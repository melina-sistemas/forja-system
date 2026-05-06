# Modelo de Dominio

Este documento traduz as regras da biblioteca para entidades simples que o sistema vai usar.

## Regras aplicadas

- Cada usuario pode ter no maximo 1 emprestimo ativo por vez.
- Cada livro possui um nivel: facil, medio ou dificil.
- Alguns livros podem ser premium.
- O prazo de devolucao depende do nivel do livro.
- O sistema registra atraso na devolucao.
- O sistema registra pontuacao por leitura.
- A devolucao exige tres respostas obrigatorias: aprendizado, aplicacao e exemplo.
- Usuarios possuem nivel de acesso: bronze, silver ou gold.

## Entidades criadas

### TeamUser

Representa a pessoa da equipe que usa a biblioteca.

Campos principais:

- `readingScore`: saldo de pontos acumulados por leitura.
- `level`: nivel atual do usuario dentro da biblioteca.
- `activeLoanId`: referencia para o emprestimo atual, ajudando a garantir a regra de 1 livro por vez.
- `completedLoansCount`: quantidade de leituras concluidas.

### Book

Representa um livro disponivel na biblioteca.

Campos principais:

- `level`: define se o livro e facil, medio ou dificil.
- `isPremium`: define se o livro exige usuario gold para emprestimo.
- `totalCopies` e `availableCopies`: controlam quantidade total e disponibilidade.
- `isActive`: permite manter livros cadastrados sem necessariamente deixa-los disponiveis.

### Loan

Representa o emprestimo de um livro para um usuario.

Campos principais:

- `userId` e `bookId`: ligam usuario e livro.
- `borrowedAt` e `dueAt`: guardam retirada e prazo final.
- `status`: informa se o emprestimo esta ativo, atrasado ou devolvido.
- `levelAtLoan`: guarda o nivel do livro no momento do emprestimo.

### LoanReturn

Representa o momento da devolucao.

Campos principais:

- `isLate` e `daysLate`: registram atraso.
- `scoreAwarded`: informa quantos pontos a leitura gerou.
- `answers`: guarda as respostas obrigatorias da devolucao.

### ScoreEntry

Representa um lancamento de pontos no historico do usuario.

Campos principais:

- `points`: quantidade de pontos adicionados ou removidos.
- `reason`: motivo do lancamento, como leitura concluida ou penalidade por atraso.
- `loanId`: permite ligar a pontuacao a um emprestimo especifico.

## Regras compartilhadas

O pacote tambem passou a expor constantes comuns:

- `LIBRARY_RULES.MAX_ACTIVE_LOANS_PER_USER = 1`
- `BOOK_LEVEL_LOAN_DAYS.easy = 15`
- `BOOK_LEVEL_LOAN_DAYS.medium = 20`
- `BOOK_LEVEL_LOAN_DAYS.hard = 30`

## Observacao

A estrutura de pontuacao ficou pronta, mas a formula de calculo ainda nao foi fechada. Isso permite decidir depois, por exemplo, se livros dificeis valem mais pontos ou se atraso reduz a pontuacao.
