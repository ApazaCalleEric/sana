import { useState } from "react";
import { ExternalLink } from "lucide-react";

const secciones = [
  {
    id: "salud",
    titulo: "Mi salud importa",
    descripcion: "Servicios y centros de atención en salud sexual y reproductiva.",
    color: "#f43f5e",
    grupos: [
      {
        nombre: "AIDA",
        descripcion: "Atención Integral para el Desarrollo del Adolescente — servicio de salud amigable para jóvenes.",
        recursos: [
          { label: "¿Qué es AIDA?", url: "https://www.cies.org.bo/aidaj/" },
          { label: "Guía AIDA (UNFPA Bolivia)", url: "https://bolivia.unfpa.org/sites/default/files/pub-pdf/2025-07/DOC%202%20AIDA%20WEB.pdf" },
          { label: "Centros AIDA certificados", url: "https://www.facebook.com/share/p/185u8ac2E1/" },
        ],
      },
      {
        nombre: "Centros de salud en SSSR",
        descripcion: "Centros especializados en Salud Sexual y Salud Reproductiva en Bolivia.",
        recursos: [
          { label: "CIES La Paz", url: "https://www.cies.org.bo/cies-la-paz/" },
          { label: "MSI Bolivia — La Paz", url: "https://msibolivia.org/la-paz/" },
        ],
      },
    ],
  },
  {
    id: "rutas",
    titulo: "Rutas donde acudir",
    descripcion: "Guías y rutas de acción para saber a dónde ir y qué hacer.",
    color: "#a855f7",
    grupos: [
      {
        nombre: "Guías de acción",
        descripcion: "Materiales que te orientan paso a paso sobre cómo actuar y dónde acudir en Bolivia.",
        recursos: [
          { label: "Ruta de atención — Comunidad.org.bo", url: "https://comunidad.org.bo/assets/archivos/herramienta/865a412a8f145a476072b2e3b6053d4c.pdf" },
        ],
      },
    ],
  },
];

function RecursoLink({ label, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100"
    >
      <span className="text-sm text-gray-700 group-hover:text-purple-700 transition-colors leading-snug">
        {label}
      </span>
      <ExternalLink size={13} className="text-gray-300 group-hover:text-purple-400 flex-shrink-0 transition-colors" />
    </a>
  );
}

export default function Instituciones() {
  const [activa, setActiva] = useState("salud");
  const seccion = secciones.find((s) => s.id === activa);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs text-purple-600 font-medium uppercase tracking-wider mb-1">Recursos</p>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dónde acudir</h1>
        <p className="text-sm text-gray-500 leading-relaxed max-w-lg">
          Servicios de salud y rutas de acción organizados para que puedas encontrar lo que necesitas.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {secciones.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiva(s.id)}
            className="flex-1 text-left p-4 rounded-2xl border-2 transition-all"
            style={activa === s.id
              ? { borderColor: s.color, backgroundColor: s.color + "10" }
              : { borderColor: "#e5e7eb", backgroundColor: "white" }}
          >
            <div className="font-semibold text-gray-800 text-sm">{s.titulo}</div>
            <div className="text-xs text-gray-400 mt-0.5 leading-tight">{s.descripcion}</div>
          </button>
        ))}
      </div>

      {/* Contenido */}
      {seccion && (
        <div className="space-y-5 animate-fade-in">
          {seccion.grupos.map((grupo) => (
            <div key={grupo.nombre} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h3 className="font-semibold text-gray-800 text-sm">{grupo.nombre}</h3>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug">{grupo.descripcion}</p>
              </div>
              <div className="px-3 py-2">
                {grupo.recursos.map((r) => (
                  <RecursoLink key={r.url} label={r.label} url={r.url} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Aviso */}
      <div className="mt-10 bg-gray-50 rounded-2xl p-5 border border-gray-100">
        <p className="text-xs text-gray-500 leading-relaxed text-center">
          Los recursos externos son responsabilidad de sus respectivas organizaciones.
          SANA no reemplaza la atención profesional de salud, legal o psicológica.
        </p>
      </div>
    </div>
  );
}
