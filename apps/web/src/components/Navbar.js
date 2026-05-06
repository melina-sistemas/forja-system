import React from "react";
import htm from "htm";
import { Link, NavLink } from "react-router-dom";

const html = htm.bind(React.createElement);

const MENU_GROUPS = [
  {
    label: "Livros",
    to: "/livros",
    items: [
      { label: "Todos os livros", to: "/livros/todos" },
      { label: "Disponiveis", to: "/livros/disponiveis" },
      { label: "Emprestados", to: "/livros/emprestados" },
      { label: "Premium", to: "/livros/premium" }
    ]
  },
  {
    label: "Usuarios",
    to: "/usuarios",
    items: [
      { label: "Ranking", to: "/usuarios/ranking" },
      { label: "Perfil", to: "/usuarios/perfil" },
      { label: "Historico", to: "/usuarios/historico" }
    ]
  },
  {
    label: "Desempenho",
    to: "/desempenho",
    items: [
      { label: "Metricas gerais", to: "/desempenho/metricas-gerais" },
      { label: "Evolucao", to: "/desempenho/evolucao" }
    ]
  },
  {
    label: "Relatorios",
    to: "/relatorios",
    items: [
      { label: "Dashboard", to: "/relatorios/dashboard" },
      { label: "Qualidade das respostas", to: "/relatorios/qualidade-respostas" }
    ]
  }
];

const ADMIN_GROUP = {
  label: "Admin",
  to: "/admin/books",
  items: [
    { label: "Livros", to: "/admin/books" },
    { label: "Solicitacoes", to: "/admin/requests" },
    { label: "Usuarios", to: "/admin/users" },
    { label: "Regras", to: "/admin/rules" },
    { label: "Gamificacao", to: "/admin/gamification" },
    { label: "Emprestimos", to: "/admin/loans" },
    { label: "Monitoramento", to: "/admin/monitoring" },
    { label: "Configuracoes", to: "/admin/settings" }
  ]
};

export function Navbar({ currentUser }) {
  const menuGroups =
    currentUser?.role === "admin" ? [...MENU_GROUPS, ADMIN_GROUP] : MENU_GROUPS;

  return html`
    <div className="header-top">
      <div className="logo-container">
        <${Link} to="/livros" className="brand-link">
          <img className="logo-img" src="/forja-icon.png" alt="Forja" />
          <span className="logo-text">
            <span className="light">FOR</span><span className="bold">JA</span>
          </span>
        <//>
      </div>

      <div className="header-actions">
        <${Link} to="/entrar" className="auth-link">
          Entrar
        <//>
        <${Link} to="/cadastrar" className="auth-link auth-link-strong">
          Cadastrar
        <//>
      </div>
    </div>

    <nav className="nav">
      ${menuGroups.map(
        (group) => html`
          <div key=${group.label} className="nav-item">
            <${NavLink}
              to=${group.to}
              className=${({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              ${group.label}
            <//>
            <div className="dropdown">
              ${group.items.map(
                (item) => html`
                  <${NavLink}
                    key=${item.to}
                    className=${({ isActive }) =>
                      `dropdown-item ${isActive ? "active" : ""}`}
                    to=${item.to}
                  >
                    ${item.label}
                  <//>
                `
              )}
            </div>
          </div>
        `
      )}
    </nav>
  `;
}
