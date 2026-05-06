import {
  BOOK_LEVEL_LOAN_DAYS,
  LIBRARY_RULES,
  READING_SCORE_RULES,
  USER_LEVEL_SCORE_RULES
} from "../constants/rules";
import type {
  AnswerFieldQuality,
  AnswerQualityAnalysis,
  Book,
  BookLevel,
  Loan,
  LoanCreationCheckResult,
  LoanStatus,
  ReturnAnswers,
  ReturnAnswersValidationResult,
  ReturnScoreBreakdown,
  TeamUser,
  UserLevel
} from "../types/library";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const GENERIC_PATTERNS = [
  "muito bom",
  "muito interessante",
  "aprendi bastante",
  "foi legal",
  "foi bom",
  "vou aplicar no trabalho",
  "usar no dia a dia",
  "dar um exemplo",
  "exemplo pratico",
  "aprendi muito"
] as const;

function toDate(value: string): Date {
  return new Date(value);
}

function startOfUtcDay(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function canCreateLoan(
  user: TeamUser,
  book: Book
): LoanCreationCheckResult {
  if (user.activeLoanId) {
    return {
      allowed: false,
      reason: "user_has_active_loan"
    };
  }

  if (!book.isActive) {
    return {
      allowed: false,
      reason: "book_inactive"
    };
  }

  if (book.availableCopies < LIBRARY_RULES.MAX_ACTIVE_LOANS_PER_USER) {
    return {
      allowed: false,
      reason: "book_unavailable"
    };
  }

  if (book.isPremium && user.level !== "gold") {
    return {
      allowed: false,
      reason: "premium_book_requires_gold"
    };
  }

  return { allowed: true };
}

export function getUserLevelFromScore(score: number): UserLevel {
  if (score >= USER_LEVEL_SCORE_RULES.gold.minScore) {
    return "gold";
  }

  if (score >= USER_LEVEL_SCORE_RULES.silver.minScore) {
    return "silver";
  }

  return "bronze";
}

export function calculateDueDate(
  level: BookLevel,
  borrowedAt: string
): string {
  const baseDate = toDate(borrowedAt);
  const resultDate = new Date(baseDate);

  resultDate.setUTCDate(baseDate.getUTCDate() + BOOK_LEVEL_LOAN_DAYS[level]);

  return resultDate.toISOString();
}

export function calculateDaysLate(dueAt: string, returnedAt: string): number {
  const dueDate = toDate(dueAt);
  const returnedDate = toDate(returnedAt);
  const dueDay = startOfUtcDay(dueDate);
  const returnedDay = startOfUtcDay(returnedDate);
  const diffInDays = Math.floor((returnedDay - dueDay) / MS_PER_DAY);

  return Math.max(0, diffInDays);
}

export function isLate(dueAt: string, returnedAt: string): boolean {
  return calculateDaysLate(dueAt, returnedAt) > 0;
}

export function getLoanStatus(
  loan: Loan,
  referenceDate: string = new Date().toISOString()
): LoanStatus {
  if (loan.returnedAt) {
    return "returned";
  }

  return isLate(loan.dueAt, referenceDate) ? "overdue" : "active";
}

export function validateReturnAnswers(
  answers: ReturnAnswers
): ReturnAnswersValidationResult {
  const qualityAnalysis = analyzeReturnAnswersQuality(answers);
  const missingFields = (Object.entries(answers) as Array<
    [keyof ReturnAnswers, string]
  >)
    .filter(([, value]) => value.trim().length === 0)
    .map(([field]) => field);

  return {
    isValid:
      missingFields.length === 0 &&
      qualityAnalysis.tooShortFields.length === 0,
    missingFields,
    tooShortFields: qualityAnalysis.tooShortFields,
    genericFields: qualityAnalysis.genericFields,
    qualityAnalysis
  };
}

export function analyzeReturnAnswersQuality(
  answers: ReturnAnswers
): AnswerQualityAnalysis {
  const fields: ReturnAnswerField[] = ["learning", "application", "example"];
  const fieldResults = {} as Record<ReturnAnswerField, AnswerFieldQuality>;

  for (const field of fields) {
    fieldResults[field] = analyzeSingleAnswerField(field, answers[field]);
  }

  const tooShortFields = fields.filter(
    (field) => fieldResults[field].label === "too_short"
  );
  const genericFields = fields.filter(
    (field) => fieldResults[field].label === "generic"
  );
  const score = Math.round(
    fields.reduce((sum, field) => sum + fieldResults[field].score, 0) /
      fields.length
  );

  return {
    score,
    tooShortFields,
    genericFields,
    fieldResults
  };
}

export function calculateReadingScore(
  level: BookLevel,
  dueAt: string,
  returnedAt: string,
  answers: ReturnAnswers
): ReturnScoreBreakdown {
  const daysLate = calculateDaysLate(dueAt, returnedAt);
  const answersValidation = validateReturnAnswers(answers);
  const basePoints = READING_SCORE_RULES.BASE_POINTS[level];
  const onTimeBonus =
    daysLate === 0 ? READING_SCORE_RULES.ON_TIME_BONUS : 0;
  const completeAnswersBonus = answersValidation.isValid
    ? READING_SCORE_RULES.COMPLETE_ANSWERS_BONUS
    : 0;
  const latePenalty =
    daysLate * READING_SCORE_RULES.LATE_PENALTY_PER_DAY;

  return {
    basePoints,
    onTimeBonus,
    completeAnswersBonus,
    latePenalty,
    totalPoints:
      basePoints + onTimeBonus + completeAnswersBonus - latePenalty,
    isLate: daysLate > 0,
    daysLate,
    answersComplete: answersValidation.isValid
  };
}

function analyzeSingleAnswerField(
  field: ReturnAnswerField,
  value: string
): AnswerFieldQuality {
  const trimmed = value.trim();
  const words = trimmed.length > 0 ? trimmed.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const characterCount = trimmed.length;
  const normalized = normalizeText(trimmed);
  const feedback: string[] = [];

  if (characterCount < 20 || wordCount < 4) {
    feedback.push("Muito curta para demonstrar reflexao.");

    return {
      field,
      score: 0,
      label: "too_short",
      wordCount,
      characterCount,
      feedback
    };
  }

  const isGeneric = GENERIC_PATTERNS.some((pattern) =>
    normalized.includes(pattern)
  );
  let score = 3;

  feedback.push("Resposta valida.");

  if (wordCount >= 8) {
    score += 2;
    feedback.push("Traz mais contexto.");
  }

  if (wordCount >= 14) {
    score += 2;
    feedback.push("Explica a ideia com mais profundidade.");
  }

  if (characterCount >= 90) {
    score += 1;
    feedback.push("Detalhamento acima da media.");
  }

  if (containsConcreteSignal(normalized)) {
    score += 2;
    feedback.push("Mostra aplicacao ou exemplo concreto.");
  }

  if (isGeneric) {
    score = Math.max(2, score - 3);
    feedback.push("Texto muito generico.");
  }

  return {
    field,
    score: Math.min(10, score),
    label: isGeneric ? "generic" : score >= 8 ? "detailed" : "solid",
    wordCount,
    characterCount,
    feedback
  };
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function containsConcreteSignal(value: string): boolean {
  return [
    "porque",
    "por exemplo",
    "exemplo",
    "quando",
    "projeto",
    "equipe",
    "codigo",
    "processo",
    "cliente",
    "documentacao",
    "aplicar",
    "aplicacao"
  ].some((token) => value.includes(token));
}
