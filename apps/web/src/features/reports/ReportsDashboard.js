import React, { useEffect, useMemo, useState } from "react";
import htm from "htm";
import { calculateAnswerQuality } from "./answer-quality.js";

const html = htm.bind(React.createElement);
const PAGE_SIZE = 5;

export function ReportsDashboard({ users, books, loans, returns, focus = "dashboard" }) {
  const [userPage, setUserPage] = useState(1);
  const [bookPage, setBookPage] = useState(1);

  const userRows = useMemo(
    () =>
      users
        .map((user) => {
          const userReturns = returns.filter((item) => item.userId === user.id);
          const userLoans = loans.filter((loan) => loan.userId === user.id);

          return {
            id: user.id,
            name: user.name,
            completedLoans: userReturns.length,
            averageReadingDays: formatAverageDays(
              average(
                userReturns.map((item) => {
                  const loan = userLoans.find((entry) => entry.id === item.loanId);
                  return loan ? calculateReadingDays(loan.borrowedAt, item.returnedAt) : 0;
                })
              )
            ),
            score: user.readingScore,
            level: translateUserLevel(user.level)
          };
        })
        .sort((left, right) => right.score - left.score),
    [loans, returns, users]
  );

  const bookRows = useMemo(
    () =>
      books
        .map((book) => {
          const bookLoans = loans.filter((loan) => loan.bookId === book.id);
          const bookReturns = returns.filter((item) => item.bookId === book.id);
          const qualityScores = bookReturns.map((item) =>
            item.qualityScore ?? calculateAnswerQuality(item.answers).score
          );

          return {
            id: book.id,
            title: book.title,
            loansCount: bookLoans.length,
            averageQuality: formatQuality(average(qualityScores)),
            averageReadingDays: formatAverageDays(
              average(
                bookReturns.map((item) => {
                  const loan = bookLoans.find((entry) => entry.id === item.loanId);
                  return loan ? calculateReadingDays(loan.borrowedAt, item.returnedAt) : 0;
                })
              )
            )
          };
        })
        .sort((left, right) => right.loansCount - left.loansCount),
    [books, loans, returns]
  );

  const answerRows = returns
    .map((item) => {
      const quality = calculateAnswerQuality(item.answers);

      return {
        ...item,
        qualityScore: item.qualityScore ?? quality.score,
        qualityLabel: quality.label,
        userName: users.find((user) => user.id === item.userId)?.name ?? item.userId,
        bookTitle: books.find((book) => book.id === item.bookId)?.title ?? item.bookId
      };
    })
    .sort((left, right) => right.qualityScore - left.qualityScore);

  const userTotalPages = Math.max(1, Math.ceil(userRows.length / PAGE_SIZE));
  const bookTotalPages = Math.max(1, Math.ceil(bookRows.length / PAGE_SIZE));

  useEffect(() => {
    if (userPage > userTotalPages) {
      setUserPage(userTotalPages);
    }
  }, [userPage, userTotalPages]);

  useEffect(() => {
    if (bookPage > bookTotalPages) {
      setBookPage(bookTotalPages);
    }
  }, [bookPage, bookTotalPages]);

  const paginatedUserRows = useMemo(() => {
    const start = (userPage - 1) * PAGE_SIZE;
    return userRows.slice(start, start + PAGE_SIZE);
  }, [userPage, userRows]);

  const paginatedBookRows = useMemo(() => {
    const start = (bookPage - 1) * PAGE_SIZE;
    return bookRows.slice(start, start + PAGE_SIZE);
  }, [bookPage, bookRows]);

  return html`
    <section className="reports-dashboard">
      ${focus !== "quality"
        ? html`
            <div className="reports-grid">
              <article className="card">
                <div className="card-top">
                  <h3>Usuarios</h3>
                  <p>Quantidade de livros lidos, tempo medio, pontuacao e nivel.</p>
                </div>
                <div className="report-table">
                  <div className="report-row report-head">
                    <span>Usuario</span>
                    <span>Lidos</span>
                    <span>Tempo medio</span>
                    <span>Pontos</span>
                    <span>Nivel</span>
                  </div>
                  ${paginatedUserRows.map(
                    (row) => html`
                      <div key=${row.id} className="report-row">
                        <span>${row.name}</span>
                        <span>${row.completedLoans}</span>
                        <span>${row.averageReadingDays}</span>
                        <span>${row.score}</span>
                        <span>${row.level}</span>
                      </div>
                    `
                  )}
                </div>
                <div className="ranking-pagination report-pagination">
                  <span className="ranking-page-indicator">
                    Pagina ${userPage} de ${userTotalPages}
                  </span>
                  <div className="ranking-pagination-actions">
                    <button
                      type="button"
                      className="admin-secondary"
                      disabled=${userPage === 1}
                      onClick=${() => setUserPage((current) => Math.max(1, current - 1))}
                    >
                      Anterior
                    </button>
                    <button
                      type="button"
                      className="admin-secondary"
                      disabled=${userPage === userTotalPages}
                      onClick=${() => setUserPage((current) => Math.min(userTotalPages, current + 1))}
                    >
                      Proxima
                    </button>
                  </div>
                </div>
              </article>

              <article className="card card-accent">
                <div className="card-top">
                  <h3>Livros</h3>
                  <p>Emprestimos, nota media de resposta e tempo medio de leitura.</p>
                </div>
                <div className="report-table">
                  <div className="report-row report-head">
                    <span>Livro</span>
                    <span>Emprestimos</span>
                    <span>Nota media</span>
                    <span>Tempo medio</span>
                  </div>
                  ${paginatedBookRows.map(
                    (row) => html`
                      <div key=${row.id} className="report-row">
                        <span>${row.title}</span>
                        <span>${row.loansCount}</span>
                        <span>${row.averageQuality}</span>
                        <span>${row.averageReadingDays}</span>
                      </div>
                    `
                  )}
                </div>
                <div className="ranking-pagination report-pagination">
                  <span className="ranking-page-indicator">
                    Pagina ${bookPage} de ${bookTotalPages}
                  </span>
                  <div className="ranking-pagination-actions">
                    <button
                      type="button"
                      className="admin-secondary"
                      disabled=${bookPage === 1}
                      onClick=${() => setBookPage((current) => Math.max(1, current - 1))}
                    >
                      Anterior
                    </button>
                    <button
                      type="button"
                      className="admin-secondary"
                      disabled=${bookPage === bookTotalPages}
                      onClick=${() => setBookPage((current) => Math.min(bookTotalPages, current + 1))}
                    >
                      Proxima
                    </button>
                  </div>
                </div>
              </article>
            </div>
          `
        : null}

      <article className="card">
        <div className="card-top">
          <h3>Qualidade das respostas</h3>
          <p>
            A pontuacao de qualidade vai de 0 a 10 e considera preenchimento
            completo e profundidade simples do texto.
          </p>
        </div>

        <div className="answers-list">
          ${answerRows.length > 0
            ? answerRows.map(
                (row) => html`
                  <article key=${row.id} className="answer-card">
                    <div className="answer-card-top">
                      <div>
                        <strong>${row.userName}</strong>
                        <span>${row.bookTitle}</span>
                      </div>
                      <span className="quality-score">
                        ${row.qualityLabel} ${row.qualityScore}/10
                      </span>
                    </div>

                    <div className="answer-block">
                      <span className="metric-label">Learning</span>
                      <p>${row.answers.learning}</p>
                    </div>

                    <div className="answer-block">
                      <span className="metric-label">Application</span>
                      <p>${row.answers.application}</p>
                    </div>

                    <div className="answer-block">
                      <span className="metric-label">Example</span>
                      <p>${row.answers.example}</p>
                    </div>
                  </article>
                `
              )
            : html`<p className="helper-text">Nenhuma devolucao registrada ainda.</p>`}
        </div>
      </article>
    </section>
  `;
}

function calculateReadingDays(borrowedAt, returnedAt) {
  const start = new Date(borrowedAt).getTime();
  const end = new Date(returnedAt).getTime();
  const diff = Math.max(0, end - start);

  return diff / (1000 * 60 * 60 * 24);
}

function average(values) {
  const filtered = values.filter((value) => Number.isFinite(value) && value > 0);

  if (filtered.length === 0) {
    return 0;
  }

  return filtered.reduce((sum, value) => sum + value, 0) / filtered.length;
}

function formatAverageDays(value) {
  return value > 0 ? `${value.toFixed(1)} dias` : "-";
}

function formatQuality(value) {
  return value > 0 ? `${value.toFixed(1)}/10` : "-";
}

function translateUserLevel(level) {
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
