import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Lightbulb, Scale, MapPin, X } from "lucide-react";
import { masInformacion, urgenciaColor } from "../../data/masInformacion";
import { categoriaConfig } from "../../data/testimonios";

const tabs = [
  { id: "queHacer", label: "¿Qué pueden hacer?", icon: <Lightbulb size={16} /> },
  { id: "derechos", label: "¿Cuáles son tus derechos?", icon: <Scale size={16} /> },
  { id: "acudir", label: "¿Dónde acudir?", icon: <MapPin size={16} /> },
];

export default function MasInformacion({ categoria, onCerrar }) {
  const [tabActiva, setTabActiva] = useState("queHacer");
  const info = masInformacion[categoria];
  const cfg = categoriaConfig[categoria];

  if (!info || !cfg) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden animate-fade-in">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ backgroundColor: cfg.color + "15", borderBottom: `2px solid ${cfg.color}30` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{cfg.emoji}</span>
          <div>
            <p className="text-xs text-gray-500">Más información sobre</p>
            <p className="font-semibold text-gray-800 text-sm">{cfg.label}</p>
          </div>
        </div>
        {onCerrar && (
          <button onClick={onCerrar} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTabActiva(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors ${
              tabActiva === tab.id
                ? "border-b-2"
                : "text-gray-500 hover:text-gray-700"
            }`}
            style={tabActiva === tab.id ? { borderColor: cfg.color, color: cfg.color } : {}}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split("?")[0]}?</span>
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div className="p-5">
        {/* ¿Qué pueden hacer? */}
        {tabActiva === "queHacer" && (
          <ul className="space-y-3 animate-fade-in">
            {info.quePuedenHacer.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: cfg.color }}
                >
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        )}

        {/* Derechos */}
        {tabActiva === "derechos" && (
          <ul className="space-y-3 animate-fade-in">
            {info.derechos.map((derecho, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                <Scale size={14} className="flex-shrink-0 mt-1" style={{ color: cfg.color }} />
                {derecho}
              </li>
            ))}
          </ul>
        )}

        {/* Dónde acudir */}
        {tabActiva === "acudir" && (
          <div className="space-y-3 animate-fade-in">
            {info.dondeAcudir.map((inst, i) => {
              const uc = urgenciaColor[inst.urgencia] || urgenciaColor.baja;
              return (
                <div key={i} className={`rounded-xl p-3.5 ${uc.bg} border border-transparent`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-semibold text-gray-800 text-sm">{inst.nombre}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${uc.text} bg-white/60 font-medium`}>
                      {uc.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{inst.detalle}</p>
                </div>
              );
            })}
            <Link
              to="/instituciones"
              className="block text-center text-sm font-medium mt-2 py-2 rounded-xl border-2 border-dashed transition-colors hover:opacity-80"
              style={{ color: cfg.color, borderColor: cfg.color + "50" }}
            >
              Ver todas las instituciones →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
