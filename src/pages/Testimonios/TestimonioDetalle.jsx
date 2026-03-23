import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Info, MessageCircle } from "lucide-react";
import { testimonios } from "../../data/testimonios";
import { ejesInformacion } from "../../data/informacion";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";
import ContentWarning from "../../components/ContentWarning/ContentWarning";
import MasInformacion from "../../components/MasInformacion/MasInformacion";
import { FlowerSVG, FallingPetals } from "../../components/Flower/Flower";

const colorGradient = {
  rose: "from-rose-500 to-pink-500",
  purple: "from-purple-500 to-violet-500",
  teal: "from-teal-500 to-cyan-500",
  amber: "from-amber-500 to-yellow-500",
};

const colorText = {
  rose: "text-rose-600",
  purple: "text-purple-600",
  teal: "text-teal-600",
};

const colorBg = {
  rose: "bg-rose-50 border-rose-200",
  purple: "bg-purple-50 border-purple-200",
  teal: "bg-teal-50 border-teal-200",
};

export default function TestimonioDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const testimonio = testimonios.find((t) => t.id === Number(id));
  const [warningAccepted, setWarningAccepted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!testimonio) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Historia no encontrada.</p>
        <Link to="/testimonios" className="text-purple-600 hover:underline">
          ← Volver a historias
        </Link>
      </div>
    );
  }

  const [mostrarMasInfo, setMostrarMasInfo] = useState(false);
  const infoEje = ejesInformacion[testimonio.ejeInfo];
  const idx = testimonios.findIndex((t) => t.id === Number(id));
  const siguiente = testimonios[idx + 1];
  const anterior = testimonios[idx - 1];

  return (
    <div className="relative min-h-screen">
      {/* Video de fondo */}
      <video
        autoPlay
        muted
        loop
        playsInline
        src="/videos/video%20trenza.mp4"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />
      {/* Overlay */}
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(88,110,125,0.45)",
        zIndex: 1,
      }} />

      {/* Contenido */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">
      {/* Advertencia de contenido */}
      {testimonio.advertencia && !warningAccepted && (
        <ContentWarning
          onAccept={() => setWarningAccepted(true)}
          onDecline={() => navigate("/testimonios")}
        />
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/testimonios" className="hover:text-gray-600 flex items-center gap-1">
          <ArrowLeft size={14} />
          Historias
        </Link>
        <span>/</span>
        <span className="text-gray-600">{testimonio.titulo}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className={`inline-block bg-gradient-to-r ${colorGradient[testimonio.color]} text-white text-sm px-3 py-1 rounded-full mb-3`}>
          {testimonio.categoriaLabel}
        </div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{testimonio.emoji}</span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {testimonio.titulo}
          </h1>
        </div>
        <p className="text-gray-600 leading-relaxed">{testimonio.resumen}</p>
      </div>

      {/* Audio Player */}
      <div className="mb-6">
        <AudioPlayer
          titulo={testimonio.titulo}
          duracion={testimonio.duracion}
          transcript={testimonio.transcript}
          audioSrc={testimonio.audioSrc}
          onPlayingChange={setIsPlaying}
        />
      </div>

      {/* Botón Más Información prominente */}
      <div className="mb-8">
        <button
          onClick={() => setMostrarMasInfo(!mostrarMasInfo)}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow"
        >
          <Info size={18} />
          {mostrarMasInfo ? "Ocultar información" : "Más información"}
        </button>
        {mostrarMasInfo && (
          <div className="mt-4 animate-fade-in">
            <MasInformacion
              categoria={testimonio.categoria}
              onCerrar={() => setMostrarMasInfo(false)}
            />
          </div>
        )}
      </div>

      {/* Puente: si esta historia te movió algo */}
      <div className={`rounded-2xl p-6 border ${colorBg[testimonio.color]} mb-8`}>
        <div className="flex items-center gap-2 mb-3">
          <Info size={18} className={colorText[testimonio.color]} />
          <h3 className={`font-semibold ${colorText[testimonio.color]}`}>
            Si esta historia te movió algo...
          </h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Aquí tienes información que puede serte útil, sin rodeos y sin juicio.
        </p>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className={`flex items-center gap-2 text-sm font-semibold ${colorText[testimonio.color]} hover:underline transition-colors`}
        >
          {showInfo ? "Ocultar información" : "Quiero saber más"}
          <ArrowRight size={14} className={showInfo ? "rotate-90" : ""} />
        </button>

        {/* Microcontenidos del eje */}
        {showInfo && infoEje && (
          <div className="mt-6 space-y-4 animate-fade-in">
            <h4 className="font-semibold text-gray-700 text-sm">
              {infoEje.titulo} — información básica
            </h4>
            {infoEje.microcontenidos.slice(0, 3).map((mc) => (
              <div key={mc.id} className="bg-white rounded-xl p-4 border border-white shadow-sm">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  {mc.pregunta}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {mc.respuesta}
                </p>
              </div>
            ))}
            <Link
              to="/informacion"
              className={`inline-block text-sm font-medium ${colorText[testimonio.color]} hover:underline`}
            >
              Ver toda la información →
            </Link>
          </div>
        )}
      </div>

      {/* CTA chat */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 border border-purple-100">
        <div>
          <p className="font-semibold text-gray-800 text-sm">
            ¿Tienes preguntas o quieres hablar?
          </p>
          <p className="text-xs text-gray-500 mt-1">
            El chatbot puede acompañarte y orientarte, sin juicio y de forma anónima.
          </p>
        </div>
        <Link
          to="/chat"
          className="flex-shrink-0 flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <MessageCircle size={16} />
          Ir al chat
        </Link>
      </div>

      {/* ── Flor giratoria + pétalos (esquina inferior derecha, solo cuando reproduce) ── */}
      {isPlaying && (
        <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
          {/* Pétalos cayendo */}
          <FallingPetals categoria={testimonio.categoria} />
          {/* Flor girando */}
          <div className="animate-spin-slow">
            <FlowerSVG categoria={testimonio.categoria} size={72} />
          </div>
        </div>
      )}

      {/* Navegación entre testimonios */}
      <div className="flex justify-between gap-4">
        {anterior ? (
          <Link
            to={`/testimonios/${anterior.id}`}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Historia anterior</span>
          </Link>
        ) : (
          <div />
        )}
        {siguiente && (
          <Link
            to={`/testimonios/${siguiente.id}`}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <span className="hidden sm:inline">Siguiente historia</span>
            <ArrowRight size={14} />
          </Link>
        )}
      </div>
      </div>
    </div>
  );
}
