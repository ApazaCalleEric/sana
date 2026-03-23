import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageCircle, BookOpen, MapPin, Plus, X } from "lucide-react";

const ACTIONS = [
  {
    to: "/chat",
    label: "Hablar con alguien",
    icon: <MessageCircle size={18} />,
  },
  {
    to: "/informacion",
    label: "Información",
    icon: <BookOpen size={18} />,
  },
  {
    to: "/instituciones",
    label: "Dónde acudir",
    icon: <MapPin size={18} />,
  },
];

export default function FloatingActions() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5">

      {/* Botones expandibles */}
      <div
        className={`flex flex-col items-end gap-2.5 transition-all duration-300 ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {ACTIONS.map((a) => {
          const isActive = location.pathname === a.to;
          return (
            <Link
              key={a.to}
              to={a.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2.5 pl-4 pr-4 py-2.5 rounded-full shadow-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                isActive
                  ? "bg-[#586E7D] text-white"
                  : "bg-[#F9F9F9] text-[#586E7D] border border-[#E7D6D3] hover:bg-[#E7D6D3]"
              }`}
            >
              {a.icon}
              <span>{a.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Botón principal */}
      <button
        onClick={() => setOpen(!open)}
        className="w-13 h-13 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110"
        style={{
          width: 52,
          height: 52,
          backgroundColor: open ? "#A7B1B3" : "#586E7D",
          color: "white",
        }}
        aria-label={open ? "Cerrar menú" : "Abrir recursos"}
      >
        <div
          className="transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          <Plus size={22} />
        </div>
      </button>
    </div>
  );
}
