import React from "react";
import htm from "htm";

const html = htm.bind(React.createElement);

export function FilterBar({ children, className = "" }) {
  return html`
    <div className=${`filter-bar ${className}`.trim()}>
      ${children}
    </div>
  `;
}
