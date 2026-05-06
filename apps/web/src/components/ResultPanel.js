import React from "react";
import htm from "htm";

const html = htm.bind(React.createElement);

export function ResultPanel({ title, status, children, raw }) {
  return html`
    <section className="result-panel">
      <div className="result-header">
        <h3>${title}</h3>
        <span className=${`status-badge ${status}`}>${status}</span>
      </div>
      <div className="result-body">${children}</div>
      ${raw
        ? html`
            <details className="raw-response">
              <summary>Ver JSON completo</summary>
              <pre>${JSON.stringify(raw, null, 2)}</pre>
            </details>
          `
        : null}
    </section>
  `;
}
