-- PIPE OS — RLS Mínimo para Uso Interno Autenticado
-- Fase 8.1 — Aplicar no Supabase SQL Editor
-- ══════════════════════════════════════════════════════════════════════════════
--
-- NOTA (Fase 11B): este script foi superado por scripts/rls-role-based.sql,
-- que implementa policies granulares por role (admin/advogado/assistente/comercial).
-- Execute rls-role-based.sql APÓS este para habilitar o RLS por role.
-- Para reverter para authenticated full access, use rls-rollback-authenticated.sql.
--
-- OBJETIVO: bloquear anon, liberar authenticated em todas as tabelas.
-- ESTRATÉGIA: single-tenant, sem multi-role por ora. Todos os usuários
--             autenticados têm acesso completo às tabelas operacionais.
--
-- COMO USAR:
--   1. Abra o Supabase Dashboard → SQL Editor → New query
--   2. Cole este arquivo inteiro e clique em Run
--   3. Confirme que não houve erros
--   4. Teste o app autenticado (todas as páginas devem carregar normalmente)
--
-- IDEMPOTENTE: pode ser re-executado sem efeito colateral.
--
-- PRÉ-REQUISITO: rodar schema.sql antes para criar a tabela profiles e o trigger.
-- ══════════════════════════════════════════════════════════════════════════════


-- ── BLOCO 1: profiles ────────────────────────────────────────────────────────
-- Tabela relacional (FK para auth.users). Requer políticas mais restritas.

alter table public.profiles enable row level security;

revoke all on public.profiles from anon;

-- Todos os autenticados podem ler todos os profiles
-- (necessário para exibir nomes no app sem joins na schema auth)
drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated" on public.profiles
  for select to authenticated
  using (true);

-- Usuário só pode atualizar o próprio profile
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());


-- ── BLOCO 2: processos ───────────────────────────────────────────────────────

alter table public.processos enable row level security;
revoke all on public.processos from anon;
grant all on public.processos to authenticated;

drop policy if exists "op_full_processos" on public.processos;
create policy "op_full_processos" on public.processos
  for all to authenticated using (true) with check (true);


-- ── BLOCO 3: consultorias ────────────────────────────────────────────────────

alter table public.consultorias enable row level security;
revoke all on public.consultorias from anon;
grant all on public.consultorias to authenticated;

drop policy if exists "op_full_consultorias" on public.consultorias;
create policy "op_full_consultorias" on public.consultorias
  for all to authenticated using (true) with check (true);


-- ── BLOCO 4: extrajudiciais ──────────────────────────────────────────────────

alter table public.extrajudiciais enable row level security;
revoke all on public.extrajudiciais from anon;
grant all on public.extrajudiciais to authenticated;

drop policy if exists "op_full_extrajudiciais" on public.extrajudiciais;
create policy "op_full_extrajudiciais" on public.extrajudiciais
  for all to authenticated using (true) with check (true);


-- ── BLOCO 5: imobiliarias ────────────────────────────────────────────────────

alter table public.imobiliarias enable row level security;
revoke all on public.imobiliarias from anon;
grant all on public.imobiliarias to authenticated;

drop policy if exists "op_full_imobiliarias" on public.imobiliarias;
create policy "op_full_imobiliarias" on public.imobiliarias
  for all to authenticated using (true) with check (true);


-- ── BLOCO 6: corretores ──────────────────────────────────────────────────────

alter table public.corretores enable row level security;
revoke all on public.corretores from anon;
grant all on public.corretores to authenticated;

drop policy if exists "op_full_corretores" on public.corretores;
create policy "op_full_corretores" on public.corretores
  for all to authenticated using (true) with check (true);


-- ── BLOCO 7: clientes ────────────────────────────────────────────────────────

alter table public.clientes enable row level security;
revoke all on public.clientes from anon;
grant all on public.clientes to authenticated;

drop policy if exists "op_full_clientes" on public.clientes;
create policy "op_full_clientes" on public.clientes
  for all to authenticated using (true) with check (true);


-- ── BLOCO 8: oportunidades ───────────────────────────────────────────────────

alter table public.oportunidades enable row level security;
revoke all on public.oportunidades from anon;
grant all on public.oportunidades to authenticated;

drop policy if exists "op_full_oportunidades" on public.oportunidades;
create policy "op_full_oportunidades" on public.oportunidades
  for all to authenticated using (true) with check (true);


-- ── BLOCO 9: propostas ───────────────────────────────────────────────────────

alter table public.propostas enable row level security;
revoke all on public.propostas from anon;
grant all on public.propostas to authenticated;

drop policy if exists "op_full_propostas" on public.propostas;
create policy "op_full_propostas" on public.propostas
  for all to authenticated using (true) with check (true);


-- ── BLOCO 10: tarefas ────────────────────────────────────────────────────────

alter table public.tarefas enable row level security;
revoke all on public.tarefas from anon;
grant all on public.tarefas to authenticated;

drop policy if exists "op_full_tarefas" on public.tarefas;
create policy "op_full_tarefas" on public.tarefas
  for all to authenticated using (true) with check (true);


-- ── BLOCO 11: arquivos ───────────────────────────────────────────────────────

alter table public.arquivos enable row level security;
revoke all on public.arquivos from anon;
grant all on public.arquivos to authenticated;

drop policy if exists "op_full_arquivos" on public.arquivos;
create policy "op_full_arquivos" on public.arquivos
  for all to authenticated using (true) with check (true);


-- ── BLOCO 12: modelos_juridicos (Fase 10) ────────────────────────────────────

alter table public.modelos_juridicos enable row level security;
revoke all on public.modelos_juridicos from anon;
grant all on public.modelos_juridicos to authenticated;

drop policy if exists "op_full_modelos_juridicos" on public.modelos_juridicos;
create policy "op_full_modelos_juridicos" on public.modelos_juridicos
  for all to authenticated using (true) with check (true);


-- ── BLOCO 13: clausulas_padrao (Fase 10) ─────────────────────────────────────

alter table public.clausulas_padrao enable row level security;
revoke all on public.clausulas_padrao from anon;
grant all on public.clausulas_padrao to authenticated;

drop policy if exists "op_full_clausulas_padrao" on public.clausulas_padrao;
create policy "op_full_clausulas_padrao" on public.clausulas_padrao
  for all to authenticated using (true) with check (true);


-- ── BLOCO 14: checklists_juridicos (Fase 10) ─────────────────────────────────

alter table public.checklists_juridicos enable row level security;
revoke all on public.checklists_juridicos from anon;
grant all on public.checklists_juridicos to authenticated;

drop policy if exists "op_full_checklists_juridicos" on public.checklists_juridicos;
create policy "op_full_checklists_juridicos" on public.checklists_juridicos
  for all to authenticated using (true) with check (true);


-- ── BLOCO 15: orientacoes_internas (Fase 10) ─────────────────────────────────

alter table public.orientacoes_internas enable row level security;
revoke all on public.orientacoes_internas from anon;
grant all on public.orientacoes_internas to authenticated;

drop policy if exists "op_full_orientacoes_internas" on public.orientacoes_internas;
create policy "op_full_orientacoes_internas" on public.orientacoes_internas
  for all to authenticated using (true) with check (true);


-- ── BLOCO 16: minutas_assistidas (Fase 10.3) ─────────────────────────────────

alter table public.minutas_assistidas enable row level security;
revoke all on public.minutas_assistidas from anon;
grant all on public.minutas_assistidas to authenticated;

drop policy if exists "op_full_minutas_assistidas" on public.minutas_assistidas;
create policy "op_full_minutas_assistidas" on public.minutas_assistidas
  for all to authenticated using (true) with check (true);


-- ══════════════════════════════════════════════════════════════════════════════
-- VERIFICAÇÃO (executar em query separada após o script acima)
-- ══════════════════════════════════════════════════════════════════════════════
--
-- Confirmar RLS ativo em todas as tabelas:
--
-- select tablename, rowsecurity
-- from pg_tables
-- where schemaname = 'public'
-- order by tablename;
--
-- Confirmar policies criadas:
--
-- select schemaname, tablename, policyname, roles, cmd
-- from pg_policies
-- where schemaname = 'public'
-- order by tablename, policyname;
--
-- Testar acesso como anon (deve retornar 0 rows ou erro):
--
-- set role anon;
-- select count(*) from public.processos;
-- reset role;
--
-- ══════════════════════════════════════════════════════════════════════════════
-- BACKFILL: se usuários foram criados ANTES do trigger on_auth_user_created
-- ══════════════════════════════════════════════════════════════════════════════
--
-- insert into public.profiles (id, email)
-- select id, coalesce(email, '') from auth.users
-- on conflict (id) do nothing;
--
-- ══════════════════════════════════════════════════════════════════════════════
