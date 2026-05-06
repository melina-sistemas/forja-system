import React from "react";
import htm from "htm";

const html = htm.bind(React.createElement);

export function Section({
  title = "",
  description = "",
  eyebrow = "",
  actions = null,
  children,
  className = ""
}) {
  return html`
    <section className=${`ui-section ${className}`.trim()}>
      ${(eyebrow || title || description || actions)
        ? html`
            <div className="ui-section-header">
              <div className="ui-section-copy">
                ${eyebrow ? html`<span className="ui-section-eyebrow">${eyebrow}</span>` : null}
                ${title ? html`<h2>${title}</h2>` : null}
                ${description ? html`<p>${description}</p>` : null}
              </div>
              ${actions ? html`<div className="ui-section-actions">${actions}</div>` : null}
            </div>
          `
        : null}
      <div className="ui-section-body">${children}</div>
    </section>
  `;
}
