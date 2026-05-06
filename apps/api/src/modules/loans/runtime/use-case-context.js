export const defaultUseCaseContext = {
  now: () => new Date().toISOString(),
  generateId: (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`
};

