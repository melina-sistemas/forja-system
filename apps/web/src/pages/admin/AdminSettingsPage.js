import React, { useState } from "react";
import htm from "htm";
import { AdminPageLayout } from "../../components/AdminPageLayout.js";

const html = htm.bind(React.createElement);

export function AdminSettingsPage({ settings, actions }) {
  const [message, setMessage] = useState("");

  const actionsBar = html`
    <button
      type="button"
      className="admin-primary"
      onClick=${() => setMessage("Configuracoes salvas com sucesso.")}
    >
      Salvar configuracoes
    </button>
  `;

  return html`
    <${AdminPageLayout}
      title="Personalizacao"
      breadcrumb="Personalizacao"
      description="Controle o nome do sistema, cor principal e limites globais."
      actions=${actionsBar}
    >
      <section className="admin-summary-grid">
        <article className="admin-summary-card">
          <span>Sistema</span>
          <strong>${settings.systemName}</strong>
          <small>Nome exibido no produto.</small>
        </article>
        <article className="admin-summary-card">
          <span>Cor primaria</span>
          <strong>${settings.primaryColor}</strong>
          <small>Tom base da identidade visual.</small>
        </article>
        <article className="admin-summary-card">
          <span>Limite de emprestimos</span>
          <strong>${settings.loanLimit}</strong>
          <small>Quantidade maxima por usuario.</small>
        </article>
        <article className="admin-summary-card">
          <span>Tempo maximo</span>
          <strong>${settings.globalMaxDays} dias</strong>
          <small>Prazo global padrao da biblioteca.</small>
        </article>
      </section>

      ${message ? html`<article className="admin-card admin-feedback">${message}</article>` : null}
      <div className="admin-grid">
        <article className="admin-card">
          <div className="admin-card-header">
            <h3>Identidade do sistema</h3>
          </div>
          <form className="admin-form admin-form-grid">
            <label>
              <span>Nome do sistema</span>
              <input
                value=${settings.systemName}
                onInput=${(event) =>
                  actions.updateSettings({ systemName: event.target.value })}
              />
            </label>

            <label>
              <span>Cor primaria</span>
              <input
                value=${settings.primaryColor}
                onInput=${(event) =>
                  actions.updateSettings({ primaryColor: event.target.value })}
              />
            </label>
          </form>
        </article>

        <article className="admin-card">
          <div className="admin-card-header">
            <h3>Limites operacionais</h3>
          </div>
          <form className="admin-form admin-form-grid">
            <label>
              <span>Limite de emprestimos</span>
              <input
                type="number"
                value=${settings.loanLimit}
                onInput=${(event) =>
                  actions.updateSettings({ loanLimit: Number(event.target.value || 0) })}
              />
            </label>

            <label>
              <span>Tempo maximo global</span>
              <input
                type="number"
                value=${settings.globalMaxDays}
                onInput=${(event) =>
                  actions.updateSettings({
                    globalMaxDays: Number(event.target.value || 0)
                  })}
              />
            </label>
          </form>
        </article>
      </div>
    <//>
  `;
}
