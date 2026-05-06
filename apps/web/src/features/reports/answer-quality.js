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
];

export function calculateAnswerQuality(answers) {
  const fields = ["learning", "application", "example"];
  const fieldResults = Object.fromEntries(
    fields.map((field) => [field, analyzeSingleAnswerField(field, answers?.[field] ?? "")])
  );
  const results = Object.values(fieldResults);
  const score = Math.round(
    results.reduce((sum, item) => sum + item.score, 0) / results.length
  );

  return {
    score,
    label:
      score >= 8 ? "Detalhada" : score >= 5 ? "Boa" : score >= 3 ? "Generica" : "Superficial",
    hasTooShortAnswer: results.some((item) => item.label === "too_short"),
    hasGenericAnswer: results.some((item) => item.label === "generic"),
    fieldResults,
    messages: buildQualityMessages(fieldResults, score)
  };
}

function analyzeSingleAnswerField(field, value) {
  const trimmed = value.trim();
  const words = trimmed.length > 0 ? trimmed.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const characterCount = trimmed.length;
  const normalized = normalizeText(trimmed);

  if (characterCount < 20 || wordCount < 4) {
    return {
      field,
      score: 0,
      label: "too_short",
      message: "Resposta muito curta"
    };
  }

  const isGeneric = GENERIC_PATTERNS.some((pattern) =>
    normalized.includes(pattern)
  );
  let score = 3;

  if (wordCount >= 8) {
    score += 2;
  }

  if (wordCount >= 14) {
    score += 2;
  }

  if (characterCount >= 90) {
    score += 1;
  }

  if (containsConcreteSignal(normalized)) {
    score += 2;
  }

  if (isGeneric) {
    score = Math.max(2, score - 3);
  }

  return {
    field,
    score: Math.min(10, score),
    label: isGeneric ? "generic" : score >= 8 ? "detailed" : "solid",
    message: isGeneric
      ? "Tente dar um exemplo mais concreto"
      : score >= 8
        ? "Boa resposta!"
        : "Pode aprofundar um pouco mais"
  };
}

function buildQualityMessages(fieldResults, score) {
  const orderedFields = ["learning", "application", "example"];
  const messages = orderedFields.map((field) => ({
    field,
    label: humanizeField(field),
    status: fieldResults[field].label,
    message: fieldResults[field].message
  }));

  if (score >= 8) {
    messages.unshift({
      field: "overall",
      label: "Geral",
      status: "detailed",
      message: "Boa resposta!"
    });
  }

  return messages;
}

function humanizeField(field) {
  switch (field) {
    case "learning":
      return "Learning";
    case "application":
      return "Application";
    case "example":
      return "Example";
    default:
      return field;
  }
}

function normalizeText(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function containsConcreteSignal(value) {
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
