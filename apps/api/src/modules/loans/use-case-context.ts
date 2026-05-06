export interface UseCaseContext {
  now(): string;
  generateId(prefix: string): string;
}

export const defaultUseCaseContext: UseCaseContext = {
  now: () => new Date().toISOString(),
  generateId: (prefix: string) =>
    `${prefix}-${Math.random().toString(36).slice(2, 10)}`
};

