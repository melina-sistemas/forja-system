import type {
  Book,
  Loan,
  LoanReturn,
  ReturnAnswers,
  ReturnScoreBreakdown,
  ScoreEntry,
  TeamUser,
  UseCaseError
} from "../types/library";

export interface CreateLoanRequest {
  userId: string;
  bookId: string;
  borrowedAt?: string;
}

export interface CreateLoanResponse {
  loan: Loan;
  user: TeamUser;
  book: Book;
}

export interface ReturnLoanRequest {
  loanId: string;
  returnedAt?: string;
  answers: ReturnAnswers;
}

export interface ReturnLoanResponse {
  loan: Loan;
  returnRecord: LoanReturn;
  scoreEntries: ScoreEntry[];
  scoreBreakdown: ReturnScoreBreakdown;
  user: TeamUser;
  book: Book;
}

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiFailure = {
  success: false;
  error: UseCaseError;
};

export type CreateLoanResult = ApiSuccess<CreateLoanResponse> | ApiFailure;
export type ReturnLoanResult = ApiSuccess<ReturnLoanResponse> | ApiFailure;
