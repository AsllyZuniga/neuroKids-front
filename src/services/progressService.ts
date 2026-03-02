import { API_CONFIG, buildApiUrl } from '../config/api';

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
}

export interface StudentProgress {
  estudianteId: number;
  totalPoints: number;
  gamesCompleted: number;
  readingsCompleted: number;
  activities: ActivityProgress[];
  lastActivity?: string;
}

class ProgressService {
  private getStudentId(): number | null {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const student = JSON.parse(userData);
        return student.id;
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

  /**
   * Guarda o actualiza el progreso de una actividad
   */
  async saveActivityProgress(activityProgress: Omit<ActivityProgress, 'completedAt' | 'attempts'>): Promise<void> {
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
      const requestBody = {
        estudiante_id: estudianteId,
        actividad_id: activityProgress.activityId,
        puntuacion: activityProgress.score,
        puntuacion_maxima: activityProgress.maxScore,
        completado: activityProgress.completed,
        completado_at: activityProgress.completed ? new Date().toISOString() : null,
        intentos: 1,
        tiempo_total: activityProgress.timeSpent || 0,
        ultima_interaccion: new Date().toISOString(),
        // Agregamos timestamp único para garantizar registros únicos
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
        console.log('✅ ÉXITO - Progreso guardado correctamente:', {
          estudiante_id: estudianteId,
          actividad_id: activityProgress.activityId,
          timestamp: new Date().toISOString(),
          result: result
        });

        // También guardamos en localStorage como caché
        this.saveToLocalStorage(estudianteId, activityProgress);
      } else {
        const errorData = await response.text(); // Cambio a text() para capturar errores HTML
        console.error('❌ Error del servidor:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });

        // Guardar en localStorage como fallback
        console.log('💾 Guardando en localStorage como fallback');
        this.saveToLocalStorage(estudianteId, activityProgress);
      }
    } catch (error) {
      console.error('❌ Error guardando progreso (catch block):', error);
      console.log('💾 Guardando en localStorage debido a error de red');

      // Guardar en localStorage como fallback
      this.saveToLocalStorage(estudianteId, activityProgress);
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
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.PROGRESS_STUDENT}/${estudianteId}`));

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
              p.actividad?.tipo_actividad_id === 2 && p.completado
            ).length || 0,
            readingsCompleted: backendData.progreso?.filter((p: any) =>
              p.actividad?.tipo_actividad_id === 1 && p.completado
            ).length || 0,
            activities: backendData.progreso?.map((p: any) => ({
              activityId: p.actividad_id,
              activityName: p.actividad?.nombre || 'Actividad',
              activityType: p.actividad?.tipo_actividad_id === 1 ? 'lectura' : 'juego',
              ageGroup: this.getAgeGroupFromId(p.actividad?.grupo_edad_id),
              level: p.actividad?.nivel || 1,
              score: p.puntuacion || 0,
              maxScore: p.puntuacion_maxima || 100,
              completed: p.completado || false,
              completedAt: p.completado_at,
              attempts: p.intentos || 0,
              timeSpent: p.tiempo_total || 0
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

  private getAgeGroupFromId(grupoEdadId: number): '7-8' | '9-10' | '11-12' {
    switch (grupoEdadId) {
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
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.PROGRESS_ACTIVITY}/${activityId}/estudiante/${estudianteId}`));

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const p = data.data;
          return {
            activityId: p.actividad_id,
            activityName: p.actividad?.nombre || 'Actividad',
            activityType: p.actividad?.tipo_actividad_id === 1 ? 'lectura' : 'juego',
            ageGroup: this.getAgeGroupFromId(p.actividad?.grupo_edad_id),
            level: p.actividad?.nivel || 1,
            score: p.puntuacion || 0,
            maxScore: p.puntuacion_maxima || 100,
            completed: p.completado || false,
            completedAt: p.completado_at,
            attempts: p.intentos || 0,
            timeSpent: p.tiempo_total || 0
          };
        }
      }
    } catch (error) {
      console.error('Error obteniendo progreso de actividad:', error);
    }

    // Fallback a localStorage
    const progress = await this.getStudentProgress();
    if (!progress) return null;

    return progress.activities.find(a => a.activityId === activityId) || null;
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
  private saveToLocalStorage(estudianteId: number, activityProgress: Omit<ActivityProgress, 'completedAt' | 'attempts'>): void {
    const key = `neurokids-progress-${estudianteId}`;
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

    // Buscar si la actividad ya existe
    const existingIndex = progress.activities.findIndex(
      a => a.activityId === activityProgress.activityId && a.level === activityProgress.level
    );

    const now = new Date().toISOString();
    const newActivity: ActivityProgress = {
      ...activityProgress,
      completedAt: activityProgress.completed ? now : undefined,
      attempts: existingIndex >= 0 ? progress.activities[existingIndex].attempts + 1 : 1
    };

    if (existingIndex >= 0) {
      // Actualizar actividad existente
      const oldActivity = progress.activities[existingIndex];
      progress.activities[existingIndex] = {
        ...newActivity,
        attempts: oldActivity.attempts + 1
      };
    } else {
      // Agregar nueva actividad
      progress.activities.push(newActivity);
    }

    // Actualizar estadísticas globales
    progress.totalPoints = progress.activities.reduce((sum, a) => sum + a.score, 0);
    progress.gamesCompleted = progress.activities.filter(a => a.activityType === 'juego' && a.completed).length;
    progress.readingsCompleted = progress.activities.filter(a => a.activityType === 'lectura' && a.completed).length;
    progress.lastActivity = now;

    localStorage.setItem(key, JSON.stringify(progress));
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
