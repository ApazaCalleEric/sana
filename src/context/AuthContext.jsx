import { createContext, useContext, useState, useEffect } from "react";
import { escucharAuth } from "../firebase/auth";
import { obtenerPerfil } from "../firebase/db";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = escucharAuth(async (u) => {
      setUser(u);
      if (u) {
        try {
          const p = await obtenerPerfil(u.uid);
          setPerfil(p);
        } catch {
          setPerfil(null);
        }
      } else {
        setPerfil(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Admin: por rol en Firestore O por email de entorno (comparación sin distinción de mayúsculas)
  const isAdmin =
    perfil?.rol === "admin" ||
    (user?.email &&
      user.email.toLowerCase() === (import.meta.env.VITE_ADMIN_EMAIL || "").toLowerCase());

  // Usuario logueado pero sin nombre anónimo configurado
  const needsSetup = !!user && !perfil?.nombreAnonimo;

  return (
    <AuthCtx.Provider value={{ user, perfil, setPerfil, isAdmin, needsSetup, loading }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthCtx);
}
