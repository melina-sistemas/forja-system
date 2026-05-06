# App Web

Responsavel pela interface interna da biblioteca.

## Estrutura pensada

- `src/app`: bootstrap da aplicacao e rotas.
- `src/components`: componentes reutilizaveis.
- `src/features`: telas e fluxos por dominio.
- `src/services`: consumo da API e integracoes.
- `src/styles`: tokens visuais e estilos globais.

## Primeiras telas sugeridas

- login da equipe;
- catalogo de livros;
- formulario de cadastro de livro;
- painel de emprestimos ativos.

## Interface criada nesta etapa

Foi criada uma pagina simples com duas telas:

- dashboard de relatorios
- ranking e progresso do usuario
- emprestimo de livro
- devolucao de livro
- lista visual de livros com preenchimento automatico do formulario

Arquivos principais:

- `index.html`
- `server.js`
- `src/app/App.js`
- `src/features/loans/LoanForm.js`
- `src/features/returns/ReturnForm.js`

## Como rodar localmente

1. Suba a API em `http://localhost:3001`
2. Suba o frontend em `http://localhost:3000`

Com Node instalado:

```bash
node apps/web/server.js
```

Ou com o Node do workspace no Windows:

```powershell
& "C:\Users\melina.abreu\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" "C:\Users\melina.abreu\Documents\Codex\2026-04-20-quero-criar-um-sistema-web-interno\apps\web\server.js"
```

## Como testar

- na tela de emprestimo, use `user-ana` e `book-clean-code`
- copie o `loanId` retornado
- use esse `loanId` na tela de devolucao
- preencha `learning`, `application` e `example`

## Regra premium

- usuarios possuem nivel `bronze`, `prata` ou `ouro`
- livros podem ser marcados como `premium`
- livro premium so pode ser emprestado por usuario `ouro`
- nesta base inicial, usuario com mais de `100` pontos vira `ouro`

## Relatorios

O dashboard de relatorios mostra:

- usuarios com livros lidos, tempo medio, score e nivel
- livros com emprestimos, nota media e tempo medio de leitura
- respostas de devolucao com uma nota de qualidade simples

Nota de qualidade usada no frontend:

- respostas muito curtas sao rejeitadas pela API
- respostas genericas ficam com nota baixa
- respostas detalhadas com contexto e exemplo concreto chegam perto de `10`
- no formulario de devolucao existe um preview em tempo real que orienta antes do envio, sem bloquear o botao
