import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { X, Send } from "lucide-react";
import {
  collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuthContext } from "../../context/AuthContext";
import { testimonios, categorias } from "../../data/testimonios";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";
import { FlowerSVG, FallingPetals } from "../../components/Flower/Flower";

const CAT_IMG = {
  "violencia-sexual": "/images/flor1.png",
  aborto:             "/images/flor2.png",
  "embarazo-parto":   "/images/flor3.png",
};

const FLOR_IMG = {
  "violencia-sexual": "/images/flor1.png",
  aborto:             "/images/flor2.png",
  "embarazo-parto":   "/images/flor3.png",
};

const HAIR_POSITIONS = [
  { top: "28%", left: "52%", rotate: -15, size: 44 },
  { top: "38%", left: "48%", rotate:  20, size: 42 },
  { top: "50%", left: "54%", rotate: -10, size: 40 },
  { top: "62%", left: "46%", rotate:  15, size: 38 },
  { top: "72%", left: "53%", rotate: -20, size: 36 },
  { top: "82%", left: "47%", rotate:  10, size: 34 },
];

export default function Testimonios() {
  const { user, perfil }          = useAuthContext();
  const [filtro, setFiltro]       = useState("todos");
  const [selected, setSelected]   = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [texto, setTexto]         = useState("");
  const [enviando, setEnviando]   = useState(false);
  const comentariosEndRef          = useRef(null);

  // Cargar comentarios en tiempo real cuando cambia el testimonio seleccionado
  useEffect(() => {
    if (!selected) { setComentarios([]); return; }
    const q = query(
      collection(db, "comentarios"),
      where("testimonioId", "==", selected.id),
      orderBy("fecha", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setComentarios(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [selected?.id]);

  // Auto-scroll al último comentario
  useEffect(() => {
    comentariosEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comentarios]);

  const handleFlor = (t) => { setSelected(t); setIsPlaying(false); };
  const handleClose = () => { setSelected(null); setIsPlaying(false); };

  const enviarComentario = async () => {
    if (!texto.trim() || !user || enviando) return;
    setEnviando(true);
    try {
      await addDoc(collection(db, "comentarios"), {
        testimonioId: selected.id,
        texto: texto.trim(),
        nombreAnonimo: perfil?.nombreAnonimo || "Anónima",
        uid: user.uid,
        fecha: serverTimestamp(),
      });
      setTexto("");
    } catch (e) {
      console.error("Error al comentar:", e);
    }
    setEnviando(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviarComentario(); }
  };

  return (
    <div
      className="relative"
      style={{
        minHeight: "calc(100vh - 64px)",
        backgroundImage: "url('/images/fondo%20historia.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Nubes decorativas */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-6  left-[5%]  w-60 h-14 bg-white/40 rounded-full blur-3xl" />
        <div className="absolute top-3  right-[10%] w-72 h-12 bg-white/35 rounded-full blur-3xl" />
        <div className="absolute top-24 left-[38%] w-52 h-10 bg-white/30 rounded-full blur-2xl" />
      </div>

      {/* Título */}
      <div className="relative z-10 text-center pt-10 pb-3 px-4">
        <h1 className="text-3xl font-bold mb-2 drop-shadow-sm" style={{ color: "#586E7D" }}>
          Historias
        </h1>
        <p className="text-sm" style={{ color: "#A7B1B3" }}>
          Las flores en su cabello son historias. Tocá una para escucharla.
        </p>
      </div>

      {/* Aviso */}
      <div className="relative z-10 max-w-md mx-auto px-4 mb-4">
        <div
          className="flex items-start gap-2 text-xs rounded-2xl px-4 py-2.5"
          style={{ backgroundColor: "rgba(251,191,36,0.15)", color: "#92610a" }}
        >
          <span className="flex-shrink-0">⚠️</span>
          <p>Algunos testimonios contienen relatos sensibles. Cuídate.</p>
        </div>
      </div>

      {/* Filtros + CTA */}
      <div className="relative z-10 flex justify-center items-center gap-2 flex-wrap px-4 mb-4">
        <button
          onClick={() => setFiltro("todos")}
          className="px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border transition-all duration-200"
          style={
            filtro === "todos"
              ? { backgroundColor: "#586E7D", color: "white", borderColor: "transparent" }
              : { backgroundColor: "rgba(255,255,255,0.65)", color: "#586E7D", borderColor: "rgba(255,255,255,0.5)" }
          }
        >
          Todas
        </button>
        {categorias.filter((c) => c.id !== "todos").map((c) => (
          <button
            key={c.id}
            onClick={() => setFiltro(c.id)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border transition-all duration-200"
            style={
              filtro === c.id
                ? { backgroundColor: "#586E7D", color: "white", borderColor: "transparent" }
                : { backgroundColor: "rgba(255,255,255,0.65)", color: "#586E7D", borderColor: "rgba(255,255,255,0.5)" }
            }
          >
            <img src={CAT_IMG[c.id]} alt="" style={{ width: 18, height: 18, objectFit: "contain" }} />
            {c.label}
          </button>
        ))}
        <Link
          to="/comparte"
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all hover:scale-105 shadow"
          style={{ backgroundColor: "#E7D6D3", color: "#586E7D", border: "1px solid rgba(255,255,255,0.5)" }}
        >
          Comparte tu historia
        </Link>
      </div>

      {/* ── Contenido principal: gif + panel derecho ── */}
      <div
        className="relative z-10 flex items-start justify-center gap-8 px-6 pb-10"
        style={{ flexWrap: "nowrap" }}
      >
        {/* GIF chica */}
        <div className="relative flex-shrink-0" style={{ width: "min(640px, 55vw)" }}>
          <img
            src="/images/chica%20animacion.gif"
            alt="Chica SANA"
            className="w-full h-auto"
            style={{ display: "block" }}
          />
          {testimonios.map((t, i) => {
            const pos = HAIR_POSITIONS[i];
            if (!pos) return null;
            const visible = filtro === "todos" || filtro === t.categoria;
            return (
              <button
                key={t.id}
                onClick={() => handleFlor(t)}
                className="absolute"
                style={{
                  top: pos.top, left: pos.left,
                  transform: `translate(-50%, -50%) rotate(${pos.rotate}deg)`,
                  opacity: visible ? 1 : 0.12,
                  transition: "opacity 0.4s ease",
                  zIndex: 20, background: "none", border: "none", padding: 0, cursor: "pointer",
                }}
              >
                <img
                  src={FLOR_IMG[t.categoria]}
                  alt={t.titulo}
                  style={{
                    width: pos.size, height: pos.size, objectFit: "contain",
                    filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))",
                    transition: "transform 0.25s ease",
                  }}
                  className="hover:scale-125"
                />
              </button>
            );
          })}
        </div>

        {/* Panel derecho: reproductor + comentarios */}
        <div
          style={{
            width: selected ? "min(420px, 40vw)" : 0,
            opacity: selected ? 1 : 0,
            overflow: "hidden",
            transition: "width 0.55s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease 0.15s",
            flexShrink: 0,
          }}
        >
          {selected && (
            <div style={{ minWidth: "300px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>

              {/* ── Tarjeta reproductor (transparente) ── */}
              <div
                style={{
                  backgroundColor: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "1.5rem",
                  border: "1px solid rgba(255,255,255,0.35)",
                  padding: "1.25rem",
                  boxShadow: "0 4px 24px rgba(88,110,125,0.12)",
                }}
              >
                {/* Cabecera */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span
                      className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-1"
                      style={{ backgroundColor: "rgba(231,214,211,0.7)", color: "#586E7D" }}
                    >
                      {selected.categoriaLabel}
                    </span>
                    <h2 className="text-base font-bold leading-tight" style={{ color: "#586E7D" }}>
                      {selected.titulo}
                    </h2>
                  </div>
                  <button
                    onClick={handleClose}
                    className="ml-3 mt-1 flex-shrink-0 hover:opacity-60 transition-opacity"
                    style={{ color: "#A7B1B3" }}
                  >
                    <X size={16} />
                  </button>
                </div>
                <AudioPlayer
                  titulo={selected.titulo}
                  duracion={selected.duracion}
                  transcript={selected.transcript}
                  audioSrc={selected.audioSrc}
                  onPlayingChange={setIsPlaying}
                />
              </div>

              {/* ── Sección comentarios ── */}
              <div
                style={{
                  backgroundColor: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "1.5rem",
                  border: "1px solid rgba(255,255,255,0.35)",
                  padding: "1.25rem",
                  boxShadow: "0 4px 24px rgba(88,110,125,0.12)",
                }}
              >
                <p className="text-sm font-semibold mb-3" style={{ color: "#586E7D" }}>
                  💬 Comentarios
                </p>

                {/* Lista de comentarios */}
                <div
                  style={{
                    maxHeight: "220px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  {comentarios.length === 0 ? (
                    <p className="text-xs text-center py-4" style={{ color: "#A7B1B3" }}>
                      Sé la primera en dejar un mensaje 🌸
                    </p>
                  ) : (
                    comentarios.map((c) => (
                      <div
                        key={c.id}
                        style={{
                          backgroundColor: "rgba(255,255,255,0.45)",
                          borderRadius: "0.75rem",
                          padding: "0.5rem 0.75rem",
                        }}
                      >
                        <p className="text-xs font-semibold mb-0.5" style={{ color: "#586E7D" }}>
                          {c.nombreAnonimo}
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: "#586E7D" }}>
                          {c.texto}
                        </p>
                      </div>
                    ))
                  )}
                  <div ref={comentariosEndRef} />
                </div>

                {/* Input comentario */}
                {user ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={texto}
                      onChange={(e) => setTexto(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Escribe un mensaje..."
                      maxLength={200}
                      style={{
                        flex: 1,
                        fontSize: "0.75rem",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "999px",
                        border: "1px solid rgba(255,255,255,0.5)",
                        backgroundColor: "rgba(255,255,255,0.5)",
                        color: "#586E7D",
                        outline: "none",
                      }}
                    />
                    <button
                      onClick={enviarComentario}
                      disabled={!texto.trim() || enviando}
                      style={{
                        width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                        backgroundColor: "#586E7D", color: "white",
                        border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        opacity: (!texto.trim() || enviando) ? 0.4 : 1,
                        transition: "opacity 0.2s",
                      }}
                    >
                      <Send size={14} />
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-center" style={{ color: "#A7B1B3" }}>
                    <Link to="/login" style={{ color: "#586E7D", fontWeight: 600 }}>Iniciá sesión</Link> para comentar
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Flor giratoria + pétalos */}
      {isPlaying && selected && (
        <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
          <FallingPetals categoria={selected.categoria} />
          <div className="animate-spin-slow">
            <FlowerSVG categoria={selected.categoria} size={72} />
          </div>
        </div>
      )}
    </div>
  );
}
