import { API_CONFIG, buildApiUrl } from '../config/api';

/** Desde `progreso_actividades.detalle_niveles` (JSON) */
export interface LevelDetail {
  levelScores: Record<number, number>;
  levelsCompleted: number[];
  maxLevelReached: number;
  lecturaSimple?: boolean;
}

export interface ActivityProgress {
  activityId: number; // Cambio a number para coincidir con DB
  activityName: string;
  activityType: 'lectura' | 'juego';
  ageGroup: '7-8' | '9-10' | '11-12';
  level: number;
  score: number;
  maxScore: number;
  completed: boolean;
  completedAt?: string;
  attempts: number;
  timeSpent?: number; // en segundos
  /** Progreso por niveles (juegos 1–3 o lectura completada en bloque) */
  levelDetail?: LevelDetail;
}

export interface StudentProgress {
  estudianteId: number;
  totalPoints: number;
  gamesCompleted: number;
  readingsCompleted: number;
  activities: ActivityProgress[];
  lastActivity?: string;
}

type ActividadCatalogo = {
  id: number;
  nombre: string;
  tipo_actividad_id: number;
  grupo_edad_id: number;
  nivel?: number | null;
  puntuacion_maxima?: number | null;
  ruta_recurso?: string | null;
};

function parseLevelDetail(raw: unknown): LevelDetail | undefined {
  if (raw == null || typeof raw !== 'object') return undefined;
  const o = raw as Record<string, unknown>;
  const levelScores: Record<number, number> = {};
  if (o.levelScores && typeof o.levelScores === 'object') {
    Object.keys(o.levelScores as object).forEach((k) => {
      const n = Number(k);
      if (Number.isFinite(n)) levelScores[n] = Number((o.levelScores as Record<string, unknown>)[k]) || 0;
    });
  }
  const lc = o.levelsCompleted;
  const levelsCompleted = Array.isArray(lc)
    ? lc.map((x) => Number(x)).filter((n) => n >= 1 && n <= 3)
    : [];
  const maxLevelReached = Number(o.maxLevelReached) || 0;
  return {
    levelScores,
    levelsCompleted,
    maxLevelReached,
    lecturaSimple: Boolean(o.lecturaSimple)
  };
}

class ProgressService {
  private actividadesCache: ActividadCatalogo[] | null = null;
  private audioUsageKey(estudianteId: number, activityId: number): string {
    return `neurokids-audio-uses-${estudianteId}-${activityId}`;
  }

  private consumeTrackedAudioUses(estudianteId: number, activityId: number): number {
    const key = this.audioUsageKey(estudianteId, activityId);
    try {
      const n = Number(localStorage.getItem(key) || '0');
      localStorage.removeItem(key);
      return Number.isFinite(n) && n > 0 ? n : 0;
    } catch {
      return 0;
    }
  }

  private getStudentId(): number | null {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const student = JSON.parse(userData);
        const id = student?.id;
        const n = typeof id === 'string' ? parseInt(id, 10) : Number(id);
        return Number.isFinite(n) ? n : null;
      }
      return null;
    } catch (error) {
      console.error('Error getting student ID:', error);
      return null;
    }
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private async getActividadesCatalogo(): Promise<ActividadCatalogo[]> {
    if (this.actividadesCache) return this.actividadesCache;

    const cacheKey = 'neurokids-actividades-catalogo';
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          this.actividadesCache = parsed;
          return parsed;
        }
      } catch {
        // ignore
      }
    }

    const resp = await fetch(buildApiUrl('/actividades'));
    if (!resp.ok) throw new Error('No se pudo cargar catálogo de actividades');
    const data = await resp.json();
    const list: ActividadCatalogo[] = data?.data?.actividades || [];
    this.actividadesCache = list;
    localStorage.setItem(cacheKey, JSON.stringify(list));
    return list;
  }

  private async resolveActividadIdPorRuta(ruta: string): Promise<ActividadCatalogo | null> {
    const list = await this.getActividadesCatalogo();
    const match = list.find(a => (a.ruta_recurso || '').trim() === ruta.trim());
    return match || null;
  }

  /**
   * Guarda progreso usando la ruta actual (window.location.pathname).
   * Requiere que en DB la actividad tenga `ruta_recurso` igual a esa ruta.
   */
  async saveCurrentRouteProgress(params: {
    score: number;
    completed: boolean;
    maxScore?: number;
    timeSpent?: number;
  }): Promise<void> {
    const ruta = window.location.pathname;
    let actividad: ActividadCatalogo | null = null;
    try {
      actividad = await this.resolveActividadIdPorRuta(ruta);
    } catch (e) {
      console.warn('No se pudo resolver actividad por ruta:', ruta, e);
      return;
    }
    if (!actividad) {
      console.warn('No existe actividad con ruta_recurso:', ruta);
      return;
    }

    await this.saveActivityProgress({
      activityId: actividad.id,
      activityName: actividad.nombre || 'Actividad',
      activityType: actividad.tipo_actividad_id === 1 ? 'lectura' : 'juego',
      ageGroup: this.getAgeGroupFromId(actividad.grupo_edad_id),
      level: actividad.nivel || 1,
      score: params.score,
      maxScore: params.maxScore ?? actividad.puntuacion_maxima ?? 100,
      completed: params.completed,
      timeSpent: params.timeSpent || 0
    });
  }

  /**
   * Guarda o actualiza el progreso de una actividad
   */
  async saveActivityProgress(
    activityProgress: Omit<ActivityProgress, 'completedAt' | 'attempts' | 'levelDetail'> & {
      /** true al terminar un nivel del juego (1–3) */
      nivelCompletado?: boolean;
      /** true al entrar a un nivel (no suma puntos ni marca nivel) */
      soloRegistro?: boolean;
      correctAnswers?: number;
      incorrectAnswers?: number;
      audioUses?: number;
    }
  ): Promise<
    | {
        insignias_desbloqueadas?: Array<{
          insignia_id: number;
          nombre: string;
          descripcion: string;
          puntos_otorgados: number;
        }>;
      }
    | undefined
  > {
    const estudianteId = this.getStudentId();

    console.log('🔍 DEBUG saveActivityProgress:', {
      estudianteId,
      activityProgress,
      userData: localStorage.getItem('user') ? 'exists' : 'missing',
      token: this.getToken() ? 'exists' : 'missing',
      timestamp: new Date().toISOString(),
      uniqueAccess: `${estudianteId}_${activityProgress.activityId}_${Date.now()}`
    });

    if (!estudianteId) {
      console.error('❌ No se encontró información del estudiante en localStorage');
      console.log('📝 userData en localStorage:', localStorage.getItem('user'));
      return;
    }

    try {
      console.log('🔄 NUEVO ACCESO - Intentando registrar ingreso a actividad');
      console.log('🎯 Guardando progreso en DB:', {
        estudiante_id: estudianteId,
        actividad_id: activityProgress.activityId,
        timestamp_unico: Date.now(),
        puntuacion: activityProgress.score,
        puntuacion_maxima: activityProgress.maxScore,
        completado: activityProgress.completed,
        tiempo_total: activityProgress.timeSpent || 0
      });

      // Guardamos directamente en el backend usando el endpoint real
      // Agregamos timestamp único para forzar registro cada vez
      const ap = activityProgress as {
        correctAnswers?: number;
        incorrectAnswers?: number;
        audioUses?: number;
        nivelCompletado?: boolean;
        soloRegistro?: boolean;
      };
      let trackedAudioUses = 0;
      if (ap.soloRegistro === true) {
        // Reiniciar contador al iniciar nivel para no arrastrar usos viejos.
        this.consumeTrackedAudioUses(Number(estudianteId), Number(activityProgress.activityId));
      } else {
        trackedAudioUses = this.consumeTrackedAudioUses(Number(estudianteId), Number(activityProgress.activityId));
      }
      const resolvedAudioUses = Math.max(
        Number(ap.audioUses ?? 0) || 0,
        trackedAudioUses
      );
      const requestBody = {
        estudiante_id: Number(estudianteId),
        actividad_id: Number(activityProgress.activityId),
        puntuacion: activityProgress.score,
        puntuacion_maxima: activityProgress.maxScore,
        completado: activityProgress.completed,
        completado_at: activityProgress.completed ? new Date().toISOString() : null,
        intentos: 1,
        tiempo_total: activityProgress.timeSpent || 0,
        ultima_interaccion: new Date().toISOString(),
        respuestas_correctas: ap.correctAnswers ?? 0,
        respuestas_incorrectas: ap.incorrectAnswers ?? 0,
        uso_audio: resolvedAudioUses,
        nivel: activityProgress.level,
        nivel_completado: ap.nivelCompletado === true,
        solo_registro: ap.soloRegistro === true,
        timestamp_acceso: Date.now(),
        session_id: `${estudianteId}_${activityProgress.activityId}_${Date.now()}`
      };

      console.log('🚀 Haciendo request a:', buildApiUrl(API_CONFIG.ENDPOINTS.PROGRESS_SAVE));
      console.log('📦 Request body:', requestBody);

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.PROGRESS_SAVE), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (response.ok) {
        const result = await response.json();
        const insignias_desbloqueadas = result?.insignias_desbloqueadas;
        if (Array.isArray(insignias_desbloqueadas) && insignias_desbloqueadas.length > 0) {
          console.log('🏆 Insignias desbloqueadas en esta sesión:', insignias_desbloqueadas);
        }
        console.log('✅ ÉXITO - Progreso guardado correctamente:', {
          estudiante_id: estudianteId,
          actividad_id: activityProgress.activityId,
          timestamp: new Date().toISOString(),
          result: result
        });

        // También guardamos en localStorage como caché
        this.saveToLocalStorage(Number(estudianteId), { ...activityProgress, activityId: Number(activityProgress.activityId) });
        return { insignias_desbloqueadas };
      } else {
        const errorData = await response.text(); // Cambio a text() para capturar errores HTML
        console.error('❌ Error del servidor:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });

        // Guardar en localStorage como fallback
        console.log('💾 Guardando en localStorage como fallback');
        this.saveToLocalStorage(Number(estudianteId), { ...activityProgress, activityId: Number(activityProgress.activityId) });
      }
    } catch (error) {
      console.error('❌ Error guardando progreso (catch block):', error);
      console.log('💾 Guardando en localStorage debido a error de red');

      // Guardar en localStorage como fallback
      this.saveToLocalStorage(Number(estudianteId), { ...activityProgress, activityId: Number(activityProgress.activityId) });
    }
  }

  /**
   * Obtiene el progreso completo del estudiante
   */
  async getStudentProgress(): Promise<StudentProgress | null> {
    const estudianteId = this.getStudentId();

    if (!estudianteId) {
      return null;
    }

    try {
      // Intentamos obtener del backend
      const response = await fetch(
        buildApiUrl(`${API_CONFIG.ENDPOINTS.PROGRESS_STUDENT}/${encodeURIComponent(String(estudianteId))}`)
      );

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Progreso obtenido del servidor:', data);

        if (data.success && data.data) {
          // Transformar los datos del backend al formato esperado
          const backendData = data.data;
          return {
            estudianteId,
            totalPoints: backendData.estadisticas?.puntuacion_total || 0,
            gamesCompleted: backendData.progreso?.filter((p: any) =>
              Number(p.actividad?.tipo_actividad_id) === 2 && p.completado
            ).length || 0,
            readingsCompleted: backendData.progreso?.filter((p: any) =>
              Number(p.actividad?.tipo_actividad_id) === 1 && p.completado
            ).length || 0,
            activities: backendData.progreso?.map((p: any) => ({
              activityId: Number(p.actividad_id),
              activityName: p.actividad?.nombre || 'Actividad',
              activityType: Number(p.actividad?.tipo_actividad_id) === 1 ? 'lectura' : 'juego',
              ageGroup: this.getAgeGroupFromId(Number(p.actividad?.grupo_edad_id)),
              level: p.actividad?.nivel || 1,
              score: Number(p.puntuacion) || 0,
              maxScore: Number(p.puntuacion_maxima) || 100,
              completed: Boolean(p.completado),
              completedAt: p.completado_at,
              attempts: p.intentos || 0,
              timeSpent: p.tiempo_total || 0,
              levelDetail: parseLevelDetail(p.detalle_niveles)
            })) || [],
            lastActivity: backendData.estadisticas?.ultima_actividad
          };
        }
      }

      // Si falla, usamos localStorage como fallback
      console.log('⚠️ Usando localStorage como fallback');
      return this.getFromLocalStorage(estudianteId);
    } catch (error) {
      console.error('❌ Error obteniendo progreso:', error);
      return this.getFromLocalStorage(estudianteId);
    }
  }

  private getAgeGroupFromId(grupoEdadId: number | string | undefined): '7-8' | '9-10' | '11-12' {
    const g = Number(grupoEdadId);
    switch (g) {
      case 1: return '7-8';
      case 2: return '9-10';
      case 3: return '11-12';
      default: return '7-8';
    }
  }

  /**
   * Obtiene el progreso de una actividad específica
   */
  async getActivityProgress(activityId: number): Promise<ActivityProgress | null> {
    const estudianteId = this.getStudentId();
    if (!estudianteId) return null;

    try {
      // Primero intentamos del backend
      const response = await fetch(
        buildApiUrl(
          `${API_CONFIG.ENDPOINTS.PROGRESS_ACTIVITY}/${encodeURIComponent(String(activityId))}/estudiante/${encodeURIComponent(String(estudianteId))}`
        )
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const p = data.data;
          return {
            activityId: Number(p.actividad_id),
            activityName: p.actividad?.nombre || 'Actividad',
            activityType: Number(p.actividad?.tipo_actividad_id) === 1 ? 'lectura' : 'juego',
            ageGroup: this.getAgeGroupFromId(Number(p.actividad?.grupo_edad_id)),
            level: p.actividad?.nivel || 1,
            score: Number(p.puntuacion) || 0,
            maxScore: Number(p.puntuacion_maxima) || 100,
            completed: Boolean(p.completado),
            completedAt: p.completado_at,
            attempts: p.intentos || 0,
            timeSpent: p.tiempo_total || 0,
            levelDetail: parseLevelDetail(p.detalle_niveles)
          };
        }
      }
    } catch (error) {
      console.error('Error obteniendo progreso de actividad:', error);
    }

    // Fallback a localStorage
    const progress = await this.getStudentProgress();
    if (!progress) return null;

    return progress.activities.find(a => Number(a.activityId) === Number(activityId)) || null;
  }

  /**
   * Verifica si una actividad está completada
   */
  async isActivityCompleted(activityId: number): Promise<boolean> {
    const activityProgress = await this.getActivityProgress(activityId);
    return activityProgress?.completed || false;
  }

  /**
   * Obtiene las actividades completadas por tipo
   */
  async getCompletedActivities(type?: 'lectura' | 'juego'): Promise<ActivityProgress[]> {
    const progress = await this.getStudentProgress();
    if (!progress) return [];

    let completed = progress.activities.filter(a => a.completed);
    if (type) {
      completed = completed.filter(a => a.activityType === type);
    }

    return completed;
  }

  /**
   * Guarda en localStorage como respaldo
   */
  private saveToLocalStorage(
    estudianteId: number,
    activityProgress: Omit<ActivityProgress, 'completedAt' | 'attempts'>
  ): void {
    const key = `neurokids-progress-${estudianteId}`;
    const normalizedId = Number(activityProgress.activityId);
    const merged: Omit<ActivityProgress, 'completedAt' | 'attempts'> = {
      ...activityProgress,
      activityId: normalizedId
    };
    let progress: StudentProgress;

    try {
      const stored = localStorage.getItem(key);
      progress = stored ? JSON.parse(stored) : {
        estudianteId,
        totalPoints: 0,
        gamesCompleted: 0,
        readingsCompleted: 0,
        activities: []
      };
    } catch (error) {
      progress = {
        estudianteId,
        totalPoints: 0,
        gamesCompleted: 0,
        readingsCompleted: 0,
        activities: []
      };
    }

    // Normalizar IDs viejos en caché (string vs number)
    progress.activities = progress.activities.map((a) => ({
      ...a,
      activityId: Number(a.activityId)
    }));

    // Una entrada por actividad (no por nivel)
    const existingIndex = progress.activities.findIndex((a) => Number(a.activityId) === normalizedId);

    const now = new Date().toISOString();
    const newActivity: ActivityProgress = {
      ...merged,
      completedAt: merged.completed ? now : undefined,
      attempts: existingIndex >= 0 ? progress.activities[existingIndex].attempts + 1 : 1
    };

    if (existingIndex >= 0) {
      // Actualizar actividad existente
      const oldActivity = progress.activities[existingIndex];
      progress.activities[existingIndex] = {
        ...newActivity,
        levelDetail: merged.levelDetail ?? oldActivity.levelDetail,
        attempts: oldActivity.attempts + 1
      };
    } else {
      // Agregar nueva actividad
      progress.activities.push(newActivity);
    }

    // Actualizar estadísticas globales
    progress.totalPoints = progress.activities.reduce((sum, a) => sum + (Number(a.score) || 0), 0);
    progress.gamesCompleted = progress.activities.filter(a => a.activityType === 'juego' && a.completed).length;
    progress.readingsCompleted = progress.activities.filter(a => a.activityType === 'lectura' && a.completed).length;
    progress.lastActivity = now;

    localStorage.setItem(key, JSON.stringify(progress));

    /** Racha de días (localStorage); no se borra al cerrar sesión */
    if (merged.completed) {
      this.bumpStreakOnCompletion(estudianteId);
    }
  }

  /** Días consecutivos con al menos una actividad completada (persistente entre sesiones) */
  private bumpStreakOnCompletion(estudianteId: number): void {
    const key = `neurokids-streak-${estudianteId}`;
    const today = new Date().toISOString().slice(0, 10);
    let data = { streak: 0, lastDate: '' };
    try {
      const raw = localStorage.getItem(key);
      if (raw) data = JSON.parse(raw);
    } catch {
      /* ignore */
    }
    if (data.lastDate === today) return;
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = y.toISOString().slice(0, 10);
    if (data.lastDate === yesterday) {
      data.streak = (data.streak || 0) + 1;
    } else {
      data.streak = 1;
    }
    data.lastDate = today;
    localStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * Obtiene del localStorage
   */
  private getFromLocalStorage(estudianteId: number): StudentProgress {
    const key = `neurokids-progress-${estudianteId}`;
    const stored = localStorage.getItem(key);

    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        console.error('Error parsing localStorage progress');
      }
    }

    return {
      estudianteId,
      totalPoints: 0,
      gamesCompleted: 0,
      readingsCompleted: 0,
      activities: []
    };
  }

  /** Días de racha guardados en localStorage (persisten al cerrar sesión) */
  getStreakDays(estudianteId: number): number {
    try {
      const raw = localStorage.getItem(`neurokids-streak-${estudianteId}`);
      if (!raw) return 0;
      const data = JSON.parse(raw) as { streak?: number };
      return typeof data.streak === 'number' ? data.streak : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Limpia el progreso (útil para testing o reset)
   */
  clearProgress(): void {
    const estudianteId = this.getStudentId();
    if (estudianteId) {
      const key = `neurokids-progress-${estudianteId}`;
      localStorage.removeItem(key);
    }
  }
}

export const progressService = new ProgressService();
