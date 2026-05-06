import React from "react";
import htm from "htm";

const html = htm.bind(React.createElement);

export function AdminAccessDeniedPage() {
  return html`
    <section className="page-shell">
      <div className="page-header">
        <span className="page-eyebrow">Admin</span>
        <h1>Acesso negado</h1>
        <p>Esta area esta disponivel apenas para usuarios com perfil administrador.</p>
      </div>

      <article className="admin-card admin-empty">
        <strong>Voce nao possui permissao para acessar este painel.</strong>
      </article>
    </section>
  `;
}
