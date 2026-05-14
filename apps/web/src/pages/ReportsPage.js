import { ReportsDashboard } from "../features/reports/ReportsDashboard.js";
import { PageLayout } from "../components/PageLayout.js";
import { Section } from "../components/Section.js";
import { EmptyState } from "../components/EmptyState.js";

import React, { useMemo, useState } from "react";
import htm from "htm";

const html = htm.bind(React.createElement);

export function ReportsPage({
  view = "dashboard",
  users,
  books,
  loans,
  returns
}) {
  const [draftPeriod, setDraftPeriod] = useState({
    startDate: "",
    endDate: ""
  });
  const [appliedPeriod, setAppliedPeriod] = useState({
    startDate: "",
    endDate: ""
  });

  const filteredLoans = useMemo(
    () =>
      loans.filter((loan) =>
        matchesPeriod(loan.borrowedAt || loan.requestedAt, appliedPeriod.startDate, appliedPeriod.endDate)
      ),
    [appliedPeriod.endDate, appliedPeriod.startDate, loans]
  );

  const filteredReturns = useMemo(
    () =>
      returns.filter((item) =>
        matchesPeriod(item.returnedAt || item.createdAt, appliedPeriod.startDate, appliedPeriod.endDate)
      ),
    [appliedPeriod.endDate, appliedPeriod.startDate, returns]
  );

  const reportUserIds = useMemo(() => {
    const ids = new Set();
    filteredLoans.forEach((loan) => ids.add(loan.userId));
    filteredReturns.forEach((item) => ids.add(item.userId));
    return ids;
  }, [filteredLoans, filteredReturns]);

  const reportBookIds = useMemo(() => {
    const ids = new Set();
    filteredLoans.forEach((loan) => ids.add(loan.bookId));
    filteredReturns.forEach((item) => ids.add(item.bookId));
    return ids;
  }, [filteredLoans, filteredReturns]);

  const filteredUsers = useMemo(
    () =>
      appliedPeriod.startDate || appliedPeriod.endDate
        ? users.filter((user) => reportUserIds.has(user.id))
        : users,
    [appliedPeriod.endDate, appliedPeriod.startDate, reportUserIds, users]
  );

  const filteredBooks = useMemo(
    () =>
      appliedPeriod.startDate || appliedPeriod.endDate
        ? books.filter((book) => reportBookIds.has(book.id))
        : books,
    [appliedPeriod.endDate, appliedPeriod.startDate, books, reportBookIds]
  );

  const copy = getPageCopy(view);
  const averageQuality = filteredReturns.length
    ? (
        filteredReturns.reduce((sum, item) => sum + Number(item.qualityScore ?? 0), 0) /
        filteredReturns.length
      ).toFixed(1)
    : "-";

  return html`
    <${PageLayout}
      eyebrow="Relatórios"
      title=${copy.title}
      description=${copy.subtitle}
      stats=${[
        { label: "Usuários analisados", value: filteredUsers.length },
        { label: "Livros no acervo", value: filteredBooks.length },
        { label: "Qualidade média", value: averageQuality === "-" ? "-" : `${averageQuality}/10` }
      ]}
    >
      ${filteredUsers.length === 0 && filteredBooks.length === 0
        ? html`
            <${EmptyState}
              title="Nenhum dado para relatório"
              description="Não encontramos dados dentro do período informado."
            />
          `
        : html`
            <${Section}
              title=${view === "quality" ? "Qualidade das respostas" : "Painel analítico"}
              description="Indicadores organizados para leitura rápida, com foco em tomada de decisão."
            >
              <form
                className="report-period-filter"
                onSubmit=${(event) => {
                  event.preventDefault();
                  setAppliedPeriod({ ...draftPeriod });
                }}
              >
                <div className="report-period-filter-copy">
                  <strong>Período do relatório</strong>
                  <span>Escolha a data inicial e final para atualizar os dados abaixo.</span>
                </div>

                <div className="report-period-filter-fields">
                  <label>
                    <span>Data inicial</span>
                    <input
                      type="date"
                      value=${draftPeriod.startDate}
                      onChange=${(event) =>
                        setDraftPeriod((current) => ({ ...current, startDate: event.target.value }))}
                    />
                  </label>

                  <label>
                    <span>Data final</span>
                    <input
                      type="date"
                      value=${draftPeriod.endDate}
                      onChange=${(event) =>
                        setDraftPeriod((current) => ({ ...current, endDate: event.target.value }))}
                    />
                  </label>
                </div>

                <div className="report-period-filter-actions">
                  <button type="submit" className="admin-primary">Aplicar filtro</button>
                </div>
              </form>

              <${ReportsDashboard}
                users=${filteredUsers}
                books=${filteredBooks}
                loans=${filteredLoans}
                returns=${filteredReturns}
                focus=${view}
              />
            <//>
          `}
    <//>
  `;
}

function matchesPeriod(dateValue, startDate, endDate) {
  if (!dateValue) {
    return !startDate && !endDate;
  }

  const baseDate = new Date(dateValue);

  if (Number.isNaN(baseDate.getTime())) {
    return false;
  }

  if (startDate) {
    const start = new Date(`${startDate}T00:00:00`);
    if (baseDate < start) {
      return false;
    }
  }

  if (endDate) {
    const end = new Date(`${endDate}T23:59:59`);
    if (baseDate > end) {
      return false;
    }
  }

  return true;
}

function getPageCopy(view) {
  switch (view) {
    case "quality":
      return {
        title: "Qualidade das respostas",
        subtitle: "Acompanhe a profundidade das devoluções e os aprendizados registrados."
      };
    default:
      return {
        title: "Dashboard de relatórios",
        subtitle: "Veja usuários, livros e qualidade das respostas em um painel único."
      };
  }
}
