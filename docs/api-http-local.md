# API HTTP Local

Esta API usa Node.js com servidor nativo e armazenamento em memoria para facilitar testes locais.

## Endpoints

### POST /loans

Cria um emprestimo.

Body:

```json
{
  "userId": "user-ana",
  "bookId": "book-clean-code"
}
```

Retorno:

- dados do emprestimo criado
- usuario atualizado
- livro atualizado

### POST /loans/:loanId/return

Finaliza um emprestimo.

Body:

```json
{
  "answers": {
    "learning": "Aprendi boas praticas de codigo.",
    "application": "Vou aplicar no modulo de emprestimos.",
    "example": "Separar validacao da camada HTTP."
  }
}
```

Retorno:

- emprestimo finalizado
- registro da devolucao
- score calculado
- usuario atualizado
- livro atualizado

## Rotas auxiliares

- `GET /health`: confirma que a API esta no ar
- `GET /seed`: mostra os dados iniciais em memoria

## Como rodar localmente

Se voce tiver Node instalado:

```bash
node apps/api/src/server.js
```

Se quiser usar o Node empacotado do workspace no Windows:

```powershell
& "C:\Users\melina.abreu\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" "C:\Users\melina.abreu\Documents\Codex\2026-04-20-quero-criar-um-sistema-web-interno\apps\api\src\server.js"
```

A API sobe em `http://localhost:3001`.

## Dados iniciais para teste

Usuarios:

- `user-ana`
- `user-bruno`

Livros:

- `book-clean-code`
- `book-refactoring`
- `book-feedback`

## Exemplo de teste rapido no PowerShell

Criar emprestimo:

```powershell
$loan = Invoke-RestMethod -Method POST -Uri "http://localhost:3001/loans" -ContentType "application/json" -Body '{"userId":"user-ana","bookId":"book-clean-code"}'
$loan.data.loan.id
```

Devolver livro:

```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3001/loans/SEU_LOAN_ID/return" -ContentType "application/json" -Body '{"answers":{"learning":"Aprendi X","application":"Vou aplicar Y","example":"Exemplo Z"}}'
```
