import React from "react";
import htm from "htm";
import { useLocation } from "react-router-dom";

const html = htm.bind(React.createElement);

export function AdminPageLayout({
  title,
  description,
  actions = null,
  filters = null,
  children,
  breadcrumb = null
}) {
  const location = useLocation();
  const sectionName = location.pathname.startsWith("/admin/settings")
    ? "Configurações / Personalização"
    : "Configurações";

  return html`
    <section className="admin-page-shell">
      <div className="admin-page-toolbar">
        <div className="admin-breadcrumb">
          <span>${sectionName}</span>
          <span>/</span>
          <strong>${breadcrumb ?? title}</strong>
        </div>
        ${actions ? html`<div className="admin-page-actions">${actions}</div>` : null}
      </div>

      <h1 className="sr-only">${title}</h1>

      ${filters
        ? html`
            <div className="admin-filters-card">
              ${filters}
            </div>
          `
        : null}

      <div className="admin-page-content">
        ${children}
      </div>
    </section>
  `;
}
