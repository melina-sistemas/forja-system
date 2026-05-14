import React, { useEffect, useMemo, useState } from "react";
import htm from "htm";

const html = htm.bind(React.createElement);
const PAGE_SIZE = 7;

export function UserInsights({ users }) {
  const [page, setPage] = useState(1);

  const ranking = useMemo(
    () =>
      [...users].sort((left, right) => {
        if ((right.readingScore ?? 0) !== (left.readingScore ?? 0)) {
          return (right.readingScore ?? 0) - (left.readingScore ?? 0);
        }

        return (right.completedLoansCount ?? 0) - (left.completedLoansCount ?? 0);
      }),
    [users]
  );

  const totalPages = Math.max(1, Math.ceil(ranking.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedRanking = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return ranking.slice(start, start + PAGE_SIZE);
  }, [page, ranking]);

  return html`
    <section className="insights-stack">
      <article className="card">
        <div className="card-top">
          <p className="section-tag">Ranking geral</p>
          <h2>Quem está liderando a leitura</h2>
          <p>
            A lista é ordenada da maior pontuação para a menor. Navegue pela página para ver
            o ranking completo da equipe.
          </p>
        </div>

        <div className="ranking-list">
          ${paginatedRanking.map(
            (user, index) => html`
              <article key=${user.id} className="ranking-row">
                <span className="ranking-position">#${(page - 1) * PAGE_SIZE + index + 1}</span>
                <span className="ranking-name">
                  ${user.name}
                  <small>${translateUserLevel(user.level)}</small>
                </span>
                <span className="ranking-stat">${user.readingScore ?? 0} pts</span>
                <span className="ranking-stat">${user.completedLoansCount ?? 0} livros</span>
              </article>
            `
          )}
        </div>

        <div className="ranking-pagination">
          <span className="ranking-page-indicator">
            Página ${page} de ${totalPages}
          </span>
          <div className="ranking-pagination-actions">
            <button
              type="button"
              className="admin-secondary"
              disabled=${page === 1}
              onClick=${() => setPage((current) => Math.max(1, current - 1))}
            >
              Anterior
            </button>
            <button
              type="button"
              className="admin-secondary"
              disabled=${page === totalPages}
              onClick=${() => setPage((current) => Math.min(totalPages, current + 1))}
            >
              Próxima
            </button>
          </div>
        </div>
      </article>
    </section>
  `;
}

function translateUserLevel(level) {
  switch (level) {
    case "bronze":
      return "Bronze";
    case "silver":
      return "Prata";
    case "gold":
      return "Ouro";
    default:
      return level;
  }
}
