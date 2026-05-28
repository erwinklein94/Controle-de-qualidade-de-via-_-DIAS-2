-- Execute este arquivo no Supabase em: SQL Editor > New query > Run.
-- Ele cria a tabela usada pelo site e mantém o RLS ligado.

create table if not exists public.app_state (
  app_key text primary key,
  tracks jsonb not null default '[]'::jsonb,
  selected_track_id text,
  saved_at text,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.app_state to anon, authenticated;

drop policy if exists "Permitir leitura do app de dormentes" on public.app_state;
drop policy if exists "Permitir inserir estado do app de dormentes" on public.app_state;
drop policy if exists "Permitir atualizar estado do app de dormentes" on public.app_state;

create policy "Permitir leitura do app de dormentes"
  on public.app_state
  for select
  to anon, authenticated
  using (app_key = 'dormentes-main');

create policy "Permitir inserir estado do app de dormentes"
  on public.app_state
  for insert
  to anon, authenticated
  with check (app_key = 'dormentes-main');

create policy "Permitir atualizar estado do app de dormentes"
  on public.app_state
  for update
  to anon, authenticated
  using (app_key = 'dormentes-main')
  with check (app_key = 'dormentes-main');
