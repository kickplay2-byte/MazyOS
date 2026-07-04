'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/lib/auth-actions'
import { hasPermission } from '@/lib/permissions'
import type { Permission } from '@/lib/permissions'
import type { UserRole } from '@/lib/types'

interface NavItem {
  href: string
  label: string
  exact: boolean
  permission?: Permission
  icon: React.ReactNode
}

interface NavSection {
  label: string
  items: NavItem[]
}

const sections: NavSection[] = [
  {
    label: 'Comercial',
    items: [
      {
        href: '/comercial',
        label: 'Visão Comercial',
        exact: true,
        permission: 'commercial:view',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
      },
      {
        href: '/comercial/oportunidades',
        label: 'Oportunidades',
        exact: false,
        permission: 'opportunities:view',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ),
      },
      {
        href: '/comercial/propostas',
        label: 'Propostas',
        exact: false,
        permission: 'proposals:view',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
      {
        href: '/comercial/imobiliarias',
        label: 'Imobiliárias',
        exact: false,
        permission: 'organizations:view',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
      },
      {
        href: '/comercial/corretores',
        label: 'Corretores',
        exact: false,
        permission: 'brokers:view',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
      {
        href: '/comercial/clientes',
        label: 'Clientes',
        exact: false,
        permission: 'clients:view',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Gestão',
    items: [
      {
        href: '/tarefas',
        label: 'Tarefas',
        exact: false,
        permission: 'tarefas:view',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        ),
      },
      {
        href: '/documentos',
        label: 'Documentos',
        exact: false,
        permission: 'documentos:view',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Jurídico',
    items: [
      {
        href: '/processos',
        label: 'Processos Judiciais',
        exact: false,
        permission: 'processos:view',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        ),
      },
      {
        href: '/consultorias',
        label: 'Consultoria Mensal',
        exact: false,
        permission: 'consultorias:view',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        href: '/extrajudiciais',
        label: 'Extrajudiciais',
        exact: false,
        permission: 'extrajudiciais:view',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
      {
        href: '/conhecimento',
        label: 'Conhecimento',
        exact: false,
        permission: 'conhecimento:view',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
      },
      {
        href: '/minutas',
        label: 'Minutas',
        exact: false,
        permission: 'minutas:view',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ),
      },
    ],
  },
]

interface SidebarProps {
  userEmail?: string
  userRole?: UserRole
}

export default function Sidebar({ userEmail, userRole }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')

  const canSee = (permission?: Permission): boolean => {
    if (!permission) return true
    if (!userRole) return false
    return hasPermission(userRole, permission)
  }

  const filteredSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => canSee(item.permission)),
    }))
    .filter((section) => section.items.length > 0)

  return (
    <aside className="w-60 min-h-screen flex flex-col" style={{ backgroundColor: '#1F2346' }}>
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/" className="block">
          <div className="text-white font-light text-xs tracking-widest uppercase mb-1 opacity-50">
            PIPE OS
          </div>
          <div className="text-white font-semibold text-sm leading-tight">
            Vieira da Silva
            <br />
            <span style={{ color: '#DFA568' }}>Advocacia</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        <div>
          <Link
            href="/"
            className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors mb-1 ${
              pathname === '/'
                ? 'font-medium'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
            style={pathname === '/' ? { backgroundColor: 'rgba(223,165,104,0.15)', color: '#DFA568' } : {}}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>

          {canSee('advisor:view') && (
            <Link
              href="/advisor"
              className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors ${
                pathname.startsWith('/advisor')
                  ? 'font-medium'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
              style={
                pathname.startsWith('/advisor')
                  ? { backgroundColor: 'rgba(223,165,104,0.15)', color: '#DFA568' }
                  : {}
              }
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>Advisor</span>
              <span
                className="ml-auto text-xs px-1.5 py-0.5 rounded font-medium"
                style={{ backgroundColor: 'rgba(223,165,104,0.2)', color: '#DFA568', fontSize: '0.6rem' }}
              >
                IA
              </span>
            </Link>
          )}
        </div>

        {filteredSections.map((section) => (
          <div key={section.label}>
            <div className="px-3 mb-1.5 text-xs font-medium tracking-widest uppercase text-white/30">
              {section.label}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href, item.exact)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors ${
                      active
                        ? 'font-medium'
                        : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                    }`}
                    style={active ? { backgroundColor: 'rgba(223,165,104,0.15)', color: '#DFA568' } : {}}
                  >
                    <span style={active ? { color: '#DFA568' } : {}}>{item.icon}</span>
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 pb-3">
        {canSee('settings:view') && (
          <Link
            href="/configuracoes"
            className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors ${
              pathname.startsWith('/configuracoes')
                ? 'font-medium'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
            style={
              pathname.startsWith('/configuracoes')
                ? { backgroundColor: 'rgba(223,165,104,0.15)', color: '#DFA568' }
                : {}
            }
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configurações
          </Link>
        )}
      </div>

      <div className="px-5 py-4 border-t border-white/10">
        {userEmail ? (
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-white/40 text-xs truncate">{userEmail}</div>
              <div className="text-white/20 text-xs truncate capitalize">
                {userRole ?? 'Perfil não definido'}
              </div>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                title="Sair"
                className="text-white/30 hover:text-white/70 transition-colors shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </form>
          </div>
        ) : (
          <div className="text-white/25 text-xs">Imobiliário · 2026</div>
        )}
      </div>
    </aside>
  )
}
