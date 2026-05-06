import React from "react";
import htm from "htm";
import { FilterBar } from "./FilterBar.js";

const html = htm.bind(React.createElement);

export function PageLayout({
  eyebrow = "",
  title = "",
  description = "",
  actions = null,
  stats = [],
  filters = null,
  children,
  className = "",
  compact = false
}) {
  return html`
    <section className=${`page-layout ${compact ? "compact" : ""} ${className}`.trim()}>
      ${(eyebrow || title || description || actions || stats.length > 0)
        ? html`
            <div className="page-hero">
              <div className="page-hero-copy">
                ${eyebrow ? html`<span className="page-eyebrow">${eyebrow}</span>` : null}
                ${title ? html`<h1>${title}</h1>` : null}
                ${description ? html`<p>${description}</p>` : null}
              </div>

              ${(actions || stats.length > 0)
                ? html`
                    <div className="page-hero-side">
                      ${actions ? html`<div className="page-hero-actions">${actions}</div>` : null}
                      ${stats.length > 0
                        ? html`
                            <div className="page-hero-stats">
                              ${stats.map(
                                (stat) => html`
                                  <div key=${stat.label} className="hero-stat-card">
                                    <span>${stat.label}</span>
                                    <strong>${stat.value}</strong>
                                  </div>
                                `
                              )}
                            </div>
                          `
                        : null}
                    </div>
                  `
                : null}
            </div>
          `
        : null}

      ${filters ? html`<${FilterBar}>${filters}<//>` : null}

      <div className="page-layout-content">${children}</div>
    </section>
  `;
}
