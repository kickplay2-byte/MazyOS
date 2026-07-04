-- PIPE OS — RLS Policies
-- ══════════════════════════════════════════════════════════════════════════════
-- Phase 8+ — Run AFTER implementing Supabase Auth.
-- Profiles section (at the bottom) can be run immediately after creating the
-- profiles table, as it only affects that table.
-- The 10 business tables section (Version B) is still optional for Phase 8.
--
-- This script enables Row Level Security on all tables and restricts access
-- to authenticated users only. It is prepared for when the system requires
-- proper authentication (Phase 8+).
--
-- CURRENT STATUS (Development):
--   - RLS is DISABLED (see schema.sql)
--   - `anon` role has full access
--   - Acceptable only because the app is internal and not internet-facing
--
-- WHEN TO RUN THIS:
--   - Before exposing the Supabase project to the internet OR
--   - Before adding authentication (Supabase Auth / NextAuth) OR
--   - Before any real client data is stored at scale
--
-- WHAT CHANGES WHEN YOU RUN THIS:
--   - The `anon` key loses all write (and read) access
--   - The app WILL BREAK until you also add Supabase Auth and pass a user JWT
--   - Only run this after implementing authentication
--
-- ══════════════════════════════════════════════════════════════════════════════

-- ── Version A: Development (controlled) ──────────────────────────────────────
-- Keep RLS disabled, but revoke write from anon as minimum protection.
-- Use only if you want some protection without full auth.
-- NOTE: This still allows any user to READ all data via the anon key.

-- UNCOMMENT ONLY IF YOU WANT PARTIAL PROTECTION WITHOUT FULL AUTH:
-- revoke insert, update, delete on processos      from anon;
-- revoke insert, update, delete on consultorias   from anon;
-- revoke insert, update, delete on extrajudiciais from anon;
-- revoke insert, update, delete on imobiliarias   from anon;
-- revoke insert, update, delete on corretores     from anon;
-- revoke insert, update, delete on clientes       from anon;
-- revoke insert, update, delete on oportunidades  from anon;
-- revoke insert, update, delete on propostas      from anon;
-- revoke insert, update, delete on tarefas        from anon;
-- revoke insert, update, delete on arquivos       from anon;

-- ── Version B: Production (full RLS) ─────────────────────────────────────────
-- Run this ONLY after implementing Supabase Auth.
-- All access restricted to authenticated users.
-- Anon key gets zero access.
-- Structure prepared for future multi-tenant (org_id) if needed.

-- Step 1: Enable RLS on all tables
alter table processos      enable row level security;
alter table consultorias   enable row level security;
alter table extrajudiciais enable row level security;
alter table imobiliarias   enable row level security;
alter table corretores     enable row level security;
alter table clientes       enable row level security;
alter table oportunidades  enable row level security;
alter table propostas      enable row level security;
alter table tarefas        enable row level security;
alter table arquivos       enable row level security;

-- Step 2: Revoke all from anon
revoke all on processos      from anon;
revoke all on consultorias   from anon;
revoke all on extrajudiciais from anon;
revoke all on imobiliarias   from anon;
revoke all on corretores     from anon;
revoke all on clientes       from anon;
revoke all on oportunidades  from anon;
revoke all on propostas      from anon;
revoke all on tarefas        from anon;
revoke all on arquivos       from anon;

-- Step 3: Grant to authenticated role
grant all on processos      to authenticated;
grant all on consultorias   to authenticated;
grant all on extrajudiciais to authenticated;
grant all on imobiliarias   to authenticated;
grant all on corretores     to authenticated;
grant all on clientes       to authenticated;
grant all on oportunidades  to authenticated;
grant all on propostas      to authenticated;
grant all on tarefas        to authenticated;
grant all on arquivos       to authenticated;

-- Step 4: Policies — allow authenticated users full access
-- (single-tenant: all users of this project share the same data)
-- If you add multi-tenancy later, add `and (data->>'orgId') = auth.jwt()->>'orgId'`

create policy "authenticated_full_processos"      on processos      for all to authenticated using (true) with check (true);
create policy "authenticated_full_consultorias"   on consultorias   for all to authenticated using (true) with check (true);
create policy "authenticated_full_extrajudiciais" on extrajudiciais for all to authenticated using (true) with check (true);
create policy "authenticated_full_imobiliarias"   on imobiliarias   for all to authenticated using (true) with check (true);
create policy "authenticated_full_corretores"     on corretores     for all to authenticated using (true) with check (true);
create policy "authenticated_full_clientes"       on clientes       for all to authenticated using (true) with check (true);
create policy "authenticated_full_oportunidades"  on oportunidades  for all to authenticated using (true) with check (true);
create policy "authenticated_full_propostas"      on propostas      for all to authenticated using (true) with check (true);
create policy "authenticated_full_tarefas"        on tarefas        for all to authenticated using (true) with check (true);
create policy "authenticated_full_arquivos"       on arquivos       for all to authenticated using (true) with check (true);

-- ── Future: Multi-tenant extension ───────────────────────────────────────────
-- When adding org_id, replace the `using (true)` conditions with:
-- using ( (data->>'orgId') = (select raw_app_meta_data->>'orgId' from auth.users where id = auth.uid()) )
-- with check ( (data->>'orgId') = (select raw_app_meta_data->>'orgId' from auth.users where id = auth.uid()) )

-- ── Profiles RLS (Phase 8 — run after creating the profiles table) ───────────
-- This section CAN be run independently of the 10 business tables above.
-- The profiles table is always protected by RLS regardless of the tables above.

alter table profiles enable row level security;

-- All authenticated users can read all profiles
-- (needed to display names throughout the app without complex joins)
create policy "profiles_select_authenticated" on profiles
  for select to authenticated
  using (true);

-- Users can only update their own profile
create policy "profiles_update_own" on profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- INSERT is handled by the trigger (handle_new_user) — no direct insert policy needed.
-- Service role can insert (trigger runs as security definer).

-- Anon gets zero access to profiles
revoke all on profiles from anon;
