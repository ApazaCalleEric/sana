import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./config";

const provider = new GoogleAuthProvider();

export async function loginConGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error en login con Google:", error);
    return null;
  }
}

export async function registrarConEmail(email, password) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { user: result.user, esNuevo: true, error: null };
  } catch (error) {
    return { user: null, esNuevo: false, error: error.code };
  }
}

export async function loginConEmail(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error.code };
  }
}

export async function cerrarSesion() {
  await signOut(auth);
}

export function escucharAuth(callback) {
  return onAuthStateChanged(auth, callback);
}
