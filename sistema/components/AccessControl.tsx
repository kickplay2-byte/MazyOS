'use client'

import type { UserRole } from '@/lib/types'
import type { Permission } from '@/lib/permissions'
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@/lib/permissions'

interface AccessControlProps {
  role?: UserRole
  permission?: Permission
  anyPermissions?: Permission[]
  allPermissions?: Permission[]
  fallback?: React.ReactNode
  children: React.ReactNode
}

export default function AccessControl({
  role,
  permission,
  anyPermissions,
  allPermissions,
  fallback = null,
  children,
}: AccessControlProps) {
  if (!role) return <>{fallback}</>

  if (permission && !hasPermission(role, permission)) return <>{fallback}</>
  if (anyPermissions && !hasAnyPermission(role, anyPermissions)) return <>{fallback}</>
  if (allPermissions && !hasAllPermissions(role, allPermissions)) return <>{fallback}</>

  return <>{children}</>
}
