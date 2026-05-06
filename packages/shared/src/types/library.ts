export type UserRole = "admin" | "staff";
export type UserLevel = "bronze" | "silver" | "gold";
export type BookLevel = "easy" | "medium" | "hard";
export type LoanStatus = "active" | "overdue" | "returned";
export type ScoreReason =
  | "reading_completed"
  | "late_return_penalty"
  | "manual_adjustment";
export type LoanCreationBlockReason =
  | "user_has_active_loan"
  | "book_inactive"
  | "book_unavailable"
  | "premium_book_requires_gold";
export type ReturnAnswerField = keyof ReturnAnswers;
export type AnswerQualityLabel =
  | "too_short"
  | "generic"
  | "solid"
  | "detailed";
export type UseCaseErrorCode =
  | "user_not_found"
  | "book_not_found"
  | "loan_not_found"
  | "loan_already_returned"
  | "user_has_active_loan"
  | "book_inactive"
  | "book_unavailable"
  | "premium_book_requires_gold"
  | "invalid_return_answers";
export type ReadingCycle = "short" | "medium" | "long";
export type RecommendationPriority = "required" | "recommended";

export interface ReturnAnswers {
  learning: string;
  application: string;
  example: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn?: string;
  level: BookLevel;
  isPremium: boolean;
  totalCopies: number;
  availableCopies: number;
  isActive: boolean;
}

export interface Loan {
  id: string;
  userId: string;
  bookId: string;
  levelAtLoan: BookLevel;
  borrowedAt: string;
  dueAt: string;
  status: LoanStatus;
  returnedAt?: string;
  returnRecordId?: string;
}

export interface TeamUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  level: UserLevel;
  readingScore: number;
  activeLoanId?: string;
  completedLoansCount: number;
}

export interface BookRecommendation {
  id: string;
  userId: string;
  bookId: string;
  cycle: ReadingCycle;
  priority: RecommendationPriority;
  mainFocus: string;
  strategicJustification: string;
}

export interface LoanReturn {
  id: string;
  loanId: string;
  userId: string;
  bookId: string;
  returnedAt: string;
  isLate: boolean;
  daysLate: number;
  scoreAwarded: number;
  qualityScore: number;
  answers: ReturnAnswers;
}

export interface ScoreEntry {
  id: string;
  userId: string;
  loanId?: string;
  points: number;
  reason: ScoreReason;
  createdAt: string;
  notes?: string;
}

export interface LoanCreationCheckResult {
  allowed: boolean;
  reason?: LoanCreationBlockReason;
}

export interface ReturnAnswersValidationResult {
  isValid: boolean;
  missingFields: ReturnAnswerField[];
  tooShortFields: ReturnAnswerField[];
  genericFields: ReturnAnswerField[];
  qualityAnalysis: AnswerQualityAnalysis;
}

export interface ReturnScoreBreakdown {
  basePoints: number;
  onTimeBonus: number;
  completeAnswersBonus: number;
  latePenalty: number;
  totalPoints: number;
  isLate: boolean;
  daysLate: number;
  answersComplete: boolean;
}

export interface AnswerFieldQuality {
  field: ReturnAnswerField;
  score: number;
  label: AnswerQualityLabel;
  wordCount: number;
  characterCount: number;
  feedback: string[];
}

export interface AnswerQualityAnalysis {
  score: number;
  tooShortFields: ReturnAnswerField[];
  genericFields: ReturnAnswerField[];
  fieldResults: Record<ReturnAnswerField, AnswerFieldQuality>;
}

export interface UseCaseError {
  code: UseCaseErrorCode;
  message: string;
  details?: Record<string, unknown>;
}
