import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Send, MessageCircle, Shield, RefreshCw } from "lucide-react";

const SUGERENCIAS = [
  "¿Qué puedo hacer si viví violencia sexual?",
  "Quiero saber sobre mis derechos reproductivos",
  "¿Dónde puedo pedir ayuda en Bolivia?",
  "¿Cómo sé si lo que viví fue violencia?",
];

// Renderiza texto con links internos [texto](/ruta) y externos
function renderTexto(texto) {
  const partes = texto.split(/(\[[^\]]+\]\([^)]+\))/g);
  return partes.map((parte, i) => {
    const match = parte.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) {
      const [, label, href] = match;
      if (href.startsWith("/")) {
        return (
          <Link key={i} to={href} className="underline text-purple-600 font-medium hover:text-purple-800">
            {label}
          </Link>
        );
      }
      return (
        <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="underline text-purple-600 font-medium">
          {label}
        </a>
      );
    }
    return <span key={i}>{parte}</span>;
  });
}

function BotMessage({ texto }) {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
        <MessageCircle size={14} className="text-white" />
      </div>
      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-700 leading-relaxed max-w-xs shadow-sm border border-gray-100">
        {renderTexto(texto)}
      </div>
    </div>
  );
}

function UserMessage({ texto }) {
  return (
    <div className="flex justify-end animate-fade-in">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed max-w-xs">
        {texto}
      </div>
    </div>
  );
}

export default function Chat() {
  const [mensajes, setMensajes] = useState([]);
  const [historialGemini, setHistorialGemini] = useState([]);
  const [input, setInput] = useState("");
  const [iniciado, setIniciado] = useState(false);
  const [escribiendo, setEscribiendo] = useState(false);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, escribiendo]);

  const agregarMensajeBot = (texto) => {
    setMensajes((prev) => [...prev, { tipo: "bot", texto }]);
  };

  const enviarAGemini = async (mensaje, historialActual) => {
    setEscribiendo(true);
    setMostrarSugerencias(false);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje, historial: historialActual }),
      });
      const data = await res.json();
      const respuesta =
        data.respuesta ||
        "Lo siento, no pude procesar tu mensaje. ¿Podés intentarlo de nuevo?";

      agregarMensajeBot(respuesta);
      setHistorialGemini((prev) => [
        ...prev,
        { role: "user", content: mensaje },
        { role: "assistant", content: respuesta },
      ]);
    } catch {
      agregarMensajeBot(
        "Tuve un problema para conectarme. Por favor, intentá de nuevo en un momento."
      );
    } finally {
      setEscribiendo(false);
      setMostrarSugerencias(true);
    }
  };

  const iniciarConversacion = async () => {
    setIniciado(true);
    await enviarAGemini("Hola, acabo de llegar a la plataforma SANA.", []);
  };

  const manejarEnvio = async (textoDirecto) => {
    const msg = textoDirecto || input.trim();
    if (!msg || escribiendo) return;
    setInput("");
    setMostrarSugerencias(false);
    setMensajes((prev) => [...prev, { tipo: "user", texto: msg }]);
    await enviarAGemini(msg, historialGemini);
  };

  const reiniciar = () => {
    setMensajes([]);
    setHistorialGemini([]);
    setIniciado(false);
    setEscribiendo(false);
    setMostrarSugerencias(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <MessageCircle size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-800">Acompañamiento</h1>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Disponible · Anónimo
            </div>
          </div>
        </div>
        {iniciado && (
          <button
            onClick={reiniciar}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Reiniciar conversación"
          >
            <RefreshCw size={16} />
          </button>
        )}
      </div>

      {/* Aviso privacidad */}
      <div className="flex items-start gap-2 mb-4 px-1">
        <Shield size={13} className="text-green-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-400 leading-relaxed">
          Conversación anónima · Sin registro de datos · No reemplaza atención profesional
        </p>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
        {!iniciado ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle size={28} className="text-purple-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Hola. Estoy aquí para acompañarte.
            </h2>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-6">
              Puedes preguntarme lo que necesites. No te juzgo. No guardo
              datos. Vos decidís qué compartir.
            </p>
            <button
              onClick={iniciarConversacion}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Comenzar conversación
            </button>
          </div>
        ) : (
          <>
            {mensajes.map((msg, i) =>
              msg.tipo === "bot" ? (
                <BotMessage key={i} texto={msg.texto} />
              ) : (
                <UserMessage key={i} texto={msg.texto} />
              )
            )}

            {/* Indicador escribiendo */}
            {escribiendo && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={14} className="text-white" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1 shadow-sm border border-gray-100">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-purple-400 rounded-full"
                      style={{ animation: `pulse-dot 1.2s infinite ${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sugerencias rápidas */}
            {!escribiendo && mostrarSugerencias && historialGemini.length <= 2 && (
              <div className="flex flex-wrap gap-2 mt-2 pl-11 animate-fade-in">
                {SUGERENCIAS.map((s) => (
                  <button
                    key={s}
                    onClick={() => manejarEnvio(s)}
                    className="text-xs bg-purple-50 border border-purple-200 text-purple-700 px-3 py-2 rounded-full hover:bg-purple-100 transition-colors font-medium"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {iniciado && (
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && manejarEnvio()}
            placeholder="Escribe tu pregunta aquí..."
            className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all"
            disabled={escribiendo}
          />
          <button
            onClick={() => manejarEnvio()}
            disabled={!input.trim() || escribiendo}
            className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
