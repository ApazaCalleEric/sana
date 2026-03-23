import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, MessageCircle, MapPin, ExternalLink } from "lucide-react";
import { ejesInformacion } from "../../data/informacion";

const recursosAdicionales = [
  {
    id: "previene",
    titulo: "Previene te conviene",
    descripcion: "Herramientas y guías para la prevención y el ejercicio de tus derechos.",
    items: [
      { label: "MUIFTS — Ley contra matrimonios infantiles forzados", url: "https://ipasbolivia.org/resource/cartilla-ley-n1639-contra-los-matrimonios-infantiles-forzados-y-tempranos/" },
      { label: "Métodos anticonceptivos", url: "https://ipasbolivia.org/resource/cartilla-uso-de-metodos-anticonceptivos/" },
      { label: "Violentómetro", url: "https://ipasbolivia.org/wp-content/uploads/2025/05/El-violentometro-de-Ipas-Bolivia.pdf" },
      { label: "ILE — Interrupción Legal del Embarazo (preguntas frecuentes)", url: "https://ipasbolivia.org/wp-content/uploads/2025/05/Preguntas-frecuentes-sobre-la-Interrupcion-Legal-del-Embarazo-ILE.pdf" },
      { label: "Planificación de Vida — UNAM", url: "https://repositorio-uapa.cuaed.unam.mx/repositorio/moodle/pluginfile.php/2555/mod_resource/content/3/UAPA-Construccion-Plan-Vida/index.html" },
      { label: "Objetivos de Desarrollo Sostenible — PNUD", url: "https://www.undp.org/es/sustainable-development-goals" },
    ],
  },
  {
    id: "derechos",
    titulo: "Mis derechos",
    descripcion: "Documentos oficiales sobre derechos humanos, sexuales y reproductivos.",
    items: [
      { label: "Derechos humanos — UNFPA Bolivia", url: "https://bolivia.unfpa.org/sites/default/files/pub-pdf/cartilla%201_0.pdf" },
      { label: "Derechos de NNA — Defensoría del Pueblo", url: "https://www.defensoria.gob.bo/uploads/files/derechos-de-las-ninas-ninos-y-adolescentes-en-el-estado-plurinacional.pdf" },
      { label: "Derechos Sexuales y Reproductivos — IPAS Bolivia", url: "https://ipasbolivia.org/resource/cuadriptico-derechos-sexuales-y-derechos-reproductivos-en-nuestras-vidas/" },
    ],
  },
];

const colorConfig = {
  rose: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    tab: "bg-rose-500",
    tabActive: "bg-rose-600",
    badge: "bg-rose-100 text-rose-700",
    text: "text-rose-600",
    dot: "bg-rose-400",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    tab: "bg-purple-500",
    tabActive: "bg-purple-600",
    badge: "bg-purple-100 text-purple-700",
    text: "text-purple-600",
    dot: "bg-purple-400",
  },
  teal: {
    bg: "bg-teal-50",
    border: "border-teal-200",
    tab: "bg-teal-500",
    tabActive: "bg-teal-600",
    badge: "bg-teal-100 text-teal-700",
    text: "text-teal-600",
    dot: "bg-teal-400",
  },
};

function Acordeon({ pregunta, respuesta, color }) {
  const [open, setOpen] = useState(false);
  const c = colorConfig[color] || colorConfig.purple;

  return (
    <div className={`rounded-xl border ${c.border} overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between p-4 text-left ${c.bg} hover:opacity-90 transition-opacity`}
      >
        <div className="flex items-start gap-3">
          <div className={`w-2 h-2 ${c.dot} rounded-full flex-shrink-0 mt-2`} />
          <span className="font-medium text-gray-800 text-sm leading-relaxed">
            {pregunta}
          </span>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-gray-400 flex-shrink-0 ml-2" />
        ) : (
          <ChevronDown size={16} className="text-gray-400 flex-shrink-0 ml-2" />
        )}
      </button>
      {open && (
        <div className="px-4 pt-3 pb-4 bg-white border-t border-gray-100 animate-fade-in">
          <p className="text-sm text-gray-600 leading-relaxed pl-5">
            {respuesta}
          </p>
        </div>
      )}
    </div>
  );
}

export default function Informacion() {
  const ejes = Object.entries(ejesInformacion);
  const [ejeActivo, setEjeActivo] = useState(ejes[0][0]);
  const eje = ejesInformacion[ejeActivo];
  const c = colorConfig[eje.color] || colorConfig.purple;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-block bg-purple-100 text-purple-700 text-sm px-4 py-2 rounded-full mb-4">
          Información basada en derechos
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Lo que deberías saber
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
          Información clara, sin tecnicismos y sin juicio. Porque conocer tus
          derechos es la primera forma de ejercerlos.
        </p>
      </div>

      {/* Aviso */}
      <div className="flex items-start gap-2 mb-8 text-xs text-gray-400 leading-relaxed">
        <span className="flex-shrink-0 mt-0.5">ℹ️</span>
        <p>
          Información orientativa. No sustituye la consulta con profesionales de salud o legales.
          Si necesitás atención directa, visitá{" "}
          <Link to="/instituciones" className="underline text-purple-500 hover:text-purple-700">
            Dónde acudir
          </Link>.
        </p>
      </div>

      {/* Tabs de ejes */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {ejes.map(([key, e]) => {
          const cc = colorConfig[e.color] || colorConfig.purple;
          return (
            <button
              key={key}
              onClick={() => setEjeActivo(key)}
              className={`flex-1 flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                ejeActivo === key
                  ? `${cc.bg} ${cc.border} shadow-sm`
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-2xl">{e.icono}</span>
              <div>
                <div className="font-semibold text-gray-800 text-sm">
                  {e.titulo}
                </div>
                <div className="text-xs text-gray-500 mt-0.5 leading-tight">
                  {ejeActivo === key ? "Viendo ahora" : "Ver información"}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Contenido del eje */}
      <div className="animate-fade-in">
        <div className={`${c.bg} rounded-2xl p-6 border ${c.border} mb-6`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{eje.icono}</span>
            <h2 className="text-xl font-bold text-gray-800">{eje.titulo}</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {eje.descripcion}
          </p>
        </div>

        <div className="space-y-3">
          {eje.microcontenidos.map((mc) => (
            <Acordeon
              key={mc.id}
              pregunta={mc.pregunta}
              respuesta={mc.respuesta}
              color={eje.color}
            />
          ))}
        </div>
      </div>

      {/* Recursos adicionales */}
      <div className="mt-12">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Recursos y materiales</h2>
        <p className="text-sm text-gray-500 mb-6">Documentos, guías y herramientas externas para profundizar.</p>
        <div className="space-y-5">
          {recursosAdicionales.map((grupo) => (
            <div key={grupo.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h3 className="font-semibold text-gray-800 text-sm">{grupo.titulo}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{grupo.descripcion}</p>
              </div>
              <div className="px-3 py-2">
                {grupo.items.map((r) => (
                  <a
                    key={r.url}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100"
                  >
                    <span className="text-sm text-gray-700 group-hover:text-purple-700 transition-colors leading-snug">
                      {r.label}
                    </span>
                    <ExternalLink size={13} className="text-gray-300 group-hover:text-purple-400 flex-shrink-0 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
          <MessageCircle size={20} className="text-purple-500 mb-3" />
          <h3 className="font-semibold text-gray-800 mb-1 text-sm">
            ¿Tienes más preguntas?
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            El chatbot puede orientarte de forma personalizada.
          </p>
          <Link
            to="/chat"
            className="text-sm font-medium text-purple-600 hover:underline"
          >
            Ir al chat →
          </Link>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-5 border border-teal-100">
          <MapPin size={20} className="text-teal-500 mb-3" />
          <h3 className="font-semibold text-gray-800 mb-1 text-sm">
            ¿Necesitas apoyo directo?
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            Conoce instituciones y organizaciones en Bolivia.
          </p>
          <Link
            to="/instituciones"
            className="text-sm font-medium text-teal-600 hover:underline"
          >
            Ver instituciones →
          </Link>
        </div>
      </div>
    </div>
  );
}
