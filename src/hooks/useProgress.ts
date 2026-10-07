import { useCallback } from 'react';
import { progressService } from '../services/progressService';
import type { ActivityProgress } from '../services/progressService';

export interface SaveProgressParams {
  activityId: number;
  activityName: string;
  activityType: 'lectura' | 'juego';
  ageGroup: '7-8' | '9-10' | '11-12';
  level: number;
  score: number;
  maxScore: number;
  completed: boolean;
  nivelCompletado?: boolean;
  soloRegistro?: boolean;
  timeSpent?: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  audioUses?: number;
}

export function useProgress() {

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
        nivelCompletado: params.nivelCompletado,
        soloRegistro: params.soloRegistro,
        timeSpent: params.timeSpent,
        correctAnswers: params.correctAnswers,
        incorrectAnswers: params.incorrectAnswers,
        audioUses: params.audioUses
      });

      console.log(`✅ Progreso guardado: ${params.activityName} - Nivel ${params.level}`);
      return true;
    } catch (error) {
      console.error('Error guardando progreso:', error);
      return false;
    }
  }, []);


  const getActivityProgress = useCallback(async (activityId: number): Promise<ActivityProgress | null> => {
    try {
      return await progressService.getActivityProgress(activityId);
    } catch (error) {
      console.error('Error obteniendo progreso de actividad:', error);
      return null;
    }
  }, []);


  const isActivityCompleted = useCallback(async (activityId: number): Promise<boolean> => {
    try {
      const progress = await progressService.getActivityProgress(activityId);
      return progress?.completed || false;
    } catch (error) {
      console.error('Error verificando actividad completada:', error);
      return false;
    }
  }, []);


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
