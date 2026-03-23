import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Bell } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { cerrarSesion } from "../../firebase/auth";
import { obtenerNotificaciones, marcarNotificacionLeida } from "../../firebase/db";

const NAV_USUARIO = [
  { path: "/",            label: "Inicio" },
  { path: "/testimonios", label: "Historias" },
  { path: "/comparte",    label: "Comparte tu historia" },
];

const NAV_ADMIN = [
  { path: "/",      label: "Inicio" },
  { path: "/admin", label: "Dashboard" },
  { path: "/admin?tab=historias", label: "Historias recibidas" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, perfil, isAdmin } = useAuth();

  const navItems = isAdmin ? NAV_ADMIN : NAV_USUARIO;
  const notifRef = useRef(null);

  // Cargar notificaciones del usuario
  useEffect(() => {
    if (!user) { setNotifs([]); return; }
    obtenerNotificaciones(user.uid)
      .then(setNotifs)
      .catch(() => setNotifs([]));
  }, [user]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const noLeidas = notifs.filter((n) => !n.leida).length;

  const handleAbrirNotifs = async () => {
    setNotifOpen(!notifOpen);
    // Marcar todas como leídas al abrir
    if (!notifOpen && noLeidas > 0) {
      const sinLeer = notifs.filter((n) => !n.leida);
      await Promise.all(sinLeer.map((n) => marcarNotificacionLeida(n.id).catch(() => {})));
      setNotifs((prev) => prev.map((n) => ({ ...n, leida: true })));
    }
  };

  const handleLogout = async () => {
    await cerrarSesion();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "rgba(249,249,249,0.92)",
        backdropFilter: "blur(12px)",
        borderColor: "#E7D6D3",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/logo1.png" alt="SANA" className="h-8 w-auto" />
          <span className="hidden md:inline text-xs" style={{ color: "#A7B1B3" }}>
            Sanar A través de Narrativas Anónimas
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const [itemPath, itemQuery] = item.path.split("?");
            const fullLocation = location.pathname + location.search;
            const active = itemQuery
              ? fullLocation === item.path
              : location.pathname === itemPath && !location.search;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: active ? "#E7D6D3" : "transparent",
                  color: active ? "#586E7D" : "#A7B1B3",
                }}
                onMouseEnter={(e) => {
                  if (!active) { e.currentTarget.style.backgroundColor = "#F9F9F9"; e.currentTarget.style.color = "#586E7D"; }
                }}
                onMouseLeave={(e) => {
                  if (!active) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#A7B1B3"; }
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sesión desktop */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              {/* Notificaciones */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={handleAbrirNotifs}
                  className="relative p-2 rounded-full transition-colors"
                  style={{ color: "#A7B1B3" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#586E7D"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#A7B1B3"; }}
                  title="Notificaciones"
                >
                  <Bell size={16} />
                  {noLeidas > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {noLeidas}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border z-50 overflow-hidden"
                    style={{ borderColor: "#E7D6D3" }}>
                    <div className="px-4 py-3 border-b" style={{ borderColor: "#E7D6D3" }}>
                      <p className="text-sm font-semibold" style={{ color: "#586E7D" }}>Notificaciones</p>
                    </div>
                    {notifs.length === 0 ? (
                      <p className="text-xs text-center py-6" style={{ color: "#A7B1B3" }}>Sin notificaciones</p>
                    ) : (
                      <div className="max-h-72 overflow-y-auto divide-y" style={{ borderColor: "#F9F9F9" }}>
                        {notifs.map((n) => (
                          <div key={n.id} className="px-4 py-3" style={{ backgroundColor: n.leida ? "transparent" : "#FFF9F9" }}>
                            <p className="text-xs leading-relaxed" style={{ color: "#586E7D" }}>{n.mensaje}</p>
                            <p className="text-xs mt-1" style={{ color: "#A7B1B3" }}>
                              {n.fecha?.toDate?.()?.toLocaleDateString("es-BO") || ""}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Nombre anónimo */}
              <span className="text-xs font-medium px-2" style={{ color: "#586E7D" }}>
                {perfil?.nombreAnonimo || ""}
              </span>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-1.5 transition-colors rounded-full"
                style={{ color: "#A7B1B3" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#586E7D"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#A7B1B3"; }}
                title="Cerrar sesión"
              >
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: "#586E7D", color: "#F9F9F9" }}
            >
              Iniciar sesión
            </Link>
          )}
        </div>

        {/* Hamburger mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: "#A7B1B3" }}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t px-4 py-3 flex flex-col gap-1 animate-fade-in"
          style={{ backgroundColor: "#F9F9F9", borderColor: "#E7D6D3" }}
        >
          {navItems.map((item) => {
            const [itemPath, itemQuery] = item.path.split("?");
            const fullLocation = location.pathname + location.search;
            const active = itemQuery
              ? fullLocation === item.path
              : location.pathname === itemPath && !location.search;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm font-medium"
                style={{
                  backgroundColor: active ? "#E7D6D3" : "transparent",
                  color: active ? "#586E7D" : "#A7B1B3",
                }}
              >
                {item.label}
              </Link>
            );
          })}

          {user ? (
            <>
              <div className="pt-2 mt-1 border-t flex items-center justify-between" style={{ borderColor: "#E7D6D3" }}>
                <span className="text-xs px-1" style={{ color: "#586E7D" }}>
                  {perfil?.nombreAnonimo || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm"
                  style={{ color: "#A7B1B3" }}
                >
                  <LogOut size={14} />
                  Salir
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="mt-2 px-4 py-2.5 rounded-full text-sm font-semibold text-center"
              style={{ backgroundColor: "#586E7D", color: "#F9F9F9" }}
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
