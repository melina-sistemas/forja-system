import React from "react";
import htm from "htm";

const html = htm.bind(React.createElement);

export function UserDirectory({ users, selectedUserId, onSelectUser }) {
  if (users.length === 0) {
    return html`
      <section className="info-card">
        <h2>Usuários</h2>
        <p className="panel-text">Nenhum usuário encontrado.</p>
      </section>
    `;
  }

  return html`
    <section className="panel-block">
      <div className="panel-header">
        <h2>Usuários</h2>
        <p className="panel-text">
          Clique em um usuário para abrir o perfil e usar este leitor nos próximos empréstimos.
        </p>
      </div>

      <div className="user-directory">
        ${users.map(
          (user) => html`
            <button
              key=${user.id}
              type="button"
              className=${`user-tile ${selectedUserId === user.id ? "active" : ""}`}
              onClick=${() => onSelectUser?.(user.id)}
            >
              <span className="user-avatar">${getInitials(user.name)}</span>
              <strong>${user.name}</strong>
              <small>${translateLevel(user.level)}</small>
              <span>${user.readingScore} pts</span>
            </button>
          `
        )}
      </div>
    </section>
  `;
}

function translateLevel(level) {
  switch (level) {
    case "bronze":
      return "Bronze";
    case "silver":
      return "Prata";
    case "gold":
      return "Ouro";
    default:
      return level;
  }
}

function getInitials(name) {
  return String(name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
