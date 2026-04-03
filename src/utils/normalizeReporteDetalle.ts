/**
 * El detalle del reporte puede traer sesiones con snake_case o camelCase
 * (según Sequelize/JSON). Unifica a un solo formato numérico para el modal.
 */

export type SesionNormalizada = {
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

function num(o: Record<string, unknown>, snake: string, camel: string): number {
  const v = o[snake] ?? o[camel];
  if (v === null || v === undefined || v === "") return 0;
  const x = typeof v === "number" ? v : Number(String(v));
  return Number.isFinite(x) ? x : 0;
}

export function normalizeSesionRecord(raw: unknown): SesionNormalizada {
  if (!raw || typeof raw !== "object") {
    return {
      fecha: "",
      duracion_seg: 0,
      completado: false,
      respuestas_correctas: 0,
      respuestas_incorrectas: 0,
      uso_audio: 0,
      nivel: 1,
      puntuacion: 0,
      puntuacion_maxima: 100,
    };
  }
  const o = raw as Record<string, unknown>;
  const nivel = Math.max(1, Math.round(num(o, "nivel", "level")));
  return {
    fecha: o.fecha != null ? String(o.fecha) : "",
    duracion_seg: num(o, "duracion_seg", "duracionSeg"),
    completado: Boolean(o.completado),
    respuestas_correctas: num(o, "respuestas_correctas", "respuestasCorrectas"),
    respuestas_incorrectas: num(o, "respuestas_incorrectas", "respuestasIncorrectas"),
    uso_audio: num(o, "uso_audio", "usoAudio"),
    nivel: nivel || 1,
    puntuacion: num(o, "puntuacion", "score"),
    puntuacion_maxima: num(o, "puntuacion_maxima", "puntuacionMaxima") || 100,
  };
}

export function normalizeSesionesPorActividadId(
  raw: unknown
): Record<number, SesionNormalizada[]> {
  if (!raw || typeof raw !== "object") return {};
  const out: Record<number, SesionNormalizada[]> = {};
  for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
    const id = Number(key);
    if (!Number.isFinite(id)) continue;
    if (!Array.isArray(val)) continue;
    out[id] = val.map((s) => normalizeSesionRecord(s));
  }
  return out;
}

export function normalizeActividadesSesiones<T extends { sesiones?: unknown[] }>(
  actividades: T[]
): T[] {
  return actividades.map((a) => {
    const ses = a.sesiones;
    if (!Array.isArray(ses)) return a;
    return {
      ...a,
      sesiones: ses.map((s) => normalizeSesionRecord(s)),
    };
  });
}
