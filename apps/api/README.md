# API

Responsavel pelas regras de negocio, autenticacao e persistencia do sistema.

## Estrutura pensada

- `src/modules`: modulos por dominio de negocio.
- `src/common`: utilitarios compartilhados do backend.
- `src/config`: configuracao de ambiente, banco e seguranca.

## Primeiros modulos sugeridos

- `books`;
- `loans`;
- `users`;
- `reservations`.

## API HTTP local

Nesta etapa, a API passou a usar Supabase como persistencia principal e continua com um servidor HTTP simples em Node.js:

- `POST /loans`
- `POST /loans/:loanId/return`
- `GET /health`
- `GET /seed`

## Como rodar

1. Crie um projeto no Supabase
2. Rode o SQL de [supabase/schema.sql](C:/Users/melina.abreu/Documents/Codex/2026-04-20-quero-criar-um-sistema-web-interno/supabase/schema.sql)
3. Crie um arquivo `.env` na raiz usando `.env.example`

Se voce ja tiver Node 24+ instalado:

```bash
node apps/api/src/server.js
```

Se quiser usar o Node empacotado do workspace:

```powershell
& "C:\Users\melina.abreu\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" "C:\Users\melina.abreu\Documents\Codex\2026-04-20-quero-criar-um-sistema-web-interno\apps\api\src\server.js"
```

Por padrao, a API sobe em `http://localhost:3001`.

## Dados de teste

Usuarios:

- `user-ana`
- `user-bruno`

Livros:

- `book-clean-code`
- `book-refactoring`
- `book-feedback`

Esses registros ja entram no banco pelo script SQL inicial.
