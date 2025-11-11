import { API_CONFIG } from '../config/api';

export interface ActivityProgress {
  activityId: string;
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
    const token = this.getToken();

    if (!estudianteId || !token) {
      console.error('No se encontró información del estudiante');
      return;
    }

    try {
      // Primero guardamos en localStorage como respaldo
      this.saveToLocalStorage(estudianteId, activityProgress);

      // Intentamos guardar en el backend
      const response = await fetch(`${API_CONFIG.BASE_URL}/progreso`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          estudianteId,
          ...activityProgress,
          completedAt: activityProgress.completed ? new Date().toISOString() : undefined
        })
      });

      if (!response.ok) {
        console.warn('No se pudo guardar en el servidor, usando localStorage');
      }
    } catch (error) {
      console.error('Error guardando progreso:', error);
      // El progreso ya está en localStorage como respaldo
    }
  }

  /**
   * Obtiene el progreso completo del estudiante
   */
  async getStudentProgress(): Promise<StudentProgress | null> {
    const estudianteId = this.getStudentId();
    const token = this.getToken();

    if (!estudianteId) {
      return null;
    }

    try {
      // Intentamos obtener del backend
      if (token) {
        const response = await fetch(`${API_CONFIG.BASE_URL}/progreso/${estudianteId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          return data.data;
        }
      }

      // Si falla, usamos localStorage
      return this.getFromLocalStorage(estudianteId);
    } catch (error) {
      console.error('Error obteniendo progreso:', error);
      return this.getFromLocalStorage(estudianteId);
    }
  }

  /**
   * Obtiene el progreso de una actividad específica
   */
  async getActivityProgress(activityId: string): Promise<ActivityProgress | null> {
    const progress = await this.getStudentProgress();
    if (!progress) return null;

    return progress.activities.find(a => a.activityId === activityId) || null;
  }

  /**
   * Verifica si una actividad está completada
   */
  async isActivityCompleted(activityId: string): Promise<boolean> {
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
