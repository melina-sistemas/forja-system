import React, { useEffect, useMemo, useState } from "react";
import htm from "htm";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar.js";
import { HeaderBar } from "../components/HeaderBar.js";
import { AuthPage } from "../features/auth/AuthPage.js";
import { useAdminPanel } from "../features/admin/admin-state.js";
import { enrichBooksWithGoogleBooks } from "../services/google-books.js";
import { createLoanApiClient } from "../services/loan-api.js";
import { BooksPage } from "../pages/BooksPage.js";
import { AccountRequestSentPage } from "../pages/AccountRequestSentPage.js";
import { MyAccountPage } from "../pages/MyAccountPage.js";
import { PerformancePage } from "../pages/PerformancePage.js";
import { ReportsPage } from "../pages/ReportsPage.js";
import { AdminAccessDeniedPage } from "../pages/admin/AdminAccessDeniedPage.js";
import { AdminBooksPage } from "../pages/admin/AdminBooksPage.js";
import { AdminRequestsPage } from "../pages/admin/AdminRequestsPage.js";
import { AdminUsersPage } from "../pages/admin/AdminUsersPage.js";
import { AdminRulesPage } from "../pages/admin/AdminRulesPage.js";
import { AdminGamificationPage } from "../pages/admin/AdminGamificationPage.js";
import { AdminLoansPage } from "../pages/admin/AdminLoansPage.js";
import { AdminMonitoringPage } from "../pages/admin/AdminMonitoringPage.js";
import { AdminSettingsPage } from "../pages/admin/AdminSettingsPage.js";
import { createDevelopmentPlanCatalog } from "../data/development-plan-data.js";

const html = htm.bind(React.createElement);

const EMPTY_CATALOG = {
  users: [],
  books: [],
  loans: [],
  returns: []
};
const FALLBACK_CATALOG = normalizeCatalogPayload(createDevelopmentPlanCatalog());
const AUTH_STORAGE_KEY = "forja-auth-session-v1";
const PREVIEW_AUTO_LOGIN = true;
const PREVIEW_AUTH_USER = {
  id: "preview-admin",
  name: "Melina Abreu",
  email: "melina@powercrm.com.br",
  role: "admin",
  level: "gold",
  accessStatus: "active"
};

function normalizeAccessLevel(level) {
  const normalized = String(level ?? "").trim().toLowerCase();

  switch (normalized) {
    case "ouro":
    case "gold":
      return "gold";
    case "prata":
    case "silver":
      return "silver";
    case "bronze":
      return "bronze";
    default:
      return normalized || "bronze";
  }
}

function normalizeAuthUser(user) {
  if (!user) {
    return null;
  }

  return {
    ...user,
    level: normalizeAccessLevel(user.level)
  };
}

export function App() {
  const apiBaseUrl = getApiBaseUrl();
  const location = useLocation();
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(() => readAuthSession());
  const [suppressPreviewLogin, setSuppressPreviewLogin] = useState(false);
  const [catalog, setCatalog] = useState(EMPTY_CATALOG);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [catalogError, setCatalogError] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const isAuthRoute = location.pathname === "/entrar" || location.pathname === "/cadastrar";
  const previewAuthUser =
    authUser || (!isAuthRoute && !suppressPreviewLogin ? PREVIEW_AUTH_USER : null);
  const adminPanel = useAdminPanel(catalog, previewAuthUser, apiBaseUrl);
  const isAuthenticated = Boolean(previewAuthUser);
  const isBooksRoute = location.pathname.startsWith("/livros");
  const isUsersRoute = location.pathname.startsWith("/usuarios");
  const isReportsRoute = location.pathname.startsWith("/relatorios");
  const showHeaderSearch = isBooksRoute || isUsersRoute || isReportsRoute;
  const displayUsers = adminPanel.users;
  const displayBooks = adminPanel.books;
  const displayLoans = adminPanel.loans;
  const displayWaitlists = adminPanel.waitlists;
  const displayNotifications = adminPanel.notifications;
  const libraryBooks = useMemo(
    () => mergeBooks(catalog.books, displayBooks),
    [catalog.books, displayBooks]
  );
  const libraryLoans = useMemo(
    () => mergeLoans(catalog.loans, displayLoans),
    [catalog.loans, displayLoans]
  );
  const filteredLibraryBooks = useMemo(
    () => (isBooksRoute ? searchBooks(libraryBooks, headerSearchQuery) : libraryBooks),
    [headerSearchQuery, isBooksRoute, libraryBooks]
  );
  const filteredUsers = useMemo(
    () => (isUsersRoute ? searchUsers(displayUsers, headerSearchQuery) : displayUsers),
    [displayUsers, headerSearchQuery, isUsersRoute]
  );
  const reportsSearchData = useMemo(
    () =>
      isReportsRoute
        ? searchReportData(
            {
              users: displayUsers,
              books: displayBooks,
              loans: displayLoans,
              returns: catalog.returns
            },
            headerSearchQuery
          )
        : {
            users: displayUsers,
            books: displayBooks,
            loans: displayLoans,
            returns: catalog.returns
          },
    [catalog.returns, displayBooks, displayLoans, displayUsers, headerSearchQuery, isReportsRoute]
  );
  const headerSearchSuggestions = useMemo(
    () =>
      isBooksRoute
        ? buildBookSearchSuggestions(libraryBooks, headerSearchQuery)
        : isUsersRoute
          ? buildUserSearchSuggestions(displayUsers, headerSearchQuery)
          : isReportsRoute
            ? buildReportSearchSuggestions(
                {
                  users: displayUsers,
                  books: displayBooks,
                  returns: catalog.returns
                },
                headerSearchQuery
              )
          : [],
    [catalog.returns, displayBooks, displayUsers, headerSearchQuery, isBooksRoute, isReportsRoute, isUsersRoute, libraryBooks]
  );
  const matchedSessionUser =
    displayUsers.find((user) => user.id === authUser?.id) ||
    displayUsers.find(
      (user) => user.email && authUser?.email && user.email.toLowerCase() === authUser.email.toLowerCase()
    ) ||
    null;
  const currentReaderId = isAuthenticated
    ? selectedUserId || matchedSessionUser?.id || displayUsers[0]?.id || ""
    : "";
  const currentReader =
    isAuthenticated ? displayUsers.find((user) => user.id === currentReaderId) ?? null : null;
  const currentReaderLoans = isAuthenticated
    ? libraryLoans.filter((loan) => loan.userId === currentReaderId && loan.status !== "RETURNED")
    : [];

  const activeLoans = useMemo(
    () =>
      libraryLoans.filter(
        (loan) =>
          loan.status === "BORROWED" ||
          (loan.status !== "returned" &&
            loan.status !== "RETURNED" &&
            !loan.returnedAt)
      ),
    [libraryLoans]
  );

  const borrowerId = isAuthenticated ? currentReaderId : "";
  const visibleNotifications = useMemo(() => {
    if (!previewAuthUser) {
      return [];
    }

    return displayNotifications.filter((notification) => notification.userId === previewAuthUser.id);
  }, [displayNotifications, previewAuthUser]);
  const unreadNotificationCount = visibleNotifications.filter(
    (notification) => !notification.readAt
  ).length;

  useEffect(() => {
    writeAuthSession(authUser);
  }, [authUser]);

  useEffect(() => {
    if (
      !PREVIEW_AUTO_LOGIN ||
      suppressPreviewLogin ||
      authUser ||
      isAuthRoute ||
      displayUsers.length === 0
    ) {
      return;
    }

    const previewUser =
      displayUsers.find((user) => user.accessStatus === "active" && user.role === "admin") ||
      displayUsers.find((user) => user.accessStatus === "active") ||
      null;

    if (!previewUser) {
      return;
    }

      setAuthUser(normalizeAuthUser({
        ...previewUser,
        email: previewUser.email || "admin@forja.local"
      }));
      setSelectedUserId(previewUser.id);
  }, [authUser, displayUsers, isAuthRoute, suppressPreviewLogin]);

  useEffect(() => {
    if (!authUser || !matchedSessionUser) {
      return;
    }

    setAuthUser((current) => {
      if (!current || current.id !== matchedSessionUser.id) {
        return current;
      }

      const nextSnapshot = [
        matchedSessionUser.name,
        matchedSessionUser.email,
        matchedSessionUser.role,
        matchedSessionUser.level,
        matchedSessionUser.accessStatus,
        matchedSessionUser.company,
        matchedSessionUser.department,
        matchedSessionUser.phone,
        matchedSessionUser.birthDate,
        matchedSessionUser.cpf
      ].join("|");
      const currentSnapshot = [
        current.name,
        current.email,
        current.role,
        current.level,
        current.accessStatus,
        current.company,
        current.department,
        current.phone,
        current.birthDate,
        current.cpf
      ].join("|");

      if (nextSnapshot === currentSnapshot) {
        return current;
      }

      return { ...current, ...matchedSessionUser };
    });
  }, [authUser, matchedSessionUser]);

  useEffect(() => {
    let ignore = false;

    async function loadCatalog() {
      setLoadingCatalog(true);
      setCatalogError(null);

      try {
        const client = createLoanApiClient(apiBaseUrl);
        const data = await client.fetchSeed();
        const nextCatalog = normalizeCatalogPayload(data);

        if (!ignore) {
          setCatalog(nextCatalog);
          setLoadingCatalog(false);
        }

        const enrichedBooks = await enrichBooksWithGoogleBooks(nextCatalog.books);

        if (!ignore) {
          setCatalog((current) => ({
            ...current,
            books: enrichedBooks
          }));
        }
      } catch (error) {
        const fallbackCatalog = FALLBACK_CATALOG;

        if (!ignore) {
          setCatalog(fallbackCatalog);
          setCatalogError(null);
          setLoadingCatalog(false);
        }

        if (!import.meta.env.PROD) {
          console.warn("Falha ao carregar o catalogo remoto; usando catalogo local.", error);
        }

        const enrichedBooks = await enrichBooksWithGoogleBooks(fallbackCatalog.books);

        if (!ignore) {
          setCatalog((current) => ({
            ...current,
            books: enrichedBooks
          }));
        }
      }
    }

    loadCatalog();

    return () => {
      ignore = true;
    };
  }, [apiBaseUrl]);

  useEffect(() => {
    const stillExists = libraryBooks.some((book) => book.id === selectedBookId);

    if (!stillExists) {
      setSelectedBookId(libraryBooks[0]?.id ?? "");
    }
  }, [libraryBooks, selectedBookId]);

  useEffect(() => {
    const stillExists = displayUsers.some((user) => user.id === selectedUserId);

    if (!stillExists) {
      setSelectedUserId(displayUsers[0]?.id ?? "");
    }
  }, [displayUsers, selectedUserId]);

  async function refreshCatalog(preferredBookId) {
    try {
      const client = createLoanApiClient(apiBaseUrl);
      const data = await client.fetchSeed();
      const nextCatalog = normalizeCatalogPayload(data);

      setCatalog(nextCatalog);
      setCatalogError(null);

      if (preferredBookId) {
        setSelectedBookId(preferredBookId);
      }

      const enrichedBooks = await enrichBooksWithGoogleBooks(nextCatalog.books);

      setCatalog((current) => ({
        ...current,
        books: enrichedBooks
      }));
    } catch (error) {
      const fallbackCatalog = FALLBACK_CATALOG;
      setCatalog(fallbackCatalog);
      setCatalogError(null);

      const enrichedBooks = await enrichBooksWithGoogleBooks(fallbackCatalog.books);

      setCatalog((current) => ({
        ...current,
        books: enrichedBooks
      }));

      if (!import.meta.env.PROD) {
        console.warn("Falha ao atualizar o catalogo remoto; usando catalogo local.", error);
      }
    }
  }

  const commonBookPageProps = {
    activeLoans,
    borrowerId,
    loading: loadingCatalog,
    errorMessage: catalogError,
    selectedBookId,
    onSelectBook: setSelectedBookId,
    loanActions: adminPanel.actions,
    currentReader,
    currentReaderLoans,
    isAuthenticated
  };
  function handleLogin(credentials) {
    const normalizedEmail = String(credentials?.email || "").trim().toLowerCase();
    const matchedUser =
      displayUsers.find(
        (user) => String(user.email || "").trim().toLowerCase() === normalizedEmail
      ) ?? null;

    if (!matchedUser) {
      return {
        success: false,
        message: "Nao encontramos um cadastro com este e-mail."
      };
    }

    if (matchedUser.accessStatus === "pending") {
      return {
        success: false,
        message: "Seu cadastro ainda aguarda aprovacao de um administrador."
      };
    }

    if (matchedUser.accessStatus === "rejected" || matchedUser.accessStatus === "blocked") {
      return {
        success: false,
        message:
          matchedUser.accessStatus === "blocked"
            ? "Seu acesso esta bloqueado no momento. Fale com um administrador da FORJA."
            : "Seu cadastro foi recusado. Fale com um administrador da FORJA."
      };
    }

    if (String(matchedUser.password || "") !== String(credentials?.password || "")) {
      return {
        success: false,
        message: "E-mail ou senha invalidos."
      };
    }

    const nextUser = {
      ...matchedUser,
      id: matchedUser.id,
      name: matchedUser.name || buildNameFromEmail(normalizedEmail) || "Leitor FORJA",
      email: normalizedEmail || matchedUser.email || "",
      level: normalizeAccessLevel(matchedUser.level)
    };

    setSuppressPreviewLogin(false);
    setAuthUser(nextUser);
    setSelectedUserId(nextUser.id);
    navigate("/livros");

    return {
      success: true,
      message: "Login realizado com sucesso."
    };
  }

  function handleLogout() {
    setSuppressPreviewLogin(true);
    setAuthUser(null);
    setSelectedUserId("");
    navigate("/entrar");

    return {
      success: true,
      message: "Voce saiu da sua conta."
    };
  }

  function handleRegister(payload) {
    const result = adminPanel.actions.submitRegistrationRequest(payload);

    if (result.success) {
      navigate("/cadastro/solicitacao-enviada");
    }

    return result;
  }

  return html`
    <main className=${`library-app app-shell ${isAuthRoute ? "auth-screen-shell" : ""}`.trim()}>
      ${!isAuthRoute
        ? html`<${Sidebar} currentUser=${adminPanel.currentUser} isAuthenticated=${isAuthenticated} />`
        : null}

      <div className="app-main">
        <${HeaderBar}
          currentUser=${adminPanel.currentUser}
          isAuthenticated=${isAuthenticated}
          variant=${isAuthRoute ? "auth" : "default"}
          notifications=${visibleNotifications}
          notificationCount=${unreadNotificationCount}
          searchValue=${headerSearchQuery}
          searchPlaceholder=${getSearchPlaceholder(location.pathname)}
          searchSuggestions=${headerSearchSuggestions}
          searchEmptyText=${getSearchEmptyText(location.pathname)}
          searchEnabled=${showHeaderSearch}
          onSearchChange=${setHeaderSearchQuery}
          onNotificationAction=${(notification) => {
            if (notification?.actionTarget) {
              navigate(notification.actionTarget);
            }

            if (notification?.bookId) {
              setSelectedBookId(notification.bookId);
            }
          }}
          onSearchSuggestionSelect=${(suggestion) => {
            setHeaderSearchQuery(suggestion.value);
            if (suggestion.bookId) {
              setSelectedBookId(suggestion.bookId);
            }
            if (suggestion.userId) {
              setSelectedUserId(suggestion.userId);
            }
            if (!location.pathname.startsWith("/livros")) {
              if (suggestion.bookId) {
                navigate(isReportsRoute ? "/relatorios" : "/livros");
              } else if (suggestion.userId) {
                navigate(isReportsRoute ? "/relatorios" : "/usuarios");
              } else if (suggestion.reportPath) {
                navigate(suggestion.reportPath);
              }
            }
          }}
          onAuthAction=${(action) => {
            if (action === "logout") {
              handleLogout();
            }
          }}
        />

        <div className=${`app-content ${isAuthRoute ? "auth-screen-content" : ""}`.trim()}>
          <${Routes}>
          <${Route}
            path="/"
            element=${React.createElement(Navigate, { to: "/livros", replace: true })}
          />
          <${Route}
            path="/livros"
            element=${React.createElement(BooksPage, {
              ...commonBookPageProps,
              waitlists: displayWaitlists,
              notifications: visibleNotifications,
              title: "Todos os livros",
              subtitle: "Explore todo o catalogo da biblioteca e abra qualquer titulo para emprestimo.",
              books: filteredLibraryBooks
            })}
          />
          <${Route}
            path="/livros/todos"
            element=${React.createElement(BooksPage, {
              ...commonBookPageProps,
              waitlists: displayWaitlists,
              notifications: visibleNotifications,
              title: "Todos os livros",
              subtitle: "Explore todo o catalogo da biblioteca e abra qualquer titulo para emprestimo.",
              books: filteredLibraryBooks
            })}
          />
          <${Route}
            path="/livros/disponiveis"
            element=${renderProtectedPage(
              isAuthenticated,
              React.createElement(BooksPage, {
              ...commonBookPageProps,
              waitlists: displayWaitlists,
              notifications: visibleNotifications,
              title: "Livros disponiveis",
              subtitle: "Veja apenas os livros que podem ser retirados agora.",
              books: filterBooks(libraryBooks, activeLoans, "available")
            })
          )}
          />
          <${Route}
            path="/livros/emprestados"
            element=${renderProtectedPage(
              isAuthenticated,
              React.createElement(BooksPage, {
              ...commonBookPageProps,
              waitlists: displayWaitlists,
              notifications: visibleNotifications,
              title: "Livros emprestados",
              subtitle: "Acompanhe os titulos em circulacao e o prazo previsto de retorno.",
              books: filterBooks(libraryBooks, activeLoans, "borrowed")
            })
          )}
          />
          <${Route}
            path="/livros/premium"
            element=${renderProtectedPage(
              isAuthenticated,
              React.createElement(BooksPage, {
              ...commonBookPageProps,
              waitlists: displayWaitlists,
              notifications: visibleNotifications,
              title: "Livros premium",
              subtitle: "Consulte os titulos premium disponiveis para leitores com nivel ouro.",
              books: filterBooks(libraryBooks, activeLoans, "premium")
            })
          )}
          />
          <${Route}
            path="/usuarios"
            element=${renderAdminPage(
              isAuthenticated,
              adminPanel,
              React.createElement(AdminUsersPage, {
              users: filteredUsers,
              loans: adminPanel.loans,
              books: adminPanel.books,
              returns: catalog.returns,
              waitlists: displayWaitlists,
              notifications: displayNotifications,
              actions: adminPanel.actions
              })
            )}
          />
          <${Route}
            path="/minha-conta"
            element=${renderProtectedPage(
              isAuthenticated,
              React.createElement(MyAccountPage, {
              currentUser: matchedSessionUser ?? authUser,
              books: libraryBooks,
              loans: libraryLoans,
              waitlists: displayWaitlists,
              notifications: visibleNotifications,
              actions: adminPanel.actions
            })
          )}
          />
          <${Route}
            path="/usuarios/ranking"
            element=${renderAdminPage(
              isAuthenticated,
              adminPanel,
              React.createElement(AdminUsersPage, {
              users: filteredUsers,
              loans: adminPanel.loans,
              books: adminPanel.books,
              returns: catalog.returns,
              waitlists: displayWaitlists,
              notifications: displayNotifications,
              actions: adminPanel.actions
            })
          )}
          />
          <${Route}
            path="/usuarios/perfil"
            element=${renderAdminPage(
              isAuthenticated,
              adminPanel,
              React.createElement(AdminUsersPage, {
              users: filteredUsers,
              loans: adminPanel.loans,
              books: adminPanel.books,
              returns: catalog.returns,
              waitlists: displayWaitlists,
              notifications: displayNotifications,
              actions: adminPanel.actions
            })
          )}
          />
          <${Route}
            path="/usuarios/historico"
            element=${renderAdminPage(
              isAuthenticated,
              adminPanel,
              React.createElement(AdminUsersPage, {
              users: filteredUsers,
              loans: adminPanel.loans,
              books: adminPanel.books,
              returns: catalog.returns,
              waitlists: displayWaitlists,
              notifications: displayNotifications,
              actions: adminPanel.actions
            })
          )}
          />
          <${Route}
            path="/desempenho"
            element=${renderAdminPage(
              isAuthenticated,
              adminPanel,
              React.createElement(PerformancePage, {
                users: displayUsers,
                books: displayBooks,
                selectedUserId,
                onSelectUser: setSelectedUserId,
                view: "overview"
              })
            )}
          />
          <${Route}
            path="/desempenho/metricas-gerais"
            element=${renderAdminPage(
              isAuthenticated,
              adminPanel,
              React.createElement(PerformancePage, {
                users: displayUsers,
                books: displayBooks,
                selectedUserId,
                onSelectUser: setSelectedUserId,
                view: "metrics"
              })
            )}
          />
          <${Route}
            path="/desempenho/evolucao"
            element=${renderAdminPage(
              isAuthenticated,
              adminPanel,
              React.createElement(PerformancePage, {
                users: displayUsers,
                books: displayBooks,
                selectedUserId,
                onSelectUser: setSelectedUserId,
                view: "evolution"
              })
            )}
          />
          <${Route}
            path="/relatorios"
            element=${renderAdminPage(
              isAuthenticated,
              adminPanel,
              React.createElement(ReportsPage, {
                users: reportsSearchData.users,
                books: reportsSearchData.books,
                loans: reportsSearchData.loans,
                returns: reportsSearchData.returns,
                view: "dashboard"
              })
            )}
          />
          <${Route}
            path="/relatorios/dashboard"
            element=${renderAdminPage(
              isAuthenticated,
              adminPanel,
              React.createElement(ReportsPage, {
                users: reportsSearchData.users,
                books: reportsSearchData.books,
                loans: reportsSearchData.loans,
                returns: reportsSearchData.returns,
                view: "dashboard"
              })
            )}
          />
          <${Route}
            path="/relatorios/qualidade-respostas"
            element=${renderAdminPage(
              isAuthenticated,
              adminPanel,
              React.createElement(ReportsPage, {
                users: reportsSearchData.users,
                books: reportsSearchData.books,
                loans: reportsSearchData.loans,
                returns: reportsSearchData.returns,
                view: "quality"
              })
            )}
          />
          <${Route}
            path="/entrar"
            element=${isAuthenticated
              ? React.createElement(Navigate, { to: "/livros", replace: true })
              : React.createElement(AuthPage, {
                  mode: "login",
                  onLogin: handleLogin,
                  onRegister: handleRegister,
                  onModeChange: (nextMode) =>
                    navigate(nextMode === "login" ? "/entrar" : "/cadastrar"),
                  onClose: () => navigate("/livros")
                })}
          />
          <${Route}
            path="/cadastrar"
            element=${isAuthenticated
              ? React.createElement(Navigate, { to: "/livros", replace: true })
              : React.createElement(AuthPage, {
                  mode: "register",
                  onLogin: handleLogin,
                  onRegister: handleRegister,
                  onModeChange: (nextMode) =>
                    navigate(nextMode === "register" ? "/cadastrar" : "/entrar"),
                  onClose: () => navigate("/livros")
                })}
          />
          <${Route}
            path="/cadastro/solicitacao-enviada"
            element=${React.createElement(AccountRequestSentPage)}
          />
          <${Route}
            path="/admin"
            element=${React.createElement(Navigate, {
              to: isAuthenticated ? "/admin/books" : "/livros",
              replace: true
            })}
          />
          <${Route}
            path="/admin/books"
            element=${renderAdminPage(
              isAuthenticated,
              adminPanel,
              React.createElement(AdminBooksPage, {
                books: adminPanel.books,
                users: adminPanel.users,
                loans: adminPanel.loans,
                actions: adminPanel.actions,
                apiBaseUrl
              })
            )}
          />
          <${Route}
            path="/admin/requests"
            element=${renderAdminPage(
              isAuthenticated,
              adminPanel,
              React.createElement(AdminRequestsPage, {
                loans: adminPanel.loans,
                books: adminPanel.books,
                users: adminPanel.users,
                actions: adminPanel.actions
              })
            )}
          />
          <${Route}
            path="/admin/users"
            element=${renderAdminPage(
              isAuthenticated,
              adminPanel,
              React.createElement(AdminUsersPage, {
                users: adminPanel.users,
                loans: adminPanel.loans,
                books: adminPanel.books,
                actions: adminPanel.actions
              })
            )}
          />
          <${Route}
            path="/admin/rules"
            element=${renderAdminPage(
              isAuthenticated,
              adminPanel,
              React.createElement(AdminRulesPage, {
                rules: adminPanel.rules,
                actions: adminPanel.actions
              })
            )}
          />
          <${Route}
            path="/admin/gamification"
            element=${renderAdminPage(
              isAuthenticated,
              adminPanel,
              React.createElement(AdminGamificationPage, {
                gamification: adminPanel.gamification,
                actions: adminPanel.actions
              })
            )}
          />
          <${Route}
            path="/admin/loans"
            element=${renderAdminPage(
              isAuthenticated,
              adminPanel,
              React.createElement(AdminLoansPage, {
                loans: adminPanel.loans,
                books: adminPanel.books,
                users: adminPanel.users,
                actions: adminPanel.actions
              })
            )}
          />
          <${Route}
            path="/admin/monitoring"
            element=${renderAdminPage(
              isAuthenticated,
              adminPanel,
              React.createElement(AdminMonitoringPage, {
                monitoring: adminPanel.monitoring
              })
            )}
          />
          <${Route}
            path="/admin/settings"
            element=${renderAdminPage(
              isAuthenticated,
              adminPanel,
              React.createElement(AdminSettingsPage, {
                settings: adminPanel.settings,
                actions: adminPanel.actions
              })
            )}
          />
          <${Route}
            path="*"
            element=${React.createElement(Navigate, { to: "/livros", replace: true })}
          />
          <//>
        </div>
      </div>
    </main>
  `;
}

export default App;

function renderProtectedPage(isAuthenticated, page) {
  if (!isAuthenticated) {
    return React.createElement(Navigate, { to: "/livros", replace: true });
  }

  return page;
}

function renderAdminPage(isAuthenticated, adminPanel, page) {
  if (!isAuthenticated) {
    return React.createElement(Navigate, { to: "/livros", replace: true });
  }

  if (adminPanel.currentUser?.role !== "admin" || !adminPanel.isAdmin) {
    return React.createElement(AdminAccessDeniedPage);
  }

  return page;
}

function readAuthSession() {
  try {
    const raw = globalThis.localStorage?.getItem(AUTH_STORAGE_KEY);

    return raw ? normalizeAuthUser(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function writeAuthSession(authUser) {
  try {
    if (!globalThis.localStorage) {
      return;
    }

    if (authUser) {
      globalThis.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    } else {
      globalThis.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    // noop
  }
}

function buildNameFromEmail(email) {
  if (!email) {
    return "";
  }

  const localPart = email.split("@")[0] || "";

  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getApiBaseUrl() {
  return "/api";
}

function normalizeCatalogPayload(data) {
  return {
    users: Array.isArray(data?.users) ? data.users : [],
    books: Array.isArray(data?.books) ? data.books : [],
    loans: Array.isArray(data?.loans) ? data.loans : [],
    returns: Array.isArray(data?.returns) ? data.returns : []
  };
}

function mergeBooks(primaryBooks = [], secondaryBooks = []) {
  const merged = new Map();

  for (const book of primaryBooks) {
    const normalized = { ...book };
    merged.set(buildBookMergeKey(normalized), normalized);
  }

  for (const book of secondaryBooks) {
    const normalized = { ...book };
    merged.set(buildBookMergeKey(normalized), normalized);
  }

  return Array.from(merged.values());
}

function mergeLoans(primaryLoans = [], secondaryLoans = []) {
  const merged = new Map();

  for (const loan of primaryLoans) {
    merged.set(String(loan.id ?? buildLoanMergeKey(loan)), { ...loan });
  }

  for (const loan of secondaryLoans) {
    merged.set(String(loan.id ?? buildLoanMergeKey(loan)), { ...loan });
  }

  return Array.from(merged.values());
}

function buildBookMergeKey(book) {
  return String(book.id ?? `${book.title ?? ""}:${book.author ?? ""}`).toLowerCase();
}

function buildLoanMergeKey(loan) {
  return `${loan.userId ?? ""}:${loan.bookId ?? ""}:${loan.status ?? ""}:${loan.requestedAt ?? ""}`.toLowerCase();
}

function getSearchPlaceholder(pathname) {
  if (pathname.startsWith("/admin/books")) {
    return "Buscar livros por titulo, autor ou categoria";
  }

  if (pathname.startsWith("/livros")) {
    return "Buscar livros por titulo, autor ou categoria";
  }

  if (pathname.startsWith("/usuarios")) {
    return "Buscar usuarios por nome, e-mail ou setor";
  }

  if (pathname.startsWith("/desempenho")) {
    return "Buscar metricas, niveis ou leitores";
  }

  if (pathname.startsWith("/relatorios")) {
    return "Buscar relatorios e indicadores";
  }

  if (pathname.startsWith("/admin")) {
    return "Buscar dados administrativos";
  }

  return "Buscar livros, usuarios ou relatorios";
}

function getSearchEmptyText(pathname) {
  if (pathname.startsWith("/admin/books")) {
    return "Nenhum livro parecido encontrado.";
  }

  if (pathname.startsWith("/livros")) {
    return "Nenhum livro parecido encontrado.";
  }

  if (pathname.startsWith("/usuarios")) {
    return "Nenhum usuario parecido encontrado.";
  }

  if (pathname.startsWith("/relatorios")) {
    return "Nenhum dado de relatorio parecido encontrado.";
  }

  return "Nenhum resultado encontrado.";
}

function searchBooks(books, query) {
  const normalizedQuery = normalizeSearch(query);

  if (!normalizedQuery) {
    return books;
  }

  return [...books]
    .map((book) => ({
      ...book,
      __score: getBookSearchScore(book, normalizedQuery)
    }))
    .filter((book) => book.__score > 0)
    .sort((left, right) => right.__score - left.__score || left.title.localeCompare(right.title, "pt-BR"))
    .map(({ __score, ...book }) => book);
}

function searchUsers(users, query) {
  const normalizedQuery = normalizeSearch(query);

  if (!normalizedQuery) {
    return users;
  }

  return [...users]
    .map((user) => ({
      ...user,
      __score: getUserSearchScore(user, normalizedQuery)
    }))
    .filter((user) => user.__score > 0)
    .sort((left, right) => right.__score - left.__score || left.name.localeCompare(right.name, "pt-BR"))
    .map(({ __score, ...user }) => user);
}

function buildBookSearchSuggestions(books, query) {
  const normalizedQuery = normalizeSearch(query);

  if (!normalizedQuery) {
    return [];
  }

  return searchBooks(books, query)
    .slice(0, 6)
    .map((book) => ({
      key: `book-${book.id}`,
      value: book.title,
      bookId: book.id,
      title: book.title,
      subtitle: [book.author, book.category].filter(Boolean).join(" • ")
    }));
}

function buildUserSearchSuggestions(users, query) {
  const normalizedQuery = normalizeSearch(query);

  if (!normalizedQuery) {
    return [];
  }

  return searchUsers(users, query)
    .slice(0, 6)
    .map((user) => ({
      key: `user-${user.id}`,
      value: user.name,
      userId: user.id,
      title: user.name,
      subtitle: [user.email, user.department].filter(Boolean).join(" • ")
    }));
}

function searchReportData(data, query) {
  const normalizedQuery = normalizeSearch(query);

  if (!normalizedQuery) {
    return data;
  }

  const directUsers = searchUsers(data.users, query);
  const directBooks = searchBooks(data.books, query);
  const matchingReturns = data.returns.filter((item) => {
    const user = data.users.find((entry) => entry.id === item.userId);
    const book = data.books.find((entry) => entry.id === item.bookId);
    const answersText = normalizeSearch(
      [item.answers?.learning, item.answers?.application, item.answers?.example]
        .filter(Boolean)
        .join(" ")
    );

    return (
      getUserSearchScore(user ?? {}, normalizedQuery) > 0 ||
      getBookSearchScore(book ?? {}, normalizedQuery) > 0 ||
      answersText.includes(normalizedQuery)
    );
  });

  const userIds = new Set(directUsers.map((user) => user.id));
  const bookIds = new Set(directBooks.map((book) => book.id));

  matchingReturns.forEach((item) => {
    userIds.add(item.userId);
    bookIds.add(item.bookId);
  });

  return {
    users: data.users.filter((user) => userIds.has(user.id)),
    books: data.books.filter((book) => bookIds.has(book.id)),
    loans: data.loans.filter((loan) => userIds.has(loan.userId) || bookIds.has(loan.bookId)),
    returns: matchingReturns
  };
}

function buildReportSearchSuggestions(data, query) {
  const normalizedQuery = normalizeSearch(query);

  if (!normalizedQuery) {
    return [];
  }

  const userSuggestions = searchUsers(data.users, query)
    .slice(0, 3)
    .map((user) => ({
      key: `report-user-${user.id}`,
      value: user.name,
      userId: user.id,
      title: `Usuario: ${user.name}`,
      subtitle: [user.email, user.department].filter(Boolean).join(" â€¢ ")
    }));

  const bookSuggestions = searchBooks(data.books, query)
    .slice(0, 3)
    .map((book) => ({
      key: `report-book-${book.id}`,
      value: book.title,
      bookId: book.id,
      title: `Livro: ${book.title}`,
      subtitle: [book.author, book.category].filter(Boolean).join(" â€¢ ")
    }));

  const answerSuggestions = data.returns
    .filter((item) =>
      normalizeSearch(
        [item.answers?.learning, item.answers?.application, item.answers?.example]
          .filter(Boolean)
          .join(" ")
      ).includes(normalizedQuery)
    )
    .slice(0, 2)
    .map((item) => ({
      key: `report-answer-${item.id}`,
      value: booksafeTitle(data.books.find((book) => book.id === item.bookId)?.title),
      reportPath: "/relatorios/qualidade-respostas",
      title: `Resposta: ${data.users.find((user) => user.id === item.userId)?.name ?? "Usuario"}`,
      subtitle: booksafeTitle(data.books.find((book) => book.id === item.bookId)?.title)
    }));

  return [...userSuggestions, ...bookSuggestions, ...answerSuggestions].slice(0, 6);
}

function booksafeTitle(title) {
  return title || "Livro sem titulo";
}

function getBookSearchScore(book, normalizedQuery) {
  const title = normalizeSearch(book.title);
  const author = normalizeSearch(book.author);
  const category = normalizeSearch(book.category);
  const haystack = `${title} ${author} ${category}`.trim();

  if (!haystack) {
    return 0;
  }

  let score = 0;

  if (title === normalizedQuery) {
    score += 120;
  } else if (title.startsWith(normalizedQuery)) {
    score += 80;
  } else if (title.includes(normalizedQuery)) {
    score += 60;
  }

  if (author.startsWith(normalizedQuery)) {
    score += 50;
  } else if (author.includes(normalizedQuery)) {
    score += 35;
  }

  if (category.startsWith(normalizedQuery)) {
    score += 30;
  } else if (category.includes(normalizedQuery)) {
    score += 20;
  }

  const tokens = normalizedQuery.split(" ").filter(Boolean);
  if (tokens.length > 1 && tokens.every((token) => haystack.includes(token))) {
    score += 25;
  }

  return score;
}

function getUserSearchScore(user, normalizedQuery) {
  const name = normalizeSearch(user.name);
  const email = normalizeSearch(user.email);
  const department = normalizeSearch(user.department);
  const company = normalizeSearch(user.company);
  const haystack = `${name} ${email} ${department} ${company}`.trim();

  if (!haystack) {
    return 0;
  }

  let score = 0;

  if (name === normalizedQuery) {
    score += 120;
  } else if (name.startsWith(normalizedQuery)) {
    score += 80;
  } else if (name.includes(normalizedQuery)) {
    score += 60;
  }

  if (email.startsWith(normalizedQuery)) {
    score += 50;
  } else if (email.includes(normalizedQuery)) {
    score += 35;
  }

  if (department.startsWith(normalizedQuery)) {
    score += 35;
  } else if (department.includes(normalizedQuery)) {
    score += 24;
  }

  if (company.startsWith(normalizedQuery)) {
    score += 24;
  } else if (company.includes(normalizedQuery)) {
    score += 14;
  }

  const tokens = normalizedQuery.split(" ").filter(Boolean);
  if (tokens.length > 1 && tokens.every((token) => haystack.includes(token))) {
    score += 25;
  }

  return score;
}

function normalizeSearch(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function filterBooks(books, activeLoans, filter) {
  switch (filter) {
    case "available":
      return books.filter(
        (book) => Number(book.availableCopies ?? book.availableQuantity ?? 0) > 0 && book.isActive
      );
    case "borrowed":
      return books.filter((book) =>
        activeLoans.some((loan) => loan.bookId === book.id)
      );
    case "premium":
      return books.filter((book) => book.isPremium);
    default:
      return books;
  }
}
