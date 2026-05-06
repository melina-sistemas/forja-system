import { createDevelopmentPlanCatalog } from "./development-plan-data.js";

export function createInitialLibraryState() {
  const catalog = createDevelopmentPlanCatalog();

  return {
    users: catalog.users,
    books: catalog.books,
    loans: [],
    returns: [],
    recommendations: catalog.recommendations,
    scoreEntries: []
  };
}
