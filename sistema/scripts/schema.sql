-- PIPE OS — Supabase Schema
-- Run this in the Supabase SQL Editor (dashboard → SQL Editor → New query)
-- Document-store pattern: each row is {id text PRIMARY KEY, data jsonb NOT NULL}
-- The entire TypeScript object is stored in the `data` column — no column mapping needed.
-- This avoids PostgreSQL camelCase quoting complexity and keeps migrations trivial.

-- ── Profiles (relational — auth-native, FK to auth.users) ───────────────────
-- NOT the jsonb document-store pattern. auth.users is the source of truth.

create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  nome       text not null default '',
  email      text not null default '',
  role       text not null default 'assistente'
               check (role in ('admin', 'advogado', 'assistente', 'comercial')),
  status     text not null default 'ativo'
               check (status in ('ativo', 'inativo')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create a profile row when a new user is inserted into auth.users.
-- Copies email so the app can display it without a join to auth schema.
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, coalesce(new.email, ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── Tables ───────────────────────────────────────────────────────────────────

create table if not exists processos       (id text primary key, data jsonb not null);
create table if not exists consultorias    (id text primary key, data jsonb not null);
create table if not exists extrajudiciais  (id text primary key, data jsonb not null);
create table if not exists imobiliarias    (id text primary key, data jsonb not null);
create table if not exists corretores      (id text primary key, data jsonb not null);
create table if not exists clientes        (id text primary key, data jsonb not null);
create table if not exists oportunidades   (id text primary key, data jsonb not null);
create table if not exists propostas       (id text primary key, data jsonb not null);
create table if not exists tarefas         (id text primary key, data jsonb not null);
create table if not exists arquivos        (id text primary key, data jsonb not null);

-- ── Base de Conhecimento (Fase 10) ────────────────────────────────────────────
create table if not exists modelos_juridicos    (id text primary key, data jsonb not null);
create table if not exists clausulas_padrao     (id text primary key, data jsonb not null);
create table if not exists checklists_juridicos (id text primary key, data jsonb not null);
create table if not exists orientacoes_internas (id text primary key, data jsonb not null);

-- ── Minutas Assistidas (Fase 10.3) ───────────────────────────────────────────
create table if not exists minutas_assistidas   (id text primary key, data jsonb not null);

-- ── Indexes ──────────────────────────────────────────────────────────────────
-- GIN indexes allow fast containment queries on the jsonb data column.
-- At current data volume (dozens of rows) these are optional but harmless.

create index if not exists idx_processos_data      on processos      using gin(data);
create index if not exists idx_consultorias_data   on consultorias   using gin(data);
create index if not exists idx_extrajudiciais_data on extrajudiciais using gin(data);
create index if not exists idx_imobiliarias_data   on imobiliarias   using gin(data);
create index if not exists idx_corretores_data     on corretores     using gin(data);
create index if not exists idx_clientes_data       on clientes       using gin(data);
create index if not exists idx_oportunidades_data  on oportunidades  using gin(data);
create index if not exists idx_propostas_data      on propostas      using gin(data);
create index if not exists idx_tarefas_data        on tarefas        using gin(data);
create index if not exists idx_arquivos_data       on arquivos       using gin(data);
create index if not exists idx_modelos_juridicos_data    on modelos_juridicos    using gin(data);
create index if not exists idx_clausulas_padrao_data     on clausulas_padrao     using gin(data);
create index if not exists idx_checklists_juridicos_data on checklists_juridicos using gin(data);
create index if not exists idx_orientacoes_internas_data on orientacoes_internas using gin(data);
create index if not exists idx_minutas_assistidas_data   on minutas_assistidas   using gin(data);

-- ── Row Level Security ───────────────────────────────────────────────────────
-- WARNING: RLS is disabled below. This is DEVELOPMENT ONLY.
-- Before going to production with real client data, run scripts/rls-policies.sql
-- to enable RLS and restrict access to authenticated users only.

alter table processos      disable row level security;
alter table consultorias   disable row level security;
alter table extrajudiciais disable row level security;
alter table imobiliarias   disable row level security;
alter table corretores     disable row level security;
alter table clientes       disable row level security;
alter table oportunidades  disable row level security;
alter table propostas      disable row level security;
alter table tarefas        disable row level security;
alter table arquivos       disable row level security;
alter table modelos_juridicos    disable row level security;
alter table clausulas_padrao     disable row level security;
alter table checklists_juridicos disable row level security;
alter table orientacoes_internas disable row level security;
alter table minutas_assistidas   disable row level security;

-- ── Permissions ──────────────────────────────────────────────────────────────
-- Grants full access to the anon role.
-- Safe only while RLS is disabled and the project is internal / not internet-facing.

grant all on processos      to anon;
grant all on consultorias   to anon;
grant all on extrajudiciais to anon;
grant all on imobiliarias   to anon;
grant all on corretores     to anon;
grant all on clientes       to anon;
grant all on oportunidades  to anon;
grant all on propostas      to anon;
grant all on tarefas        to anon;
grant all on arquivos       to anon;
grant all on modelos_juridicos    to anon;
grant all on clausulas_padrao     to anon;
grant all on checklists_juridicos to anon;
grant all on orientacoes_internas to anon;
grant all on minutas_assistidas   to anon;
