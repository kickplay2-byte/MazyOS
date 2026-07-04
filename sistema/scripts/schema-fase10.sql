-- PIPE OS — Schema Fase 10 (Base de Conhecimento)
-- Executar no Supabase SQL Editor ANTES de rodar o seed.
-- Idempotente: usa "create table if not exists" e "create index if not exists".
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. TABELAS
create table if not exists modelos_juridicos    (id text primary key, data jsonb not null);
create table if not exists clausulas_padrao     (id text primary key, data jsonb not null);
create table if not exists checklists_juridicos (id text primary key, data jsonb not null);
create table if not exists orientacoes_internas (id text primary key, data jsonb not null);

-- 2. ÍNDICES GIN
create index if not exists idx_modelos_juridicos_data    on modelos_juridicos    using gin(data);
create index if not exists idx_clausulas_padrao_data     on clausulas_padrao     using gin(data);
create index if not exists idx_checklists_juridicos_data on checklists_juridicos using gin(data);
create index if not exists idx_orientacoes_internas_data on orientacoes_internas using gin(data);

-- 3. DESABILITAR RLS temporariamente (seed usa anon key)
--    Execute o scripts/rls-minimo-authenticated.sql (BLOCOs 12-15) DEPOIS do seed.
alter table modelos_juridicos    disable row level security;
alter table clausulas_padrao     disable row level security;
alter table checklists_juridicos disable row level security;
alter table orientacoes_internas disable row level security;

grant all on modelos_juridicos    to anon;
grant all on clausulas_padrao     to anon;
grant all on checklists_juridicos to anon;
grant all on orientacoes_internas to anon;

-- ─────────────────────────────────────────────────────────────────────────────
-- VERIFICAÇÃO (rodar em query separada após executar acima):
-- ─────────────────────────────────────────────────────────────────────────────
-- select tablename, rowsecurity
-- from pg_tables
-- where schemaname = 'public'
-- and tablename in (
--   'modelos_juridicos', 'clausulas_padrao',
--   'checklists_juridicos', 'orientacoes_internas'
-- )
-- order by tablename;
-- ─────────────────────────────────────────────────────────────────────────────
-- APÓS O SEED, executar os BLOCOs 12-15 de scripts/rls-minimo-authenticated.sql
-- para habilitar RLS e bloquear anon.
-- ─────────────────────────────────────────────────────────────────────────────
