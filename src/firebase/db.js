import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./config";

// ── PERFILES DE USUARIO ───────────────────────────────────────────────────────

export async function crearPerfil(uid, nombreAnonimo) {
  await setDoc(doc(db, "users", uid), {
    nombreAnonimo,
    rol: "usuario",
    creadoEn: serverTimestamp(),
  });
}

export async function obtenerPerfil(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

// ── AUDIO UPLOAD ─────────────────────────────────────────────────────────────

export async function subirAudio(file, uid) {
  const extension = file.name.split(".").pop();
  const nombre = `audios-pendientes/${uid || "anonimo"}_${Date.now()}.${extension}`;
  const storageRef = ref(storage, nombre);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return { url, nombre };
}

// ── SUBMISSIONS (testimonios del formulario) ──────────────────────────────────

export async function enviarTestimonio({ titulo, categoria, edad, sexo, tipo, texto, audioFile, uid }) {
  let audioUrl = "";
  let audioNombre = "";

  if (tipo === "audio" && audioFile) {
    const resultado = await subirAudio(audioFile, uid);
    audioUrl = resultado.url;
    audioNombre = resultado.nombre;
  }

  return await addDoc(collection(db, "submissions"), {
    titulo: titulo || "",
    categoria,
    edad: edad ?? null,
    sexo: sexo || null,
    tipo,
    texto: tipo === "texto" ? texto : "",
    audioUrl,
    audioNombre,
    uid: uid || "anonimo",
    estado: "pendiente",
    fechaEnvio: serverTimestamp(),
  });
}

export async function obtenerTodasSubmissions() {
  const q = query(collection(db, "submissions"), orderBy("fechaEnvio", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ── ADMIN: APROBAR / RECHAZAR ─────────────────────────────────────────────────

export async function aprobarSubmission(id) {
  await updateDoc(doc(db, "submissions", id), {
    estado: "aprobado",
    fechaRevision: serverTimestamp(),
  });
}

export async function rechazarSubmission(id, uid, mensaje) {
  await updateDoc(doc(db, "submissions", id), {
    estado: "rechazado",
    fechaRevision: serverTimestamp(),
  });
  if (uid && uid !== "anonimo") {
    await addDoc(collection(db, "notificaciones"), {
      uid,
      mensaje,
      submissionId: id,
      leida: false,
      fecha: serverTimestamp(),
    });
  }
}

// ── NOTIFICACIONES ────────────────────────────────────────────────────────────

export async function obtenerNotificaciones(uid) {
  const q = query(
    collection(db, "notificaciones"),
    where("uid", "==", uid),
    orderBy("fecha", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function marcarNotificacionLeida(id) {
  await updateDoc(doc(db, "notificaciones", id), { leida: true });
}

// ── TESTIMONIOS APROBADOS (públicos) ─────────────────────────────────────────

export async function obtenerTestimonios() {
  const q = query(
    collection(db, "testimonios"),
    where("aprobado", "==", true),
    orderBy("fechaPublicacion", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ── COMENTARIOS EN TESTIMONIOS ────────────────────────────────────────────────

export async function agregarComentario({ testimonioId, texto, nombreAnonimo, uid }) {
  return await addDoc(collection(db, "comentarios"), {
    testimonioId,
    texto,
    nombreAnonimo,
    uid,
    fecha: serverTimestamp(),
  });
}

// ── ESTADÍSTICAS ANÓNIMAS ─────────────────────────────────────────────────────

export async function registrarConsulta({ tema }) {
  return await addDoc(collection(db, "consultas_bot"), {
    tema,
    fecha: serverTimestamp(),
  });
}

export async function obtenerEstadisticas() {
  const [submissionsSnap, consultasSnap] = await Promise.all([
    getDocs(collection(db, "submissions")),
    getDocs(collection(db, "consultas_bot")),
  ]);

  const submissions = submissionsSnap.docs.map((d) => d.data());
  const consultas = consultasSnap.docs.map((d) => d.data());

  const porCategoria = {
    "violencia-sexual": 0,
    aborto: 0,
    "embarazo-parto": 0,
  };

  const porRangoEdad = {
    "violencia-sexual": { "12-15": 0, "16-18": 0, "19-23": 0, "24-28": 0, "28+": 0 },
    aborto:             { "12-15": 0, "16-18": 0, "19-23": 0, "24-28": 0, "28+": 0 },
    "embarazo-parto":   { "12-15": 0, "16-18": 0, "19-23": 0, "24-28": 0, "28+": 0 },
  };

  const porSexo = { Mujer: 0, Hombre: 0, Intersexual: 0 };

  submissions.forEach((s) => {
    if (porCategoria[s.categoria] !== undefined) porCategoria[s.categoria]++;
    if (s.edad && porRangoEdad[s.categoria]) {
      const edad = Number(s.edad);
      let rango = null;
      if (edad >= 12 && edad <= 15)      rango = "12-15";
      else if (edad >= 16 && edad <= 18) rango = "16-18";
      else if (edad >= 19 && edad <= 23) rango = "19-23";
      else if (edad >= 24 && edad <= 28) rango = "24-28";
      else if (edad > 28)                rango = "28+";
      if (rango) porRangoEdad[s.categoria][rango]++;
    }
    if (s.sexo && porSexo[s.sexo] !== undefined) porSexo[s.sexo]++;
  });

  const porTemaBot = {};
  consultas.forEach((c) => {
    porTemaBot[c.tema] = (porTemaBot[c.tema] || 0) + 1;
  });

  return {
    totalSubmissions: submissions.length,
    totalConsultas: consultas.length,
    porCategoria,
    porRangoEdad,
    porSexo,
    porTemaBot,
  };
}
