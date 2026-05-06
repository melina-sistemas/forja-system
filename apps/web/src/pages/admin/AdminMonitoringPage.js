import React, { useMemo, useState } from "react";
import htm from "htm";
import { AdminPageLayout } from "../../components/AdminPageLayout.js";

const html = htm.bind(React.createElement);

export function AdminMonitoringPage({ monitoring }) {
  const [focus, setFocus] = useState("all");
  const [message, setMessage] = useState("");

  const filteredRanking = useMemo(() => {
    if (focus === "top3") {
      return monitoring.ranking.slice(0, 3);
    }

    return monitoring.ranking.slice(0, 5);
  }, [focus, monitoring.ranking]);
  const summary = useMemo(
    () => ({
      overdue: monitoring.overdueUsers.length,
      topScore: monitoring.ranking[0]?.score ?? 0,
      mostRead: monitoring.mostReadBooks[0]?.reads ?? 0,
      quality:
        monitoring.answerQuality.length > 0
          ? (
              monitoring.answerQuality.reduce(
                (sum, item) => sum + Number(item.qualityScore ?? 0),
                0
              ) / monitoring.answerQuality.length
            ).toFixed(1)
          : "-"
    }),
    [monitoring.answerQuality, monitoring.mostReadBooks, monitoring.overdueUsers.length, monitoring.ranking]
  );

  const actionsBar = html`
    <button
      type="button"
      className="admin-primary"
      onClick=${() => setMessage("Painel atualizado com os dados mais recentes.")}
    >
      Atualizar painel
    </button>
  `;

  const filters = html`
    <div className="admin-filters-row">
      <label>
        <select value=${focus} onChange=${(event) => setFocus(event.target.value)}>
          <option value="all">Visao completa</option>
          <option value="top3">Top 3</option>
        </select>
      </label>
    </div>
  `;

  return html`
    <${AdminPageLayout}
      title="Monitoramento"
      breadcrumb="Monitoramento"
      description="Veja atrasos, ranking, livros mais lidos e qualidade das respostas."
      actions=${actionsBar}
      filters=${filters}
    >
      <section className="admin-summary-grid">
        <article className="admin-summary-card">
          <span>Usuarios atrasados</span>
          <strong>${summary.overdue}</strong>
          <small>Pessoas que precisam de acompanhamento.</small>
        </article>
        <article className="admin-summary-card">
          <span>Top score</span>
          <strong>${summary.topScore} pts</strong>
          <small>Maior pontuacao atual da equipe.</small>
        </article>
        <article className="admin-summary-card">
          <span>Livro mais lido</span>
          <strong>${summary.mostRead}</strong>
          <small>Total de leituras do titulo lider.</small>
        </article>
        <article className="admin-summary-card">
          <span>Qualidade media</span>
          <strong>${summary.quality === "-" ? "-" : `${summary.quality}/10`}</strong>
          <small>Media das respostas de devolucao.</small>
        </article>
      </section>

      ${message ? html`<article className="admin-card admin-feedback">${message}</article>` : null}
      <div className="admin-grid">
        <article className="admin-card">
          <div className="admin-card-header">
            <h3>Usuarios atrasados</h3>
          </div>
          ${monitoring.overdueUsers.length > 0
            ? html`
                <ul className="admin-simple-list">
                  ${monitoring.overdueUsers.map(
                    (item) => html`
                      <li key=${item.id}>
                        <strong>${item.userName}</strong>
                        <span>${item.bookTitle}</span>
                      </li>
                    `
                  )}
                </ul>
              `
            : html`<p className="admin-helper">Nenhum atraso no momento.</p>`}
        </article>

        <article className="admin-card">
          <div className="admin-card-header">
            <h3>Ranking geral</h3>
          </div>
          <ul className="admin-simple-list">
            ${filteredRanking.map(
              (user) => html`
                <li key=${user.id}>
                  <strong>${user.name}</strong>
                  <span>${user.score} pts</span>
                </li>
              `
            )}
          </ul>
        </article>

        <article className="admin-card">
          <div className="admin-card-header">
            <h3>Livros mais lidos</h3>
          </div>
          <ul className="admin-simple-list">
            ${monitoring.mostReadBooks.map(
              (book) => html`
                <li key=${book.id}>
                  <strong>${book.title}</strong>
                  <span>${book.reads} leituras</span>
                </li>
              `
            )}
          </ul>
        </article>

        <article className="admin-card">
          <div className="admin-card-header">
            <h3>Qualidade das respostas</h3>
          </div>
          ${monitoring.answerQuality.length > 0
            ? html`
                <ul className="admin-simple-list">
                  ${monitoring.answerQuality.map(
                    (item) => html`
                      <li key=${item.id}>
                        <strong>${item.qualityScore ?? 0}/10</strong>
                        <span>${item.answers?.learning ?? "Sem resposta"}</span>
                      </li>
                    `
                  )}
                </ul>
              `
            : html`<p className="admin-helper">Ainda nao ha respostas avaliadas.</p>`}
        </article>
      </div>
    <//>
  `;
}
