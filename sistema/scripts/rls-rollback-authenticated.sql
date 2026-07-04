-- ══════════════════════════════════════════════════════════════════════════════
-- PIPE OS — RLS Rollback: Voltar para Authenticated Full Access
-- ══════════════════════════════════════════════════════════════════════════════
--
-- OBJETIVO:
--   Reverter o estado das policies para o comportamento de
--   rls-minimo-authenticated.sql (authenticated com acesso total).
--
-- QUANDO USAR:
--   Se rls-role-based.sql causar problemas inesperados em produção,
--   execute este script para restaurar o acesso imediato enquanto investiga.
--
-- ATENÇÃO:
--   Após o rollback, QUALQUER usuário autenticado volta a ter acesso total
--   a todas as tabelas, independente de role ou status.
--   Use apenas como medida emergencial temporária.
--
-- IDEMPOTENTE: pode ser re-executado sem efeito colateral.
-- ══════════════════════════════════════════════════════════════════════════════


-- ── FUNÇÕES HELPER ────────────────────────────────────────────────────────────
-- Manter as funções no banco (não causam dano) mas revogar de authenticated
-- e reatribuir ao public (estado default) para limpeza:

-- Opcional: remover funções helper (descomente se quiser limpeza total)
-- drop function if exists public.current_user_role();
-- drop function if exists public.has_any_role(text[]);


-- ── PROFILES ─────────────────────────────────────────────────────────────────

-- Remover policies da Fase 11B
drop policy if exists "rb_profiles_select_own"   on public.profiles;
drop policy if exists "rb_profiles_select_admin" on public.profiles;
drop policy if exists "rb_profiles_update_admin" on public.profiles;

-- Recriar policies originais do rls-minimo-authenticated.sql
drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated" on public.profiles
  for select to authenticated
  using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());


-- ── IMOBILIÁRIAS ──────────────────────────────────────────────────────────────

drop policy if exists "rb_select_imobiliarias" on public.imobiliarias;
drop policy if exists "rb_insert_imobiliarias" on public.imobiliarias;
drop policy if exists "rb_update_imobiliarias" on public.imobiliarias;
drop policy if exists "rb_delete_imobiliarias" on public.imobiliarias;

drop policy if exists "op_full_imobiliarias" on public.imobiliarias;
create policy "op_full_imobiliarias" on public.imobiliarias
  for all to authenticated using (true) with check (true);


-- ── CORRETORES ────────────────────────────────────────────────────────────────

drop policy if exists "rb_select_corretores" on public.corretores;
drop policy if exists "rb_insert_corretores" on public.corretores;
drop policy if exists "rb_update_corretores" on public.corretores;
drop policy if exists "rb_delete_corretores" on public.corretores;

drop policy if exists "op_full_corretores" on public.corretores;
create policy "op_full_corretores" on public.corretores
  for all to authenticated using (true) with check (true);


-- ── CLIENTES ─────────────────────────────────────────────────────────────────

drop policy if exists "rb_select_clientes" on public.clientes;
drop policy if exists "rb_insert_clientes" on public.clientes;
drop policy if exists "rb_update_clientes" on public.clientes;
drop policy if exists "rb_delete_clientes" on public.clientes;

drop policy if exists "op_full_clientes" on public.clientes;
create policy "op_full_clientes" on public.clientes
  for all to authenticated using (true) with check (true);


-- ── OPORTUNIDADES ────────────────────────────────────────────────────────────

drop policy if exists "rb_select_oportunidades" on public.oportunidades;
drop policy if exists "rb_insert_oportunidades" on public.oportunidades;
drop policy if exists "rb_update_oportunidades" on public.oportunidades;
drop policy if exists "rb_delete_oportunidades" on public.oportunidades;

drop policy if exists "op_full_oportunidades" on public.oportunidades;
create policy "op_full_oportunidades" on public.oportunidades
  for all to authenticated using (true) with check (true);


-- ── PROPOSTAS ────────────────────────────────────────────────────────────────

drop policy if exists "rb_select_propostas" on public.propostas;
drop policy if exists "rb_insert_propostas" on public.propostas;
drop policy if exists "rb_update_propostas" on public.propostas;
drop policy if exists "rb_delete_propostas" on public.propostas;

drop policy if exists "op_full_propostas" on public.propostas;
create policy "op_full_propostas" on public.propostas
  for all to authenticated using (true) with check (true);


-- ── PROCESSOS ────────────────────────────────────────────────────────────────

drop policy if exists "rb_select_processos" on public.processos;
drop policy if exists "rb_insert_processos" on public.processos;
drop policy if exists "rb_update_processos" on public.processos;
drop policy if exists "rb_delete_processos" on public.processos;

drop policy if exists "op_full_processos" on public.processos;
create policy "op_full_processos" on public.processos
  for all to authenticated using (true) with check (true);


-- ── EXTRAJUDICIAIS ───────────────────────────────────────────────────────────

drop policy if exists "rb_select_extrajudiciais" on public.extrajudiciais;
drop policy if exists "rb_insert_extrajudiciais" on public.extrajudiciais;
drop policy if exists "rb_update_extrajudiciais" on public.extrajudiciais;
drop policy if exists "rb_delete_extrajudiciais" on public.extrajudiciais;

drop policy if exists "op_full_extrajudiciais" on public.extrajudiciais;
create policy "op_full_extrajudiciais" on public.extrajudiciais
  for all to authenticated using (true) with check (true);


-- ── CONSULTORIAS ─────────────────────────────────────────────────────────────

drop policy if exists "rb_select_consultorias" on public.consultorias;
drop policy if exists "rb_insert_consultorias" on public.consultorias;
drop policy if exists "rb_update_consultorias" on public.consultorias;
drop policy if exists "rb_delete_consultorias" on public.consultorias;

drop policy if exists "op_full_consultorias" on public.consultorias;
create policy "op_full_consultorias" on public.consultorias
  for all to authenticated using (true) with check (true);


-- ── TAREFAS ──────────────────────────────────────────────────────────────────

drop policy if exists "rb_select_tarefas" on public.tarefas;
drop policy if exists "rb_insert_tarefas" on public.tarefas;
drop policy if exists "rb_update_tarefas" on public.tarefas;
drop policy if exists "rb_delete_tarefas" on public.tarefas;

drop policy if exists "op_full_tarefas" on public.tarefas;
create policy "op_full_tarefas" on public.tarefas
  for all to authenticated using (true) with check (true);


-- ── ARQUIVOS ─────────────────────────────────────────────────────────────────

drop policy if exists "rb_select_arquivos" on public.arquivos;
drop policy if exists "rb_insert_arquivos" on public.arquivos;
drop policy if exists "rb_update_arquivos" on public.arquivos;
drop policy if exists "rb_delete_arquivos" on public.arquivos;

drop policy if exists "op_full_arquivos" on public.arquivos;
create policy "op_full_arquivos" on public.arquivos
  for all to authenticated using (true) with check (true);


-- ── MODELOS JURÍDICOS ────────────────────────────────────────────────────────

drop policy if exists "rb_select_modelos_juridicos" on public.modelos_juridicos;
drop policy if exists "rb_insert_modelos_juridicos" on public.modelos_juridicos;
drop policy if exists "rb_update_modelos_juridicos" on public.modelos_juridicos;
drop policy if exists "rb_delete_modelos_juridicos" on public.modelos_juridicos;

drop policy if exists "op_full_modelos_juridicos" on public.modelos_juridicos;
create policy "op_full_modelos_juridicos" on public.modelos_juridicos
  for all to authenticated using (true) with check (true);


-- ── CLÁUSULAS PADRÃO ─────────────────────────────────────────────────────────

drop policy if exists "rb_select_clausulas_padrao" on public.clausulas_padrao;
drop policy if exists "rb_insert_clausulas_padrao" on public.clausulas_padrao;
drop policy if exists "rb_update_clausulas_padrao" on public.clausulas_padrao;
drop policy if exists "rb_delete_clausulas_padrao" on public.clausulas_padrao;

drop policy if exists "op_full_clausulas_padrao" on public.clausulas_padrao;
create policy "op_full_clausulas_padrao" on public.clausulas_padrao
  for all to authenticated using (true) with check (true);


-- ── CHECKLISTS JURÍDICOS ─────────────────────────────────────────────────────

drop policy if exists "rb_select_checklists_juridicos" on public.checklists_juridicos;
drop policy if exists "rb_insert_checklists_juridicos" on public.checklists_juridicos;
drop policy if exists "rb_update_checklists_juridicos" on public.checklists_juridicos;
drop policy if exists "rb_delete_checklists_juridicos" on public.checklists_juridicos;

drop policy if exists "op_full_checklists_juridicos" on public.checklists_juridicos;
create policy "op_full_checklists_juridicos" on public.checklists_juridicos
  for all to authenticated using (true) with check (true);


-- ── ORIENTAÇÕES INTERNAS ─────────────────────────────────────────────────────

drop policy if exists "rb_select_orientacoes_internas" on public.orientacoes_internas;
drop policy if exists "rb_insert_orientacoes_internas" on public.orientacoes_internas;
drop policy if exists "rb_update_orientacoes_internas" on public.orientacoes_internas;
drop policy if exists "rb_delete_orientacoes_internas" on public.orientacoes_internas;

drop policy if exists "op_full_orientacoes_internas" on public.orientacoes_internas;
create policy "op_full_orientacoes_internas" on public.orientacoes_internas
  for all to authenticated using (true) with check (true);


-- ── MINUTAS ASSISTIDAS ───────────────────────────────────────────────────────

drop policy if exists "rb_select_minutas_assistidas" on public.minutas_assistidas;
drop policy if exists "rb_insert_minutas_assistidas" on public.minutas_assistidas;
drop policy if exists "rb_update_minutas_assistidas" on public.minutas_assistidas;
drop policy if exists "rb_delete_minutas_assistidas" on public.minutas_assistidas;

drop policy if exists "op_full_minutas_assistidas" on public.minutas_assistidas;
create policy "op_full_minutas_assistidas" on public.minutas_assistidas
  for all to authenticated using (true) with check (true);


-- ══════════════════════════════════════════════════════════════════════════════
-- FIM DO ROLLBACK
-- Após executar, confirme com:
--   select tablename, policyname from pg_policies where schemaname = 'public';
-- Todos os policies devem ser op_full_* ou profiles_* novamente.
-- ══════════════════════════════════════════════════════════════════════════════
