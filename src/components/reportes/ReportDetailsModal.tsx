import { useState, useMemo, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import * as Select from "@radix-ui/react-select";
import { ReportAnalysisTabContent } from "./ReportAnalysisTabContent";
import {
  X,
  ChevronDown,
  BookOpen,
  Headphones,
  Clock,
  CheckCircle,
  XCircle,
  BarChart,
  Trophy,
  Gamepad2,
  Calendar,
  Layers,
  History,
} from "lucide-react";

type DetalleActividad = {
  actividad_id: number;
  nombre: string;
  tipo_actividad_id: number;
  grupo_edad_id: number;
  nivel: number | null;
  puntuacion: number | null;
  puntuacion_maxima: number | null;
  completado: boolean | null;
  intentos: number | null;
  tiempo_total: number | null;
  respuestas_correctas?: number;
  respuestas_incorrectas?: number;
  uso_audio?: number;
  ultima_interaccion: string | null;
  sesiones?: Array<{
    fecha: string;
    duracion_seg: number;
    completado: boolean;
    respuestas_correctas: number;
    respuestas_incorrectas: number;
    uso_audio: number;
    nivel: number;
    puntuacion: number;
    puntuacion_maxima: number;
  }>;
};

type DetalleInsignia = {
  id: number;
  nombre: string;
  descripcion: string;
  completado: boolean | null;
  obtenido_at: string | null;
};

type CatalogoItem = { id: number; nombre: string };

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

type HistorialAccesoItem = {
  id: number;
  fecha_hora: string | null;
  ip_address: string | null;
  user_agent: string | null;
};

type ReportDetailsModalProps = {
  studentName: string;
  studentAge: number | null;
  actividades: DetalleActividad[];
  sesionesPorActividadId: Record<string | number, SesionData[]>;
  catalogoLecturas: CatalogoItem[];
  catalogoJuegos: CatalogoItem[];
  insignias: DetalleInsignia[];
  historialAccesos?: HistorialAccesoItem[];
  actividadNombres?: Record<number, string>;
  open: boolean;
  loading: boolean;
  error: string | null;
  onClose: () => void;
};

const LEVEL_NAMES: Record<number, string> = {
  1: "Nivel Fácil",
  2: "Nivel Medio",
  3: "Nivel Difícil",
};

function formatDate(d: string | null): string {
  if (!d) return "-";
  try {
    const date = new Date(d);
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return "-";
  }
}

/** Fecha y hora local del servidor (ISO) para el historial de accesos a la plataforma */
function formatAccesoParts(fechaHora: string | null): { fecha: string; hora: string } {
  if (!fechaHora) return { fecha: "-", hora: "-" };
  try {
    const d = new Date(fechaHora);
    if (Number.isNaN(d.getTime())) return { fecha: "-", hora: "-" };
    return {
      fecha: d.toLocaleDateString("es-ES", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      hora: d.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
  } catch {
    return { fecha: "-", hora: "-" };
  }
}

function toDateKeyLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const DEFAULT_LEVELS = [
  { id: 1, name: "Nivel 1" },
  { id: 2, name: "Nivel 2" },
  { id: 3, name: "Nivel 3" },
];

export function ReportDetailsModal({
  studentName,
  studentAge,
  actividades,
  sesionesPorActividadId,
  catalogoLecturas,
  catalogoJuegos,
  insignias,
  historialAccesos = [],
  actividadNombres = {},
  open,
  loading,
  error,
  onClose,
}: ReportDetailsModalProps) {
  const actividadesMap = useMemo(() => {
    const m = new Map<number, DetalleActividad>();
    actividades.forEach((a) => m.set(a.actividad_id, a));
    return m;
  }, [actividades]);

  const [selectedReadingId, setSelectedReadingId] = useState<number | null>(
    catalogoLecturas[0]?.id ?? null
  );
  const [selectedReadingLevel, setSelectedReadingLevel] = useState<number | null>(null);
  const [readingDateFilter, setReadingDateFilter] = useState<string>("all");
  const [readingDateFrom, setReadingDateFrom] = useState<string>("");
  const [readingDateTo, setReadingDateTo] = useState<string>("");

  const [selectedGameId, setSelectedGameId] = useState<number | null>(
    catalogoJuegos[0]?.id ?? null
  );

  const [selectedGameLevel, setSelectedGameLevel] = useState<number | null>(null);
  const [gameDateFilter, setGameDateFilter] = useState<string>("all");
  const [gameDateFrom, setGameDateFrom] = useState<string>("");
  const [gameDateTo, setGameDateTo] = useState<string>("");

  useEffect(() => {
    if (catalogoLecturas.length > 0 && (selectedReadingId === null || !catalogoLecturas.some((r) => r.id === selectedReadingId))) {
      setSelectedReadingId(catalogoLecturas[0].id);
    }
  }, [catalogoLecturas]);
  useEffect(() => {
    if (catalogoJuegos.length > 0 && (selectedGameId === null || !catalogoJuegos.some((g) => g.id === selectedGameId))) {
      setSelectedGameId(catalogoJuegos[0].id);
    }
  }, [catalogoJuegos]);

  const selectedReading = useMemo(
    () => (selectedReadingId ? actividadesMap.get(selectedReadingId) : null),
    [actividadesMap, selectedReadingId]
  );
  const selectedGame = useMemo(
    () => (selectedGameId ? actividadesMap.get(selectedGameId) : null),
    [actividadesMap, selectedGameId]
  );
  const selectedReadingInfo = useMemo(
    () => catalogoLecturas.find((r) => r.id === selectedReadingId) ?? catalogoLecturas[0],
    [catalogoLecturas, selectedReadingId]
  );
  const selectedGameInfo = useMemo(
    () => catalogoJuegos.find((g) => g.id === selectedGameId) ?? catalogoJuegos[0],
    [catalogoJuegos, selectedGameId]
  );

  const filterSessionsByDate = (
    sesiones: DetalleActividad["sesiones"],
    filter: string,
    dateFrom: string,
    dateTo: string
  ) => {
    if (!sesiones || sesiones.length === 0) return [];
    if (filter === "all") return sesiones;

    const now = new Date();
    const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const fromKey = dateFrom && /^\d{4}-\d{2}-\d{2}$/.test(dateFrom) ? dateFrom : "";
    const toKey = dateTo && /^\d{4}-\d{2}-\d{2}$/.test(dateTo) ? dateTo : "";

    return sesiones.filter((s) => {
      if (!s.fecha) return false;
      const sessionDate = new Date(s.fecha);
      if (isNaN(sessionDate.getTime())) return false;
      const sessionKey = toDateKeyLocal(sessionDate);
      const sessionDateOnly = new Date(
        sessionDate.getFullYear(),
        sessionDate.getMonth(),
        sessionDate.getDate()
      );

      if (filter === "day") {
        if (!fromKey) return false;
        return sessionKey === fromKey;
      }

      if (filter === "range") {
        if (!fromKey || !toKey) return false;
        return sessionKey >= fromKey && sessionKey <= toKey;
      }

      const diffDays = Math.floor(
        (nowDateOnly.getTime() - sessionDateOnly.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (filter === "week") return diffDays <= 7;
      if (filter === "month") return diffDays <= 30;
      if (filter === "three-months") return diffDays <= 90;
      return true;
    });
  };

  const readingSessionsFiltered = useMemo(() => {
    const map = sesionesPorActividadId as Record<string, SesionData[]>;
    const sesionesRaw =
      selectedReadingId != null
        ? (map[selectedReadingId] ?? map[String(selectedReadingId)] ?? selectedReading?.sesiones ?? [])
        : [];
    const sesiones = Array.isArray(sesionesRaw) ? sesionesRaw : [];
    let list = [...sesiones];
    if (selectedReadingLevel !== null) {
      list = list.filter((s) => s.nivel === selectedReadingLevel);
    }
    return filterSessionsByDate(list, readingDateFilter, readingDateFrom, readingDateTo);
  }, [selectedReadingId, sesionesPorActividadId, selectedReading?.sesiones, selectedReadingLevel, readingDateFilter, readingDateFrom, readingDateTo]);

  const gameSessionsFiltered = useMemo(() => {
    const map = sesionesPorActividadId as Record<string, SesionData[]>;
    const sesionesRaw =
      selectedGameId != null
        ? (map[selectedGameId] ?? map[String(selectedGameId)] ?? selectedGame?.sesiones ?? [])
        : [];
    const sesiones = Array.isArray(sesionesRaw) ? sesionesRaw : [];
    let list = [...sesiones];
    if (selectedGameLevel !== null) {
      list = list.filter((s) => s.nivel === selectedGameLevel);
    }
    return filterSessionsByDate(list, gameDateFilter, gameDateFrom, gameDateTo);
  }, [selectedGameId, sesionesPorActividadId, selectedGame?.sesiones, selectedGameLevel, gameDateFilter, gameDateFrom, gameDateTo]);

  const readingStats = useMemo(() => {
    const ses = readingSessionsFiltered;
    const hasSessionData = ses.length > 0;
    let totalCorrect = ses.reduce((s, x) => s + (x.respuestas_correctas || 0), 0);
    let totalIncorrect = ses.reduce((s, x) => s + (x.respuestas_incorrectas || 0), 0);
    let totalListen = ses.reduce((s, x) => s + (x.uso_audio || 0), 0);
    let totalMin = ses.reduce((s, x) => s + Math.floor((x.duracion_seg || 0) / 60), 0);
    let totalScore = ses.reduce((s, x) => s + (x.puntuacion || 0), 0);
    let totalScoreMax = ses.reduce((s, x) => s + (x.puntuacion_maxima || 0), 0);

    if (!hasSessionData && selectedReading) {
      totalCorrect = selectedReading.respuestas_correctas ?? 0;
      totalIncorrect = selectedReading.respuestas_incorrectas ?? 0;
      totalListen = selectedReading.uso_audio ?? 0;
      totalMin = Math.floor((selectedReading.tiempo_total ?? 0) / 60);
      totalScore = selectedReading.puntuacion ?? 0;
      totalScoreMax = selectedReading.puntuacion_maxima ?? 0;
    }

    const totalSessions = hasSessionData
      ? ses.length
      : (selectedReading?.intentos ?? 0) || (selectedReading ? 1 : 0);

    return {
      totalSessions,
      totalTimeMinutes: totalMin,
      averageReadingTime: totalSessions > 0 ? Math.round(totalMin / totalSessions) : 0,
      listenButtonUsed: totalListen,
      correctAnswers: totalCorrect,
      incorrectAnswers: totalIncorrect,
      totalScore,
      totalScoreMax,
      scorePercentage:
        totalScoreMax > 0 ? Math.round((totalScore / totalScoreMax) * 100) : 0,
    };
  }, [readingSessionsFiltered, selectedReading]);

  const gameStats = useMemo(() => {
    const ses = gameSessionsFiltered;
    const hasSessionData = ses.length > 0;
    let totalAttempts = ses.length;
    let totalCorrect = ses.reduce((s, x) => s + (x.respuestas_correctas || 0), 0);
    let totalTime = ses.reduce((s, x) => s + Math.floor((x.duracion_seg || 0) / 60), 0);
    let totalListen = ses.reduce((s, x) => s + (x.uso_audio || 0), 0);
    let totalScore = ses.reduce((s, x) => s + (x.puntuacion || 0), 0);
    let totalScoreMax = ses.reduce((s, x) => s + (x.puntuacion_maxima || 0), 0);

    if (!hasSessionData && selectedGame) {
      totalCorrect = selectedGame.respuestas_correctas ?? 0;
      totalTime = Math.floor((selectedGame.tiempo_total ?? 0) / 60);
      totalListen = selectedGame.uso_audio ?? 0;
      totalAttempts = selectedGame.intentos ?? 0;
      totalScore = selectedGame.puntuacion ?? 0;
      totalScoreMax = selectedGame.puntuacion_maxima ?? 0;
    }

    if (totalAttempts === 0) {
      totalAttempts = selectedGame?.intentos ?? 1;
    }

    return {
      totalAttempts: totalAttempts || 1,
      totalCorrect,
      totalTime,
      totalListenUses: totalListen,
      precision: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
      totalScore,
      totalScoreMax,
      scorePercentage: totalScoreMax > 0 ? Math.round((totalScore / totalScoreMax) * 100) : 0,
    };
  }, [gameSessionsFiltered, selectedGame]);

  const readingLevels = DEFAULT_LEVELS;
  const gameLevels = DEFAULT_LEVELS;

  const badgesFormatted = useMemo(
    () =>
      insignias.map((i) => ({
        id: i.id,
        name: i.nombre,
        description: i.descripcion,
        unlocked: i.completado ?? false,
        date: i.obtenido_at ? formatDate(i.obtenido_at) : null,
      })),
    [insignias]
  );

  const unlockedCount = badgesFormatted.filter((b) => b.unlocked).length;

  const hasReportTabs =
    actividades.length > 0 ||
    catalogoLecturas.length > 0 ||
    catalogoJuegos.length > 0 ||
    insignias.length > 0 ||
    historialAccesos.length > 0;

  const defaultTab =
    catalogoLecturas.length > 0
      ? "lecturas"
      : catalogoJuegos.length > 0
        ? "juegos"
        : insignias.length > 0
          ? "insignias"
          : historialAccesos.length > 0
            ? "historial"
            : "lecturas";

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[998]" />
        <Dialog.Content
          className="fixed z-[999] flex flex-col overflow-hidden bg-white shadow-2xl
            inset-x-0 bottom-0 top-[8vh] rounded-t-2xl max-h-[min(92dvh,92vh)]
            sm:inset-x-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:max-h-[min(90dvh,90vh)]
            w-full sm:w-[min(100vw-1.5rem,64rem)] max-w-[100vw] sm:max-w-5xl"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 sm:p-6 flex items-start sm:items-center justify-between gap-3 shrink-0">
            <div className="min-w-0 pr-2">
              <Dialog.Title className="text-lg sm:text-2xl mb-1 leading-tight">
                Reporte detallado
              </Dialog.Title>
              <p className="text-purple-100 text-sm sm:text-base truncate">
                {studentName} {studentAge != null ? `· ${studentAge} años` : ""}
              </p>
            </div>
            <Dialog.Close className="shrink-0 text-white hover:bg-white/20 rounded-full p-2 transition-colors">
              <X size={22} className="sm:w-6 sm:h-6" />
            </Dialog.Close>
          </div>

          {loading && (
            <div className="p-8 text-center text-gray-500">Cargando detalle...</div>
          )}
          {error && (
            <div className="p-8 text-center text-red-600 font-medium">{error}</div>
          )}
          {!loading && !error && !hasReportTabs && (
            <div className="p-8 text-center text-gray-500">
              No hay datos disponibles para este estudiante.
            </div>
          )}

          {!loading && !error && hasReportTabs && (
            <Tabs.Root defaultValue={defaultTab} className="flex-1 flex flex-col overflow-hidden min-h-0">
              <Tabs.List
                className="flex border-b bg-gray-50 px-2 sm:px-4 shrink-0 overflow-x-auto overscroll-x-contain gap-0.5 sm:gap-1"
                style={{ scrollbarWidth: "thin" }}
              >
                <Tabs.Trigger
                  value="lecturas"
                  className="shrink-0 px-3 py-3 sm:px-5 sm:py-4 text-sm sm:text-base text-gray-600 border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
                >
                  <BookOpen size={18} className="sm:w-5 sm:h-5 shrink-0" />
                  Lecturas
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="juegos"
                  className="shrink-0 px-3 py-3 sm:px-5 sm:py-4 text-sm sm:text-base text-gray-600 border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
                >
                  <Gamepad2 size={18} className="sm:w-5 sm:h-5 shrink-0" />
                  Juegos
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="insignias"
                  className="shrink-0 px-3 py-3 sm:px-5 sm:py-4 text-sm sm:text-base text-gray-600 border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
                >
                  <Trophy size={18} className="sm:w-5 sm:h-5 shrink-0" />
                  Insignias
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="historial"
                  className="shrink-0 px-3 py-3 sm:px-5 sm:py-4 text-sm sm:text-base text-gray-600 border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
                >
                  <History size={18} className="sm:w-5 sm:h-5 shrink-0" />
                  Accesos
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="analisis"
                  className="shrink-0 px-3 py-3 sm:px-5 sm:py-4 text-sm sm:text-base text-gray-600 border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
                >
                  <BarChart size={18} className="sm:w-5 sm:h-5 shrink-0" />
                  Análisis
                </Tabs.Trigger>
              </Tabs.List>

              <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain">
                {/* Pestaña Lecturas */}
                <Tabs.Content value="lecturas" className="p-4 sm:p-6 focus:outline-none">
                  <div className="mb-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block mb-2 text-sm text-gray-700 flex items-center gap-2">
                          <BookOpen size={16} />
                          Seleccionar Lectura
                        </label>
                        <Select.Root
                          value={selectedReadingId?.toString() ?? ""}
                          onValueChange={(v) => {
                            setSelectedReadingId(Number(v));
                            setSelectedReadingLevel(null);
                          }}
                        >
                          <Select.Trigger className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between hover:border-purple-400 transition-colors">
                            <Select.Value placeholder="Seleccione..." />
                            <Select.Icon>
                              <ChevronDown size={20} className="text-gray-500" />
                            </Select.Icon>
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-[1100]">
                              <Select.Viewport className="p-1">
                                {catalogoLecturas.map((r) => {
                                  const hasProgress = actividadesMap.has(r.id);
                                  const actividad = actividadesMap.get(r.id);
                                  return (
                                    <Select.Item
                                      key={r.id}
                                      value={r.id.toString()}
                                      className="px-4 py-3 cursor-pointer hover:bg-purple-50 rounded-md outline-none flex items-center justify-between"
                                    >
                                      <Select.ItemText>{r.nombre}</Select.ItemText>
                                      {hasProgress && actividad?.completado && (
                                        <CheckCircle size={16} className="text-green-500 ml-2" />
                                      )}
                                    </Select.Item>
                                  );
                                })}
                              </Select.Viewport>
                            </Select.Content>
                          </Select.Portal>
                        </Select.Root>
                      </div>
                      <div>
                        <label className="block mb-2 text-sm text-gray-700 flex items-center gap-2">
                          <Layers size={16} />
                          Filtrar por Nivel
                        </label>
                        <Select.Root
                          value={selectedReadingLevel?.toString() ?? "all"}
                          onValueChange={(v) =>
                            setSelectedReadingLevel(v === "all" ? null : Number(v))
                          }
                        >
                          <Select.Trigger className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between hover:border-purple-400 transition-colors">
                            <Select.Value placeholder="Todos" />
                            <Select.Icon>
                              <ChevronDown size={20} className="text-gray-500" />
                            </Select.Icon>
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-[1100]">
                              <Select.Viewport className="p-1">
                                <Select.Item
                                  value="all"
                                  className="px-4 py-3 cursor-pointer hover:bg-purple-50 rounded-md outline-none"
                                >
                                  <Select.ItemText>Todos los niveles</Select.ItemText>
                                </Select.Item>
                                {readingLevels.map((l) => (
                                  <Select.Item
                                    key={l.id}
                                    value={l.id.toString()}
                                    className="px-4 py-3 cursor-pointer hover:bg-purple-50 rounded-md outline-none"
                                  >
                                    <Select.ItemText>{l.name}</Select.ItemText>
                                  </Select.Item>
                                ))}
                              </Select.Viewport>
                            </Select.Content>
                          </Select.Portal>
                        </Select.Root>
                      </div>
                      <div>
                        <label className="block mb-2 text-sm text-gray-700 flex items-center gap-2">
                          <Calendar size={16} />
                          Filtrar por Fecha
                        </label>
                        <Select.Root
                          value={readingDateFilter}
                          onValueChange={(value) => {
                            setReadingDateFilter(value);
                            if (value !== "day") setReadingDateFrom("");
                            if (value !== "range") setReadingDateFrom("");
                            if (value !== "range") setReadingDateTo("");
                          }}
                        >
                          <Select.Trigger className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between hover:border-purple-400 transition-colors">
                            <Select.Value />
                            <Select.Icon>
                              <ChevronDown size={20} className="text-gray-500" />
                            </Select.Icon>
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-[1100]">
                              <Select.Viewport className="p-1">
                                <Select.Item
                                  value="all"
                                  className="px-4 py-3 cursor-pointer hover:bg-purple-50 rounded-md outline-none"
                                >
                                  <Select.ItemText>Todas las fechas</Select.ItemText>
                                </Select.Item>
                                <Select.Item
                                  value="week"
                                  className="px-4 py-3 cursor-pointer hover:bg-purple-50 rounded-md outline-none"
                                >
                                  <Select.ItemText>Última semana</Select.ItemText>
                                </Select.Item>
                                <Select.Item
                                  value="month"
                                  className="px-4 py-3 cursor-pointer hover:bg-purple-50 rounded-md outline-none"
                                >
                                  <Select.ItemText>Último mes</Select.ItemText>
                                </Select.Item>
                                <Select.Item
                                  value="three-months"
                                  className="px-4 py-3 cursor-pointer hover:bg-purple-50 rounded-md outline-none"
                                >
                                  <Select.ItemText>Últimos 3 meses</Select.ItemText>
                                </Select.Item>
                                <Select.Item
                                  value="day"
                                  className="px-4 py-3 cursor-pointer hover:bg-purple-50 rounded-md outline-none"
                                >
                                  <Select.ItemText>Fecha específica</Select.ItemText>
                                </Select.Item>
                                <Select.Item
                                  value="range"
                                  className="px-4 py-3 cursor-pointer hover:bg-purple-50 rounded-md outline-none"
                                >
                                  <Select.ItemText>Rango de fechas</Select.ItemText>
                                </Select.Item>
                              </Select.Viewport>
                            </Select.Content>
                          </Select.Portal>
                        </Select.Root>
                        {readingDateFilter === "day" && (
                          <div className="mt-2">
                            <input
                              type="date"
                              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2"
                              value={readingDateFrom}
                              onChange={(e) => setReadingDateFrom(e.target.value)}
                            />
                          </div>
                        )}
                        {readingDateFilter === "range" && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <input
                              type="date"
                              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2"
                              value={readingDateFrom}
                              onChange={(e) => setReadingDateFrom(e.target.value)}
                            />
                            <input
                              type="date"
                              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2"
                              value={readingDateTo}
                              onChange={(e) => setReadingDateTo(e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
                    <h3 className="text-xl mb-4 flex items-center gap-2">
                      <BarChart className="text-purple-600" size={24} />
                      Estadísticas de "{selectedReadingInfo?.nombre ?? "-"}"
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <BookOpen className="text-blue-600" size={20} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Sesiones Totales</p>
                            <p className="text-2xl">{readingStats.totalSessions}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <Clock className="text-purple-600" size={20} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Tiempo Total</p>
                            <p className="text-2xl">{readingStats.totalTimeMinutes} min</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <Clock className="text-green-600" size={20} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Tiempo Promedio</p>
                            <p className="text-2xl">{readingStats.averageReadingTime} min</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="bg-orange-100 p-2 rounded-lg">
                            <Headphones className="text-orange-600" size={20} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Uso de Audio</p>
                            <p className="text-2xl">{readingStats.listenButtonUsed} veces</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <CheckCircle className="text-green-600" size={20} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Respuestas Correctas</p>
                            <p className="text-2xl text-green-600">{readingStats.correctAnswers}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="bg-red-100 p-2 rounded-lg">
                            <XCircle className="text-red-600" size={20} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Respuestas Incorrectas</p>
                            <p className="text-2xl text-red-600">{readingStats.incorrectAnswers}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-100 p-2 rounded-lg">
                            <Trophy className="text-indigo-600" size={20} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Puntuación Total</p>
                            <p className="text-2xl text-indigo-600">{readingStats.totalScore}/{readingStats.totalScoreMax}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-100 p-2 rounded-lg">
                            <BarChart className="text-indigo-600" size={20} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">% Precisión Puntuación</p>
                            <p className="text-2xl text-indigo-600">{readingStats.scorePercentage}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <h4 className="bg-gray-50 px-6 py-3 border-b">
                      Historial de Sesiones ({readingSessionsFiltered.length} sesiones)
                    </h4>
                    {readingSessionsFiltered.length > 0 ? (
                      <div className="divide-y">
                        {readingSessionsFiltered.map((session, idx) => (
                          <div key={idx} className="px-6 py-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-4">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    session.completado ? "bg-green-500" : "bg-yellow-500"
                                  }`}
                                />
                                <div>
                                  <p className="text-sm">{formatDate(session.fecha)}</p>
                                  <p className="text-xs text-gray-500">
                                    Duración: {Math.floor(session.duracion_seg / 60)} min •{" "}
                                    {LEVEL_NAMES[session.nivel] || `Nivel ${session.nivel}`}
                                  </p>
                                </div>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  session.completado
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {session.completado ? "Completada" : "Incompleta"}
                              </span>
                            </div>
                            <div className="ml-6 flex gap-4 text-xs text-gray-600">
                              <span className="flex items-center gap-1">
                                <CheckCircle size={12} className="text-green-600" />
                                {session.respuestas_correctas} correctas
                              </span>
                              <span className="flex items-center gap-1">
                                <XCircle size={12} className="text-red-600" />
                                {session.respuestas_incorrectas} incorrectas
                              </span>
                              <span className="flex items-center gap-1">
                                <Headphones size={12} className="text-orange-600" />
                                {session.uso_audio} usos de audio
                              </span>
                              <span className="flex items-center gap-1">
                                <Trophy size={12} className="text-indigo-600" />
                                {session.puntuacion}/{session.puntuacion_maxima} pts
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-6 py-8 text-center text-gray-500">
                        No hay sesiones con los filtros seleccionados
                      </div>
                    )}
                  </div>
                </Tabs.Content>

                {/* Pestaña Juegos */}
                <Tabs.Content value="juegos" className="p-4 sm:p-6 focus:outline-none">
                  <div className="mb-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block mb-2 text-sm text-gray-700 flex items-center gap-2">
                          <Gamepad2 size={16} />
                          Seleccionar Juego
                        </label>
                        <Select.Root
                          value={selectedGameId?.toString() ?? ""}
                          onValueChange={(v) => {
                            setSelectedGameId(Number(v));
                            setSelectedGameLevel(null);
                          }}
                        >
                          <Select.Trigger className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between hover:border-purple-400 transition-colors">
                            <Select.Value placeholder="Seleccione..." />
                            <Select.Icon>
                              <ChevronDown size={20} className="text-gray-500" />
                            </Select.Icon>
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-[1100]">
                              <Select.Viewport className="p-1">
{catalogoJuegos.map((g) => (
                                <Select.Item
                                  key={g.id}
                                  value={g.id.toString()}
                                  className="px-4 py-3 cursor-pointer hover:bg-purple-50 rounded-md outline-none"
                                >
                                  <Select.ItemText>{g.nombre}</Select.ItemText>
                                </Select.Item>
                              ))}
                              </Select.Viewport>
                            </Select.Content>
                          </Select.Portal>
                        </Select.Root>
                      </div>
                      <div>
                        <label className="block mb-2 text-sm text-gray-700 flex items-center gap-2">
                          <Layers size={16} />
                          Filtrar por Nivel
                        </label>
                        <Select.Root
                          value={selectedGameLevel?.toString() ?? "all"}
                          onValueChange={(v) =>
                            setSelectedGameLevel(v === "all" ? null : Number(v))
                          }
                        >
                          <Select.Trigger className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between hover:border-purple-400 transition-colors">
                            <Select.Value placeholder="Todos" />
                            <Select.Icon>
                              <ChevronDown size={20} className="text-gray-500" />
                            </Select.Icon>
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-[1100]">
                              <Select.Viewport className="p-1">
                                <Select.Item
                                  value="all"
                                  className="px-4 py-3 cursor-pointer hover:bg-purple-50 rounded-md outline-none"
                                >
                                  <Select.ItemText>Todos los niveles</Select.ItemText>
                                </Select.Item>
                                {gameLevels.map((l) => (
                                  <Select.Item
                                    key={l.id}
                                    value={l.id.toString()}
                                    className="px-4 py-3 cursor-pointer hover:bg-purple-50 rounded-md outline-none"
                                  >
                                    <Select.ItemText>{l.name}</Select.ItemText>
                                  </Select.Item>
                                ))}
                              </Select.Viewport>
                            </Select.Content>
                          </Select.Portal>
                        </Select.Root>
                      </div>
                      <div>
                        <label className="block mb-2 text-sm text-gray-700 flex items-center gap-2">
                          <Calendar size={16} />
                          Filtrar por Fecha
                        </label>
                        <Select.Root
                          value={gameDateFilter}
                          onValueChange={(value) => {
                            setGameDateFilter(value);
                            if (value !== "day") setGameDateFrom("");
                            if (value !== "range") setGameDateFrom("");
                            if (value !== "range") setGameDateTo("");
                          }}
                        >
                          <Select.Trigger className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between hover:border-purple-400 transition-colors">
                            <Select.Value />
                            <Select.Icon>
                              <ChevronDown size={20} className="text-gray-500" />
                            </Select.Icon>
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-[1100]">
                              <Select.Viewport className="p-1">
                                <Select.Item
                                  value="all"
                                  className="px-4 py-3 cursor-pointer hover:bg-purple-50 rounded-md outline-none"
                                >
                                  <Select.ItemText>Todas las fechas</Select.ItemText>
                                </Select.Item>
                                <Select.Item
                                  value="week"
                                  className="px-4 py-3 cursor-pointer hover:bg-purple-50 rounded-md outline-none"
                                >
                                  <Select.ItemText>Última semana</Select.ItemText>
                                </Select.Item>
                                <Select.Item
                                  value="month"
                                  className="px-4 py-3 cursor-pointer hover:bg-purple-50 rounded-md outline-none"
                                >
                                  <Select.ItemText>Último mes</Select.ItemText>
                                </Select.Item>
                                <Select.Item
                                  value="three-months"
                                  className="px-4 py-3 cursor-pointer hover:bg-purple-50 rounded-md outline-none"
                                >
                                  <Select.ItemText>Últimos 3 meses</Select.ItemText>
                                </Select.Item>
                                <Select.Item
                                  value="day"
                                  className="px-4 py-3 cursor-pointer hover:bg-purple-50 rounded-md outline-none"
                                >
                                  <Select.ItemText>Fecha específica</Select.ItemText>
                                </Select.Item>
                                <Select.Item
                                  value="range"
                                  className="px-4 py-3 cursor-pointer hover:bg-purple-50 rounded-md outline-none"
                                >
                                  <Select.ItemText>Rango de fechas</Select.ItemText>
                                </Select.Item>
                              </Select.Viewport>
                            </Select.Content>
                          </Select.Portal>
                        </Select.Root>
                        {gameDateFilter === "day" && (
                          <div className="mt-2">
                            <input
                              type="date"
                              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2"
                              value={gameDateFrom}
                              onChange={(e) => setGameDateFrom(e.target.value)}
                            />
                          </div>
                        )}
                        {gameDateFilter === "range" && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <input
                              type="date"
                              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2"
                              value={gameDateFrom}
                              onChange={(e) => setGameDateFrom(e.target.value)}
                            />
                            <input
                              type="date"
                              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2"
                              value={gameDateTo}
                              onChange={(e) => setGameDateTo(e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
                    <h3 className="text-xl mb-4 flex items-center gap-2">
                      <BarChart className="text-purple-600" size={24} />
                      Estadísticas de "{selectedGameInfo?.nombre ?? "-"}"
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Gamepad2 className="text-blue-600" size={20} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Intentos Totales</p>
                            <p className="text-2xl">{gameStats.totalAttempts}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <CheckCircle className="text-green-600" size={20} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Respuestas Correctas</p>
                            <p className="text-2xl text-green-600">{gameStats.totalCorrect}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <BarChart className="text-purple-600" size={20} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Precisión</p>
                            <p className="text-2xl text-purple-600">{gameStats.precision}%</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="bg-orange-100 p-2 rounded-lg">
                            <Clock className="text-orange-600" size={20} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Tiempo Jugado</p>
                            <p className="text-2xl">{gameStats.totalTime} min</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-100 p-2 rounded-lg">
                            <Headphones className="text-indigo-600" size={20} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Uso de Audio/Ayuda</p>
                            <p className="text-2xl">{gameStats.totalListenUses} veces</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-100 p-2 rounded-lg">
                            <Trophy className="text-indigo-600" size={20} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Puntuación Total</p>
                            <p className="text-2xl text-indigo-600">{gameStats.totalScore}/{gameStats.totalScoreMax}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-100 p-2 rounded-lg">
                            <BarChart className="text-indigo-600" size={20} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">% Precisión Puntuación</p>
                            <p className="text-2xl text-indigo-600">{gameStats.scorePercentage}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <h4 className="bg-gray-50 px-6 py-3 border-b">
                      Historial de Sesiones ({gameSessionsFiltered.length} sesiones)
                    </h4>
                    {gameSessionsFiltered.length > 0 ? (
                      <div className="divide-y">
                        {gameSessionsFiltered.map((session, idx) => (
                          <div key={idx} className="px-6 py-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <div>
                                  <p className="text-sm">{formatDate(session.fecha)}</p>
                                  <p className="text-xs text-gray-500">
                                    Duración: {Math.floor(session.duracion_seg / 60)} min • Nivel{" "}
                                    {session.nivel}
                                  </p>
                                </div>
                              </div>
                              <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                                {session.respuestas_correctas + session.respuestas_incorrectas}{" "}
                                intentos
                              </span>
                            </div>
                            <div className="ml-6 flex gap-4 text-xs text-gray-600">
                              <span className="flex items-center gap-1">
                                <CheckCircle size={12} className="text-green-600" />
                                {session.respuestas_correctas} correctas
                              </span>
                              <span className="flex items-center gap-1">
                                <Headphones size={12} className="text-orange-600" />
                                {session.uso_audio} usos de ayuda
                              </span>
                              <span className="flex items-center gap-1">
                                <Trophy size={12} className="text-indigo-600" />
                                {session.puntuacion}/{session.puntuacion_maxima} pts
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-6 py-8 text-center text-gray-500">
                        No hay sesiones con los filtros seleccionados
                      </div>
                    )}
                  </div>
                </Tabs.Content>

                {/* Pestaña Insignias */}
                <Tabs.Content value="insignias" className="p-4 sm:p-6 focus:outline-none">
                  <h3 className="text-xl mb-4 flex items-center gap-2">
                    <Trophy className="text-purple-600" size={24} />
                    Logros e Insignias
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {badgesFormatted.map((badge) => (
                      <div
                        key={badge.id}
                        className={`rounded-xl p-6 border-2 ${
                          badge.unlocked
                            ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300"
                            : "bg-gray-50 border-gray-200 opacity-60"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-3 rounded-full ${
                              badge.unlocked ? "bg-yellow-400" : "bg-gray-300"
                            }`}
                          >
                            <Trophy
                              size={32}
                              className={badge.unlocked ? "text-white" : "text-gray-500"}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg mb-1">{badge.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                            {badge.unlocked ? (
                              <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-600" />
                                <span className="text-sm text-green-600">
                                  Desbloqueado el {badge.date}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">Bloqueado</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {badgesFormatted.length > 0 && (
                    <div className="mt-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6">
                      <h4 className="text-lg mb-2">Progreso General</h4>
                      <p className="text-3xl mb-2">
                        {unlockedCount} / {badgesFormatted.length}
                      </p>
                      <div className="w-full bg-white rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-blue-600 h-full transition-all"
                          style={{
                            width: `${
                              badgesFormatted.length > 0
                                ? (unlockedCount / badgesFormatted.length) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {badgesFormatted.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      No hay insignias registradas.
                    </p>
                  )}
                </Tabs.Content>

                <Tabs.Content value="historial" className="p-4 sm:p-6 focus:outline-none">
                  <h3 className="text-lg sm:text-xl mb-4 flex items-center gap-2">
                    <History className="text-purple-600 shrink-0" size={22} />
                    Accesos a la plataforma
                  </h3>
                  {historialAccesos.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No hay accesos registrados todavía.</p>
                  ) : (
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                      <div className="overflow-x-auto max-h-[min(50dvh,420px)] overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 sticky top-0 z-[1]">
                            <tr className="text-left text-gray-600">
                              <th className="px-3 py-3 font-medium">Fecha</th>
                              <th className="px-3 py-3 font-medium">Hora</th>
                            </tr>
                          </thead>
                          <tbody>
                            {historialAccesos.map((h) => {
                              const { fecha, hora } = formatAccesoParts(h.fecha_hora);
                              return (
                                <tr key={String(h.id)} className="border-t border-gray-100 hover:bg-gray-50/80">
                                  <td className="px-3 py-2.5">{fecha}</td>
                                  <td className="px-3 py-2.5 font-medium text-purple-800 whitespace-nowrap">{hora}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </Tabs.Content>

                <Tabs.Content value="analisis" className="p-4 sm:p-6 focus:outline-none">
                  <ReportAnalysisTabContent
                    sesionesPorActividadId={sesionesPorActividadId}
                    actividades={actividades}
                    catalogoLecturas={catalogoLecturas}
                    catalogoJuegos={catalogoJuegos}
                    actividadNombres={actividadNombres}
                    modalOpen={open}
                  />
                </Tabs.Content>
              </div>
            </Tabs.Root>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
