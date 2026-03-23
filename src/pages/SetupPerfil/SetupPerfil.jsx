import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Sparkles } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { crearPerfil } from "../../firebase/db";

const SUGERENCIAS = ["Luna", "Mariposa", "Cielo", "Rosa", "Esperanza", "Verano", "Estrella", "Brisa"];

export default function SetupPerfil() {
  const { user, setPerfil } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/";

  const [nombre, setNombre] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) { setError("Escribe un nombre ficticio."); return; }
    if (!user) { navigate("/login"); return; }

    setCargando(true);
    try {
      await crearPerfil(user.uid, nombre.trim());
      // Actualizar contexto local
      setPerfil({ nombreAnonimo: nombre.trim(), rol: "usuario" });
      navigate(next);
    } catch (err) {
      setError("No se pudo guardar. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #F9F9F9 0%, #E7D6D3 100%)" }}
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 animate-fade-in-up">

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
            style={{ backgroundColor: "#E7D6D3" }}>
            🌸
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: "#586E7D" }}>
            Elige tu nombre anónimo
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "#A7B1B3" }}>
            Nadie sabrá tu nombre real. Elige uno ficticio o inventado que te represente en esta plataforma.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={nombre}
              onChange={(e) => { setNombre(e.target.value); setError(""); }}
              placeholder="Ej: Luna, Mariposa, Cielo..."
              maxLength={30}
              className="w-full border rounded-2xl px-4 py-3 text-sm outline-none transition-all text-center font-medium"
              style={{ borderColor: "#E7D6D3", color: "#586E7D", fontSize: "1rem" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#586E7D"; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = "#E7D6D3"; }}
            />
            <div className="text-xs text-right mt-1" style={{ color: "#A7B1B3" }}>
              {nombre.length}/30
            </div>
          </div>

          {/* Sugerencias rápidas */}
          <div>
            <p className="text-xs mb-2 flex items-center gap-1" style={{ color: "#A7B1B3" }}>
              <Sparkles size={11} /> Sugerencias rápidas:
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGERENCIAS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setNombre(s)}
                  className="px-3 py-1 rounded-full text-xs border transition-all"
                  style={nombre === s
                    ? { backgroundColor: "#586E7D", color: "#F9F9F9", borderColor: "#586E7D" }
                    : { backgroundColor: "transparent", color: "#A7B1B3", borderColor: "#E7D6D3" }
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={cargando || !nombre.trim()}
            className="w-full py-3 rounded-full font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ backgroundColor: "#586E7D", color: "#F9F9F9" }}
          >
            {cargando
              ? <><Loader2 size={16} className="animate-spin" /> Guardando...</>
              : "Continuar como " + (nombre.trim() || "...")
            }
          </button>
        </form>
      </div>
    </div>
  );
}
