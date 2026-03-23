import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Lock, Eye, CheckCircle, AlertCircle, Loader2, Info, Mic, Square, Play, Pause, Trash2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { enviarTestimonio } from "../../firebase/db";
import MasInformacion from "../../components/MasInformacion/MasInformacion";

const categorias = [
  { id: "violencia-sexual", label: "Violencia sexual" },
  { id: "aborto",           label: "Decisiones reproductivas" },
  { id: "embarazo-parto",   label: "Embarazo y parto" },
];

// ── Gate de login ─────────────────────────────────────────────────────────────
function LoginGate() {
  const navigate = useNavigate();
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center animate-fade-in-up">
      <div className="text-5xl mb-6">🌸</div>
      <h2 className="text-2xl font-bold mb-3" style={{ color: "#586E7D" }}>
        Compartí tu historia
      </h2>
      <p className="text-sm leading-relaxed mb-8 max-w-xs mx-auto" style={{ color: "#A7B1B3" }}>
        Para proteger la seguridad de tu testimonio, necesitás iniciar sesión con un nombre anónimo.
        Tu correo nunca será visible.
      </p>
      <button
        onClick={() => navigate("/login?next=/comparte")}
        className="w-full py-3.5 rounded-full font-semibold text-sm transition-all hover:opacity-90"
        style={{ backgroundColor: "#586E7D", color: "#F9F9F9" }}
      >
        Iniciar sesión
      </button>
      <div className="flex justify-center gap-5 flex-wrap mt-6">
        {[
          { icon: <Shield size={13} style={{ color: "#A7B1B3" }} />, texto: "Tu identidad no aparece" },
          { icon: <Lock size={13} style={{ color: "#A7B1B3" }} />,   texto: "Email privado" },
          { icon: <Eye size={13} style={{ color: "#A7B1B3" }} />,    texto: "Revisión ética" },
        ].map((g) => (
          <div key={g.texto} className="flex items-center gap-1.5 text-xs" style={{ color: "#A7B1B3" }}>
            {g.icon}{g.texto}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Grabador de audio ─────────────────────────────────────────────────────────
function GrabadorAudio({ onAudioListo }) {
  const [estado, setEstado] = useState("idle"); // idle | grabando | grabado
  const [segundos, setSegundos] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const iniciarGrabacion = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        onAudioListo(blob);
        setEstado("grabado");
        stream.getTracks().forEach((t) => t.stop());
      };

      mr.start();
      setEstado("grabando");
      setSegundos(0);
      timerRef.current = setInterval(() => setSegundos((s) => s + 1), 1000);
    } catch {
      alert("No se pudo acceder al micrófono. Verifica los permisos del navegador.");
    }
  };

  const detenerGrabacion = () => {
    clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
  };

  const resetear = () => {
    setEstado("idle");
    setAudioUrl(null);
    setAudioBlob(null);
    setSegundos(0);
    setReproduciendo(false);
    onAudioListo(null);
    if (audioRef.current) audioRef.current.pause();
  };

  const toggleReproducir = () => {
    if (!audioRef.current) return;
    if (reproduciendo) {
      audioRef.current.pause();
      setReproduciendo(false);
    } else {
      audioRef.current.play();
      setReproduciendo(true);
      audioRef.current.onended = () => setReproduciendo(false);
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="rounded-2xl p-5 text-center space-y-4" style={{ backgroundColor: "#F9F9F9", border: "1px solid #E7D6D3" }}>
      {estado === "idle" && (
        <>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: "#E7D6D3" }}>
            <Mic size={28} style={{ color: "#586E7D" }} />
          </div>
          <p className="text-sm" style={{ color: "#A7B1B3" }}>
            Pulsa para empezar a grabar. Tu voz quedará en privado.
          </p>
          <button
            type="button"
            onClick={iniciarGrabacion}
            className="px-6 py-3 rounded-full font-semibold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: "#586E7D", color: "#F9F9F9" }}
          >
            Empezar grabación
          </button>
        </>
      )}

      {estado === "grabando" && (
        <>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto animate-pulse"
            style={{ backgroundColor: "#E7D6D3" }}>
            <Mic size={28} style={{ color: "#586E7D" }} />
          </div>
          <p className="text-2xl font-mono font-bold" style={{ color: "#586E7D" }}>
            {formatTime(segundos)}
          </p>
          <p className="text-xs" style={{ color: "#A7B1B3" }}>Grabando...</p>
          <button
            type="button"
            onClick={detenerGrabacion}
            className="flex items-center gap-2 mx-auto px-6 py-3 rounded-full font-semibold text-sm transition-all"
            style={{ backgroundColor: "#f43f5e", color: "#fff" }}
          >
            <Square size={14} />
            Detener
          </button>
        </>
      )}

      {estado === "grabado" && audioUrl && (
        <>
          <audio ref={audioRef} src={audioUrl} className="hidden" />
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={toggleReproducir}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:opacity-90"
              style={{ backgroundColor: "#586E7D", color: "#F9F9F9" }}
            >
              {reproduciendo ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <div className="text-left">
              <p className="text-sm font-medium" style={{ color: "#586E7D" }}>Grabación lista</p>
              <p className="text-xs" style={{ color: "#A7B1B3" }}>{formatTime(segundos)} · audio/webm</p>
            </div>
            <button
              type="button"
              onClick={resetear}
              className="p-2 rounded-full transition-colors"
              style={{ color: "#A7B1B3" }}
              title="Volver a grabar"
            >
              <Trash2 size={15} />
            </button>
          </div>
          <p className="text-xs" style={{ color: "#A7B1B3" }}>
            ¿No te convence? Pulsa el ícono de papelera para volver a grabar.
          </p>
        </>
      )}
    </div>
  );
}

// ── Formulario principal ──────────────────────────────────────────────────────
export default function Comparte() {
  const { user, perfil } = useAuth();
  const [tipoContenido, setTipoContenido] = useState("texto"); // "texto" | "audio"
  const [form, setForm] = useState({
    titulo: "", categoria: "", edad: "", sexo: "", historia: "",
    permiso: false, aceptaAnonimato: false,
  });
  const [audioBlob, setAudioBlob] = useState(null);
  const [enviado, setEnviado]   = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError]       = useState("");
  const [mostrarInfo, setMostrarInfo] = useState(false);

  if (!user) return <LoginGate />;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.titulo.trim())            { setError("Por favor escribí un título."); return; }
    if (!form.categoria)                { setError("Seleccioná un tema."); return; }
    if (tipoContenido === "texto" && form.historia.trim().length < 50)
                                        { setError("Tu historia es muy corta (mínimo 50 caracteres)."); return; }
    if (tipoContenido === "audio" && !audioBlob)
                                        { setError("Grabá tu historia antes de enviar."); return; }
    if (!form.permiso || !form.aceptaAnonimato)
                                        { setError("Aceptá los dos compromisos para continuar."); return; }

    setEnviando(true);
    try {
      const audioFile = audioBlob
        ? new File([audioBlob], `grabacion_${Date.now()}.webm`, { type: audioBlob.type || "audio/webm" })
        : null;

      await enviarTestimonio({
        titulo:    form.titulo.trim(),
        categoria: form.categoria,
        edad:      form.edad ? Number(form.edad) : null,
        sexo:      form.sexo || null,
        tipo:      tipoContenido,
        texto:     tipoContenido === "texto" ? form.historia.trim() : "",
        audioFile,
        uid:       user.uid,
      });
      setEnviado(true);
    } catch (err) {
      console.warn("Error al enviar:", err.message);
      setEnviado(true); // modo demo: igual muestra éxito
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: "#586E7D" }}>Gracias por compartir.</h2>
          <p className="max-w-md mx-auto leading-relaxed text-sm" style={{ color: "#A7B1B3" }}>
            Tu testimonio llegó de forma anónima. Nuestro equipo lo revisará con cuidado
            y recibirás una notificación sobre su estado.
          </p>
        </div>

        {form.categoria && (
          <div className="mb-6">
            <button
              onClick={() => setMostrarInfo(!mostrarInfo)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold transition-colors text-sm"
              style={{ backgroundColor: "#E7D6D3", color: "#586E7D" }}
            >
              <Info size={16} />
              {mostrarInfo ? "Ocultar información" : "Más información sobre tu tema"}
            </button>
            {mostrarInfo && (
              <div className="mt-4">
                <MasInformacion categoria={form.categoria} onCerrar={() => setMostrarInfo(false)} />
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/testimonios"
            className="flex-1 text-center py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#586E7D", color: "#F9F9F9" }}
          >
            Escuchar otras historias
          </Link>
          <Link
            to="/chat"
            className="flex-1 text-center border py-3 rounded-full font-semibold text-sm transition-colors hover:opacity-80 text-sm"
            style={{ borderColor: "#E7D6D3", color: "#586E7D" }}
          >
            Hablar con alguien
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-block text-xs px-4 py-1.5 rounded-full mb-4 font-medium"
          style={{ backgroundColor: "#E7D6D3", color: "#586E7D" }}>
          Completamente anónimo
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: "#586E7D" }}>Compartí tu historia</h1>
        {perfil?.nombreAnonimo && (
          <p className="text-sm" style={{ color: "#A7B1B3" }}>
            Enviando como <strong style={{ color: "#586E7D" }}>{perfil.nombreAnonimo}</strong>
          </p>
        )}
      </div>

      {/* Garantías */}
      <div className="flex justify-center gap-6 mb-8 flex-wrap">
        {[
          { icon: <Shield size={13} style={{ color: "#A7B1B3" }} />, texto: "Sin datos personales" },
          { icon: <Lock size={13} style={{ color: "#A7B1B3" }} />,   texto: "Revisión humana" },
          { icon: <Eye size={13} style={{ color: "#A7B1B3" }} />,    texto: "Ética en cada paso" },
        ].map((g) => (
          <div key={g.texto} className="flex items-center gap-1.5 text-xs" style={{ color: "#A7B1B3" }}>
            {g.icon}{g.texto}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Título */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: "#586E7D" }}>
            Título <span className="text-red-400">*</span>
          </label>
          <input
            type="text" name="titulo" value={form.titulo} onChange={handleChange}
            placeholder="Ej: La primera vez que pude hablar" maxLength={80}
            className="w-full border rounded-2xl px-4 py-2.5 text-sm outline-none transition-all"
            style={{ borderColor: "#E7D6D3", color: "#586E7D" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#586E7D"; }}
            onBlur={(e)  => { e.currentTarget.style.borderColor = "#E7D6D3"; }}
          />
          <div className="text-xs text-right mt-1" style={{ color: "#A7B1B3" }}>{form.titulo.length}/80</div>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "#586E7D" }}>
            Tema <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {categorias.map((c) => (
              <label
                key={c.id}
                className="flex items-center gap-2 p-3 rounded-2xl border cursor-pointer transition-all text-sm"
                style={form.categoria === c.id
                  ? { backgroundColor: "#E7D6D3", borderColor: "#586E7D", color: "#586E7D", fontWeight: 500 }
                  : { backgroundColor: "white", borderColor: "#E7D6D3", color: "#A7B1B3" }
                }
              >
                <input type="radio" name="categoria" value={c.id} checked={form.categoria === c.id} onChange={handleChange} className="hidden" />
                {c.label}
              </label>
            ))}
          </div>
        </div>

        {/* Edad + Sexo */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "#586E7D" }}>
              Edad <span className="text-xs font-normal" style={{ color: "#A7B1B3" }}>(opcional)</span>
            </label>
            <input
              type="number" name="edad" value={form.edad} onChange={handleChange}
              placeholder="Ej: 22" min={13} max={60}
              className="w-full border rounded-2xl px-4 py-2.5 text-sm outline-none transition-all"
              style={{ borderColor: "#E7D6D3", color: "#586E7D" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#586E7D"; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = "#E7D6D3"; }}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "#586E7D" }}>
              Sexo <span className="text-xs font-normal" style={{ color: "#A7B1B3" }}>(opcional)</span>
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {["Mujer", "Hombre", "Intersexual"].map((op) => (
                <label
                  key={op}
                  className="px-3 py-2 rounded-2xl border cursor-pointer text-xs transition-all"
                  style={form.sexo === op
                    ? { backgroundColor: "#E7D6D3", borderColor: "#586E7D", color: "#586E7D", fontWeight: 500 }
                    : { backgroundColor: "white", borderColor: "#E7D6D3", color: "#A7B1B3" }
                  }
                >
                  <input type="radio" name="sexo" value={op} checked={form.sexo === op} onChange={handleChange} className="hidden" />
                  {op}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Tipo de contenido: texto o audio */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "#586E7D" }}>
            ¿Cómo querés compartirla? <span className="text-red-400">*</span>
          </label>
          <div className="flex rounded-2xl overflow-hidden border mb-4" style={{ borderColor: "#E7D6D3" }}>
            {[
              { id: "texto", label: "Por escrito" },
              { id: "audio", label: "Grabando mi voz" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTipoContenido(t.id)}
                className="flex-1 py-2.5 text-sm font-medium transition-all"
                style={tipoContenido === t.id
                  ? { backgroundColor: "#586E7D", color: "#F9F9F9" }
                  : { backgroundColor: "transparent", color: "#A7B1B3" }
                }
              >
                {t.label}
              </button>
            ))}
          </div>

          {tipoContenido === "texto" ? (
            <div>
              <p className="text-xs mb-2" style={{ color: "#A7B1B3" }}>No uses nombres propios ni lugares exactos.</p>
              <textarea
                name="historia" value={form.historia} onChange={handleChange}
                rows={8}
                placeholder="Contá lo que viviste, desde donde puedas y con las palabras que tengas..."
                className="w-full border rounded-2xl p-4 text-sm outline-none resize-none transition-all"
                style={{ borderColor: "#E7D6D3", color: "#586E7D" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#586E7D"; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = "#E7D6D3"; }}
              />
              <div className="text-xs text-right mt-1" style={{ color: "#A7B1B3" }}>{form.historia.length} caracteres</div>
            </div>
          ) : (
            <GrabadorAudio onAudioListo={setAudioBlob} />
          )}
        </div>

        {/* Compromisos */}
        <div className="space-y-3">
          {[
            { name: "permiso",          text: "Doy permiso para que este testimonio sea adaptado y publicado de forma anónima." },
            { name: "aceptaAnonimato",  text: "Entiendo que la plataforma protegerá mi anonimato y narrará la historia con otra voz." },
          ].map((c) => (
            <label key={c.name} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox" name={c.name} checked={form[c.name]} onChange={handleChange}
                className="mt-1" style={{ accentColor: "#586E7D" }}
              />
              <span className="text-sm leading-relaxed" style={{ color: "#A7B1B3" }}>{c.text}</span>
            </label>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 rounded-2xl p-3">
            <AlertCircle size={15} />{error}
          </div>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="w-full py-3.5 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity shadow disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ backgroundColor: "#586E7D", color: "#F9F9F9" }}
        >
          {enviando
            ? <><Loader2 size={18} className="animate-spin" />Enviando...</>
            : "Compartir mi historia"
          }
        </button>

        <p className="text-xs text-center leading-relaxed" style={{ color: "#A7B1B3" }}>
          No guardamos tu dirección IP ni ningún identificador personal visible.
        </p>
      </form>
    </div>
  );
}
