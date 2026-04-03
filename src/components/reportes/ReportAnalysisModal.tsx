import { useState, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  X,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  Gamepad2,
  BookOpen,
} from "lucide-react";

export type SesionDataWithActividad = {
  fecha: string;
  duracion_seg: number;
  completado: boolean;
  puntuacion: number;
  puntuacion_maxima: number;
  actividad_id: number;
  actividad_nombre: string;
  tipo: "lectura" | "juego";
  nivel?: number;
  respuestas_correctas?: number;
  respuestas_incorrectas?: number;
  uso_audio?: number;
};

type ReportAnalysisModalProps = {
  studentName: string;
  allSessions: SesionDataWithActividad[];
  open: boolean;
  onClose: () => void;
};

const CHART_COLORS = [
  "#8b5cf6", // purple-500
  "#6366f1", // indigo-500
  "#06b6d4", // cyan-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ec4899", // pink-500
  "#14b8a6", // teal-500
  "#f97316", // orange-500
];

function formatDateShort(d: string): string {
  if (!d) return "-";
  try {
    const date = new Date(d);
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
  } catch {
    return "-";
  }
}

export function ReportAnalysisModal({
  studentName,
  allSessions,
  open,
  onClose,
}: ReportAnalysisModalProps) {
  const today = new Date();
  const defaultEnd = today.toISOString().slice(0, 10);
  const defaultStart = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const [dateFrom, setDateFrom] = useState(defaultStart);
  const [dateTo, setDateTo] = useState(defaultEnd);

  const filteredSessions = useMemo(() => {
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    to.setHours(23, 59, 59, 999);
    return allSessions.filter((s) => {
      const d = s.fecha ? new Date(s.fecha) : null;
      if (!d || isNaN(d.getTime())) return false;
      return d >= from && d <= to;
    });
  }, [allSessions, dateFrom, dateTo]);

  const puntosPorFecha = useMemo(() => {
    const byDate: Record<string, number> = {};
    filteredSessions.forEach((s) => {
      const key = s.fecha ? new Date(s.fecha).toISOString().slice(0, 10) : "";
      if (!key) return;
      byDate[key] = (byDate[key] || 0) + (s.puntuacion ?? 0);
    });
    return Object.entries(byDate)
      .map(([fecha, puntos]) => ({ fecha: formatDateShort(fecha), puntos, fechaRaw: fecha }))
      .sort((a, b) => a.fechaRaw.localeCompare(b.fechaRaw));
  }, [filteredSessions]);

  const actividadesMasJugadas = useMemo(() => {
    const byActividad: Record<string, { nombre: string; sesiones: number; puntos: number }> = {};
    filteredSessions.forEach((s) => {
      const key = String(s.actividad_id);
      if (!byActividad[key]) {
        byActividad[key] = { nombre: s.actividad_nombre, sesiones: 0, puntos: 0 };
      }
      byActividad[key].sesiones += 1;
      byActividad[key].puntos += s.puntuacion ?? 0;
    });
    return Object.entries(byActividad)
      .map(([, v]) => ({ nombre: v.nombre, sesiones: v.sesiones, puntos: v.puntos }))
      .sort((a, b) => b.sesiones - a.sesiones)
      .slice(0, 8);
  }, [filteredSessions]);

  const tendencia = useMemo(() => {
    if (puntosPorFecha.length < 2) return null;
    const mid = Math.floor(puntosPorFecha.length / 2);
    const primeraMitad = puntosPorFecha.slice(0, mid);
    const segundaMitad = puntosPorFecha.slice(mid);
    const sum1 = primeraMitad.reduce((s, x) => s + x.puntos, 0);
    const sum2 = segundaMitad.reduce((s, x) => s + x.puntos, 0);
    const prom1 = primeraMitad.length ? sum1 / primeraMitad.length : 0;
    const prom2 = segundaMitad.length ? sum2 / segundaMitad.length : 0;
    const diff = prom2 - prom1;
    const percent =
      prom1 > 0 ? Math.round((diff / prom1) * 100) : (prom2 > 0 ? 100 : 0);
    return { diff, percent, subio: diff > 0 };
  }, [puntosPorFecha]);

  const totalPuntos = useMemo(
    () => filteredSessions.reduce((s, x) => s + (x.puntuacion ?? 0), 0),
    [filteredSessions]
  );
  const totalSesiones = filteredSessions.length;
  const totalTiempoSeg = useMemo(
    () => filteredSessions.reduce((s, x) => s + (x.duracion_seg ?? 0), 0),
    [filteredSessions]
  );
  const totalTiempoFormato = totalTiempoSeg >= 3600
    ? `${Math.floor(totalTiempoSeg / 3600)} h ${Math.floor((totalTiempoSeg % 3600) / 60)} min`
    : totalTiempoSeg >= 60
      ? `${Math.floor(totalTiempoSeg / 60)} min ${totalTiempoSeg % 60} s`
      : `${totalTiempoSeg} seg`;
  const actividadMasJugada = actividadesMasJugadas[0];

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1098]" />
        <Dialog.Content
          className="fixed z-[1099] flex flex-col overflow-hidden bg-white shadow-2xl
            inset-x-0 bottom-0 top-[6vh] rounded-t-2xl max-h-[min(94dvh,94vh)]
            sm:inset-x-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:max-h-[min(90dvh,90vh)]
            w-full sm:w-[min(100vw-1.5rem,64rem)] max-w-[100vw] sm:max-w-5xl"
        >
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white p-4 sm:p-6 flex items-start sm:items-center justify-between gap-3 shrink-0">
            <div className="min-w-0 pr-2">
              <Dialog.Title className="text-lg sm:text-2xl mb-1 font-bold leading-tight">
                Análisis de progreso
              </Dialog.Title>
              <p className="text-indigo-100 text-sm sm:text-base truncate">{studentName}</p>
            </div>
            <Dialog.Close className="shrink-0 text-white hover:bg-white/20 rounded-full p-2 transition-colors">
              <X size={22} className="sm:w-6 sm:h-6" />
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain p-4 sm:p-6">
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              Los datos son reales: provienen del registro en base de datos cuando el estudiante completa juegos y lecturas.
            </div>
            {/* Selector de fechas */}
            <div className="mb-8 p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-xl border border-purple-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Calendar className="text-purple-600" size={20} />
                Rango de fechas
              </h3>
              <div className="flex flex-wrap gap-4 items-center">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Desde</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Hasta</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {filteredSessions.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">No hay sesiones en el rango seleccionado.</p>
                <p className="text-sm mt-2">Prueba ampliar el rango de fechas.</p>
              </div>
            ) : (
              <>
                {/* Resumen rápido */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 shadow-lg">
                    <p className="text-sm opacity-90">Total puntos</p>
                    <p className="text-2xl md:text-3xl font-bold">{totalPuntos}</p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl p-4 shadow-lg">
                    <p className="text-sm opacity-90">Sesiones</p>
                    <p className="text-2xl md:text-3xl font-bold">{totalSesiones}</p>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500 to-teal-600 text-white rounded-xl p-4 shadow-lg">
                    <p className="text-sm opacity-90">Tiempo total</p>
                    <p className="text-xl md:text-2xl font-bold">{totalTiempoFormato}</p>
                  </div>
                  <div
                    className={`rounded-xl p-4 shadow-lg ${
                      tendencia?.subio
                        ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white"
                        : tendencia && !tendencia.subio
                          ? "bg-gradient-to-br from-rose-500 to-rose-600 text-white"
                          : "bg-gradient-to-br from-slate-400 to-slate-500 text-white"
                    }`}
                  >
                    <p className="text-sm opacity-90 flex items-center gap-1">
                      {tendencia?.subio ? (
                        <TrendingUp size={16} />
                      ) : tendencia ? (
                        <TrendingDown size={16} />
                      ) : null}
                      Tendencia
                    </p>
                    <p className="text-2xl font-bold">
                      {tendencia
                        ? `${tendencia.subio ? "+" : ""}${tendencia.percent}%`
                        : "-"}
                    </p>
                    <p className="text-xs opacity-80 mt-1">
                      {tendencia?.subio
                        ? "Puntos aumentaron"
                        : tendencia
                          ? "Puntos disminuyeron"
                          : "Insuficientes datos"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl p-4 shadow-lg">
                    <p className="text-sm opacity-90 flex items-center gap-1">
                      <Gamepad2 size={14} />
                      Más jugado
                    </p>
                    <p className="text-lg font-bold truncate" title={actividadMasJugada?.nombre}>
                      {actividadMasJugada?.nombre ?? "-"}
                    </p>
                    <p className="text-xs opacity-80">
                      {actividadMasJugada?.sesiones ?? 0} sesiones
                    </p>
                  </div>
                </div>

                {/* Gráfica: Puntos por fecha */}
                <div className="mb-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BarChart3 className="text-purple-600" size={20} />
                    Puntos acumulados por fecha
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={puntosPorFecha} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="fecha"
                          tick={{ fontSize: 12, fill: "#6b7280" }}
                          stroke="#9ca3af"
                        />
                        <YAxis
                          tick={{ fontSize: 12, fill: "#6b7280" }}
                          stroke="#9ca3af"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                          formatter={(value) => [`${value ?? 0} pts`, "Puntos"]}
                          labelFormatter={(label) => `Fecha: ${label}`}
                        />
                        <Bar dataKey="puntos" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Gráfica: Actividades más jugadas */}
                <div className="mb-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BookOpen className="text-indigo-600" size={20} />
                    <Gamepad2 className="text-amber-600" size={20} />
                    Actividades más realizadas
                  </h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={actividadesMasJugadas}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" tick={{ fontSize: 12, fill: "#6b7280" }} stroke="#9ca3af" />
                        <YAxis
                          type="category"
                          dataKey="nombre"
                          width={140}
                          tick={{ fontSize: 11, fill: "#4b5563" }}
                          stroke="#9ca3af"
                          tickFormatter={(v) => (v.length > 20 ? v.slice(0, 18) + "…" : v)}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                          formatter={(value, name) => [
                            name === "sesiones" ? `${value ?? 0} sesiones` : `${value ?? 0} pts`,
                            name === "sesiones" ? "Sesiones" : "Puntos",
                          ]}
                          labelFormatter={(_, payload) =>
                            (payload?.[0] as { payload?: { nombre?: string } })?.payload?.nombre ?? ""
                          }
                        />
                        <Bar dataKey="sesiones" name="sesiones" radius={[0, 4, 4, 0]}>
                          {actividadesMasJugadas.map((_, index) => (
                            <Cell
                              key={index}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
