# Livros Premium

Esta etapa adiciona uma regra simples de acesso a livros premium.

## O que mudou

- Usuario agora tem um campo `level`: `bronze`, `silver` ou `gold`
- Livro agora tem um campo `isPremium`
- O emprestimo verifica se o livro e premium e se o usuario ja e ouro

## Como a regra funciona

- se o livro nao for premium, qualquer usuario pode tentar pegar
- se o livro for premium, apenas usuario nivel `gold` pode concluir o emprestimo
- se o usuario ainda for `bronze` ou `silver`, a API bloqueia o emprestimo

## Como o usuario vira ouro

Foi adotada uma regra simples de pontuacao:

- `bronze`: de 0 ate 49 pontos
- `silver`: de 50 ate 100 pontos
- `gold`: acima de 100 pontos

Quando uma devolucao soma pontos suficientes, o nivel do usuario e recalculado automaticamente.

## Interface

Na tela principal:

- a lista visual mostra todos os livros
- livros premium recebem um selo visual
- ao clicar em `Pegar livro`, o formulario de emprestimo e preenchido automaticamente
- se o usuario selecionado ainda nao for ouro, a tela avisa que o emprestimo premium sera bloqueado
