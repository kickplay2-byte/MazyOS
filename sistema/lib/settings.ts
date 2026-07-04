import { createSupabaseServerClient } from './supabase-server'
import type { Profile, UserRole } from './types'

// Server-only. Acessa process.env e Supabase — nunca importar de Client Components.

// ── Configurações do escritório ───────────────────────────────────────────────

export interface OfficeSettings {
  systemName: string
  officeName: string
  mainArea: string
  city: string
  version: string
  environment: string
}

export function getOfficeSettings(): OfficeSettings {
  return {
    systemName: 'PIPE OS',
    officeName: 'Vieira da Silva Advocacia',
    mainArea: 'Direito Imobiliário',
    city: 'Curitiba/PR',
    version: 'MVP interno',
    environment: process.env.NODE_ENV ?? 'development',
  }
}

// ── Status de integrações ─────────────────────────────────────────────────────

export interface IntegrationStatus {
  supabase: {
    configured: boolean
    urlConfigured: boolean
    anonKeyConfigured: boolean
  }
  openai: {
    configured: boolean
  }
  advisor: {
    globalEnabled: boolean
    entityEnabled: boolean
  }
}

export function getIntegrationStatus(): IntegrationStatus {
  const urlConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKeyConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const openaiConfigured = !!process.env.OPENAI_API_KEY

  return {
    supabase: {
      configured: urlConfigured && anonKeyConfigured,
      urlConfigured,
      anonKeyConfigured,
    },
    openai: {
      configured: openaiConfigured,
    },
    advisor: {
      globalEnabled: openaiConfigured,
      entityEnabled: openaiConfigured,
    },
  }
}

// ── Status de segurança ───────────────────────────────────────────────────────

export interface SecurityStatus {
  authActive: boolean
  proxyActive: boolean
  advisorProtected: boolean
  entityAdvisorProtected: boolean
  serviceRoleExposed: boolean
  sensibleKeysInClient: boolean
  publicRegistration: boolean
}

export function getSecurityStatus(): SecurityStatus {
  return {
    authActive: true,
    proxyActive: true,
    advisorProtected: true,
    entityAdvisorProtected: true,
    serviceRoleExposed: false,
    sensibleKeysInClient: false,
    publicRegistration: false,
  }
}

// ── Perfis de usuário ─────────────────────────────────────────────────────────

export async function getProfiles(): Promise<Profile[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('id, nome, email, role, status, created_at, updated_at')
      .order('created_at', { ascending: true })
    if (error) return []
    return (data ?? []) as Profile[]
  } catch {
    return []
  }
}

export interface ProfilesResumo {
  total: number
  ativos: number
  inativos: number
  porRole: Record<UserRole, number>
}

export function computeProfilesResumo(profiles: Profile[]): ProfilesResumo {
  return {
    total: profiles.length,
    ativos: profiles.filter((p) => p.status === 'ativo').length,
    inativos: profiles.filter((p) => p.status === 'inativo').length,
    porRole: {
      admin: profiles.filter((p) => p.role === 'admin').length,
      advogado: profiles.filter((p) => p.role === 'advogado').length,
      assistente: profiles.filter((p) => p.role === 'assistente').length,
      comercial: profiles.filter((p) => p.role === 'comercial').length,
    },
  }
}

export async function getProfilesResumo(): Promise<ProfilesResumo> {
  return computeProfilesResumo(await getProfiles())
}

// ── Saúde consolidada ─────────────────────────────────────────────────────────

export interface SystemHealth {
  office: OfficeSettings
  integrations: IntegrationStatus
  security: SecurityStatus
  users: {
    profiles: Profile[]
    resumo: ProfilesResumo
  }
}

export async function getSystemHealth(): Promise<SystemHealth> {
  const profiles = await getProfiles()
  return {
    office: getOfficeSettings(),
    integrations: getIntegrationStatus(),
    security: getSecurityStatus(),
    users: { profiles, resumo: computeProfilesResumo(profiles) },
  }
}
