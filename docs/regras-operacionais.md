# Regras Operacionais

Este documento descreve como o sistema deve tomar decisoes no dia a dia da biblioteca.

## 1. Quando um emprestimo pode ser criado

Um emprestimo so pode ser criado quando:

- o usuario nao possui outro emprestimo ativo;
- o livro esta ativo no sistema;
- o livro possui pelo menos 1 copia disponivel.
- se o livro for premium, o usuario precisa ser `gold`.

Se o usuario ja estiver com um livro, o sistema deve bloquear o novo emprestimo.
Se o livro for premium e o usuario ainda nao for ouro, o sistema tambem deve bloquear.

Funcao criada:

- `canCreateLoan(user, book)`

## 2. Como a data de devolucao e calculada

O prazo e definido automaticamente com base no nivel do livro:

- `easy`: 15 dias
- `medium`: 20 dias
- `hard`: 30 dias

O sistema pega a data do emprestimo e soma a quantidade de dias correspondente ao nivel.

Funcao criada:

- `calculateDueDate(level, borrowedAt)`

## 3. Como o atraso e identificado

O atraso e identificado comparando a data limite com a data real de devolucao, ou com a data atual quando o livro ainda nao foi devolvido.

Regras:

- se ainda nao passou da data limite, o emprestimo esta `active`;
- se passou da data limite e o livro ainda nao foi devolvido, o emprestimo esta `overdue`;
- se o livro foi devolvido, o emprestimo esta `returned`.

Para a contagem de atraso, o sistema considera dias de calendario apos a data limite.

Funcoes criadas:

- `calculateDaysLate(dueAt, returnedAt)`
- `isLate(dueAt, returnedAt)`
- `getLoanStatus(loan, referenceDate)`

## 4. Como a devolucao obrigatoria e validada

A devolucao so deve ser aceita se as 3 respostas obrigatorias estiverem preenchidas:

- `learning`
- `application`
- `example`

Se qualquer uma estiver vazia, a devolucao fica invalida.
Se alguma resposta for curta demais, a devolucao tambem fica invalida.

Funcao criada:

- `validateReturnAnswers(answers)`

## 4.1 Como a qualidade das respostas e analisada

O sistema avalia `learning`, `application` e `example` com uma nota de `0 a 10`.

Regras:

- respostas muito curtas sao rejeitadas;
- respostas genericas continuam aceitas, mas recebem nota baixa;
- respostas detalhadas, com contexto e exemplo concreto, recebem nota alta.

Funcao criada:

- `analyzeReturnAnswersQuality(answers)`

## 5. Como a pontuacao e calculada

Pontuacao base por nivel:

- `easy`: 10 pontos
- `medium`: 20 pontos
- `hard`: 30 pontos

Regras adicionais:

- bonus por entrega no prazo: `+10`
- bonus por respostas completas: `+10`
- penalidade por atraso: `-2` por dia

Formula:

`pontuacao final = pontos base + bonus no prazo + bonus respostas - penalidade por atraso`

Funcao criada:

- `calculateReadingScore(level, dueAt, returnedAt, answers)`

## Exemplo simples

Livro `medium`, devolvido no prazo e com as 3 respostas preenchidas:

- base: `20`
- bonus no prazo: `10`
- bonus respostas completas: `10`
- penalidade: `0`
- total: `40`

Livro `hard`, devolvido com 3 dias de atraso e respostas completas:

- base: `30`
- bonus no prazo: `0`
- bonus respostas completas: `10`
- penalidade: `6`
- total: `34`
