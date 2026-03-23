import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: "rgba(249,249,249,0.80)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderTop: "1px solid rgba(231,214,211,0.6)",
    }}>
      <div className="max-w-6xl mx-auto px-6 py-4">

        {/* Fila principal */}
        <div className="flex flex-wrap items-start justify-between gap-6">

          {/* Logo */}
          <div className="min-w-[160px]">
            <img src="/images/logo1.png" alt="SANA" className="h-7 w-auto mb-1" />
            <p className="text-xs mt-0.5" style={{ color: "#A7B1B3" }}>Sanar A través de Narrativas Anónimas</p>
            <p className="text-xs mt-1.5 leading-relaxed max-w-[200px]" style={{ color: "#A7B1B3" }}>
              Un espacio seguro de acompañamiento en derechos sexuales y reproductivos.
            </p>
          </div>

          {/* Explorar */}
          <div>
            <h3 className="font-semibold text-xs mb-1.5" style={{ color: "#586E7D" }}>Explorar</h3>
            <div className="flex flex-col gap-1">
              {[
                { to: "/testimonios",   label: "Escuchar historias" },
                { to: "/informacion",   label: "Información" },
                { to: "/instituciones", label: "Dónde acudir" },
                { to: "/chat",          label: "Hablar con alguien" },
                { to: "/comparte",      label: "Comparte tu historia" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-xs transition-colors"
                  style={{ color: "#A7B1B3" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#586E7D"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#A7B1B3"; }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Privacidad */}
          <div className="max-w-[260px]">
            <h3 className="font-semibold text-xs mb-1.5" style={{ color: "#586E7D" }}>Tu privacidad</h3>
            <p className="text-xs leading-relaxed" style={{ color: "#A7B1B3" }}>
              No guardamos datos personales ni registramos tu IP. Todo el contenido es anónimo.
            </p>
            <p className="text-xs mt-1" style={{ color: "#C4CBCC" }}>
              Usá el modo incógnito para mayor privacidad.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs mt-3 pt-3 text-center leading-relaxed" style={{ borderTop: "1px solid #E7D6D3", color: "#C4CBCC" }}>
          No reemplaza atención profesional de salud, psicológica o legal. Los testimonios son ficcionados para proteger la identidad de las personas.
        </p>
      </div>
    </footer>
  );
}
