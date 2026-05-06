import React, { useEffect, useRef, useState } from "react";
import htm from "htm";
import { Link, useLocation } from "react-router-dom";

const html = htm.bind(React.createElement);

const ROUTE_COPY = [
  { match: "/admin", title: "Painel administrativo", hint: "Gerencie catalogo, regras e operacao." },
  { match: "/livros", title: "Biblioteca", hint: "Escolha o proximo livro para leitura." },
  { match: "/usuarios", title: "Usuarios", hint: "Acompanhe perfis, historicos e niveis." },
  { match: "/desempenho", title: "Desempenho", hint: "Veja score, ranking e evolucao." },
  { match: "/relatorios", title: "Relatorios", hint: "Analise dados de uso e qualidade." },
  { match: "/entrar", title: "Acesso", hint: "Entre na sua conta FORJA." },
  { match: "/cadastrar", title: "Cadastro", hint: "Crie um novo acesso." }
];

export function HeaderBar({
  currentUser,
  isAuthenticated,
  variant = "default",
  notifications = [],
  notificationCount = 0,
  searchValue = "",
  searchPlaceholder = "Buscar livros, usuarios ou relatorios",
  searchSuggestions = [],
  searchEmptyText = "Nenhum resultado encontrado.",
  searchEnabled = false,
  onSearchChange = () => {},
  onSearchSuggestionSelect = () => {},
  onNotificationAction = () => {}
}) {
  const location = useLocation();
  const copy = ROUTE_COPY.find((item) => location.pathname.startsWith(item.match)) ?? ROUTE_COPY[1];
  const initials = getInitials(currentUser?.name || "Admin");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  const shouldShowSearch = searchEnabled;

  useEffect(() => {
    if (!searchEnabled || !String(searchValue || "").trim()) {
      setIsSearchOpen(false);
    }
  }, [searchEnabled, searchValue]);

  useEffect(() => {
    if (!notificationCount) {
      setIsNotificationOpen(false);
    }
  }, [notificationCount]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!notificationRef.current) {
        return;
      }

      if (!notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    }

    globalThis.addEventListener("pointerdown", handlePointerDown);

    return () => {
      globalThis.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  if (variant === "auth") {
    return html`
      <header className="app-header auth-topbar">
        <${Link} to="/livros" className="auth-topbar-brand">
          <img className="auth-topbar-logo" src="/forja-icon.png" alt="Forja" />
          <strong>FORJA</strong>
        </${Link}>
      </header>
    `;
  }

  return html`
    <header className="app-header">
      ${shouldShowSearch
        ? html`
            <div className="header-search">
              <input
                type="search"
                placeholder=${searchPlaceholder}
                value=${searchValue}
                onInput=${(event) => {
                  onSearchChange(event.target.value);
                  if (searchEnabled) {
                    setIsSearchOpen(true);
                  }
                }}
                onFocus=${() => {
                  if (searchEnabled && searchSuggestions.length > 0) {
                    setIsSearchOpen(true);
                  }
                }}
                onBlur=${() => {
                  globalThis.setTimeout(() => {
                    setIsSearchOpen(false);
                  }, 120);
                }}
              />
              <span className="header-search-shortcut" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </span>

              ${searchEnabled && isSearchOpen
                ? html`
                    <div className="header-search-suggestions">
                      ${searchSuggestions.length > 0
                        ? searchSuggestions.map(
                            (suggestion) => html`
                              <button
                                key=${suggestion.key}
                                type="button"
                                className="header-search-suggestion"
                                onMouseDown=${(event) => event.preventDefault()}
                                onClick=${() => {
                                  onSearchSuggestionSelect(suggestion);
                                  setIsSearchOpen(false);
                                }}
                              >
                                <strong>${suggestion.title}</strong>
                                ${suggestion.subtitle
                                  ? html`<span>${suggestion.subtitle}</span>`
                                  : null}
                              </button>
                            `
                          )
                        : html`
                            <div className="header-search-empty">
                              ${searchEmptyText}
                            </div>
                          `}
                    </div>
                  `
                : null}
            </div>
          `
        : null}

      <div className="header-route-copy">
        <strong>${copy.title}</strong>
        <span>${copy.hint}</span>
      </div>

      <div className="header-right">
        ${isAuthenticated
          ? html`
              <div className="header-auth-tools">
                <div ref=${notificationRef} className="header-notifications">
                  <button
                    type="button"
                    className="header-icon-button"
                    aria-label="Notificacoes"
                    onClick=${() => setIsNotificationOpen((current) => !current)}
                  >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5"></path>
                    <path d="M10 21a2 2 0 0 0 4 0"></path>
                  </svg>
                    ${notificationCount > 0
                      ? html`<span className="header-badge">${notificationCount}</span>`
                      : null}
                  </button>

                  ${isNotificationOpen
                    ? html`
                        <div className="header-notification-popover">
                          <div className="header-notification-head">
                            <strong>Notificacoes</strong>
                            <span>${notificationCount} novas</span>
                          </div>

                          ${notifications.length > 0
                            ? notifications.slice(0, 5).map(
                                (notification) => html`
                                  <button
                                    key=${notification.id}
                                    type="button"
                                    className="header-notification-item"
                                    onClick=${() => {
                                      onNotificationAction(notification);
                                      setIsNotificationOpen(false);
                                    }}
                                  >
                                    <strong>${notification.title}</strong>
                                    <span>${notification.message}</span>
                                    ${notification.actionLabel
                                      ? html`<small>${notification.actionLabel}</small>`
                                      : null}
                                  </button>
                                `
                              )
                            : html`<div className="header-notification-empty">Nenhuma notificação nova.</div>`}
                        </div>
                      `
                    : null}
                </div>

                <div className="header-profile" tabIndex="0">
                  <span className="header-profile-avatar">${initials}</span>
                  <div className="header-profile-popover">
                    <strong>${currentUser?.name || "Admin"}</strong>
                    <span className="header-profile-level">Ouro</span>
                  </div>
                </div>
              </div>
            `
          : html`
              <div className="header-guest-actions">
                <${Link} to="/entrar" className="header-ghost-link">Entrar</${Link}>
                <${Link} to="/cadastrar" className="header-primary-link">Cadastrar</${Link}>
              </div>
            `}
      </div>
    </header>
  `;
}

function getInitials(name) {
  return String(name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
