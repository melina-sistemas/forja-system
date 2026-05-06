create table if not exists public.book_recommendations (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  book_id text not null references public.books(id) on delete cascade,
  cycle text not null check (cycle in ('short', 'medium', 'long')),
  priority text not null check (priority in ('required', 'recommended')),
  main_focus text not null,
  strategic_justification text not null,
  created_at timestamptz not null default now(),
  unique (user_id, book_id)
);
