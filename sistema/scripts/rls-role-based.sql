-- ══════════════════════════════════════════════════════════════════════════════
-- PIPE OS — RLS por Role (Fase 11B)
-- Aplicar no Supabase SQL Editor DEPOIS de scripts/rls-minimo-authenticated.sql
-- ══════════════════════════════════════════════════════════════════════════════
--
-- OBJETIVO:
--   Substituir as policies "authenticated full access" por policies granulares
--   por role do usuário, consultando public.profiles em vez de auth.jwt().
--
-- POR QUE NÃO auth.jwt() ->> 'role':
--   O role real fica em public.profiles (tabela relacional FK → auth.users).
--   Não há custom claims no JWT. Consultar profiles é o caminho correto.
--
-- ROLES VÁLIDOS (conforme schema.sql → profiles.role):
--   'admin'      — acesso total
--   'advogado'   — jurídico completo + comercial view
--   'assistente' — jurídico manage (processos/ext/tarefas/minutas) + leitura geral
--   'comercial'  — comercial manage + jurídico/conhecimento view
--
-- STATUS VÁLIDOS (conforme schema.sql → profiles.status):
--   'ativo'   — usuário com acesso
--   'inativo' — usuário sem acesso (bloqueado pelo banco)
--
-- IDEMPOTENTE: pode ser re-executado sem efeito colateral.
--   Usa "drop policy if exists" antes de cada "create policy".
--   Usa "create or replace function" para os helpers.
--
-- PRÉ-REQUISITO:
--   1. schema.sql já executado (tabela profiles, trigger on_auth_user_created)
--   2. rls-minimo-authenticated.sql já executado (RLS ativo, grants authenticated)
--
-- COMO APLICAR:
--   1. Supabase Dashboard → SQL Editor → New query
--   2. Cole este arquivo inteiro e clique em Run
--   3. Confirme que não houve erros
--   4. Teste cada role conforme seção de testes (item 9 do relatório)
--
-- ROLLBACK:
--   Execute scripts/rls-rollback-authenticated.sql para voltar ao RLS mínimo.
--
-- ══════════════════════════════════════════════════════════════════════════════


-- ── PARTE 1: FUNÇÕES HELPER ───────────────────────────────────────────────────
--
-- Atenção: security definer é necessário para que a função possa ler
-- public.profiles mesmo quando este tem RLS ativo. O filtro WHERE p.id = auth.uid()
-- garante que a função só lê o próprio profile do usuário autenticado.
-- A anotação STABLE permite ao otimizador cachear o resultado por query,
-- evitando múltiplas consultas ao banco por operação.


-- Helper 1: retorna o role do usuário autenticado (ou NULL se inativo/sem profile)
create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select p.role
  from public.profiles p
  where p.id = auth.uid()
    and p.status = 'ativo'
  limit 1
$$;

-- Helper 2: verifica se o usuário tem qualquer um dos roles listados
create or replace function public.has_any_role(allowed_roles text[])
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.status = 'ativo'
      and p.role = any(allowed_roles)
  )
$$;

-- Revogar execução pública (anon não deve chamar helpers de role)
revoke execute on function public.current_user_role()     from public;
revoke execute on function public.has_any_role(text[])    from public;

-- Conceder apenas a authenticated
grant execute on function public.current_user_role()      to authenticated;
grant execute on function public.has_any_role(text[])     to authenticated;


-- ── PARTE 2: PROFILES ────────────────────────────────────────────────────────
--
-- Policies especiais: profiles é tabela relacional, não document-store.
-- SELECT:  cada usuário vê seu próprio profile; admin vê todos.
-- UPDATE:  somente admin pode alterar qualquer profile.
--          (a aplicação já restringe via requireActionPermission('users:manage'))
-- INSERT:  gerenciado pelo trigger on_auth_user_created (security definer).
--          Nenhuma policy de INSERT necessária no client.
-- DELETE:  gerenciado pelo CASCADE de auth.users. Nenhuma policy necessária.

alter table public.profiles enable row level security;
revoke all on public.profiles from anon;

-- Remover policies do rls-minimo-authenticated.sql
drop policy if exists "profiles_select_authenticated"  on public.profiles;
drop policy if exists "profiles_update_own"            on public.profiles;

-- Remover policies próprias deste script (idempotência)
drop policy if exists "rb_profiles_select_own"         on public.profiles;
drop policy if exists "rb_profiles_select_admin"       on public.profiles;
drop policy if exists "rb_profiles_update_admin"       on public.profiles;

-- Cada usuário autenticado pode sempre ler o próprio profile
-- (não exige status=ativo para evitar que usuário inativo fique sem acesso à
--  própria informação — o bloqueio de dados do negócio é feito nas outras tabelas)
create policy "rb_profiles_select_own" on public.profiles
  for select to authenticated
  using (id = auth.uid());

-- Admin pode ler todos os profiles (necessário para listagem em /configuracoes)
create policy "rb_profiles_select_admin" on public.profiles
  for select to authenticated
  using (public.has_any_role(array['admin']));

-- Somente admin pode atualizar profiles (role, status, nome de qualquer usuário)
create policy "rb_profiles_update_admin" on public.profiles
  for update to authenticated
  using  (public.has_any_role(array['admin']))
  with check (public.has_any_role(array['admin']));


-- ── PARTE 3: IMOBILIÁRIAS ─────────────────────────────────────────────────────
--
-- SELECT: todos os roles (assistente precisa ver imobiliárias em formulários)
-- WRITE:  admin, comercial

alter table public.imobiliarias enable row level security;
revoke all on public.imobiliarias from anon;
grant all on public.imobiliarias to authenticated;

drop policy if exists "op_full_imobiliarias"  on public.imobiliarias;
drop policy if exists "rb_select_imobiliarias" on public.imobiliarias;
drop policy if exists "rb_insert_imobiliarias" on public.imobiliarias;
drop policy if exists "rb_update_imobiliarias" on public.imobiliarias;
drop policy if exists "rb_delete_imobiliarias" on public.imobiliarias;

create policy "rb_select_imobiliarias" on public.imobiliarias
  for select to authenticated
  using (public.has_any_role(array['admin', 'advogado', 'assistente', 'comercial']));

create policy "rb_insert_imobiliarias" on public.imobiliarias
  for insert to authenticated
  with check (public.has_any_role(array['admin', 'comercial']));

create policy "rb_update_imobiliarias" on public.imobiliarias
  for update to authenticated
  using  (public.has_any_role(array['admin', 'comercial']))
  with check (public.has_any_role(array['admin', 'comercial']));

-- Imobiliárias são inativadas (status update), não deletadas — sem policy de DELETE.


-- ── PARTE 4: CORRETORES ──────────────────────────────────────────────────────
--
-- SELECT: todos os roles (corretores aparecem como opções em formulários jurídicos)
-- WRITE:  admin, comercial

alter table public.corretores enable row level security;
revoke all on public.corretores from anon;
grant all on public.corretores to authenticated;

drop policy if exists "op_full_corretores"  on public.corretores;
drop policy if exists "rb_select_corretores" on public.corretores;
drop policy if exists "rb_insert_corretores" on public.corretores;
drop policy if exists "rb_update_corretores" on public.corretores;
drop policy if exists "rb_delete_corretores" on public.corretores;

create policy "rb_select_corretores" on public.corretores
  for select to authenticated
  using (public.has_any_role(array['admin', 'advogado', 'assistente', 'comercial']));

create policy "rb_insert_corretores" on public.corretores
  for insert to authenticated
  with check (public.has_any_role(array['admin', 'comercial']));

create policy "rb_update_corretores" on public.corretores
  for update to authenticated
  using  (public.has_any_role(array['admin', 'comercial']))
  with check (public.has_any_role(array['admin', 'comercial']));

-- Corretores não são deletados no app atual — sem policy de DELETE.


-- ── PARTE 5: CLIENTES ────────────────────────────────────────────────────────
--
-- SELECT: todos os roles
-- WRITE:  admin, advogado, comercial
-- DELETE: admin, advogado, comercial (excluirCliente existe no app)

alter table public.clientes enable row level security;
revoke all on public.clientes from anon;
grant all on public.clientes to authenticated;

drop policy if exists "op_full_clientes"  on public.clientes;
drop policy if exists "rb_select_clientes" on public.clientes;
drop policy if exists "rb_insert_clientes" on public.clientes;
drop policy if exists "rb_update_clientes" on public.clientes;
drop policy if exists "rb_delete_clientes" on public.clientes;

create policy "rb_select_clientes" on public.clientes
  for select to authenticated
  using (public.has_any_role(array['admin', 'advogado', 'assistente', 'comercial']));

create policy "rb_insert_clientes" on public.clientes
  for insert to authenticated
  with check (public.has_any_role(array['admin', 'advogado', 'comercial']));

create policy "rb_update_clientes" on public.clientes
  for update to authenticated
  using  (public.has_any_role(array['admin', 'advogado', 'comercial']))
  with check (public.has_any_role(array['admin', 'advogado', 'comercial']));

create policy "rb_delete_clientes" on public.clientes
  for delete to authenticated
  using (public.has_any_role(array['admin', 'advogado', 'comercial']));


-- ── PARTE 6: OPORTUNIDADES ───────────────────────────────────────────────────
--
-- SELECT: todos os roles
-- WRITE:  admin, advogado, comercial
-- DELETE: oportunidades não são deletadas no app (apenas movidas para perdido)

alter table public.oportunidades enable row level security;
revoke all on public.oportunidades from anon;
grant all on public.oportunidades to authenticated;

drop policy if exists "op_full_oportunidades"  on public.oportunidades;
drop policy if exists "rb_select_oportunidades" on public.oportunidades;
drop policy if exists "rb_insert_oportunidades" on public.oportunidades;
drop policy if exists "rb_update_oportunidades" on public.oportunidades;
drop policy if exists "rb_delete_oportunidades" on public.oportunidades;

create policy "rb_select_oportunidades" on public.oportunidades
  for select to authenticated
  using (public.has_any_role(array['admin', 'advogado', 'assistente', 'comercial']));

create policy "rb_insert_oportunidades" on public.oportunidades
  for insert to authenticated
  with check (public.has_any_role(array['admin', 'advogado', 'comercial']));

create policy "rb_update_oportunidades" on public.oportunidades
  for update to authenticated
  using  (public.has_any_role(array['admin', 'advogado', 'comercial']))
  with check (public.has_any_role(array['admin', 'advogado', 'comercial']));

-- Sem DELETE de oportunidades no app.


-- ── PARTE 7: PROPOSTAS ───────────────────────────────────────────────────────
--
-- SELECT: todos os roles
-- WRITE:  admin, advogado, comercial
-- DELETE: propostas são arquivadas (status cancelada), não deletadas

alter table public.propostas enable row level security;
revoke all on public.propostas from anon;
grant all on public.propostas to authenticated;

drop policy if exists "op_full_propostas"  on public.propostas;
drop policy if exists "rb_select_propostas" on public.propostas;
drop policy if exists "rb_insert_propostas" on public.propostas;
drop policy if exists "rb_update_propostas" on public.propostas;
drop policy if exists "rb_delete_propostas" on public.propostas;

create policy "rb_select_propostas" on public.propostas
  for select to authenticated
  using (public.has_any_role(array['admin', 'advogado', 'assistente', 'comercial']));

create policy "rb_insert_propostas" on public.propostas
  for insert to authenticated
  with check (public.has_any_role(array['admin', 'advogado', 'comercial']));

create policy "rb_update_propostas" on public.propostas
  for update to authenticated
  using  (public.has_any_role(array['admin', 'advogado', 'comercial']))
  with check (public.has_any_role(array['admin', 'advogado', 'comercial']));

-- Sem DELETE de propostas no app.


-- ── PARTE 8: PROCESSOS ───────────────────────────────────────────────────────
--
-- SELECT: todos os roles (comercial tem processos:view)
-- WRITE:  admin, advogado, assistente
-- DELETE: admin, advogado, assistente (excluirProcesso existe no app)

alter table public.processos enable row level security;
revoke all on public.processos from anon;
grant all on public.processos to authenticated;

drop policy if exists "op_full_processos"  on public.processos;
drop policy if exists "rb_select_processos" on public.processos;
drop policy if exists "rb_insert_processos" on public.processos;
drop policy if exists "rb_update_processos" on public.processos;
drop policy if exists "rb_delete_processos" on public.processos;

create policy "rb_select_processos" on public.processos
  for select to authenticated
  using (public.has_any_role(array['admin', 'advogado', 'assistente', 'comercial']));

create policy "rb_insert_processos" on public.processos
  for insert to authenticated
  with check (public.has_any_role(array['admin', 'advogado', 'assistente']));

create policy "rb_update_processos" on public.processos
  for update to authenticated
  using  (public.has_any_role(array['admin', 'advogado', 'assistente']))
  with check (public.has_any_role(array['admin', 'advogado', 'assistente']));

create policy "rb_delete_processos" on public.processos
  for delete to authenticated
  using (public.has_any_role(array['admin', 'advogado', 'assistente']));


-- ── PARTE 9: EXTRAJUDICIAIS ───────────────────────────────────────────────────
--
-- SELECT: todos os roles (comercial tem extrajudiciais:view)
-- WRITE:  admin, advogado, assistente
-- DELETE: admin, advogado, assistente (excluirExtrajudicial existe no app)

alter table public.extrajudiciais enable row level security;
revoke all on public.extrajudiciais from anon;
grant all on public.extrajudiciais to authenticated;

drop policy if exists "op_full_extrajudiciais"  on public.extrajudiciais;
drop policy if exists "rb_select_extrajudiciais" on public.extrajudiciais;
drop policy if exists "rb_insert_extrajudiciais" on public.extrajudiciais;
drop policy if exists "rb_update_extrajudiciais" on public.extrajudiciais;
drop policy if exists "rb_delete_extrajudiciais" on public.extrajudiciais;

create policy "rb_select_extrajudiciais" on public.extrajudiciais
  for select to authenticated
  using (public.has_any_role(array['admin', 'advogado', 'assistente', 'comercial']));

create policy "rb_insert_extrajudiciais" on public.extrajudiciais
  for insert to authenticated
  with check (public.has_any_role(array['admin', 'advogado', 'assistente']));

create policy "rb_update_extrajudiciais" on public.extrajudiciais
  for update to authenticated
  using  (public.has_any_role(array['admin', 'advogado', 'assistente']))
  with check (public.has_any_role(array['admin', 'advogado', 'assistente']));

create policy "rb_delete_extrajudiciais" on public.extrajudiciais
  for delete to authenticated
  using (public.has_any_role(array['admin', 'advogado', 'assistente']));


-- ── PARTE 10: CONSULTORIAS ────────────────────────────────────────────────────
--
-- SELECT: todos os roles (comercial tem consultorias:view)
-- WRITE:  admin, advogado
-- DELETE: admin, advogado (excluirConsultoria existe no app)

alter table public.consultorias enable row level security;
revoke all on public.consultorias from anon;
grant all on public.consultorias to authenticated;

drop policy if exists "op_full_consultorias"  on public.consultorias;
drop policy if exists "rb_select_consultorias" on public.consultorias;
drop policy if exists "rb_insert_consultorias" on public.consultorias;
drop policy if exists "rb_update_consultorias" on public.consultorias;
drop policy if exists "rb_delete_consultorias" on public.consultorias;

create policy "rb_select_consultorias" on public.consultorias
  for select to authenticated
  using (public.has_any_role(array['admin', 'advogado', 'assistente', 'comercial']));

create policy "rb_insert_consultorias" on public.consultorias
  for insert to authenticated
  with check (public.has_any_role(array['admin', 'advogado']));

create policy "rb_update_consultorias" on public.consultorias
  for update to authenticated
  using  (public.has_any_role(array['admin', 'advogado']))
  with check (public.has_any_role(array['admin', 'advogado']));

create policy "rb_delete_consultorias" on public.consultorias
  for delete to authenticated
  using (public.has_any_role(array['admin', 'advogado']));


-- ── PARTE 11: TAREFAS ─────────────────────────────────────────────────────────
--
-- SELECT: todos os roles
-- WRITE:  admin, advogado, assistente, comercial (comercial tem tarefas:manage)
-- DELETE: admin, advogado, assistente, comercial (excluirTarefa existe no app)

alter table public.tarefas enable row level security;
revoke all on public.tarefas from anon;
grant all on public.tarefas to authenticated;

drop policy if exists "op_full_tarefas"  on public.tarefas;
drop policy if exists "rb_select_tarefas" on public.tarefas;
drop policy if exists "rb_insert_tarefas" on public.tarefas;
drop policy if exists "rb_update_tarefas" on public.tarefas;
drop policy if exists "rb_delete_tarefas" on public.tarefas;

create policy "rb_select_tarefas" on public.tarefas
  for select to authenticated
  using (public.has_any_role(array['admin', 'advogado', 'assistente', 'comercial']));

create policy "rb_insert_tarefas" on public.tarefas
  for insert to authenticated
  with check (public.has_any_role(array['admin', 'advogado', 'assistente', 'comercial']));

create policy "rb_update_tarefas" on public.tarefas
  for update to authenticated
  using  (public.has_any_role(array['admin', 'advogado', 'assistente', 'comercial']))
  with check (public.has_any_role(array['admin', 'advogado', 'assistente', 'comercial']));

create policy "rb_delete_tarefas" on public.tarefas
  for delete to authenticated
  using (public.has_any_role(array['admin', 'advogado', 'assistente', 'comercial']));


-- ── PARTE 12: ARQUIVOS ────────────────────────────────────────────────────────
--
-- SELECT: todos os roles (documentos:view inclui todos)
-- WRITE:  admin, advogado, assistente (documentos:manage)
-- DELETE: admin, advogado, assistente (excluirArquivo existe no app)

alter table public.arquivos enable row level security;
revoke all on public.arquivos from anon;
grant all on public.arquivos to authenticated;

drop policy if exists "op_full_arquivos"  on public.arquivos;
drop policy if exists "rb_select_arquivos" on public.arquivos;
drop policy if exists "rb_insert_arquivos" on public.arquivos;
drop policy if exists "rb_update_arquivos" on public.arquivos;
drop policy if exists "rb_delete_arquivos" on public.arquivos;

create policy "rb_select_arquivos" on public.arquivos
  for select to authenticated
  using (public.has_any_role(array['admin', 'advogado', 'assistente', 'comercial']));

create policy "rb_insert_arquivos" on public.arquivos
  for insert to authenticated
  with check (public.has_any_role(array['admin', 'advogado', 'assistente']));

create policy "rb_update_arquivos" on public.arquivos
  for update to authenticated
  using  (public.has_any_role(array['admin', 'advogado', 'assistente']))
  with check (public.has_any_role(array['admin', 'advogado', 'assistente']));

create policy "rb_delete_arquivos" on public.arquivos
  for delete to authenticated
  using (public.has_any_role(array['admin', 'advogado', 'assistente']));


-- ── PARTE 13: MODELOS JURÍDICOS ───────────────────────────────────────────────
--
-- SELECT: todos os roles (conhecimento:view inclui todos)
-- WRITE:  admin, advogado (conhecimento:manage)
-- DELETE: modelos são arquivados (status arquivado), não deletados

alter table public.modelos_juridicos enable row level security;
revoke all on public.modelos_juridicos from anon;
grant all on public.modelos_juridicos to authenticated;

drop policy if exists "op_full_modelos_juridicos"  on public.modelos_juridicos;
drop policy if exists "rb_select_modelos_juridicos" on public.modelos_juridicos;
drop policy if exists "rb_insert_modelos_juridicos" on public.modelos_juridicos;
drop policy if exists "rb_update_modelos_juridicos" on public.modelos_juridicos;
drop policy if exists "rb_delete_modelos_juridicos" on public.modelos_juridicos;

create policy "rb_select_modelos_juridicos" on public.modelos_juridicos
  for select to authenticated
  using (public.has_any_role(array['admin', 'advogado', 'assistente', 'comercial']));

create policy "rb_insert_modelos_juridicos" on public.modelos_juridicos
  for insert to authenticated
  with check (public.has_any_role(array['admin', 'advogado']));

create policy "rb_update_modelos_juridicos" on public.modelos_juridicos
  for update to authenticated
  using  (public.has_any_role(array['admin', 'advogado']))
  with check (public.has_any_role(array['admin', 'advogado']));

-- Sem DELETE: modelos são arquivados, não deletados.


-- ── PARTE 14: CLÁUSULAS PADRÃO ────────────────────────────────────────────────
--
-- SELECT: todos os roles
-- WRITE:  admin, advogado
-- DELETE: cláusulas são arquivadas, não deletadas

alter table public.clausulas_padrao enable row level security;
revoke all on public.clausulas_padrao from anon;
grant all on public.clausulas_padrao to authenticated;

drop policy if exists "op_full_clausulas_padrao"  on public.clausulas_padrao;
drop policy if exists "rb_select_clausulas_padrao" on public.clausulas_padrao;
drop policy if exists "rb_insert_clausulas_padrao" on public.clausulas_padrao;
drop policy if exists "rb_update_clausulas_padrao" on public.clausulas_padrao;
drop policy if exists "rb_delete_clausulas_padrao" on public.clausulas_padrao;

create policy "rb_select_clausulas_padrao" on public.clausulas_padrao
  for select to authenticated
  using (public.has_any_role(array['admin', 'advogado', 'assistente', 'comercial']));

create policy "rb_insert_clausulas_padrao" on public.clausulas_padrao
  for insert to authenticated
  with check (public.has_any_role(array['admin', 'advogado']));

create policy "rb_update_clausulas_padrao" on public.clausulas_padrao
  for update to authenticated
  using  (public.has_any_role(array['admin', 'advogado']))
  with check (public.has_any_role(array['admin', 'advogado']));

-- Sem DELETE: cláusulas são arquivadas, não deletadas.


-- ── PARTE 15: CHECKLISTS JURÍDICOS ───────────────────────────────────────────
--
-- SELECT: todos os roles
-- WRITE:  admin, advogado
-- DELETE: checklists são arquivados, não deletados

alter table public.checklists_juridicos enable row level security;
revoke all on public.checklists_juridicos from anon;
grant all on public.checklists_juridicos to authenticated;

drop policy if exists "op_full_checklists_juridicos"  on public.checklists_juridicos;
drop policy if exists "rb_select_checklists_juridicos" on public.checklists_juridicos;
drop policy if exists "rb_insert_checklists_juridicos" on public.checklists_juridicos;
drop policy if exists "rb_update_checklists_juridicos" on public.checklists_juridicos;
drop policy if exists "rb_delete_checklists_juridicos" on public.checklists_juridicos;

create policy "rb_select_checklists_juridicos" on public.checklists_juridicos
  for select to authenticated
  using (public.has_any_role(array['admin', 'advogado', 'assistente', 'comercial']));

create policy "rb_insert_checklists_juridicos" on public.checklists_juridicos
  for insert to authenticated
  with check (public.has_any_role(array['admin', 'advogado']));

create policy "rb_update_checklists_juridicos" on public.checklists_juridicos
  for update to authenticated
  using  (public.has_any_role(array['admin', 'advogado']))
  with check (public.has_any_role(array['admin', 'advogado']));

-- Sem DELETE: checklists são arquivados, não deletados.


-- ── PARTE 16: ORIENTAÇÕES INTERNAS ───────────────────────────────────────────
--
-- SELECT: todos os roles
-- WRITE:  admin, advogado
-- DELETE: orientações são arquivadas, não deletadas

alter table public.orientacoes_internas enable row level security;
revoke all on public.orientacoes_internas from anon;
grant all on public.orientacoes_internas to authenticated;

drop policy if exists "op_full_orientacoes_internas"  on public.orientacoes_internas;
drop policy if exists "rb_select_orientacoes_internas" on public.orientacoes_internas;
drop policy if exists "rb_insert_orientacoes_internas" on public.orientacoes_internas;
drop policy if exists "rb_update_orientacoes_internas" on public.orientacoes_internas;
drop policy if exists "rb_delete_orientacoes_internas" on public.orientacoes_internas;

create policy "rb_select_orientacoes_internas" on public.orientacoes_internas
  for select to authenticated
  using (public.has_any_role(array['admin', 'advogado', 'assistente', 'comercial']));

create policy "rb_insert_orientacoes_internas" on public.orientacoes_internas
  for insert to authenticated
  with check (public.has_any_role(array['admin', 'advogado']));

create policy "rb_update_orientacoes_internas" on public.orientacoes_internas
  for update to authenticated
  using  (public.has_any_role(array['admin', 'advogado']))
  with check (public.has_any_role(array['admin', 'advogado']));

-- Sem DELETE: orientações são arquivadas, não deletadas.


-- ── PARTE 17: MINUTAS ASSISTIDAS ─────────────────────────────────────────────
--
-- SELECT: todos os roles (comercial tem minutas:view)
-- WRITE:  admin, advogado, assistente (minutas:manage)
-- DELETE: minutas são arquivadas (status arquivada), não deletadas

alter table public.minutas_assistidas enable row level security;
revoke all on public.minutas_assistidas from anon;
grant all on public.minutas_assistidas to authenticated;

drop policy if exists "op_full_minutas_assistidas"  on public.minutas_assistidas;
drop policy if exists "rb_select_minutas_assistidas" on public.minutas_assistidas;
drop policy if exists "rb_insert_minutas_assistidas" on public.minutas_assistidas;
drop policy if exists "rb_update_minutas_assistidas" on public.minutas_assistidas;
drop policy if exists "rb_delete_minutas_assistidas" on public.minutas_assistidas;

create policy "rb_select_minutas_assistidas" on public.minutas_assistidas
  for select to authenticated
  using (public.has_any_role(array['admin', 'advogado', 'assistente', 'comercial']));

create policy "rb_insert_minutas_assistidas" on public.minutas_assistidas
  for insert to authenticated
  with check (public.has_any_role(array['admin', 'advogado', 'assistente']));

create policy "rb_update_minutas_assistidas" on public.minutas_assistidas
  for update to authenticated
  using  (public.has_any_role(array['admin', 'advogado', 'assistente']))
  with check (public.has_any_role(array['admin', 'advogado', 'assistente']));

-- Sem DELETE: minutas são arquivadas via status, não deletadas.
-- Nota: exportação DOCX/PDF é controlada pela API (requer minutas:export), não pelo banco.


-- ══════════════════════════════════════════════════════════════════════════════
-- QUERIES DE VERIFICAÇÃO
-- Execute em queries separadas após rodar o script acima.
-- ══════════════════════════════════════════════════════════════════════════════

-- A. Verificar todas as policies criadas:
--
-- select tablename, policyname, cmd, roles
-- from pg_policies
-- where schemaname = 'public'
-- order by tablename, policyname;

-- B. Verificar RLS ativo em todas as tabelas:
--
-- select tablename, rowsecurity
-- from pg_tables
-- where schemaname = 'public'
-- order by tablename;

-- C. Verificar profiles existentes:
--
-- select id, email, role, status
-- from public.profiles
-- order by email;

-- D. Testar helpers (requer contexto autenticado — SQL Editor logado como usuário):
--
-- select public.current_user_role();
-- select public.has_any_role(array['admin', 'advogado']);

-- E. Verificar funções criadas:
--
-- select routine_name, security_type
-- from information_schema.routines
-- where routine_schema = 'public'
--   and routine_name in ('current_user_role', 'has_any_role')
-- order by routine_name;

-- F. Testar bloqueio anon (deve retornar 0 rows ou erro de permissão):
--
-- set role anon;
-- select count(*) from public.processos;
-- reset role;

-- G. Verificar grants nas funções:
--
-- select grantee, privilege_type
-- from information_schema.routine_privileges
-- where routine_schema = 'public'
--   and routine_name in ('current_user_role', 'has_any_role')
-- order by routine_name, grantee;

-- ══════════════════════════════════════════════════════════════════════════════
-- NOTAS IMPORTANTES
-- ══════════════════════════════════════════════════════════════════════════════
--
-- 1. USUÁRIO INATIVO: o campo profiles.status = 'inativo' bloqueia o acesso
--    ao banco. A função has_any_role() filtra por status = 'ativo'.
--    O app também bloqueia via requireUser() + status check no layout.
--
-- 2. USUÁRIO SEM PROFILE: se o trigger on_auth_user_created não criou o profile
--    (erro na criação, usuário manual sem trigger), has_any_role() retorna false
--    e nenhuma tabela fica acessível. O app cairá com dados vazios ou erro.
--    Solução: inserir profile manualmente ou reexecutar o trigger via backfill.
--
-- 3. CIRCULAR DEPENDENCY: has_any_role() usa security definer, bypassando RLS
--    de profiles ao ler auth.uid(). Não há recursão — a policy de profiles
--    para select own usa id = auth.uid() diretamente, sem chamar a função.
--
-- 4. PERFORMANCE: a anotação STABLE no has_any_role() permite ao otimizador
--    cachear o resultado da função dentro de uma única query, evitando múltiplas
--    consultas a profiles por operação. Em produção com carga alta, considerar
--    usar JWT custom claims (Fase 12+) para eliminar o join em profiles.
--
-- 5. EXPORTAÇÃO DOCX/PDF: a restrição de exportação é feita pela API do app
--    (requer minutas:export via hasPermission()), não pelo banco. O banco garante
--    apenas que a minuta existe e é legível pelo role do usuário.
--
-- 6. ROLLBACK: execute scripts/rls-rollback-authenticated.sql para voltar ao
--    estado de rls-minimo-authenticated.sql (authenticated full access).
--
-- ══════════════════════════════════════════════════════════════════════════════
