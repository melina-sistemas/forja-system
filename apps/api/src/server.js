import { createServer } from "node:http";
import os from "node:os";
import { readFile, writeFile } from "node:fs/promises";
import { URL } from "node:url";
import { loadEnvFile } from "./config/load-env.js";
import { getSupabaseConfig } from "./config/supabase-config.js";
import { createDevelopmentPlanCatalog } from "./data/development-plan-data.js";
import { createLoan } from "./modules/loans/runtime/create-loan.js";
import { InMemoryLoanRepository } from "./modules/loans/runtime/in-memory-loan-repository.js";
import { returnLoan } from "./modules/loans/runtime/return-loan.js";
import { SupabaseLoanRepository } from "./modules/loans/runtime/supabase-loan-repository.js";

const ADMIN_BOOKS_STATE_FILE = new URL("./data/admin-books-state.json", import.meta.url);

loadEnvFile();

const repository = createRepository();
const server = createApiServer(repository);

export { server };
export default server;

export function createApiServer(repository) {
  return createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", "http://localhost");

    try {
      if (request.method === "OPTIONS") {
        return sendJson(response, 204, null);
      }

      if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/health")) {
        return sendJson(response, 200, {
          status: "ok",
          message: "API da biblioteca ativa."
        });
      }

      if (request.method === "GET" && url.pathname === "/seed") {
        const snapshot = await repository.getLibrarySnapshot();
        const adminBooksState = await readAdminBooksState();
        const mergedBooks = mergeBooks(snapshot.books, adminBooksState.books);

        return sendJson(response, 200, {
          ...snapshot,
          books: mergedBooks
        });
      }

      if (request.method === "POST" && url.pathname === "/loans") {
        const body = await readJsonBody(request);

        if (!body.userId || !body.bookId) {
          return sendJson(response, 400, {
            success: false,
            error: {
              code: "invalid_request",
              message: "Informe userId e bookId."
            }
          });
        }

        const result = await createLoan(
          {
            userId: body.userId,
            bookId: body.bookId,
            borrowedAt: body.borrowedAt
          },
          { repository }
        );

        return sendUseCaseResult(response, result, 201);
      }

      const returnMatch = url.pathname.match(/^\/loans\/([^/]+)\/return$/);

      if (request.method === "POST" && returnMatch) {
        const body = await readJsonBody(request);
        const answers = normalizeAnswers(body);

        const result = await returnLoan(
          {
            loanId: returnMatch[1],
            returnedAt: body.returnedAt,
            answers
          },
          { repository }
        );

        return sendUseCaseResult(response, result, 200);
      }

      if (request.method === "POST" && url.pathname === "/admin/books/import-pdf") {
        const body = await readJsonBody(request);

        if (!body.extractedText && !body.pdfUrl) {
          return sendJson(response, 400, {
            success: false,
            error: {
              code: "invalid_request",
              message: "Envie extractedText ou pdfUrl para importar os livros."
            }
          });
        }

        const importedBooks = await importBooksFromImportedPdfText(body);

        return sendJson(response, 200, {
          success: true,
          importedBooks
        });
      }

      if (request.method === "POST" && url.pathname === "/admin/books/sync") {
        const body = await readJsonBody(request);
        const nextBooks = Array.isArray(body.books) ? body.books : [];

        await writeAdminBooksState({ books: nextBooks });

        return sendJson(response, 200, {
          success: true,
          books: nextBooks.length
        });
      }

      return sendJson(response, 404, {
        success: false,
        error: {
          code: "not_found",
          message: "Rota nao encontrada."
        }
      });
    } catch (error) {
      return sendJson(response, 500, {
        success: false,
        error: {
          code: "internal_error",
          message: "Erro interno da API.",
          details: {
            message: error instanceof Error ? error.message : String(error)
          }
        }
      });
    }
  });
}

function normalizeAnswers(body) {
  if (body.answers && typeof body.answers === "object") {
    return body.answers;
  }

  return {
    learning: body.learning ?? "",
    application: body.application ?? "",
    example: body.example ?? ""
  };
}

async function readJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");

  if (!rawBody.trim()) {
    return {};
  }

  return JSON.parse(rawBody);
}

function sendUseCaseResult(response, result, successStatus) {
  if (result.success) {
    return sendJson(response, successStatus, result);
  }

  return sendJson(response, mapErrorToStatus(result.error.code), result);
}

function mapErrorToStatus(code) {
  switch (code) {
    case "user_not_found":
    case "book_not_found":
    case "loan_not_found":
      return 404;
    case "invalid_return_answers":
      return 422;
    case "premium_book_requires_gold":
      return 403;
    case "user_has_active_loan":
    case "book_inactive":
    case "book_unavailable":
    case "loan_already_returned":
      return 409;
    default:
      return 400;
  }
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });

  if (statusCode === 204) {
    response.end();
    return;
  }

  response.end(JSON.stringify(payload, null, 2));
}

async function readAdminBooksState() {
  try {
    const raw = await readFile(ADMIN_BOOKS_STATE_FILE, "utf8");
    const parsed = JSON.parse(raw);

    return {
      books: Array.isArray(parsed?.books) ? parsed.books : []
    };
  } catch (error) {
    return {
      books: []
    };
  }
}

async function writeAdminBooksState(state) {
  const payload = {
    books: Array.isArray(state?.books) ? state.books : []
  };

  await writeFile(ADMIN_BOOKS_STATE_FILE, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function mergeBooks(baseBooks = [], adminBooks = []) {
  const map = new Map();

  for (const book of baseBooks) {
    map.set(book.id, book);
  }

  for (const book of adminBooks) {
    map.set(book.id, {
      ...map.get(book.id),
      ...book
    });
  }

  return Array.from(map.values()).sort((left, right) =>
    String(left.title || "").localeCompare(String(right.title || ""), "pt-BR")
  );
}

async function importBooksFromImportedPdfText(body) {
  const text = String(body.extractedText ?? "").replace(/\r/g, "");

  if (!text.trim()) {
    return [];
  }

  if (
    text.includes("PLANO DE DESENVOLVIMENTO") &&
    text.includes("CONSOLIDA")
  ) {
    return buildBooksFromDevelopmentPlan();
  }

  return parseImportedBooksText(text);
}

function buildBooksFromDevelopmentPlan() {
  const catalog = createDevelopmentPlanCatalog();
  const recommendationMap = new Map();

  for (const recommendation of catalog.recommendations) {
    const bucket = recommendationMap.get(recommendation.bookId) ?? [];
    bucket.push(recommendation);
    recommendationMap.set(recommendation.bookId, bucket);
  }

  return catalog.books.map((book) => {
    const relatedRecommendations = recommendationMap.get(book.id) ?? [];
    const summary = relatedRecommendations
      .slice(0, 2)
      .map((item) => item.strategicJustification)
      .filter(Boolean)
      .join(" ");

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      summary,
      category: book.category,
      coverUrl: "",
      type: "physical",
      totalQuantity: book.totalCopies,
      availableQuantity: book.availableCopies,
      isPremium: book.isPremium,
      isActive: book.isActive
    };
  });
}

function parseImportedBooksText(text) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  const imported = [];

  for (const block of blocks) {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      continue;
    }

    const title = lines[0];
    const authorLine =
      lines.find((line) => /^autor[:\-]/i.test(line)) ??
      lines.find((line) => /por\s+/i.test(line)) ??
      lines[1];
    const author = authorLine
      .replace(/^autor[:\-]\s*/i, "")
      .replace(/^por\s+/i, "")
      .trim();
    const summary = lines.slice(2).join(" ").trim();

    if (!looksLikeBookTitle(title) || !author) {
      continue;
    }

    imported.push({
      id: `imported-${slugify(`${title}-${author}`)}`,
      title,
      author,
      summary,
      category: inferCategory(lines, summary),
      coverUrl: "",
      type: "physical",
      totalQuantity: 1,
      availableQuantity: 1,
      isPremium: false,
      isActive: true
    });
  }

  return dedupeImportedBooks(imported);
}

function inferCategory(lines, summary) {
  const joined = `${lines.join(" ")} ${summary}`.toLowerCase();

  if (joined.includes("engenharia")) {
    return "Engenharia";
  }

  if (joined.includes("lider") || joined.includes("lideranca")) {
    return "Lideranca";
  }

  if (joined.includes("comunica")) {
    return "Comunicacao";
  }

  if (joined.includes("estrat")) {
    return "Pensamento estrategico";
  }

  if (joined.includes("soft")) {
    return "Soft skills";
  }

  return "";
}

function looksLikeBookTitle(value) {
  return value.length >= 3 && !/^p[aá]gina\s+\d+/i.test(value);
}

function dedupeImportedBooks(books) {
  const map = new Map();

  for (const book of books) {
    const key = `${book.title}:${book.author}`.toLowerCase();

    if (!map.has(key)) {
      map.set(key, book);
    }
  }

  return Array.from(map.values());
}

function slugify(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const isMainModule =
  process.argv[1] &&
  new URL(`file:${process.argv[1].replace(/\\/g, "/")}`).pathname.endsWith(
    "/server.js"
  );

if (isMainModule) {
  try {
    const port = Number(process.env.PORT ?? 3001);
    server.listen(port, "0.0.0.0", () => {
      console.log(`Biblioteca API rodando em http://localhost:${port}`);
      for (const address of getLocalAddresses()) {
        console.log(`Biblioteca API em rede local: http://${address}:${port}`);
      }
      console.log("Rotas disponiveis:");
      console.log("POST /loans");
      console.log("POST /loans/:loanId/return");
      console.log("POST /admin/books/import-pdf");
      console.log("GET /health");
      console.log("GET /seed");
    });
  } catch (error) {
    console.error("Nao foi possivel iniciar a API.");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

function getLocalAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const group of Object.values(interfaces)) {
    for (const item of group ?? []) {
      if (item.family === "IPv4" && !item.internal) {
        addresses.push(item.address);
      }
    }
  }

  return [...new Set(addresses)];
}

function createRepository() {
  const hasSupabaseConfig =
    Boolean(process.env.SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (hasSupabaseConfig) {
    return new SupabaseLoanRepository(getSupabaseConfig());
  }

  console.warn(
    "SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausentes. Usando repositorio em memoria."
  );

  return new InMemoryLoanRepository();
}
