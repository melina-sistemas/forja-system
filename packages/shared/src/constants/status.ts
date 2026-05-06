export const LOAN_STATUS = {
  ACTIVE: "active",
  OVERDUE: "overdue",
  RETURNED: "returned"
} as const;

export const BOOK_LEVEL = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard"
} as const;

export const USER_LEVEL = {
  BRONZE: "bronze",
  SILVER: "silver",
  GOLD: "gold"
} as const;

export const SCORE_REASON = {
  READING_COMPLETED: "reading_completed",
  LATE_RETURN_PENALTY: "late_return_penalty",
  MANUAL_ADJUSTMENT: "manual_adjustment"
} as const;
