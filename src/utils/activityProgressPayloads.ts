
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
