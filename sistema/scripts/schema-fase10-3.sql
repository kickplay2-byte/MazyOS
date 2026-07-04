-- Fase 10.3 — Montador Assistido de Minutas
-- Idempotente: pode ser re-executado sem erro

create table if not exists public.minutas_assistidas (
  id   text primary key,
  data jsonb not null
);

create index if not exists minutas_assistidas_data_gin
  on public.minutas_assistidas using gin (data);

-- RLS desabilitado para seed inicial; aplicar BLOCO 16 de rls-minimo-authenticated.sql após seed
