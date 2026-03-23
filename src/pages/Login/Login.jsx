import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Shield } from "lucide-react";
import { loginConEmail, registrarConEmail } from "../../firebase/auth";
import { obtenerPerfil } from "../../firebase/db";

const ERROR_MSG = {
  "auth/user-not-found":       "No existe una cuenta con ese correo.",
  "auth/wrong-password":       "Contraseña incorrecta.",
  "auth/invalid-credential":   "Correo o contraseña incorrectos.",
  "auth/email-already-in-use": "Ya existe una cuenta con ese correo.",
  "auth/weak-password":        "La contraseña debe tener al menos 6 caracteres.",
  "auth/invalid-email":        "Correo electrónico inválido.",
};

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/";

  const [modo, setModo] = useState("login"); // "login" | "registro"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPass, setMostrarPass] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    if (modo === "registro") {
      const { user, error: err } = await registrarConEmail(email, password);
      if (err) { setError(ERROR_MSG[err] || "Error al registrarse."); setCargando(false); return; }
      // Nuevo usuario → setup perfil
      navigate("/setup-perfil?next=" + encodeURIComponent(next));
    } else {
      const { user, error: err } = await loginConEmail(email, password);
      if (err) { setError(ERROR_MSG[err] || "Error al iniciar sesión."); setCargando(false); return; }
      // Verificar si ya tiene perfil configurado
      try {
        const perfil = await obtenerPerfil(user.uid);
        if (!perfil?.nombreAnonimo) {
          navigate("/setup-perfil?next=" + encodeURIComponent(next));
        } else {
          navigate(next);
        }
      } catch {
        navigate(next);
      }
    }
    setCargando(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #F9F9F9 0%, #E7D6D3 100%)" }}
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 animate-fade-in-up">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/images/logo1.png" alt="SANA" className="h-12 w-auto mx-auto mb-2" />
          </Link>
          <p className="text-xs" style={{ color: "#A7B1B3" }}>Sanar A través de Narrativas Anónimas</p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-2xl overflow-hidden border mb-6" style={{ borderColor: "#E7D6D3" }}>
          {["login", "registro"].map((m) => (
            <button
              key={m}
              onClick={() => { setModo(m); setError(""); }}
              className="flex-1 py-2.5 text-sm font-medium transition-all"
              style={modo === m
                ? { backgroundColor: "#586E7D", color: "#F9F9F9" }
                : { backgroundColor: "transparent", color: "#A7B1B3" }}
            >
              {m === "login" ? "Iniciar sesión" : "Registrarse"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#586E7D" }}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@correo.com"
              className="w-full border rounded-2xl px-4 py-2.5 text-sm outline-none transition-all"
              style={{ borderColor: "#E7D6D3", color: "#586E7D" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#586E7D"; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = "#E7D6D3"; }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#586E7D" }}>
              Contraseña
            </label>
            <div className="relative">
              <input
                type={mostrarPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                className="w-full border rounded-2xl px-4 py-2.5 text-sm outline-none transition-all pr-10"
                style={{ borderColor: "#E7D6D3", color: "#586E7D" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#586E7D"; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = "#E7D6D3"; }}
              />
              <button
                type="button"
                onClick={() => setMostrarPass(!mostrarPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "#A7B1B3" }}
              >
                {mostrarPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full py-3 rounded-full font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ backgroundColor: "#586E7D", color: "#F9F9F9" }}
          >
            {cargando
              ? <><Loader2 size={16} className="animate-spin" /> Cargando...</>
              : modo === "login" ? "Entrar" : "Crear cuenta"
            }
          </button>
        </form>

        {/* Privacidad */}
        <div className="mt-6 flex items-start gap-2 bg-purple-50 rounded-2xl px-4 py-3">
          <Shield size={14} className="text-purple-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs leading-relaxed" style={{ color: "#A7B1B3" }}>
            Tu correo nunca será visible ni compartido. Solo pedimos un nombre ficticio para proteger tu identidad.
          </p>
        </div>

        <p className="text-center mt-4">
          <Link to="/" className="text-xs" style={{ color: "#A7B1B3" }}>
            ← Volver sin iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
