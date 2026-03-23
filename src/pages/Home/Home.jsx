import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Play, ArrowRight } from "lucide-react";

export default function Home() {
  const [intro, setIntro] = useState(false);
  const audioRef = useRef(null);

  const empecemos = () => {
    setIntro(true);
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  const salir = () => {
    setIntro(false);
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.currentTime = 0; }
  };

  return (
    <div
      className="min-h-screen"
      onClick={intro ? salir : undefined}
      style={{ cursor: intro ? "pointer" : "default" }}
    >
      {/* Audio intro */}
      <audio
        ref={audioRef}
        src="/audios/Audio%20intro.mp3"
        onEnded={() => setIntro(false)}
      />

      {/* Video fijo de fondo */}
      <video
        autoPlay muted loop playsInline
        src="/videos/intro.mp4"
        style={{
          position: "fixed", top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "cover", zIndex: 0,
        }}
      />

      {/* Overlay — se desvanece al entrar en modo intro */}
      <div
        style={{
          position: "fixed", inset: 0,
          backgroundColor: "rgba(88,110,125,0.52)",
          zIndex: 1,
          opacity: intro ? 0 : 1,
          transition: "opacity 1.2s ease",
          pointerEvents: "none",
        }}
      />

      {/* Pista sutil "clic para salir" durante el intro */}
      {intro && (
        <div
          style={{
            position: "fixed", bottom: 32, left: 0, right: 0,
            textAlign: "center", zIndex: 10,
            color: "rgba(249,249,249,0.5)",
            fontSize: "0.75rem",
            letterSpacing: "0.05em",
            pointerEvents: "none",
            animation: "fadeIn 2s ease forwards",
          }}
        >
          Clic en cualquier lugar para continuar
        </div>
      )}

      {/* Hero */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4"
        style={{
          minHeight: "90vh", zIndex: 2,
          opacity: intro ? 0 : 1,
          transition: "opacity 1s ease",
          pointerEvents: intro ? "none" : "auto",
        }}
      >
        <img
          src="/images/logo1.png"
          alt="SANA"
          className="animate-fade-in-up h-24 md:h-32 w-auto mb-4 drop-shadow-lg"
        />
        <p className="animate-fade-in-up delay-100 text-sm md:text-base mb-6 tracking-wide" style={{ color: "rgba(249,249,249,0.75)" }}>
          Sanar A través de Narrativas Anónimas
        </p>
        <p className="animate-fade-in-up delay-200 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed font-light" style={{ color: "rgba(249,249,249,0.90)" }}>
          Escucha historias reales. Accede a información sin prejuicios.
          Encuentra acompañamiento. Este es un espacio para vos.
        </p>

        <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/testimonios"
            className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold hover:scale-105 transition-all shadow-lg"
            style={{ backgroundColor: "#F9F9F9", color: "#586E7D" }}
          >
            <Play size={17} />
            Escuchar historias
          </Link>
          <button
            onClick={(e) => { e.stopPropagation(); empecemos(); }}
            className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold hover:scale-105 transition-all"
            style={{
              backgroundColor: "rgba(249,249,249,0.18)",
              border: "1.5px solid rgba(249,249,249,0.35)",
              color: "#F9F9F9",
              cursor: "pointer",
            }}
          >
            ✨ Empecemos
          </button>
        </div>

        {/* Stats */}
        <div className="animate-fade-in-up delay-400 mt-14 flex justify-center gap-10">
          {[
            { n: "3",    label: "Temáticas" },
            { n: "100%", label: "Anónimo" },
            { n: "24/7", label: "Disponible" },
          ].map((s) => (
            <div key={s.label} className="text-center text-white">
              <div className="text-2xl font-bold">{s.n}</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(249,249,249,0.65)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Cards */}
      <section
        className="relative"
        style={{
          zIndex: 2,
          opacity: intro ? 0 : 1,
          transition: "opacity 1s ease",
          pointerEvents: intro ? "none" : "auto",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "rgba(249,249,249,0.65)" }}>La plataforma</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: "#F9F9F9" }}>
              ¿Qué encontrarás aquí?
            </h2>
            <p className="max-w-sm mx-auto text-sm" style={{ color: "rgba(249,249,249,0.75)" }}>
              Cada sección está pensada para acompañarte, sin prisa y sin juicio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { emoji: "🎙️", titulo: "Historias reales",  desc: "Testimonios narrados en primera persona. Escucha, pausa, vuelve cuando quieras.", link: "/testimonios",  linkLabel: "Escuchar" },
              { emoji: "💬", titulo: "Habla sin miedo",   desc: "Un chatbot empático que responde tus preguntas sin juzgarte.",                   link: "/chat",         linkLabel: "Ir al chat" },
              { emoji: "📖", titulo: "Información clara", desc: "Microcontenidos sobre derechos, salud y rutas de acción. En lenguaje simple.",   link: "/informacion",  linkLabel: "Ver información" },
              { emoji: "📍", titulo: "Dónde acudir",      desc: "Instituciones y organizaciones en Bolivia que pueden acompañarte.",              link: "/instituciones", linkLabel: "Ver recursos" },
            ].map((card, i) => (
              <div
                key={card.titulo}
                className="animate-fade-in-up bg-white rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                style={{ border: "1px solid #E7D6D3", animationDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: "#F9F9F9" }}>
                  {card.emoji}
                </div>
                <h3 className="font-semibold mb-2 text-sm" style={{ color: "#586E7D" }}>{card.titulo}</h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: "#A7B1B3" }}>{card.desc}</p>
                <Link
                  to={card.link}
                  className="flex items-center gap-1 text-xs font-semibold hover:gap-2 transition-all duration-200"
                  style={{ color: "#586E7D" }}
                >
                  {card.linkLabel}
                  <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
