import React from "react";
import htm from "htm";

const html = htm.bind(React.createElement);

export function Card({
  title = "",
  description = "",
  eyebrow = "",
  actions = null,
  children,
  className = ""
}) {
  return html`
    <article className=${`ui-card ${className}`.trim()}>
      ${(eyebrow || title || description || actions)
        ? html`
            <div className="ui-card-header">
              <div className="ui-card-copy">
                ${eyebrow ? html`<span className="ui-card-eyebrow">${eyebrow}</span>` : null}
                ${title ? html`<h3>${title}</h3>` : null}
                ${description ? html`<p>${description}</p>` : null}
              </div>
              ${actions ? html`<div className="ui-card-actions">${actions}</div>` : null}
            </div>
          `
        : null}
      <div className="ui-card-body">${children}</div>
    </article>
  `;
}
