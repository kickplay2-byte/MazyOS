-- ══════════════════════════════════════════════════════════════════════════════
-- PIPE OS — Validação de RLS por Role (Fase 11B.1)
-- Executar no Supabase SQL Editor para verificar estado do RLS.
-- Cada seção pode ser executada independentemente.
-- ══════════════════════════════════════════════════════════════════════════════

-- ── A. ESTADO GERAL ──────────────────────────────────────────────────────────

-- A1. RLS ativo em todas as tabelas (rowsecurity = true para todas)
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;

-- A2. Todas as 53 policies rb_* presentes
select tablename, count(*) as total_policies
from pg_policies
where schemaname = 'public'
  and policyname like 'rb_%'
group by tablename
order by tablename;

-- A3. Funções helper criadas
select routine_name, security_type, routine_definition
from information_schema.routines
where routine_schema = 'public'
  and routine_name in ('current_user_role', 'has_any_role')
order by routine_name;

-- A4. Grants nas funções (deve mostrar authenticated, não public/anon)
select routine_name, grantee, privilege_type
from information_schema.routine_privileges
where routine_schema = 'public'
  and routine_name in ('current_user_role', 'has_any_role')
order by routine_name, grantee;


-- ── B. PROFILES ──────────────────────────────────────────────────────────────

-- B1. Todos os profiles existentes
select id, email, role, status, created_at
from public.profiles
order by role, email;

-- B2. Verificar que todos os auth.users têm profile correspondente
select u.id, u.email,
       p.role, p.status,
       case when p.id is null then 'SEM PROFILE' else 'OK' end as profile_status
from auth.users u
left join public.profiles p on p.id = u.id
order by profile_status desc, u.email;


-- ── C. TESTES DE BLOQUEIO anon ───────────────────────────────────────────────
-- Execute como superuser — deve confirmar que anon não tem permissão

-- C1. Testar bloqueio anon em processos
set local role anon;
select count(*) as processos_visiveis_anon from public.processos;
reset role;

-- C2. Testar bloqueio anon em profiles
set local role anon;
select count(*) as profiles_visiveis_anon from public.profiles;
reset role;


-- ── D. SIMULAR ACESSO POR ROLE ────────────────────────────────────────────────
-- Estas queries testam a lógica das policies sem precisar de um JWT real.
-- Substitua o UUID pelo ID do usuário correspondente para teste real.

-- D1. Verificar quem é admin (deve conseguir ver todos os profiles)
select p.email, p.role, p.status
from public.profiles p
where p.role = 'admin' and p.status = 'ativo';

-- D2. Verificar que has_any_role retorna FALSE para usuário inativo
-- (Executar autenticado como usuário inativo para ver NULL/false)
-- select public.has_any_role(array['admin', 'advogado', 'assistente', 'comercial']);

-- D3. Lista de policies SELECT por tabela (para confirmar quem pode ler)
select tablename, policyname, cmd,
       pg_get_expr(qual, 'public.processos'::regclass) as using_expr
from pg_policies
where schemaname = 'public'
  and cmd = 'SELECT'
  and policyname like 'rb_%'
order by tablename;


-- ── E. CONTAGEM DE DADOS POR TABELA ──────────────────────────────────────────
-- Executar autenticado como cada role para ver quantos registros ficam visíveis.
-- Como admin: deve ver todos. Como outros roles: deve ver o mesmo (SELECT é universal).

select 'processos'            as tabela, count(*) as total from public.processos
union all
select 'extrajudiciais',         count(*) from public.extrajudiciais
union all
select 'consultorias',           count(*) from public.consultorias
union all
select 'imobiliarias',           count(*) from public.imobiliarias
union all
select 'corretores',             count(*) from public.corretores
union all
select 'clientes',               count(*) from public.clientes
union all
select 'oportunidades',          count(*) from public.oportunidades
union all
select 'propostas',              count(*) from public.propostas
union all
select 'tarefas',                count(*) from public.tarefas
union all
select 'arquivos',               count(*) from public.arquivos
union all
select 'modelos_juridicos',      count(*) from public.modelos_juridicos
union all
select 'clausulas_padrao',       count(*) from public.clausulas_padrao
union all
select 'checklists_juridicos',   count(*) from public.checklists_juridicos
union all
select 'orientacoes_internas',   count(*) from public.orientacoes_internas
union all
select 'minutas_assistidas',     count(*) from public.minutas_assistidas
order by tabela;


-- ── F. SETUP USUÁRIOS DE TESTE ────────────────────────────────────────────────
-- Executar APÓS criar os usuários em Supabase Auth → Authentication → Users.
-- Substitua os emails pelos emails reais dos usuários de teste.

-- F1. Criar/atualizar profiles de teste
-- (substituir emails e IDs pelos reais)
/*
update public.profiles set role = 'advogado',  status = 'ativo'   where email = 'lawyer@pipeos.test';
update public.profiles set role = 'assistente', status = 'ativo'  where email = 'assistant@pipeos.test';
update public.profiles set role = 'comercial',  status = 'ativo'  where email = 'commercial@pipeos.test';
update public.profiles set role = 'assistente', status = 'inativo' where email = 'inactive@pipeos.test';
*/

-- F2. Confirmar profiles de teste após setup
select email, role, status from public.profiles order by role, status, email;


-- ── G. QUERIES DE BYPASS — TENTAR WRITE SEM PERMISSÃO ────────────────────────
-- Execute estas queries autenticado como um role sem permissão de write.
-- Exemplo: autenticado como 'comercial', tentar inserir em processos.
-- Deve retornar "ERROR: new row violates row-level security policy for table processos"

-- G1. Comercial tentando inserir em processos (deve falhar)
-- insert into public.processos (id, data) values ('test-bypass', '{"test": true}'::jsonb);

-- G2. Assistente tentando inserir em imobiliarias (deve falhar)
-- insert into public.imobiliarias (id, data) values ('test-bypass', '{"test": true}'::jsonb);

-- G3. Advogado tentando update em profiles (deve falhar — apenas admin)
-- update public.profiles set role = 'admin' where email = 'lawyer@pipeos.test';


-- ── H. VERIFICAÇÃO FINAL ──────────────────────────────────────────────────────

-- H1. Resumo de policies por tabela e comando
select tablename,
       count(*) filter (where cmd = 'SELECT') as select_policies,
       count(*) filter (where cmd = 'INSERT') as insert_policies,
       count(*) filter (where cmd = 'UPDATE') as update_policies,
       count(*) filter (where cmd = 'DELETE') as delete_policies
from pg_policies
where schemaname = 'public'
  and policyname like 'rb_%'
group by tablename
order by tablename;

-- ══════════════════════════════════════════════════════════════════════════════
-- Resultado esperado em H1:
--
-- Tabelas com 4 policies (SELECT/INSERT/UPDATE/DELETE):
--   arquivos, clientes, consultorias, extrajudiciais, processos, tarefas
--
-- Tabelas com 3 policies (SELECT/INSERT/UPDATE, sem DELETE — archive pattern):
--   checklists_juridicos, clausulas_padrao, corretores, imobiliarias,
--   minutas_assistidas, modelos_juridicos, oportunidades, orientacoes_internas,
--   propostas
--
-- profiles: 2 SELECT (own + admin) + 1 UPDATE = 3 policies
-- ══════════════════════════════════════════════════════════════════════════════
