import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from './supabase-server'
import type { User } from '@supabase/supabase-js'
import type { Profile, UserRole } from './types'
import { hasPermission, hasAnyPermission } from './permissions'
import type { Permission } from './permissions'

export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch {
    return null
  }
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

export async function getCurrentProfile(): Promise<Profile | null> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data } = await supabase
      .from('profiles')
      .select('id, nome, email, role, status, created_at, updated_at')
      .eq('id', user.id)
      .single()
    return (data as Profile) ?? null
  } catch {
    return null
  }
}

// ── Role & Permission helpers ──────────────────────────────────────────────────

// Fallback para profile não encontrado: menor privilégio
const FALLBACK_ROLE: UserRole = 'assistente'

export async function getCurrentRole(): Promise<UserRole> {
  const profile = await getCurrentProfile()
  if (!profile || profile.status === 'inativo') return FALLBACK_ROLE
  return profile.role
}

export async function requirePermission(permission: Permission): Promise<void> {
  const role = await getCurrentRole()
  if (!hasPermission(role, permission)) {
    redirect('/acesso-negado')
  }
}

export async function requireAnyPermission(permissions: Permission[]): Promise<void> {
  const role = await getCurrentRole()
  if (!hasAnyPermission(role, permissions)) {
    redirect('/acesso-negado')
  }
}

export async function requireRole(roles: UserRole[]): Promise<Profile> {
  const profile = await getCurrentProfile()
  if (!profile || !roles.includes(profile.role)) {
    redirect('/acesso-negado')
  }
  return profile
}
