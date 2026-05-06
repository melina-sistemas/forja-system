# Backend com Supabase

Esta etapa troca o repositorio em memoria por persistencia real no Supabase.

## Estrutura criada

- `.env.example`: exemplo das variaveis de ambiente
- `supabase/schema.sql`: criacao das tabelas `users`, `books`, `loans` e `returns`
- `apps/api/src/config/load-env.js`: leitura simples do `.env`
- `apps/api/src/config/supabase-config.js`: validacao das credenciais
- `apps/api/src/modules/loans/runtime/supabase-loan-repository.js`: repositorio que fala com o REST do Supabase

## Tabelas

- `users`: usuarios da biblioteca, com nivel, score e emprestimo ativo
- `books`: livros, incluindo nivel, premium e quantidade disponivel
- `loans`: emprestimos criados e finalizados
- `returns`: devolucoes com atraso, score e respostas obrigatorias

## Como conectar o backend ao Supabase

1. Crie um projeto no Supabase.
2. No SQL Editor, execute o arquivo `supabase/schema.sql`.
3. Copie `.env.example` para `.env`.
4. Preencha:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - opcionalmente `SUPABASE_SCHEMA`
5. Suba a API.

## Variaveis de ambiente

Exemplo:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
SUPABASE_SCHEMA=public
PORT=3001
```

## Como rodar localmente

Com Node instalado:

```bash
node apps/api/src/server.js
```

Ou com o Node do workspace:

```powershell
& "C:\Users\melina.abreu\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" "C:\Users\melina.abreu\Documents\Codex\2026-04-20-quero-criar-um-sistema-web-interno\apps\api\src\server.js"
```

## Como a API passou a funcionar

- `GET /seed`: agora le `users`, `books`, `loans` e `returns` direto do banco
- `POST /loans`: busca usuario e livro no banco, aplica as regras atuais e persiste o emprestimo
- `POST /loans/:loanId/return`: busca dados no banco, aplica devolucao, atualiza score e salva tudo no banco

## Observacao importante

As regras continuam as mesmas:

- 1 livro por usuario
- prazo por nivel
- controle de atraso
- pontuacao por leitura
- respostas obrigatorias
- bloqueio de livros premium para quem nao e ouro

O que mudou foi apenas a camada de persistencia.
