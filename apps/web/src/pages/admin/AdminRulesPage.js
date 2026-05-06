import React, { useState } from "react";
import htm from "htm";
import { AdminPageLayout } from "../../components/AdminPageLayout.js";

const html = htm.bind(React.createElement);

export function AdminRulesPage({ rules, actions }) {
  const [message, setMessage] = useState("");

  const actionsBar = html`
    <button
      type="button"
      className="admin-primary"
      onClick=${() => setMessage("Regras salvas no painel administrativo.")}
    >
      Salvar regras
    </button>
  `;

  return html`
    <${AdminPageLayout}
      title="Regras"
      breadcrumb="Regras"
      description="Defina tempos de leitura, pontos por livro e multiplicadores do sistema."
      actions=${actionsBar}
    >
      <section className="admin-summary-grid">
        <article className="admin-summary-card">
          <span>Soft skills</span>
          <strong>${rules.readingTimeByCategory.soft_skills} dias</strong>
          <small>Prazo atual para trilhas comportamentais.</small>
        </article>
        <article className="admin-summary-card">
          <span>Engenharia</span>
          <strong>${rules.readingTimeByCategory.engenharia} dias</strong>
          <small>Tempo base de leitura técnica.</small>
        </article>
        <article className="admin-summary-card">
          <span>Pontos por livro</span>
          <strong>${rules.pointsPerBook}</strong>
          <small>Base da gamificacao por leitura.</small>
        </article>
        <article className="admin-summary-card">
          <span>Multiplicador</span>
          <strong>${rules.difficultyMultiplier}x</strong>
          <small>Impacto da dificuldade no score final.</small>
        </article>
      </section>

      ${message ? html`<article className="admin-card admin-feedback">${message}</article>` : null}
      <div className="admin-grid">
        <article className="admin-card">
          <div className="admin-card-header">
            <h3>Prazos por categoria</h3>
          </div>
          <form className="admin-form admin-form-grid">
            <label>
              <span>Soft skills (dias)</span>
              <input
                type="number"
                value=${rules.readingTimeByCategory.soft_skills}
                onInput=${(event) =>
                  actions.updateRules({
                    readingTimeByCategory: {
                      ...rules.readingTimeByCategory,
                      soft_skills: Number(event.target.value || 0)
                    }
                  })}
              />
            </label>

            <label>
              <span>Engenharia (dias)</span>
              <input
                type="number"
                value=${rules.readingTimeByCategory.engenharia}
                onInput=${(event) =>
                  actions.updateRules({
                    readingTimeByCategory: {
                      ...rules.readingTimeByCategory,
                      engenharia: Number(event.target.value || 0)
                    }
                  })}
              />
            </label>
          </form>
        </article>

        <article className="admin-card">
          <div className="admin-card-header">
            <h3>Pontuacao</h3>
          </div>
          <form className="admin-form admin-form-grid">
            <label>
              <span>Pontos por livro</span>
              <input
                type="number"
                value=${rules.pointsPerBook}
                onInput=${(event) =>
                  actions.updateRules({ pointsPerBook: Number(event.target.value || 0) })}
              />
            </label>

            <label>
              <span>Multiplicador de dificuldade</span>
              <input
                type="number"
                step="0.1"
                value=${rules.difficultyMultiplier}
                onInput=${(event) =>
                  actions.updateRules({
                    difficultyMultiplier: Number(event.target.value || 0)
                  })}
              />
            </label>
          </form>
        </article>
      </div>
    <//>
  `;
}
