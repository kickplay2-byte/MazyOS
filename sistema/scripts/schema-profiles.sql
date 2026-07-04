-- PIPE OS — Criar tabela profiles + trigger (pré-requisito para rls-role-based.sql)
-- Idempotente: usa CREATE TABLE IF NOT EXISTS

create table if not exists public.profiles (
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

-- Trigger: cria profile automaticamente para novos usuários
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, coalesce(new.email, ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: criar profiles para usuários já existentes em auth.users
insert into public.profiles (id, email)
select id, coalesce(email, '')
from auth.users
on conflict (id) do nothing;
