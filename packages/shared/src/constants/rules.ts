import type { BookLevel, UserLevel } from "../types/library";

export const LIBRARY_RULES = {
  MAX_ACTIVE_LOANS_PER_USER: 1
} as const;

export const BOOK_LEVEL_LOAN_DAYS: Record<BookLevel, number> = {
  easy: 15,
  medium: 20,
  hard: 30
};

export const READING_SCORE_RULES = {
  BASE_POINTS: {
    easy: 10,
    medium: 20,
    hard: 30
  } as const,
  ON_TIME_BONUS: 10,
  COMPLETE_ANSWERS_BONUS: 10,
  LATE_PENALTY_PER_DAY: 2
} as const;

export const USER_LEVEL_SCORE_RULES: Record<UserLevel, { minScore: number }> = {
  bronze: { minScore: 0 },
  silver: { minScore: 50 },
  gold: { minScore: 101 }
};
