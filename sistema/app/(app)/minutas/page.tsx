import Link from 'next/link'
import { getMinutasAssistidas, getResumoMinutasAssistidas } from '@/lib/data'
import { arquivarMinutaAssistida, duplicarMinutaAssistida } from '@/lib/actions'
import StatusBadge from '@/components/StatusBadge'
import { requirePermission, getCurrentRole } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import {
  TIPO_DOCUMENTO_MINUTA_LABELS,
  MINUTA_ENTITY_TYPE_LABELS,
  STATUS_MINUTA_LABELS,
  TIPOS_DOCUMENTO_MINUTA,
  MINUTA_ENTITY_TYPES,
  RESPONSAVEIS,
  type MinutaEntityType,
  type TipoDocumentoMinuta,
  type StatusMinuta,
} from '@/lib/types'
import { formatDate } from '@/lib/utils'

const SETE_DIAS_MS = 7 * 24 * 60 * 60 * 1000

export default async function MinutasPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    status?: string
    tipo?: string
    entityType?: string
    responsavel?: string
  }>
}) {
  await requirePermission('minutas:view')
  const role = await getCurrentRole()
  const canManage = hasPermission(role, 'minutas:manage')
  const params = await searchParams
  const [minutas, resumo] = await Promise.all([
    getMinutasAssistidas(),
    getResumoMinutasAssistidas(),
  ])

  const q = (params.q ?? '').toLowerCase().trim()
  const filtroStatus = params.status ?? ''
  const filtroTipo = params.tipo ?? ''
  const filtroEntityType = params.entityType ?? ''
  const filtroResponsavel = params.responsavel ?? ''

  const agora = new Date().getTime()
  const recentes7dias = minutas.filter(
    (m) => m.status !== 'arquivada' && agora - new Date(m.createdAt).getTime() < SETE_DIAS_MS
  ).length

  const ativas = minutas.filter((m) => {
    if (filtroStatus === 'arquivada') return m.status === 'arquivada'
    if (m.status === 'arquivada') return false
    if (filtroStatus && m.status !== filtroStatus) return false
    if (filtroTipo && m.tipoDocumento !== filtroTipo) return false
    if (filtroEntityType) {
      if (filtroEntityType === 'livre') {
        if (m.entityType) return false
      } else if (m.entityType !== filtroEntityType) return false
    }
    if (filtroResponsavel && m.responsavel !== filtroResponsavel) return false
    if (q) {
      const haystack = [m.titulo, m.tipoDocumento, m.entityType ?? '', m.responsavel, m.conteudo]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })

  const hasFilter = q || filtroStatus || filtroTipo || filtroEntityType || filtroResponsavel

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F2346]">Minutas Assistidas</h1>
          <p className="text-sm text-gray-500 mt-1">Minutas de trabalho montadas com base na Base de Conhecimento</p>
        </div>
        {canManage && (
          <Link
            href="/minutas/nova"
            className="px-4 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90"
            style={{ backgroundColor: '#DFA568' }}
          >
            + Nova minuta
          </Link>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-4 sm:grid-cols-6">
        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="text-2xl font-bold text-[#1F2346]">{resumo.total}</div>
          <div className="text-xs text-gray-500 mt-1">Total ativas</div>
        </div>
        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="text-2xl font-bold text-gray-400">{resumo.rascunhos}</div>
          <div className="text-xs text-gray-500 mt-1">Rascunhos</div>
        </div>
        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="text-2xl font-bold text-amber-600">{resumo.emRevisao}</div>
          <div className="text-xs text-gray-500 mt-1">Em revisão</div>
        </div>
        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="text-2xl font-bold text-green-600">{resumo.aprovadas}</div>
          <div className="text-xs text-gray-500 mt-1">Aprovadas</div>
        </div>
        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="text-2xl font-bold text-gray-400">{resumo.arquivadas}</div>
          <div className="text-xs text-gray-500 mt-1">Arquivadas</div>
        </div>
        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="text-2xl font-bold text-blue-600">{recentes7dias}</div>
          <div className="text-xs text-gray-500 mt-1">Últimos 7 dias</div>
        </div>
      </div>

      {/* Filtros */}
      <form method="GET" className="bg-white border border-gray-200 rounded p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <input
            name="q"
            defaultValue={params.q ?? ''}
            placeholder="Buscar por título, tipo, conteúdo…"
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568] col-span-1 sm:col-span-2"
          />
          <select
            name="status"
            defaultValue={params.status ?? ''}
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
          >
            <option value="">Todos os status</option>
            {(['rascunho', 'em_revisao', 'aprovada', 'arquivada'] as StatusMinuta[]).map((s) => (
              <option key={s} value={s}>{STATUS_MINUTA_LABELS[s]}</option>
            ))}
          </select>
          <select
            name="tipo"
            defaultValue={params.tipo ?? ''}
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
          >
            <option value="">Todos os tipos</option>
            {TIPOS_DOCUMENTO_MINUTA.map((t) => (
              <option key={t} value={t}>{TIPO_DOCUMENTO_MINUTA_LABELS[t]}</option>
            ))}
          </select>
          <select
            name="entityType"
            defaultValue={params.entityType ?? ''}
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
          >
            <option value="">Todas as origens</option>
            <option value="livre">Livre (sem vínculo)</option>
            {MINUTA_ENTITY_TYPES.map((et) => (
              <option key={et} value={et}>{MINUTA_ENTITY_TYPE_LABELS[et]}</option>
            ))}
          </select>
          <select
            name="responsavel"
            defaultValue={params.responsavel ?? ''}
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
          >
            <option value="">Todos responsáveis</option>
            {RESPONSAVEIS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90"
            style={{ backgroundColor: '#DFA568' }}
          >
            Filtrar
          </button>
          {hasFilter && (
            <Link href="/minutas" className="text-sm text-gray-400 hover:text-gray-600">
              Limpar filtros
            </Link>
          )}
          {hasFilter && (
            <span className="text-xs text-gray-400">{ativas.length} resultado(s)</span>
          )}
        </div>
      </form>

      {/* Listagem */}
      {ativas.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded p-12 text-center">
          <div className="text-gray-400 text-4xl mb-3">📄</div>
          {hasFilter ? (
            <>
              <p className="text-gray-500 font-medium">Nenhuma minuta encontrada</p>
              <p className="text-gray-400 text-sm mt-1">Tente ajustar os filtros de busca.</p>
              <Link href="/minutas" className="inline-block mt-4 text-sm text-[#DFA568] hover:underline">
                Limpar filtros
              </Link>
            </>
          ) : (
            <>
              <p className="text-gray-500 font-medium">Nenhuma minuta ainda</p>
              <p className="text-gray-400 text-sm mt-1">Use o Montador Assistido para criar minutas de trabalho a partir da Base de Conhecimento.</p>
              <Link href="/minutas/nova" className="inline-block mt-4 px-4 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90" style={{ backgroundColor: '#DFA568' }}>
                Criar primeira minuta
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-400">
                <th className="text-left px-4 py-3 font-medium">Título</th>
                <th className="text-left px-4 py-3 font-medium">Tipo</th>
                <th className="text-left px-4 py-3 font-medium">Origem</th>
                <th className="text-left px-4 py-3 font-medium">Responsável</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Criado em</th>
                <th className="text-left px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {ativas.map((m) => {
                const arquivarComId = arquivarMinutaAssistida.bind(null, m.id)
                const duplicarComId = duplicarMinutaAssistida.bind(null, m.id)
                return (
                  <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/minutas/${m.id}`} className="font-medium text-[#1F2346] hover:text-[#DFA568] transition-colors">
                        {m.titulo}
                      </Link>
                      {m.duplicadaDeId && (
                        <span className="ml-2 text-xs text-gray-300">cópia</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {TIPO_DOCUMENTO_MINUTA_LABELS[m.tipoDocumento as TipoDocumentoMinuta]}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {m.entityType ? MINUTA_ENTITY_TYPE_LABELS[m.entityType as MinutaEntityType] : 'Livre'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{m.responsavel}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-400">{formatDate(m.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {canManage && (
                          <form action={duplicarComId}>
                            <button
                              type="submit"
                              className="text-xs text-gray-400 hover:text-[#1F2346] transition-colors px-2 py-1 border border-gray-200 rounded hover:border-gray-300"
                            >
                              Duplicar
                            </button>
                          </form>
                        )}
                        {canManage && m.status !== 'arquivada' && (
                          <form action={arquivarComId}>
                            <button
                              type="submit"
                              className="text-xs text-gray-300 hover:text-red-400 transition-colors px-2 py-1 border border-gray-100 rounded hover:border-red-200"
                            >
                              Arquivar
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
