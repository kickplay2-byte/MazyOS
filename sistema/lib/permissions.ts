import type { UserRole } from './types'

// ── Permission type ────────────────────────────────────────────────────────────

export type Permission =
  | 'dashboard:view'
  // Advisor
  | 'advisor:view'
  | 'advisor:use'
  // Comercial
  | 'commercial:view'
  | 'commercial:manage'
  | 'organizations:view'
  | 'organizations:manage'
  | 'brokers:view'
  | 'brokers:manage'
  | 'clients:view'
  | 'clients:manage'
  | 'opportunities:view'
  | 'opportunities:manage'
  | 'proposals:view'
  | 'proposals:manage'
  // Jurídico
  | 'legal:view'
  | 'legal:manage'
  | 'processos:view'
  | 'processos:manage'
  | 'extrajudiciais:view'
  | 'extrajudiciais:manage'
  | 'consultorias:view'
  | 'consultorias:manage'
  // Gestão
  | 'tarefas:view'
  | 'tarefas:manage'
  | 'documentos:view'
  | 'documentos:manage'
  // Conhecimento / Minutas
  | 'conhecimento:view'
  | 'conhecimento:manage'
  | 'minutas:view'
  | 'minutas:manage'
  | 'minutas:export'
  // Admin
  | 'settings:view'
  | 'settings:manage'
  | 'users:view'
  | 'users:manage'
  | 'security:view'

// ── Role → Permission map ──────────────────────────────────────────────────────

const ADMIN_PERMISSIONS: Permission[] = [
  'dashboard:view',
  'advisor:view', 'advisor:use',
  'commercial:view', 'commercial:manage',
  'organizations:view', 'organizations:manage',
  'brokers:view', 'brokers:manage',
  'clients:view', 'clients:manage',
  'opportunities:view', 'opportunities:manage',
  'proposals:view', 'proposals:manage',
  'legal:view', 'legal:manage',
  'processos:view', 'processos:manage',
  'extrajudiciais:view', 'extrajudiciais:manage',
  'consultorias:view', 'consultorias:manage',
  'tarefas:view', 'tarefas:manage',
  'documentos:view', 'documentos:manage',
  'conhecimento:view', 'conhecimento:manage',
  'minutas:view', 'minutas:manage', 'minutas:export',
  'settings:view', 'settings:manage',
  'users:view', 'users:manage',
  'security:view',
]

const ADVOGADO_PERMISSIONS: Permission[] = [
  'dashboard:view',
  'advisor:view', 'advisor:use',
  'commercial:view',
  'organizations:view',
  'brokers:view',
  'clients:view', 'clients:manage',
  'opportunities:view', 'opportunities:manage',
  'proposals:view', 'proposals:manage',
  'legal:view', 'legal:manage',
  'processos:view', 'processos:manage',
  'extrajudiciais:view', 'extrajudiciais:manage',
  'consultorias:view', 'consultorias:manage',
  'tarefas:view', 'tarefas:manage',
  'documentos:view', 'documentos:manage',
  'conhecimento:view', 'conhecimento:manage',
  'minutas:view', 'minutas:manage', 'minutas:export',
  'settings:view',
  'users:view',
  'security:view',
]

const ASSISTENTE_PERMISSIONS: Permission[] = [
  'dashboard:view',
  'advisor:view', 'advisor:use',
  'commercial:view',
  'clients:view',
  'opportunities:view',
  'proposals:view',
  'legal:view',
  'processos:view', 'processos:manage',
  'extrajudiciais:view', 'extrajudiciais:manage',
  'consultorias:view',
  'tarefas:view', 'tarefas:manage',
  'documentos:view', 'documentos:manage',
  'conhecimento:view',
  'minutas:view', 'minutas:manage', 'minutas:export',
  'settings:view',
  'users:view',
]

const COMERCIAL_PERMISSIONS: Permission[] = [
  'dashboard:view',
  'advisor:view', 'advisor:use',
  'commercial:view', 'commercial:manage',
  'organizations:view', 'organizations:manage',
  'brokers:view', 'brokers:manage',
  'clients:view', 'clients:manage',
  'opportunities:view', 'opportunities:manage',
  'proposals:view', 'proposals:manage',
  'legal:view',
  'processos:view',
  'extrajudiciais:view',
  'consultorias:view',
  'tarefas:view', 'tarefas:manage',
  'documentos:view',
  'conhecimento:view',
  'minutas:view',
  'settings:view',
  'users:view',
]

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: ADMIN_PERMISSIONS,
  advogado: ADVOGADO_PERMISSIONS,
  assistente: ASSISTENTE_PERMISSIONS,
  comercial: COMERCIAL_PERMISSIONS,
}

// ── Helpers ────────────────────────────────────────────────────────────────────

export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return getRolePermissions(role).includes(permission)
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  const perms = getRolePermissions(role)
  return permissions.some((p) => perms.includes(p))
}

export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  const perms = getRolePermissions(role)
  return permissions.every((p) => perms.includes(p))
}

// ── Route → Permission map ─────────────────────────────────────────────────────

const ROUTE_PERMISSION_MAP: Array<[string, Permission]> = [
  ['/advisor', 'advisor:view'],
  ['/comercial', 'commercial:view'],
  ['/processos', 'processos:view'],
  ['/extrajudiciais', 'extrajudiciais:view'],
  ['/consultorias', 'consultorias:view'],
  ['/tarefas', 'tarefas:view'],
  ['/documentos', 'documentos:view'],
  ['/conhecimento', 'conhecimento:view'],
  ['/minutas', 'minutas:view'],
  ['/configuracoes', 'settings:view'],
]

export function canAccessRoute(role: UserRole, pathname: string): boolean {
  for (const [route, permission] of ROUTE_PERMISSION_MAP) {
    if (pathname === route || pathname.startsWith(route + '/')) {
      return hasPermission(role, permission)
    }
  }
  return true
}

// ── Entity-level helpers ───────────────────────────────────────────────────────

const ENTITY_MANAGE_MAP: Record<string, Permission> = {
  imobiliaria: 'organizations:manage',
  corretor: 'brokers:manage',
  cliente: 'clients:manage',
  oportunidade: 'opportunities:manage',
  proposta: 'proposals:manage',
  processo: 'processos:manage',
  extrajudicial: 'extrajudiciais:manage',
  consultoria: 'consultorias:manage',
  tarefa: 'tarefas:manage',
  documento: 'documentos:manage',
  modelo: 'conhecimento:manage',
  clausula: 'conhecimento:manage',
  checklist: 'conhecimento:manage',
  orientacao: 'conhecimento:manage',
  minuta: 'minutas:manage',
}

const ENTITY_VIEW_MAP: Record<string, Permission> = {
  imobiliaria: 'organizations:view',
  corretor: 'brokers:view',
  cliente: 'clients:view',
  oportunidade: 'opportunities:view',
  proposta: 'proposals:view',
  processo: 'processos:view',
  extrajudicial: 'extrajudiciais:view',
  consultoria: 'consultorias:view',
  tarefa: 'tarefas:view',
  documento: 'documentos:view',
  modelo: 'conhecimento:view',
  clausula: 'conhecimento:view',
  checklist: 'conhecimento:view',
  orientacao: 'conhecimento:view',
  minuta: 'minutas:view',
}

export function canManageEntity(role: UserRole, entityType: string): boolean {
  const permission = ENTITY_MANAGE_MAP[entityType]
  if (!permission) return true
  return hasPermission(role, permission)
}

export function canViewEntity(role: UserRole, entityType: string): boolean {
  const permission = ENTITY_VIEW_MAP[entityType]
  if (!permission) return true
  return hasPermission(role, permission)
}
