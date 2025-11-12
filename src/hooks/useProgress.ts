import { useCallback } from 'react';
import { progressService } from '../services/progressService';
import type { ActivityProgress } from '../services/progressService';

interface SaveProgressParams {
  activityId: string;
  activityName: string;
  activityType: 'lectura' | 'juego';
  ageGroup: '7-8' | '9-10' | '11-12';
  level: number;
  score: number;
  maxScore: number;
  completed: boolean;
  timeSpent?: number;
}

export function useProgress() {
  /**
   * Guarda el progreso de una actividad
   */
  const saveProgress = useCallback(async (params: SaveProgressParams) => {
    try {
      await progressService.saveActivityProgress({
        activityId: params.activityId,
        activityName: params.activityName,
        activityType: params.activityType,
        ageGroup: params.ageGroup,
        level: params.level,
        score: params.score,
        maxScore: params.maxScore,
        completed: params.completed,
        timeSpent: params.timeSpent
      });

      console.log(`✅ Progreso guardado: ${params.activityName} - Nivel ${params.level}`);
      return true;
    } catch (error) {
      console.error('Error guardando progreso:', error);
      return false;
    }
  }, []);

  /**
   * Obtiene el progreso de una actividad específica
   */
  const getActivityProgress = useCallback(async (activityId: string): Promise<ActivityProgress | null> => {
    try {
      return await progressService.getActivityProgress(activityId);
    } catch (error) {
      console.error('Error obteniendo progreso de actividad:', error);
      return null;
    }
  }, []);

  /**
   * Verifica si una actividad está completada
   */
  const isActivityCompleted = useCallback(async (activityId: string): Promise<boolean> => {
    try {
      return await progressService.isActivityCompleted(activityId);
    } catch (error) {
      console.error('Error verificando actividad completada:', error);
      return false;
    }
  }, []);

  /**
   * Obtiene el progreso completo del estudiante
   */
  const getStudentProgress = useCallback(async () => {
    try {
      return await progressService.getStudentProgress();
    } catch (error) {
      console.error('Error obteniendo progreso del estudiante:', error);
      return null;
    }
  }, []);

  return {
    saveProgress,
    getActivityProgress,
    isActivityCompleted,
    getStudentProgress
  };
}
