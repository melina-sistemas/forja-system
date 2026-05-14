import React, { useMemo } from "react";
import htm from "htm";
import { UserInsights } from "../features/users/UserInsights.js";
import { ScoreBoard } from "../features/users/ScoreBoard.js";
import { PageLayout } from "../components/PageLayout.js";
import { Section } from "../components/Section.js";
import { EmptyState } from "../components/EmptyState.js";

const html = htm.bind(React.createElement);

export function PerformancePage({
  view = "overview",
  users,
  books,
  selectedUserId,
  onSelectUser
}) {
  const filteredUsers = useMemo(() => users, [users]);
  const copy = getPageCopy(view);
  const bestReader = [...filteredUsers].sort(
    (left, right) => (right.readingScore ?? 0) - (left.readingScore ?? 0)
  )[0];

  return html`
    <${PageLayout}
      eyebrow="Desempenho"
      title=${copy.title}
      description=${copy.subtitle}
      stats=${[
        { label: "Top score", value: bestReader ? `${bestReader.readingScore} pts` : "-" },
        { label: "Leitor líder", value: bestReader?.name ?? "-" },
        { label: "Usuários no score", value: filteredUsers.length }
      ]}
    >
      ${filteredUsers.length === 0
        ? html`
            <${EmptyState}
              title="Nenhum resultado com os filtros atuais"
              description="Ajuste os filtros para visualizar novamente os dados de desempenho."
            />
          `
        : null}

      ${view !== "evolution" && filteredUsers.length > 0
        ? html`
            <${Section}
              title="Score da equipe"
              description="Compare rapidamente a pontuação acumulada e identifique quem mais evoluiu."
            >
              <${ScoreBoard}
                users=${filteredUsers}
                selectedUserId=${selectedUserId}
                onSelectUser=${onSelectUser}
              />
            <//>
          `
        : null}

      ${filteredUsers.length > 0
        ? html`
            <${Section}
              title="Ranking geral"
              description="Veja a classificação da equipe com paginação e acompanhe a evolução por grupos menores."
            >
              <${UserInsights}
                users=${filteredUsers}
                books=${books}
              />
            <//>
          `
        : null}
    <//>
  `;
}

function getPageCopy(view) {
  switch (view) {
    case "metrics":
      return {
        title: "Métricas gerais",
        subtitle: "Compare score, posição no ranking e leituras concluídas da equipe."
      };
    case "evolution":
      return {
        title: "Evolução",
        subtitle: "Acompanhe o progresso de nível e a evolução geral da equipe."
      };
    default:
      return {
        title: "Desempenho",
        subtitle: "Uma visão geral da evolução de leitura e do score acumulado pela equipe."
      };
  }
}
