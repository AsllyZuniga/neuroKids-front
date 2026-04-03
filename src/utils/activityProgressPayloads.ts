/**
 * Payloads coherentes con el backend (detalle_niveles, solo_registro, nivel_completado).
 * Usar en todos los juegos y lecturas.
 */
import type { ActivityConfig } from '@/config/activities';
import type { SaveProgressParams } from '@/hooks/useProgress';

export const GAME_LEVELS_DEFAULT = 3;

export function baseFromActivityConfig(c: ActivityConfig): Pick<
  SaveProgressParams,
  'activityId' | 'activityName' | 'activityType' | 'ageGroup' | 'maxScore'
> {
  return {
    activityId: c.dbId,
    activityName: c.title,
    activityType: c.type,
    ageGroup: c.ageGroup,
    maxScore: c.maxScore
  };
}

/** Entrada a un nivel de juego (sin puntos de nivel). */
export function gameLevelStart(
  base: ReturnType<typeof baseFromActivityConfig>,
  level: number
): SaveProgressParams {
  return {
    ...base,
    level,
    score: 0,
    completed: false,
    soloRegistro: true,
    timeSpent: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    audioUses: 0
  };
}

/** Fin de un nivel de juego. `completed` solo true en el último nivel. */
export function gameLevelFinished(
  base: ReturnType<typeof baseFromActivityConfig>,
  opts: {
    level: number;
    maxLevels?: number;
    score: number;
    maxScore?: number;
    timeSpent?: number;
    correctAnswers?: number;
    incorrectAnswers?: number;
    audioUses?: number;
  }
): SaveProgressParams {
  const maxLevels = opts.maxLevels ?? GAME_LEVELS_DEFAULT;
  const last = opts.level >= maxLevels;
  return {
    ...base,
    level: opts.level,
    score: opts.score,
    maxScore: opts.maxScore ?? base.maxScore,
    completed: last,
    nivelCompletado: true,
    timeSpent: opts.timeSpent ?? 0,
    correctAnswers: opts.correctAnswers ?? 0,
    incorrectAnswers: opts.incorrectAnswers ?? 0,
    audioUses: opts.audioUses ?? 0
  };
}

/** Inicio / cambio de sección en lectura (sin completar). */
export function readingStart(
  base: ReturnType<typeof baseFromActivityConfig>,
  level: number = 1
): SaveProgressParams {
  return {
    ...base,
    level,
    score: 0,
    completed: false,
    soloRegistro: true,
    timeSpent: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    audioUses: 0
  };
}

/** Lectura lineal completada de una vez (mapa 3/3 en backend). */
export function readingComplete(
  base: ReturnType<typeof baseFromActivityConfig>,
  opts: {
    score: number;
    maxScore?: number;
    level?: number;
    timeSpent?: number;
    correctAnswers?: number;
    incorrectAnswers?: number;
    audioUses?: number;
  }
): SaveProgressParams {
  return {
    ...base,
    level: opts.level ?? 1,
    score: opts.score,
    maxScore: opts.maxScore ?? base.maxScore,
    completed: true,
    timeSpent: opts.timeSpent ?? 0,
    correctAnswers: opts.correctAnswers ?? 0,
    incorrectAnswers: opts.incorrectAnswers ?? 0,
    audioUses: opts.audioUses ?? 0
  };
}

/** Lectura con varios niveles (1–3): al terminar cada nivel. */
export function readingLevelFinished(
  base: ReturnType<typeof baseFromActivityConfig>,
  opts: {
    level: number;
    maxLevels?: number;
    score: number;
    maxScore?: number;
    timeSpent?: number;
    correctAnswers?: number;
    audioUses?: number;
  }
): SaveProgressParams {
  const maxLevels = opts.maxLevels ?? GAME_LEVELS_DEFAULT;
  const last = opts.level >= maxLevels;
  return {
    ...base,
    level: opts.level,
    score: opts.score,
    maxScore: opts.maxScore ?? base.maxScore,
    completed: last,
    nivelCompletado: true,
    timeSpent: opts.timeSpent ?? 0,
    correctAnswers: opts.correctAnswers ?? 0,
    incorrectAnswers: 0,
    audioUses: opts.audioUses ?? 0
  };
}
