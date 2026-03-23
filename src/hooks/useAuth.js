import { useAuthContext } from "../context/AuthContext";

// Proxy al contexto para que todos los archivos existentes sigan funcionando
export function useAuth() {
  return useAuthContext();
}
