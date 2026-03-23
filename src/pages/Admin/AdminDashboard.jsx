import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { CheckCircle, XCircle, Loader2, Play, FileText, Bell } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import {
  obtenerEstadisticas,
  obtenerTodasSubmissions,
  aprobarSubmission,
  rechazarSubmission,
} from "../../firebase/db";

const CATEGORIAS = [
  { id: "violencia-sexual", label: "Violencia sexual",        color: "#f43f5e" },
  { id: "aborto",           label: "Decisiones reproductivas", color: "#a855f7" },
  { id: "embarazo-parto",   label: "Embarazo y parto",         color: "#f59e0b" },
];

const ESTADO_STYLE = {
  pendiente: { bg: "#fffbeb", text: "#92400e", label: "Pendiente" },
  aprobado:  { bg: "#f0fdf4", text: "#166534", label: "Aprobado"  },
  rechazado: { bg: "#fff1f2", text: "#9f1239", label: "Rechazado" },
};

const TIP = { borderRadius: "10px", border: "none", fontSize: 12 };

function Kpi({ valor, label }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center shadow-sm">
      <div className="text-3xl font-bold" style={{ color: "#586E7D" }}>{valor}</div>
      <div className="text-xs mt-1" style={{ color: "#A7B1B3" }}>{label}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tab, setTab] = useState(searchParams.get("tab") === "historias" ? "historias" : "dashboard");
  const [stats, setStats] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [cargandoStats, setCargandoStats] = useState(true);
  const [cargandoSubs, setCargandoSubs] = useState(true);
  const [rechazandoId, setRechazandoId] = useState(null);
  const [mensajeRechazo, setMensajeRechazo] = useState("");
  const [accionando, setAccionando] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("pendiente");

  // Protección de ruta
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/");
  }, [user, isAdmin, loading]);

  // Cargar stats
  useEffect(() => {
    obtenerEstadisticas()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setCargandoStats(false));
  }, []);

  // Cargar submissions
  const cargarSubmissions = () => {
    setCargandoSubs(true);
    obtenerTodasSubmissions()
      .then(setSubmissions)
      .catch(() => setSubmissions([]))
      .finally(() => setCargandoSubs(false));
  };

  useEffect(() => { cargarSubmissions(); }, []);

  const handleAprobar = async (id) => {
    setAccionando(true);
    try { await aprobarSubmission(id); cargarSubmissions(); } catch {}
    setAccionando(false);
  };

  const handleRechazar = async (id, uid) => {
    if (!mensajeRechazo.trim()) { alert("Escribe un mensaje de retroalimentación."); return; }
    setAccionando(true);
    try {
      await rechazarSubmission(id, uid, mensajeRechazo.trim());
      setRechazandoId(null);
      setMensajeRechazo("");
      cargarSubmissions();
    } catch {}
    setAccionando(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin" style={{ color: "#586E7D" }} />
      </div>
    );
  }

  if (!isAdmin) return null;

  const submissionsFiltradas = submissions.filter((s) =>
    filtroEstado === "todos" ? true : s.estado === filtroEstado
  );

  const catPie = CATEGORIAS.map((c) => ({
    name: c.label,
    value: stats?.porCategoria?.[c.id] ?? 0,
    color: c.color,
  }));

  const total = catPie.reduce((a, b) => a + b.value, 0);
  const pendientes = submissions.filter((s) => s.estado === "pendiente").length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#A7B1B3" }}>
            Panel de administración
          </p>
          <h1 className="text-2xl font-bold" style={{ color: "#586E7D" }}>Dashboard SANA</h1>
        </div>
        {pendientes > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-2">
            <Bell size={14} className="text-amber-500" />
            <span className="text-sm font-medium text-amber-700">{pendientes} histori{pendientes === 1 ? "a" : "as"} pendiente{pendientes !== 1 && "s"}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b" style={{ borderColor: "#E7D6D3" }}>
        {[
          { id: "dashboard", label: "Estadísticas" },
          { id: "historias", label: `Historias (${submissions.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="pb-2.5 px-1 text-sm font-medium transition-all border-b-2 -mb-px"
            style={tab === t.id
              ? { borderColor: "#586E7D", color: "#586E7D" }
              : { borderColor: "transparent", color: "#A7B1B3" }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB DASHBOARD ── */}
      {tab === "dashboard" && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Kpi valor={total} label="Testimonios recibidos" />
            <Kpi valor={submissions.filter((s) => s.estado === "aprobado").length} label="Aprobados" />
            <Kpi valor={pendientes} label="Pendientes" />
            <Kpi valor={stats?.totalConsultas ?? "—"} label="Consultas al bot" />
          </div>

          {/* Pie categorías */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="font-semibold text-sm mb-1" style={{ color: "#586E7D" }}>Testimonios por temática</p>
            <p className="text-xs mb-4" style={{ color: "#A7B1B3" }}>Distribución total recibida</p>
            {cargandoStats ? (
              <div className="flex justify-center py-10">
                <Loader2 size={20} className="animate-spin" style={{ color: "#A7B1B3" }} />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={catPie} cx="50%" cy="50%" innerRadius={50} outerRadius={90}
                    paddingAngle={3} dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {catPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Legend formatter={(v) => <span style={{ fontSize: 12, color: "#586E7D" }}>{v}</span>} />
                  <Tooltip contentStyle={TIP} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Barras por categoría */}
          {stats && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="font-semibold text-sm mb-4" style={{ color: "#586E7D" }}>Conteo por temática</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={catPie}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#A7B1B3" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#A7B1B3" }} allowDecimals={false} />
                  <Tooltip contentStyle={TIP} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {catPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* ── TAB HISTORIAS ── */}
      {tab === "historias" && (
        <div>
          {/* Filtro estado */}
          <div className="flex gap-2 flex-wrap mb-5">
            {[
              { id: "pendiente", label: "Pendientes" },
              { id: "aprobado",  label: "Aprobados"  },
              { id: "rechazado", label: "Rechazados" },
              { id: "todos",     label: "Todos"      },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFiltroEstado(f.id)}
                className="px-4 py-1.5 rounded-full text-xs font-medium border transition-all"
                style={filtroEstado === f.id
                  ? { backgroundColor: "#586E7D", color: "#F9F9F9", borderColor: "#586E7D" }
                  : { backgroundColor: "transparent", color: "#A7B1B3", borderColor: "#E7D6D3" }
                }
              >
                {f.label}
              </button>
            ))}
          </div>

          {cargandoSubs ? (
            <div className="flex justify-center py-16">
              <Loader2 size={24} className="animate-spin" style={{ color: "#586E7D" }} />
            </div>
          ) : submissionsFiltradas.length === 0 ? (
            <div className="text-center py-16" style={{ color: "#A7B1B3" }}>
              <p className="text-sm">No hay historias en esta categoría.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissionsFiltradas.map((s) => {
                const est = ESTADO_STYLE[s.estado] || ESTADO_STYLE.pendiente;
                const fecha = s.fechaEnvio?.toDate?.()?.toLocaleDateString("es-BO") || "—";
                return (
                  <div key={s.id} className="bg-white border rounded-2xl p-5 shadow-sm" style={{ borderColor: "#E7D6D3" }}>
                    {/* Cabecera */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-semibold" style={{ color: "#586E7D" }}>
                            {s.titulo || "Sin título"}
                          </span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: est.bg, color: est.text }}
                          >
                            {est.label}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F9F9F9", color: "#A7B1B3" }}>
                            {s.tipo === "audio" ? "🎙 Audio" : "📝 Texto"}
                          </span>
                        </div>
                        <p className="text-xs" style={{ color: "#A7B1B3" }}>
                          {CATEGORIAS.find((c) => c.id === s.categoria)?.label || s.categoria} · {fecha}
                          {s.edad && ` · ${s.edad} años`}
                          {s.sexo && ` · ${s.sexo}`}
                        </p>
                      </div>
                    </div>

                    {/* Contenido */}
                    {s.tipo === "texto" && s.texto && (
                      <div className="mb-4 p-3 rounded-xl text-sm leading-relaxed max-h-36 overflow-y-auto"
                        style={{ backgroundColor: "#F9F9F9", color: "#586E7D" }}>
                        <FileText size={12} className="inline mr-1 opacity-60" />
                        {s.texto}
                      </div>
                    )}
                    {s.tipo === "audio" && s.audioUrl && (
                      <div className="mb-4">
                        <audio controls src={s.audioUrl} className="w-full" style={{ height: 36 }} />
                      </div>
                    )}

                    {/* Acciones (solo en pendiente) */}
                    {s.estado === "pendiente" && (
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAprobar(s.id)}
                            disabled={accionando}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all disabled:opacity-60"
                            style={{ backgroundColor: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }}
                          >
                            <CheckCircle size={13} />
                            Aprobar
                          </button>
                          <button
                            onClick={() => setRechazandoId(rechazandoId === s.id ? null : s.id)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all"
                            style={{ backgroundColor: "#fff1f2", color: "#9f1239", border: "1px solid #fecdd3" }}
                          >
                            <XCircle size={13} />
                            Rechazar con nota
                          </button>
                        </div>

                        {rechazandoId === s.id && (
                          <div className="space-y-2">
                            <textarea
                              value={mensajeRechazo}
                              onChange={(e) => setMensajeRechazo(e.target.value)}
                              rows={3}
                              placeholder="Escribe un mensaje de retroalimentación para quien envió la historia..."
                              className="w-full border rounded-xl p-3 text-xs outline-none resize-none"
                              style={{ borderColor: "#E7D6D3", color: "#586E7D" }}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRechazar(s.id, s.uid)}
                                disabled={accionando || !mensajeRechazo.trim()}
                                className="px-4 py-2 rounded-full text-xs font-semibold disabled:opacity-50"
                                style={{ backgroundColor: "#586E7D", color: "#F9F9F9" }}
                              >
                                {accionando ? "Enviando..." : "Enviar notificación y rechazar"}
                              </button>
                              <button
                                onClick={() => { setRechazandoId(null); setMensajeRechazo(""); }}
                                className="px-4 py-2 rounded-full text-xs"
                                style={{ color: "#A7B1B3" }}
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
