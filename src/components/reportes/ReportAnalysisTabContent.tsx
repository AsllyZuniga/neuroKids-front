import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar, BarChart3, PieChart as PieChartIcon } from "lucide-react";

type SesionData = {
  fecha: string;
  duracion_seg: number;
  completado: boolean;
  respuestas_correctas: number;
  respuestas_incorrectas: number;
  uso_audio: number;
  nivel: number;
  puntuacion: number;
  puntuacion_maxima: number;
};

type DetalleActividad = {
  actividad_id: number;
  nombre: string;
  tipo_actividad_id: number;
};

type CatalogoItem = { id: number; nombre: string };

type Props = {
  sesionesPorActividadId: Record<string | number, SesionData[]>;
  actividades: DetalleActividad[];
  catalogoLecturas: CatalogoItem[];
  catalogoJuegos: CatalogoItem[];
  actividadNombres?: Record<number, string>;
  modalOpen: boolean;
};

function sessionInRange(fecha: string, desde: string, hasta: string): boolean {
  const t = new Date(fecha).getTime();
  if (Number.isNaN(t)) return false;
  const d0 = new Date(`${desde}T00:00:00`);
  const d1 = new Date(`${hasta}T23:59:59.999`);
  return t >= d0.getTime() && t <= d1.getTime();
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

const COLORS = {
  lectura: "#6366f1",
  juego: "#22c55e",
  bar: "#8b5cf6",
};

export function ReportAnalysisTabContent({
  sesionesPorActividadId,
  actividades,
  catalogoLecturas,
  catalogoJuegos,
  actividadNombres = {},
  modalOpen,
}: Props) {
  const actividadesMap = useMemo(() => {
    const m = new Map<number, DetalleActividad>();
    actividades.forEach((a) => m.set(a.actividad_id, a));
    return m;
  }, [actividades]);

  const [desde, setDesde] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [hasta, setHasta] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (!modalOpen) return;
    const d = new Date();
    const h = d.toISOString().slice(0, 10);
    const dd = new Date(d);
    dd.setDate(dd.getDate() - 30);
    setDesde(dd.toISOString().slice(0, 10));
    setHasta(h);
  }, [modalOpen]);

  const nombreActividad = (id: number): string => {
    const mapNom = actividadNombres as Record<string | number, string | undefined>;
    const desdeApi = mapNom[id] ?? mapNom[String(id)];
    if (desdeApi && String(desdeApi).trim()) return String(desdeApi).trim();

    const a = actividadesMap.get(id);
    if (a?.nombre && String(a.nombre).trim()) return String(a.nombre).trim();

    const c =
      catalogoLecturas.find((x) => x.id === id) || catalogoJuegos.find((x) => x.id === id);
    if (c?.nombre && String(c.nombre).trim()) return String(c.nombre).trim();

    return "Nombre no disponible";
  };

  const tipoActividad = (id: number): 1 | 2 | 0 => {
    const a = actividadesMap.get(id);
    if (a?.tipo_actividad_id === 1 || a?.tipo_actividad_id === 2) {
      return a.tipo_actividad_id as 1 | 2;
    }
    if (catalogoLecturas.some((c) => c.id === id)) return 1;
    if (catalogoJuegos.some((c) => c.id === id)) return 2;
    return 0;
  };

  const stats = useMemo(() => {
    const map = sesionesPorActividadId as Record<string, SesionData[]>;
    const perActivity: Array<{
      id: number;
      nombre: string;
      tipo: 1 | 2 | 0;
      sesiones: number;
      minutos: number;
    }> = [];

    let lecturasCount = 0;
    let juegosCount = 0;
    let otrasCount = 0;
    let totalSeg = 0;

    const keys = Object.keys(map);
    for (const k of keys) {
      const id = Number(k);
      if (!Number.isFinite(id)) continue;
      const sessions = map[k] ?? map[String(id)];
      if (!Array.isArray(sessions)) continue;

      const filtered = sessions.filter(
        (s) => s.fecha && sessionInRange(String(s.fecha), desde, hasta)
      );
      if (filtered.length === 0) continue;

      const sesionesN = filtered.length;
      const seg = filtered.reduce((acc, s) => acc + (Number(s.duracion_seg) || 0), 0);
      const tipo = tipoActividad(id);

      if (tipo === 1) lecturasCount += sesionesN;
      else if (tipo === 2) juegosCount += sesionesN;
      else otrasCount += sesionesN;

      totalSeg += seg;

      perActivity.push({
        id,
        nombre: nombreActividad(id),
        tipo,
        sesiones: sesionesN,
        minutos: Math.round(seg / 60),
      });
    }

    perActivity.sort((a, b) => b.sesiones - a.sesiones);

    const pieData = [
      { name: "Lecturas", value: lecturasCount, fill: COLORS.lectura },
      { name: "Juegos", value: juegosCount, fill: COLORS.juego },
      { name: "Sin clasificar", value: otrasCount, fill: "#94a3b8" },
    ].filter((d) => d.value > 0);

    const topBar = perActivity.slice(0, 12).map((p) => ({
      nombre: truncate(p.nombre, 42),
      sesiones: p.sesiones,
      minutos: p.minutos,
      tipo: p.tipo === 1 ? "Lectura" : p.tipo === 2 ? "Juego" : "?",
    }));

    const totalSesiones = lecturasCount + juegosCount + otrasCount;

    return {
      lecturasCount,
      juegosCount,
      otrasCount,
      totalSesiones,
      totalSeg,
      totalMinutos: Math.round(totalSeg / 60),
      perActivity,
      pieData,
      topBar,
    };
  }, [
    sesionesPorActividadId,
    desde,
    hasta,
    actividadesMap,
    catalogoLecturas,
    catalogoJuegos,
    actividadNombres,
  ]);

  const applyPreset = (days: number | "all") => {
    const end = new Date();
    const h = end.toISOString().slice(0, 10);
    if (days === "all") {
      let minT = end.getTime();
      const map = sesionesPorActividadId as Record<string, SesionData[]>;
      Object.values(map).forEach((sessions) => {
        if (!Array.isArray(sessions)) return;
        sessions.forEach((s) => {
          if (!s.fecha) return;
          const t = new Date(s.fecha).getTime();
          if (!Number.isNaN(t)) minT = Math.min(minT, t);
        });
      });
      const start = new Date(minT);
      setDesde(start.toISOString().slice(0, 10));
      setHasta(h);
      return;
    }
    const start = new Date(end);
    start.setDate(start.getDate() - days);
    setDesde(start.toISOString().slice(0, 10));
    setHasta(h);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl mb-1 flex items-center gap-2 text-gray-800">
          <BarChart3 className="text-purple-600" size={24} />
          Análisis por periodo
        </h3>
        <p className="text-sm text-gray-600 max-w-3xl">
          Compara cuántas sesiones dedicó a cada lectura o juego en el rango elegido. 
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Desde</label>
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Hasta</label>
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2 pb-0.5">
          <button
            type="button"
            onClick={() => applyPreset(7)}
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
          >
            7 días
          </button>
          <button
            type="button"
            onClick={() => applyPreset(30)}
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
          >
            30 días
          </button>
          <button
            type="button"
            onClick={() => applyPreset(90)}
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
          >
            90 días
          </button>
          <button
            type="button"
            onClick={() => applyPreset("all")}
            className="text-xs px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900"
          >
            Todo el historial
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-slate-50 to-white p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Sesiones en el periodo</p>
          <p className="text-2xl font-semibold text-gray-900">{stats.totalSesiones}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-slate-50 to-white p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Tiempo estimado</p>
          <p className="text-2xl font-semibold text-gray-900">{stats.totalMinutos} min</p>
          <p className="text-xs text-gray-400 mt-1">Suma de duración por sesión</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-slate-50 to-white p-4 flex items-center gap-2">
          <Calendar className="text-purple-500 shrink-0" size={20} />
          <div>
            <p className="text-xs text-gray-500">Rango activo</p>
            <p className="text-sm font-medium text-gray-800">
              {desde} → {hasta}
            </p>
          </div>
        </div>
      </div>

      {stats.totalSesiones === 0 ? (
        <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/50 px-6 py-10 text-center text-amber-900">
          <p className="font-medium">No hay sesiones en este rango de fechas</p>
          <p className="text-sm mt-2 text-amber-800/90">
            Amplía las fechas o pulsa &quot;Todo el historial&quot; si ya hubo actividad en otras
            fechas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-xl border border-gray-200 p-4 bg-white">
            <h4 className="text-sm font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <PieChartIcon size={18} className="text-purple-600" />
              Lecturas vs juegos (sesiones)
            </h4>
            <p className="text-xs text-gray-500 mb-4">
              Reparto del número de sesiones registradas en el periodo.
            </p>
            {stats.pieData.length === 0 ? (
              <p className="text-sm text-gray-500">Sin datos para el gráfico circular.</p>
            ) : (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={56}
                      outerRadius={88}
                      paddingAngle={2}
                      label={({ name, value, percent }) =>
                        `${name}: ${value} (${((percent ?? 0) * 100).toFixed(0)}%)`
                      }
                    >
                      {stats.pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${Number(value ?? 0)} sesiones`, ""]}
                      contentStyle={{ borderRadius: "8px" }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 p-4 bg-white lg:col-span-1">
            <h4 className="text-sm font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <BarChart3 size={18} className="text-purple-600" />
              Top actividades (sesiones)
            </h4>
            <p className="text-xs text-gray-500 mb-4">
              Las actividades con más sesiones en el periodo (máx. 12).
            </p>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={stats.topBar}
                  margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                >
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="nombre"
                    width={118}
                    tick={{ fontSize: 10 }}
                    interval={0}
                  />
                  <Tooltip
                    formatter={(v) => [`${Number(v ?? 0)} sesiones`, "Sesiones"]}
                    contentStyle={{ borderRadius: "8px" }}
                  />
                  <Bar dataKey="sesiones" fill={COLORS.bar} name="Sesiones" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {stats.perActivity.length > 0 && stats.totalSesiones > 0 && (
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <h4 className="text-sm font-semibold text-gray-800 px-4 py-3 bg-gray-50 border-b">
            Detalle por actividad
          </h4>
          <div className="overflow-x-auto max-h-[240px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-white sticky top-0 shadow-sm">
                <tr className="text-left text-gray-600 text-xs">
                  <th className="px-4 py-2">Actividad</th>
                  <th className="px-4 py-2">Tipo</th>
                  <th className="px-4 py-2 text-right">Sesiones</th>
                  <th className="px-4 py-2 text-right">Minutos (aprox.)</th>
                </tr>
              </thead>
              <tbody>
                {stats.perActivity.map((row) => (
                  <tr key={row.id} className="border-t border-gray-100 hover:bg-purple-50/40">
                    <td className="px-4 py-2 font-medium text-gray-900 max-w-[200px] truncate">
                      {row.nombre}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {row.tipo === 1 ? "Lectura" : row.tipo === 2 ? "Juego" : "—"}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">{row.sesiones}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{row.minutos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
