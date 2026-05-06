import React from "react";
import htm from "htm";

const html = htm.bind(React.createElement);

export function EmptyState({
  title = "Nenhum item encontrado",
  description = "Tente ajustar os filtros ou voltar mais tarde.",
  className = ""
}) {
  return html`
    <div className=${`empty-state ${className}`.trim()}>
      <div className="empty-state-icon" aria-hidden="true">+</div>
      <strong>${title}</strong>
      <p>${description}</p>
    </div>
  `;
}
