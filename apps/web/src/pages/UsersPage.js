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
      eyebrow="Usuarios"
      title=${copy.title}
      description=${copy.subtitle}
      stats=${[
        { label: "Colaboradores", value: totalUsers },
        { label: "Admins", value: admins },
        { label: "Nivel ouro", value: goldUsers }
      ]}
    >
      <${Section}
        title="Diretorio da equipe"
        description="Selecione um colaborador para navegar entre perfil, ranking e historico."
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
              title="Nenhum usuario encontrado"
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
        subtitle: "Veja quem lidera a pontuacao e abra o perfil de qualquer colaborador."
      };
    case "profile":
      return {
        title: "Perfil do usuario",
        subtitle: "Acompanhe nivel atual, pontuacao, progresso e acesso aos premium."
      };
    case "history":
      return {
        title: "Historico de leitura",
        subtitle: "Consulte emprestimos e devolucoes ja registrados para cada usuario."
      };
    default:
      return {
        title: "Usuarios",
        subtitle: "Selecione um colaborador para navegar entre perfil, ranking e historico."
      };
  }
}
