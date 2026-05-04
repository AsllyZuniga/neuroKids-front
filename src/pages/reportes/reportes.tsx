import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header/header";
import { TotalAnalysisModal } from "@/components/reportes/TotalAnalysisModal";

const ReportDetailsModal = lazy(async () => {
  const m = await import("@/components/reportes/ReportDetailsModal");
  return { default: m.ReportDetailsModal };
});
import { buildApiUrl } from "@/config/api";
import type { InsigniaCatalogoItem } from "@/services/insigniaService";
import {
  normalizeActividadesSesiones,
  normalizeSesionesPorActividadId,
} from "@/utils/normalizeReporteDetalle";
import "./reportes.scss";

type HistorialAccesoItem = {
  id: number;
  fecha_hora: string | null;
  ip_address: string | null;
  user_agent: string | null;
};

type ReportItem = {
  estudiante: {
    id: number;
    nombre: string;
    apellido: string;
    edad: number | null;
    institucion?: string;
  };
  resumen: {
    total_actividades: number;
    completadas: number;
    lecturas_completadas: number;
    juegos_completados: number;
    lecturas_usadas?: number;
    juegos_usados?: number;
    puntos_totales: number;
    ultima_interaccion: string | null;
  };
};

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
  insignia_id: number;
  nombre: string;
  descripcion: string;
  actividad_origen_id: number | null;
  actividad: {
    id: number;
    nombre: string;
    tipo_actividad_id: number;
    grupo_edad_id: number;
    nivel: number | null;
  } | null;
  progreso_actual: number | null;
  progreso_requerido: number | null;
  completado: boolean | null;
  obtenido_at: string | null;
};

export default function Reportes() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ReportItem[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ReportItem | null>(null);
  const [detalle, setDetalle] = useState<{
    actividades: DetalleActividad[];
    sesionesPorActividadId: Record<number, Array<{
      fecha: string;
      duracion_seg: number;
      completado: boolean;
      respuestas_correctas: number;
      respuestas_incorrectas: number;
      uso_audio: number;
      nivel: number;
      puntuacion: number;
      puntuacion_maxima: number;
    }>>;
    insignias: DetalleInsignia[];
    catalogoInsignias: InsigniaCatalogoItem[];
    historialAccesos: HistorialAccesoItem[];
    catalogoLecturas: Array<{ id: number; nombre: string }>;
    catalogoJuegos: Array<{ id: number; nombre: string }>;
    actividadNombres: Record<number, string>;
  } | null>(null);
  const [detalleLoading, setDetalleLoading] = useState(false);
  const [detalleError, setDetalleError] = useState<string | null>(null);
  const [instituciones, setInstituciones] = useState<Array<{ id: number; nombre: string }>>([]);
  const [institucionFiltro, setInstitucionFiltro] = useState<string>("");
  const [showTotalAnalysis, setShowTotalAnalysis] = useState(false);

  const userType = localStorage.getItem("userType");
  const isDocente = userType === "docente";
  const isAdmin = userType === "admin";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || (!isDocente && !isAdmin)) {
      navigate("/tipo-usuario");
      return;
    }

    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = new URL(buildApiUrl("/reportes/estudiantes"));
        if (isAdmin && institucionFiltro) {
          url.searchParams.set("institucion_id", institucionFiltro);
        }
        const resp = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(text || "Error al cargar reportes");
        }
        const json = await resp.json();
        const items: ReportItem[] = json?.data?.estudiantes || [];
        setData(items);
      } catch (e: any) {
        setError(e?.message || "Error al cargar reportes");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [navigate, isAdmin, isDocente, institucionFiltro]);

  useEffect(() => {
    if (!isAdmin) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    const fetchInstituciones = async () => {
      try {
        const resp = await fetch(buildApiUrl("/instituciones-admin"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resp.ok) {
          const json = await resp.json();
          const list = json?.data?.instituciones ?? json?.data ?? [];
          setInstituciones(Array.isArray(list) ? list : []);
        }
      } catch {
        // Silenciar error, el filtro quedarÃ¡ vacÃ­o
      }
    };
    fetchInstituciones();
  }, [isAdmin]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((r) => {
      const full = `${r.estudiante.nombre} ${r.estudiante.apellido}`.toLowerCase();
      return full.includes(q);
    });
  }, [data, search]);

  const handleBack = () => navigate(isAdmin ? "/perfil/admin" : "/perfil/docente");

  const handleViewDetail = async (item: ReportItem) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setSelected(item);
    setDetalle(null);
    setDetalleError(null);
    setDetalleLoading(true);
    try {
      const resp = await fetch(
        buildApiUrl(`/reportes/estudiantes/${item.estudiante.id}/detalle`),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const text = await resp.text();
      if (!resp.ok) throw new Error(text || "Error al cargar detalle");
      const json = JSON.parse(text);
      const actividades = normalizeActividadesSesiones(
        json?.data?.actividades || []
      ) as DetalleActividad[];
      const sesionesPorActividadId = normalizeSesionesPorActividadId(
        json?.data?.sesionesPorActividadId || {}
      );
      const insignias = json?.data?.insignias || [];
      const catalogoInsignias: InsigniaCatalogoItem[] = Array.isArray(
        json?.data?.catalogoInsignias
      )
        ? json.data.catalogoInsignias
        : [];
      const historialAccesos: HistorialAccesoItem[] = Array.isArray(
        json?.data?.historialAccesos
      )
        ? json.data.historialAccesos.map((row: Record<string, unknown>, idx: number) => {
            const idNum = Number(row?.id);
            return {
              id: Number.isFinite(idNum) ? idNum : idx,
              fecha_hora:
                row?.fecha_hora != null
                  ? typeof row.fecha_hora === "string"
                    ? row.fecha_hora
                    : String(row.fecha_hora)
                  : null,
              ip_address: row?.ip_address != null ? String(row.ip_address) : null,
              user_agent: row?.user_agent != null ? String(row.user_agent) : null,
            };
          })
        : [];
      let catalogoLecturas = json?.data?.catalogoLecturas || [];
      let catalogoJuegos = json?.data?.catalogoJuegos || [];
      if (Array.isArray(catalogoLecturas)) {
        catalogoLecturas = catalogoLecturas
          .map((x: any) => ({ id: Number(x?.id), nombre: String(x?.nombre || "-") }))
          .filter((x: any) => Number.isFinite(x.id));
      }
      if (Array.isArray(catalogoJuegos)) {
        catalogoJuegos = catalogoJuegos
          .map((x: any) => ({ id: Number(x?.id), nombre: String(x?.nombre || "-") }))
          .filter((x: any) => Number.isFinite(x.id));
      }
      if (catalogoLecturas.length === 0 && actividades.length > 0) {
        const lecturas = actividades.filter((a: DetalleActividad) => a.tipo_actividad_id === 1);
        catalogoLecturas = lecturas.map((a: DetalleActividad) => ({ id: a.actividad_id, nombre: a.nombre || "-" }));
      }
      if (catalogoJuegos.length === 0 && actividades.length > 0) {
        const juegos = actividades.filter((a: DetalleActividad) => a.tipo_actividad_id === 2);
        catalogoJuegos = juegos.map((a: DetalleActividad) => ({ id: a.actividad_id, nombre: a.nombre || "-" }));
      }
      const rawNombres = json?.data?.actividadNombres;
      const actividadNombres: Record<number, string> = {};
      if (rawNombres && typeof rawNombres === "object") {
        for (const [key, val] of Object.entries(rawNombres as Record<string, unknown>)) {
          const id = Number(key);
          if (Number.isFinite(id) && typeof val === "string" && val.trim()) {
            actividadNombres[id] = val.trim();
          }
        }
      }
      setDetalle({
        actividades,
        sesionesPorActividadId,
        insignias,
        catalogoInsignias,
        historialAccesos,
        catalogoLecturas,
        catalogoJuegos,
        actividadNombres,
      });
    } catch (e: any) {
      setDetalleError(e?.message || "Error al cargar detalle");
    } finally {
      setDetalleLoading(false);
    }
  };

  return (
    <div className="reportes-page min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      <div className="reportes-container max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <button className="reportes-back-btn" onClick={handleBack}>
           ← Volver
        </button>

        <div className="reportes-controls mb-6 flex flex-wrap gap-4 items-center">
          <input
            className="reportes-search flex-1 min-w-[200px] max-w-xs px-3 py-2 border border-gray-300 rounded-lg bg-white"
            placeholder="Buscar estudiante por nombre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {isAdmin && instituciones.length > 0 && (
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              value={institucionFiltro}
              onChange={(e) => setInstitucionFiltro(e.target.value)}
            >
              <option value="">Todas las instituciones</option>
              {instituciones.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nombre}
                </option>
              ))}
            </select>
          )}
          {isAdmin && (
            <button
              onClick={() => setShowTotalAnalysis(true)}
              className="w-full sm:w-auto justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              Análisis interacción
            </button>
          )}
          <span className="text-gray-600">
            Total: <strong>{filtered.length}</strong>
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 mb-6 lg:mb-8">
          Panel de Reportes 
        </h1>

        {loading && <p className="text-gray-600">Cargando reportes...</p>}
        {error && <p className="text-red-600 font-medium">{error}</p>}

        {!loading && !error && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {filtered.length === 0 ? (
              <p className="p-6 sm:p-8 text-gray-500 text-center">
                No hay información de progreso aún.
              </p>
            ) : (
              <div>
                <div className="divide-y divide-gray-200 md:hidden">
                  {filtered.map((r) => (
                    <article key={r.estudiante.id} className="p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="break-words text-base font-semibold text-gray-800">
                            {r.estudiante.nombre} {r.estudiante.apellido}
                          </h2>
                          <p className="text-sm text-gray-500">
                            Edad: {r.estudiante.edad ?? "-"}
                          </p>
                          {isAdmin && (
                            <p className="mt-1 break-words text-sm text-gray-500">
                              {r.estudiante.institucion ?? "-"}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleViewDetail(r)}
                          className="shrink-0 rounded-lg bg-blue-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-600"
                        >
                          Ver detalle
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-3 text-center">
                        <div>
                          <p className="text-[11px] font-medium uppercase text-gray-500">
                            Lecturas
                          </p>
                          <p className="mt-1 text-lg font-semibold text-gray-900">
                            {r.resumen.lecturas_usadas ?? r.resumen.lecturas_completadas}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-medium uppercase text-gray-500">
                            Juegos
                          </p>
                          <p className="mt-1 text-lg font-semibold text-gray-900">
                            {r.resumen.juegos_usados ?? r.resumen.juegos_completados}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-medium uppercase text-gray-500">
                            Puntos
                          </p>
                          <p className="mt-1 text-lg font-semibold text-gray-900">
                            {r.resumen.puntos_totales ?? 0}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[640px]">
                    <thead className="bg-purple-600 text-white">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base">Estudiante</th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base hidden sm:table-cell">Edad</th>
                        {isAdmin && (
                          <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base hidden lg:table-cell">Institución</th>
                        )}
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base">Lecturas usadas</th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base">Juegos usados</th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base hidden md:table-cell">Puntos</th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((r) => (
                        <tr key={r.estudiante.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <span className="font-medium">{r.estudiante.nombre} {r.estudiante.apellido}</span>
                            <span className="sm:hidden text-gray-500 block text-sm">Edad: {r.estudiante.edad ?? "-"}</span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">{r.estudiante.edad ?? "-"}</td>
                          {isAdmin && (
                            <td className="px-3 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">{r.estudiante.institucion ?? "-"}</td>
                          )}
                          <td className="px-3 sm:px-6 py-3 sm:py-4">{r.resumen.lecturas_usadas ?? r.resumen.lecturas_completadas}</td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4">{r.resumen.juegos_usados ?? r.resumen.juegos_completados}</td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">{r.resumen.puntos_totales ?? 0}</td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <button
                              onClick={() => handleViewDetail(r)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm transition-colors whitespace-nowrap"
                            >
                              Ver detalle
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {selected && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
              <p className="rounded-xl bg-white px-6 py-4 text-gray-700 shadow-lg">
                Cargando panel de detalles
              </p>
            </div>
          }
        >
          <ReportDetailsModal
            key={selected.estudiante.id}
            studentName={`${selected.estudiante.nombre} ${selected.estudiante.apellido}`}
            studentAge={selected.estudiante.edad}
            actividades={detalle?.actividades ?? []}
            sesionesPorActividadId={detalle?.sesionesPorActividadId ?? {}}
            catalogoLecturas={detalle?.catalogoLecturas ?? []}
            catalogoJuegos={detalle?.catalogoJuegos ?? []}
            insignias={detalle?.insignias ?? []}
            historialAccesos={detalle?.historialAccesos ?? []}
            actividadNombres={detalle?.actividadNombres ?? {}}
            open={selected !== null}
            loading={detalleLoading}
            error={detalleError}
            onClose={() => setSelected(null)}
          />
        </Suspense>
      )}
      <TotalAnalysisModal
        open={showTotalAnalysis}
        onClose={() => setShowTotalAnalysis(false)}
      />    </div>
  );
}

