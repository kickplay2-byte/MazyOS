-- ══════════════════════════════════════════════════════════════════════════════
-- PIPE OS — Setup de Usuários de Teste (Fase 11B.1)
-- Executar APÓS criar os usuários em Supabase Auth → Authentication → Users
--
-- Passo a passo:
--  1. Supabase Dashboard → Authentication → Users → Add user → Confirm with email
--  2. Criar 5 usuários com as senhas abaixo (ou suas próprias):
--     - lawyer@pipeos.test    (senha: Teste1234!)
--     - assistant@pipeos.test (senha: Teste1234!)
--     - commercial@pipeos.test (senha: Teste1234!)
--     - inactive@pipeos.test  (senha: Teste1234!)
--  3. Rodar este script para definir os roles e status corretos
-- ══════════════════════════════════════════════════════════════════════════════

-- Definir role e status dos usuários de teste
-- (o backfill já criou os profiles com role='assistente', status='ativo' por padrão)

update public.profiles set role = 'advogado',   status = 'ativo'
  where email = 'lawyer@pipeos.test';

update public.profiles set role = 'assistente', status = 'ativo'
  where email = 'assistant@pipeos.test';

update public.profiles set role = 'comercial',  status = 'ativo'
  where email = 'commercial@pipeos.test';

-- Usuário inativo: tem profile mas status bloqueado
update public.profiles set role = 'assistente', status = 'inativo'
  where email = 'inactive@pipeos.test';

-- Confirmar resultado
select email, role, status from public.profiles order by role, status, email;

-- ══════════════════════════════════════════════════════════════════════════════
-- Resultado esperado:
--   giovani@...    | admin      | ativo
--   lawyer@...     | advogado   | ativo
--   assistant@...  | assistente | ativo
--   inactive@...   | assistente | inativo
--   commercial@... | comercial  | ativo
-- ══════════════════════════════════════════════════════════════════════════════
