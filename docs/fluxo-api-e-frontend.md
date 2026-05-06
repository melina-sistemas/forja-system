# Fluxo da API e Preparacao para Frontend

Este documento resume o que a API faz em cada acao e como a interface pode consumir isso depois.

## Fluxo do createLoan

Passo a passo:

1. Recebe `userId` e `bookId`.
2. Busca usuario e livro.
3. Valida se o usuario ja possui emprestimo ativo.
4. Valida se o livro esta ativo e disponivel.
5. Define a data do emprestimo.
6. Calcula automaticamente a data de devolucao com base no nivel do livro.
7. Cria o emprestimo com status `active`.
8. Atualiza o usuario para marcar que ele esta com um livro ativo.
9. Reduz a quantidade de copias disponiveis do livro.
10. Retorna os dados atualizados para a API responder ao frontend.

Arquivos:

- `apps/api/src/modules/loans/use-cases/create-loan.ts`
- `packages/shared/src/contracts/loan-api.ts`

## Fluxo do returnLoan

Passo a passo:

1. Recebe `loanId` e as respostas de devolucao.
2. Busca o emprestimo.
3. Verifica se ele ja nao foi devolvido.
4. Valida as 3 respostas obrigatorias: `learning`, `application` e `example`.
5. Busca usuario e livro ligados ao emprestimo.
6. Define a data da devolucao.
7. Calcula automaticamente se houve atraso e quantos dias.
8. Calcula a pontuacao final da leitura.
9. Cria o registro de devolucao.
10. Cria os lancamentos de score do usuario.
11. Finaliza o emprestimo com status `returned`.
12. Libera o usuario para pegar outro livro.
13. Devolve 1 copia ao estoque do livro.
14. Retorna tudo pronto para a API responder ao frontend.

Arquivos:

- `apps/api/src/modules/loans/use-cases/return-loan.ts`
- `packages/shared/src/contracts/loan-api.ts`

## Como o frontend pode se conectar depois

Os contratos compartilhados ja deixam claro o formato de entrada e saida:

- `CreateLoanRequest`
- `CreateLoanResponse`
- `ReturnLoanRequest`
- `ReturnLoanResponse`

Isso permite criar telas e formularios sem adivinhar a estrutura da API.

## Rotas sugeridas para a proxima etapa

- `POST /loans`
  Usa `CreateLoanRequest`
  Retorna `CreateLoanResult`

- `POST /loans/{loanId}/return`
  Usa `ReturnLoanRequest`
  Retorna `ReturnLoanResult`

## O que o frontend precisara enviar

Para criar emprestimo:

- `userId`
- `bookId`

Para devolver livro:

- `loanId`
- `answers.learning`
- `answers.application`
- `answers.example`

## O que o frontend recebera

Na criacao:

- emprestimo criado
- usuario atualizado
- livro atualizado

Na devolucao:

- emprestimo finalizado
- registro da devolucao
- score calculado
- usuario atualizado
- livro atualizado

## Proximo passo recomendado

O melhor passo agora e criar a camada HTTP da API e, em seguida, a primeira interface do frontend:

1. endpoints `POST /loans` e `POST /loans/{loanId}/return`
2. formulario de emprestimo
3. formulario de devolucao com as 3 respostas obrigatorias
