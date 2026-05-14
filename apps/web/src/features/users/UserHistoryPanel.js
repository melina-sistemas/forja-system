import React from "react";
import htm from "htm";

const html = htm.bind(React.createElement);

export function UserHistoryPanel({
  users,
  books,
  loans,
  returns,
  selectedUserId
}) {
  const selectedUser = users.find((user) => user.id === selectedUserId) ?? users[0] ?? null;
  const userLoans = loans.filter((loan) => loan.userId === selectedUser?.id);
  const historyRows = userLoans
    .map((loan) => {
      const book = books.find((item) => item.id === loan.bookId);
      const returnRecord = returns.find((item) => item.loanId === loan.id);

      return {
        id: loan.id,
        title: book?.title ?? "Livro",
        status: returnRecord ? "Devolvido" : "Em leitura",
        borrowedAt: formatDate(loan.borrowedAt),
        returnedAt: returnRecord ? formatDate(returnRecord.returnedAt) : "Em aberto"
      };
    })
    .sort((left, right) => right.borrowedAt.localeCompare(left.borrowedAt));

  return html`
    <section className="panel-block">
      <div className="panel-header">
        <h2>Histórico</h2>
        <p className="panel-text">
          ${selectedUser
            ? `Leituras vinculadas a ${selectedUser.name}.`
            : "Selecione um usuário para ver o histórico."}
        </p>
      </div>

      ${historyRows.length > 0
        ? html`
            <div className="history-list">
              ${historyRows.map(
                (row) => html`
                  <article key=${row.id} className="history-card">
                    <strong>${row.title}</strong>
                    <span>${row.status}</span>
                    <small>Retirado em ${row.borrowedAt}</small>
                    <small>Devolucao: ${row.returnedAt}</small>
                  </article>
                `
              )}
            </div>
          `
        : html`<p className="panel-text">Nenhum histórico encontrado para este usuário.</p>`}
    </section>
  `;
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("pt-BR");
}
