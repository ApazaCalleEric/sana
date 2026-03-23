import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line, CartesianGrid,
} from "recharts";
import { obtenerEstadisticas } from "../../firebase/db";

const CATEGORIAS = [
  { id: "violencia-sexual", label: "Violencia sexual", color: "#f43f5e", emoji: "🌷" },
  { id: "aborto",           label: "Aborto",           color: "#a855f7", emoji: "🌿" },
  { id: "embarazo-parto",   label: "Embarazo y parto", color: "#f59e0b", emoji: "🌻" },
];

const RANGOS = ["12-15", "16-18", "19-23", "24-28", "28+"];

const SEXOS = ["Mujer", "Hombre", "Intersexual"];
const SEXO_COLOR = { Mujer: "#f43f5e", Hombre: "#6366f1", Intersexual: "#f59e0b" };

// Datos demo
const demo = {
  totalTestimonios: 47,
  totalConsultas: 312,
  porCategoria: { "violencia-sexual": 22, aborto: 15, "embarazo-parto": 10 },
  porRangoEdad: {
    "violencia-sexual": { "12-15": 5, "16-18": 8, "19-23": 6, "24-28": 2, "28+": 1 },
    aborto:             { "12-15": 1, "16-18": 4, "19-23": 6, "24-28": 3, "28+": 1 },
    "embarazo-parto":   { "12-15": 0, "16-18": 2, "19-23": 4, "24-28": 3, "28+": 1 },
  },
  porSexo: { Mujer: 38, Hombre: 6, Intersexual: 3 },
  tendencia: [
    { mes: "Oct", "violencia-sexual": 3, aborto: 2, "embarazo-parto": 1 },
    { mes: "Nov", "violencia-sexual": 5, aborto: 3, "embarazo-parto": 2 },
    { mes: "Dic", "violencia-sexual": 6, aborto: 4, "embarazo-parto": 2 },
    { mes: "Ene", "violencia-sexual": 4, aborto: 3, "embarazo-parto": 2 },
    { mes: "Feb", "violencia-sexual": 4, aborto: 3, "embarazo-parto": 3 },
  ],
};

const TIP = { borderRadius: "10px", border: "none", boxShadow: "0 2px 12px rgba(0,0,0,.1)", fontSize: 12 };

function Kpi({ valor, label }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
      <div className="text-3xl font-bold text-gray-800">{valor}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

export default function Estadisticas() {
  const [datos, setDatos] = useState(demo);
  const [catActiva, setCatActiva] = useState("violencia-sexual");

  useEffect(() => {
    obtenerEstadisticas().then((real) => {
      if (real?.totalSubmissions > 0) setDatos((p) => ({ ...p, ...real }));
    }).catch(() => {});
  }, []);

  const total = Object.values(datos.porCategoria).reduce((a, b) => a + b, 0);

  // Datos para gráfica de rangos de la categoría activa
  const rangoData = RANGOS.map((r) => ({
    rango: r,
    cantidad: datos.porRangoEdad?.[catActiva]?.[r] ?? 0,
  }));

  // Pie sexo
  const sexoPie = SEXOS.map((s) => ({
    name: s,
    value: datos.porSexo?.[s] ?? 0,
    color: SEXO_COLOR[s],
  }));

  // Pie categorías
  const catPie = CATEGORIAS.map((c) => ({
    name: c.label,
    value: datos.porCategoria[c.id] ?? 0,
    color: c.color,
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs text-purple-600 font-medium uppercase tracking-wider mb-1">Dashboard</p>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Estadísticas SANA</h1>
        <p className="text-sm text-gray-400">Datos agregados y anónimos · Ningún dato permite identificar a una persona</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Kpi valor={total} label="Testimonios recibidos" />
        <Kpi valor={datos.totalConsultas} label="Consultas al chatbot" />
        <Kpi valor="3" label="Temáticas" />
        <Kpi valor="100%" label="Anónimo" />
      </div>

      {/* Fila 1: Pie categorías + Pie sexo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* Distribución por categoría */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <p className="font-semibold text-gray-800 mb-1 text-sm">Testimonios por temática</p>
          <p className="text-xs text-gray-400 mb-4">Distribución total</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={catPie} cx="50%" cy="50%" innerRadius={55} outerRadius={95}
                paddingAngle={3} dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {catPie.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Legend formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
              <Tooltip contentStyle={TIP} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución por sexo */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <p className="font-semibold text-gray-800 mb-1 text-sm">Distribución por sexo</p>
          <p className="text-xs text-gray-400 mb-4">De quienes compartieron su historia</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={sexoPie} cx="50%" cy="50%" innerRadius={55} outerRadius={95}
                paddingAngle={3} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {sexoPie.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={TIP} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rangos de edad por categoría */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
          <div>
            <p className="font-semibold text-gray-800 text-sm mb-1">Rangos de edad por temática</p>
            <p className="text-xs text-gray-400">Selecciona una categoría para ver el desglose</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIAS.map((c) => (
              <button key={c.id} onClick={() => setCatActiva(c.id)}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-all border"
                style={catActiva === c.id
                  ? { backgroundColor: c.color, color: "white", borderColor: c.color }
                  : { backgroundColor: "white", color: "#6b7280", borderColor: "#e5e7eb" }}>
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={rangoData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="rango" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip contentStyle={TIP} formatter={(v) => [v, "Testimonios"]} />
            <Bar dataKey="cantidad" radius={[6, 6, 0, 0]}
              fill={CATEGORIAS.find(c => c.id === catActiva)?.color ?? "#a855f7"} />
          </BarChart>
        </ResponsiveContainer>

        {/* Resumen numérico */}
        <div className="grid grid-cols-5 gap-2 mt-4">
          {rangoData.map((r) => (
            <div key={r.rango} className="text-center bg-gray-50 rounded-xl py-2">
              <div className="text-base font-bold text-gray-800">{r.cantidad}</div>
              <div className="text-xs text-gray-400">{r.rango}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tendencia mensual */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
        <p className="font-semibold text-gray-800 text-sm mb-1">Tendencia mensual</p>
        <p className="text-xs text-gray-400 mb-5">Testimonios recibidos por mes y temática</p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={datos.tendencia} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip contentStyle={TIP} />
            <Legend formatter={(v) => <span className="text-xs">{CATEGORIAS.find(c => c.id === v)?.label ?? v}</span>} />
            {CATEGORIAS.map((c) => (
              <Line key={c.id} type="monotone" dataKey={c.id}
                stroke={c.color} strokeWidth={2.5}
                dot={{ r: 4, fill: c.color }} activeDot={{ r: 6 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Nota */}
      <div className="bg-purple-50 rounded-2xl p-5 text-center border border-purple-100">
        <p className="text-sm text-gray-600 leading-relaxed max-w-lg mx-auto">
          Detrás de cada número hay una persona real que decidió hablar. Estos datos
          existen porque alguien rompió el silencio.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Datos ilustrativos · Se actualizan en tiempo real con Firebase activo
        </p>
      </div>
    </div>
  );
}
