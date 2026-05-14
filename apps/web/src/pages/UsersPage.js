import { UserDirectory } from "../features/users/UserDirectory.js";
import { UserInsights } from "../features/users/UserInsights.js";
import { UserHistoryPanel } from "../features/users/UserHistoryPanel.js";
import { PageLayout } from "../components/PageLayout.js";
import { Section } from "../components/Section.js";
import { EmptyState } from "../components/EmptyState.js";

import React from "react";
import htm from "htm";

const html = htm.bind(React.createElement);

export function UsersPage({
  view = "overview",
  users,
  books,
  loans,
  returns,
  selectedUserId,
  onSelectUser
}) {
  const content = renderView({
    view,
    users,
    books,
    loans,
    returns,
    selectedUserId,
    onSelectUser
  });
  const copy = getPageCopy(view);
  const totalUsers = users.length;
  const admins = users.filter((user) => user.role === "admin").length;
  const goldUsers = users.filter((user) => user.level === "gold").length;

  return html`
    <${PageLayout}
      eyebrow="Usuários"
      title=${copy.title}
      description=${copy.subtitle}
      stats=${[
        { label: "Colaboradores", value: totalUsers },
        { label: "Admins", value: admins },
        { label: "Nível ouro", value: goldUsers }
      ]}
    >
      <${Section}
        title="Diretório da equipe"
        description="Selecione um colaborador para navegar entre perfil, ranking e histórico."
      >
        <${UserDirectory}
          users=${users}
          selectedUserId=${selectedUserId}
          onSelectUser=${onSelectUser}
        />
      <//>

      ${users.length === 0
        ? html`
            <${EmptyState}
              title="Nenhum usuário encontrado"
              description="Quando os colaboradores forem carregados, o perfil e o ranking aparecem aqui."
            />
          `
        : content}
    <//>
  `;
}

function renderView({
  view,
  users,
  books,
  loans,
  returns,
  selectedUserId,
  onSelectUser
}) {
  switch (view) {
    case "history":
      return html`
        <${UserHistoryPanel}
          users=${users}
          books=${books}
          loans=${loans}
          returns=${returns}
          selectedUserId=${selectedUserId}
        />
      `;
    case "ranking":
    case "profile":
    default:
      return html`
        <${UserInsights}
          users=${users}
          books=${books}
          selectedUserId=${selectedUserId}
          onSelectUser=${onSelectUser}
        />
      `;
  }
}

function getPageCopy(view) {
  switch (view) {
    case "ranking":
      return {
        title: "Ranking dos leitores",
        subtitle: "Veja quem lidera a pontuação e abra o perfil de qualquer colaborador."
      };
    case "profile":
      return {
        title: "Perfil do usuário",
        subtitle: "Acompanhe nível atual, pontuação, progresso e acesso aos premium."
      };
    case "history":
      return {
        title: "Histórico de leitura",
        subtitle: "Consulte empréstimos e devoluções já registrados para cada usuário."
      };
    default:
      return {
        title: "Usuários",
        subtitle: "Selecione um colaborador para navegar entre perfil, ranking e histórico."
      };
  }
}


