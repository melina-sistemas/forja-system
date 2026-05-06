import { createLoanApiClient } from "../../services/loan-api.js";
import { ResultPanel } from "../../components/ResultPanel.js";
import { calculateAnswerQuality } from "../reports/answer-quality.js";

import React, { useEffect, useMemo, useState } from "react";
import htm from "htm";

const html = htm.bind(React.createElement);

export function ReturnForm({
  apiBaseUrl,
  activeLoans,
  users,
  books,
  loadingCatalog,
  onSuccess
}) {
  const [form, setForm] = useState({
    loanId: "",
    learning: "",
    application: "",
    example: ""
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const qualityPreview = useMemo(
    () =>
      calculateAnswerQuality({
        learning: form.learning,
        application: form.application,
        example: form.example
      }),
    [form.application, form.example, form.learning]
  );

  const loanOptions = useMemo(
    () =>
      activeLoans.map((loan) => {
        const user = users.find((item) => item.id === loan.userId);
        const book = books.find((item) => item.id === loan.bookId);

        return {
          id: loan.id,
          label: `${user?.name ?? loan.userId} - ${book?.title ?? loan.bookId}`,
          dueAt: loan.dueAt
        };
      }),
    [activeLoans, users, books]
  );
  const selectedLoan = loanOptions.find((loan) => loan.id === form.loanId) ?? null;

  useEffect(() => {
    const selectedLoanIsValid = loanOptions.some(
      (loan) => loan.id === form.loanId
    );

    if (!selectedLoanIsValid) {
      setForm((current) => ({
        ...current,
        loanId: loanOptions[0]?.id ?? ""
      }));
    }
  }, [form.loanId, loanOptions]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const client = createLoanApiClient(apiBaseUrl);
      const response = await client.returnLoan({
        loanId: form.loanId,
        answers: {
          learning: form.learning,
          application: form.application,
          example: form.example
        }
      });

      if (!response.success) {
        setError(response);
        return;
      }

      setResult(response);
      setForm((current) => ({
        ...current,
        loanId: "",
        learning: "",
        application: "",
        example: ""
      }));
      await onSuccess?.();
    } catch (submitError) {
      setError({
        success: false,
        error: {
          code: "network_error",
          message: submitError instanceof Error ? submitError.message : String(submitError)
        }
      });
    } finally {
      setLoading(false);
    }
  }

  return html`
    <section className="card card-accent">
      <div className="card-top">
        <p className="section-tag">Tela de devolucao</p>
        <h2>Devolver livro</h2>
        <p>
          Agora a tela lista apenas os emprestimos ativos. Voce escolhe um item
          da lista e o sistema usa o ID do emprestimo internamente.
        </p>
      </div>

      <form className="form-stack" onSubmit=${handleSubmit}>
        <label>
          <span>Emprestimo ativo</span>
          <select
            value=${form.loanId}
            onChange=${(event) =>
              setForm((current) => ({ ...current, loanId: event.target.value }))}
            disabled=${loadingCatalog || loanOptions.length === 0 || loading}
          >
            ${loanOptions.length === 0
              ? html`<option value="">Nenhum emprestimo ativo</option>`
              : loanOptions.map(
                  (loan) => html`
                    <option key=${loan.id} value=${loan.id}>
                      ${loan.label}
                    </option>
                  `
                )}
          </select>
        </label>

        ${form.loanId
          ? html`
              <p className="helper-text">
                Prazo deste emprestimo:
                ${selectedLoan
                  ? new Date(selectedLoan.dueAt).toLocaleString("pt-BR")
                  : "nao encontrado"}
              </p>
            `
          : html`<p className="helper-text">Crie um emprestimo para liberar a devolucao nesta tela.</p>`}

        <label>
          <span>learning</span>
          <textarea
            rows="3"
            value=${form.learning}
            onChange=${(event) =>
              setForm((current) => ({ ...current, learning: event.target.value }))}
            placeholder="O que a pessoa aprendeu com a leitura?"
          ></textarea>
        </label>

        <label>
          <span>application</span>
          <textarea
            rows="3"
            value=${form.application}
            onChange=${(event) =>
              setForm((current) => ({ ...current, application: event.target.value }))}
            placeholder="Como isso sera aplicado no trabalho?"
          ></textarea>
        </label>

        <label>
          <span>example</span>
          <textarea
            rows="3"
            value=${form.example}
            onChange=${(event) =>
              setForm((current) => ({ ...current, example: event.target.value }))}
            placeholder="Digite um exemplo pratico."
          ></textarea>
        </label>

        <section className="quality-preview">
          <div className="quality-preview-header">
            <div>
              <span className="metric-label">Preview de qualidade</span>
              <strong>Estimativa ${qualityPreview.score}/10</strong>
            </div>
            <span className=${`quality-pill ${qualityPreview.label.toLowerCase()}`}>
              ${qualityPreview.label}
            </span>
          </div>

          <div className="quality-messages">
            ${qualityPreview.messages.map(
              (item) => html`
                <div key=${`${item.field}-${item.label}`} className=${`quality-message ${item.status}`}>
                  <strong>${item.label}</strong>
                  <span>${item.message}</span>
                </div>
              `
            )}
          </div>
        </section>

        <button type="submit" disabled=${loading || !form.loanId}>
          ${loading ? "Enviando..." : "Devolver livro"}
        </button>
      </form>

      ${result
        ? html`
            <${ResultPanel}
              title="Resultado da devolucao"
              status="success"
              raw=${result}
            >
              <div className="metric-grid">
                <div>
                  <span className="metric-label">Status</span>
                  <strong>${result.data.loan.status}</strong>
                </div>
                <div>
                  <span className="metric-label">Score</span>
                  <strong>${result.data.scoreBreakdown.totalPoints}</strong>
                </div>
                <div>
                  <span className="metric-label">Atraso</span>
                  <strong>${result.data.scoreBreakdown.daysLate} dia(s)</strong>
                </div>
                <div>
                  <span className="metric-label">No prazo</span>
                  <strong>${result.data.scoreBreakdown.isLate ? "Nao" : "Sim"}</strong>
                </div>
                <div>
                  <span className="metric-label">Usuario</span>
                  <strong>${result.data.user.name}</strong>
                </div>
                <div>
                  <span className="metric-label">Livro</span>
                  <strong>${result.data.book.title}</strong>
                </div>
              </div>
            </${ResultPanel}>
          `
        : null}

      ${error
        ? html`
            <${ResultPanel}
              title="Erro na devolucao"
              status="error"
              raw=${error}
            >
              <p>${error.error.message}</p>
              ${error.error.details?.tooShortFields?.length
                ? html`
                    <p className="helper-text error-text">
                      Campos curtos demais:
                      ${error.error.details.tooShortFields.join(", ")}
                    </p>
                  `
                : null}
              ${typeof error.error.details?.qualityScore === "number"
                ? html`
                    <p className="helper-text">
                      Nota de qualidade atual: ${error.error.details.qualityScore}/10
                    </p>
                  `
                : null}
            </${ResultPanel}>
          `
        : null}
    </section>
  `;
}
