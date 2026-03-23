import { useState } from "react";
import { Heart, Shield, Chrome, Loader2 } from "lucide-react";
import { loginConGoogle } from "../../firebase/auth";

export default function Login() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleGoogle = async () => {
    setCargando(true);
    setError("");
    const user = await loginConGoogle();
    if (!user) {
      setError("No se pudo iniciar sesión. Intenta de nuevo.");
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-rose-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-rose-400 px-8 py-10 text-center text-white">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
            <Heart size={26} className="text-white" fill="white" />
          </div>
          <h1 className="text-3xl font-bold mb-1 tracking-wide">SANA</h1>
          <p className="text-white/70 text-xs mb-3">Sentir · Aprender · Narrar · Avanzar</p>
          <p className="text-white/80 text-sm leading-relaxed">
            Un espacio seguro de acompañamiento en derechos sexuales y reproductivos.
          </p>
        </div>

        {/* Contenido */}
        <div className="px-8 py-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">
            Accede a la plataforma
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
            Inicia sesión con tu cuenta de Google. No compartimos tu información
            con nadie ni la usamos para nada más allá del acceso.
          </p>

          {/* Botón Google */}
          <button
            onClick={handleGoogle}
            disabled={cargando}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl py-3 px-4 font-medium text-gray-700 hover:border-purple-300 hover:bg-purple-50 transition-all disabled:opacity-60"
          >
            {cargando ? (
              <Loader2 size={20} className="animate-spin text-purple-500" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.2 0-9.6-3-11.4-7.2l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6l6.2 5.2C40.8 35.6 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/>
              </svg>
            )}
            {cargando ? "Conectando..." : "Continuar con Google"}
          </button>

          {error && (
            <p className="text-sm text-red-500 text-center mt-3">{error}</p>
          )}

          {/* Garantías */}
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
            {[
              "Tu identidad no se muestra en los testimonios",
              "No compartimos tu email con nadie",
              "Puedes eliminar tu cuenta cuando quieras",
            ].map((g) => (
              <div key={g} className="flex items-start gap-2 text-xs text-gray-500">
                <Shield size={13} className="text-purple-400 flex-shrink-0 mt-0.5" />
                {g}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
