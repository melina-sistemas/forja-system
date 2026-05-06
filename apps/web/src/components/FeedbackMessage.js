import React from "react";
import htm from "htm";

const html = htm.bind(React.createElement);

export function FeedbackMessage({
  tone = "info",
  title = "",
  message = "",
  className = ""
}) {
  return html`
    <div className=${`feedback-message ${tone} ${className}`.trim()}>
      ${title ? html`<strong>${title}</strong>` : null}
      ${message ? html`<span>${message}</span>` : null}
    </div>
  `;
}
