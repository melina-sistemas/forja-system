# Arquitetura Inicial

## Visao geral

O sistema foi organizado como um monorepo simples:

- `apps/web`: frontend para uso interno da equipe.
- `apps/api`: backend com autenticacao, regras de emprestimo e persistencia.
- `packages/shared`: contratos compartilhados entre frontend e backend.

## Por que essa estrutura

- Evita duplicacao de tipos entre frontend e backend.
- Facilita crescimento por modulos.
- Permite evoluir o sistema sem misturar interface, regra de negocio e contratos.

## Modulos de negocio previstos

- `catalogo`: livros, categorias, autores, disponibilidade.
- `emprestimos`: retirada, devolucao, atraso, renovacao.
- `reservas`: fila de espera para livros indisponiveis.
- `usuarios`: perfis internos, permissoes e historico.
- `relatorios`: indicadores de uso da biblioteca.

## Decisao assumida nesta etapa

Assumimos um sistema web interno com:

- frontend em React/TypeScript;
- backend em Node.js/TypeScript;
- compartilhamento de tipos via workspace local.

Essa escolha e boa para produtividade e manutencao. Se voce preferir, no proximo passo podemos ajustar para outro stack antes de instalar qualquer dependencia.

