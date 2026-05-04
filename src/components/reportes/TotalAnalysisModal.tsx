import { useEffect, useState, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, BarChart3, Loader } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { buildApiUrl } from "@/config/api";

type TotalAnalysisData = {
  totalEstudiantes: number;
  estudiantesConJuegosEspecificos: number;
  estudiantesConSesionesLecturas: number;
  estudiantesConLecturasYJuegos: number;
  estudiantesSoloLecturas: number;
  estudiantesSoloJuegos: number;
  lecturas: ActivityAnalysisItem[];
  juegos: ActivityAnalysisItem[];
};

type ActivityAnalysisItem = {
  id: number;
  nombre: string;
  tipo: "lectura" | "juego" | "otro";
  tipo_actividad_id: number;
  estudiantes_usaron?: number;
  estudiantes_completaron?: number;
};

type TotalAnalysisModalProps = {
  open: boolean;
  onClose: () => void;
};

export function TotalAnalysisModal({ open, onClose }: TotalAnalysisModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<TotalAnalysisData | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);

    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No autenticado");

        const resp = await fetch(buildApiUrl("/reportes/analisis-general"), {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(text || "Error al cargar análisis total");
        }

        const json = await resp.json();
        setAnalysisData({
          totalEstudiantes: json?.data?.analisis?.totalEstudiantes ?? 0,
          estudiantesConJuegosEspecificos:
            json?.data?.analisis?.estudiantesConJuegosEspecificos ?? 0,
          estudiantesConSesionesLecturas:
            json?.data?.analisis?.estudiantesConSesionesLecturas ?? 0,
          estudiantesConLecturasYJuegos:
            json?.data?.analisis?.estudiantesAmbos ?? 0,
          estudiantesSoloLecturas:
            json?.data?.analisis?.estudiantesSoloLecturas ?? 0,
          estudiantesSoloJuegos:
            json?.data?.analisis?.estudiantesSoloJuegos ?? 0,
          lecturas: Array.isArray(json?.data?.analisis?.lecturas)
            ? json.data.analisis.lecturas
            : [],
          juegos: Array.isArray(json?.data?.analisis?.juegos)
            ? json.data.analisis.juegos
            : [],
        });
      } catch (e: any) {
        setError(e?.message || "Error al cargar análisis total");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open]);

  // 📊 Datos para gráfica de barras
  const studentsBarData = useMemo(() => {
    if (!analysisData) return [];

    return [
      {
        nombre: "Solo lecturas",
        estudiantes: analysisData.estudiantesSoloLecturas,
        color: "#3b82f6",
      },
      {
        nombre: "Solo juegos",
        estudiantes: analysisData.estudiantesSoloJuegos,
        color: "#8b5cf6",
      },
      {
        nombre: "Lecturas y juegos",
        estudiantes: analysisData.estudiantesConLecturasYJuegos,
        color: "#16a34a",
      },
    ];
  }, [analysisData]);

  // 🥧 Datos para gráfica de pastel
  const activityStudentsData = useMemo(() => {
    if (!analysisData) return [];

    const palette = [
      "#3b82f6",
      "#8b5cf6",
      "#f97316",
      "#22c55e",
      "#ec4899",
      "#14b8a6",
      "#eab308",
      "#f43f5e",
      "#0ea5e9",
      "#64748b",
      "#84cc16",
      "#a855f7",
      "#06b6d4",
      "#ef4444",
      "#f59e0b",
      "#10b981",
      "#6366f1",
      "#d946ef",
      "#0891b2",
      "#65a30d",
      "#dc2626",
      "#7c3aed",
      "#0f766e",
      "#ca8a04",
      "#be123c",
      "#4338ca",
      "#15803d",
      "#b45309",
    ];

    return [...analysisData.lecturas, ...analysisData.juegos]
      .map((item, index) => ({
        id: item.id,
        nombre: item.nombre,
        tipo: item.tipo_actividad_id === 1 ? "Lectura" : "Juego",
        estudiantes:
          item.estudiantes_usaron ?? item.estudiantes_completaron ?? 0,
        fill: palette[index] ?? `hsl(${(index * 137.508) % 360} 72% 52%)`,
      }))
      .filter((item) => item.estudiantes > 0)
      .sort((a, b) => b.estudiantes - a.estudiantes);
  }, [analysisData]);

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-[90rem] max-h-[85vh] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl overflow-y-auto">
          <Dialog.Title className="text-2xl font-bold text-gray-800">
            Análisis de Estudiantes
          </Dialog.Title>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </Dialog.Close>
          </div>

          {loading ? (
            <div className="p-8 flex items-center justify-center gap-3 text-gray-600">
              <Loader className="w-5 h-5 animate-spin" />
              <p>Cargando datos...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              <p>{error}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* TARJETAS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <p className="text-sm text-gray-600">Total estudiantes</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {analysisData?.totalEstudiantes ?? 0}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-blue-200">
                  <p className="text-sm text-gray-600">Solo usaron lecturas</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {analysisData?.estudiantesSoloLecturas ?? 0}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-purple-200">
                  <p className="text-sm text-gray-600">Solo usaron juegos</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {analysisData?.estudiantesSoloJuegos ?? 0}
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                  <p className="text-sm text-gray-600">Usaron lecturas y juegos</p>
                  <p className="text-3xl font-bold text-green-700">
                    {analysisData?.estudiantesConLecturasYJuegos ?? 0}
                  </p>
                </div>
              </div>

              {/* 📊 BARRAS */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Comparación de estudiantes
                </h3>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={studentsBarData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nombre" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any) => [
                          `${value}`,
                          "Estudiantes",
                        ]}
                      />
                      <Bar dataKey="estudiantes" radius={[8, 8, 0, 0]}>
                        {studentsBarData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Estudiantes por actividad
                </h3>

                {activityStudentsData.length === 0 ? (
                  <p className="text-gray-500">
                    No hay estudiantes registrados por actividad.
                  </p>
                ) : (
                  <div className="space-y-6">
                    <div className="h-72 sm:h-96 flex justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={isMobile ? { top: 8, right: 8, bottom: 8, left: 8 } : undefined}>
                          <Pie
                            data={activityStudentsData}
                            dataKey="estudiantes"
                            nameKey="nombre"
                            outerRadius={isMobile ? 86 : 110}
                            innerRadius={isMobile ? 36 : 45}
                            labelLine={false}
                            label={({ percent }) =>
                              `${Math.round((percent ?? 0) * 100)}%`
                            }
                          >
                            {activityStudentsData.map((entry, index) => (
                              <Cell
                                key={`activity-cell-${index}`}
                                fill={entry.fill}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: any) => [
                              `${value ?? 0}`,
                              "Estudiantes",
                            ]}
                          />
                          {!isMobile && (
                            <Legend
                              layout="vertical"
                              verticalAlign="middle"
                              align="right"
                              wrapperStyle={{
                                columnCount: 2,
                                columnGap: 24,
                                maxWidth: 420,
                                lineHeight: "18px",
                              }}
                            />
                          )}
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {isMobile && (
                      <div className="mt-3 space-y-2">
                        {activityStudentsData.map((item) => (
                          <div
                            key={`activity-legend-${item.id}-${item.tipo}`}
                            className="flex items-center gap-2 text-sm text-gray-700"
                          >
                            <span
                              className="inline-block h-3 w-3 shrink-0 rounded-full"
                              style={{ backgroundColor: item.fill }}
                            />
                            <span className="min-w-0 truncate">
                              {item.nombre}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {activityStudentsData.map((item) => (
                        <div
                          key={`${item.id}-${item.tipo}`}
                          className="flex items-center justify-between gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className="inline-block w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: item.fill }}
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-700 truncate">
                                {item.nombre}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.tipo}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-lg font-semibold text-gray-900">
                              {item.estudiantes}
                            </p>
                            <p className="text-xs text-gray-500">estudiantes</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
