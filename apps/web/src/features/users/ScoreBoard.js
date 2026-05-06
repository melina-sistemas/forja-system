import React, { useEffect, useMemo, useState } from "react";
import htm from "htm";

const html = htm.bind(React.createElement);
const PAGE_SIZE = 7;

export function ScoreBoard({ users, selectedUserId, onSelectUser }) {
  const [page, setPage] = useState(1);

  const ranking = useMemo(
    () => [...users].sort((left, right) => (right.readingScore ?? 0) - (left.readingScore ?? 0)),
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

  const maxScore = ranking[0]?.readingScore ?? 1;

  if (ranking.length === 0) {
    return html`
      <section className="info-card">
        <h2>Score</h2>
        <p className="panel-text">Ainda nao existem pontuacoes registradas.</p>
      </section>
    `;
  }

  return html`
    <section className="panel-block">
      <div className="panel-header">
        <h2>Score</h2>
        <p className="panel-text">
          Ranking visual de pontuacao para acompanhar quem mais leu e acumulou pontos.
        </p>
      </div>

      <div className="score-list">
        ${paginatedRanking.map(
          (user, index) => html`
            <button
              key=${user.id}
              type="button"
              className=${`score-row ${selectedUserId === user.id ? "active" : ""}`}
              onClick=${() => onSelectUser?.(user.id)}
            >
              <span className="score-rank">#${(page - 1) * PAGE_SIZE + index + 1}</span>
              <div className="score-user">
                <strong>${user.name}</strong>
                <small>${user.completedLoansCount} livros concluidos</small>
              </div>
              <div className="score-bar">
                <span
                  className="score-bar-fill"
                  style=${{ width: `${Math.max(12, (user.readingScore / maxScore) * 100)}%` }}
                ></span>
              </div>
              <span className="score-points">${user.readingScore} pts</span>
            </button>
          `
        )}
      </div>

      <div className="ranking-pagination">
        <span className="ranking-page-indicator">
          Pagina ${page} de ${totalPages}
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
            Proxima
          </button>
        </div>
      </div>
    </section>
  `;
}
