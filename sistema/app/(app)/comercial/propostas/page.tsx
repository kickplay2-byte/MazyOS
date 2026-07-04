import Link from 'next/link'
import { requirePermission, getCurrentRole } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import {
  getPropostas,
  getClientes,
  getPropostasAbertas,
  getPropostasAceitas,
  getPropostasRecusadas,
  getPropostasVencidas,
  getValorPropostasAbertas,
  getValorPropostasAceitas,
  getTaxaConversaoPropostas,
} from '@/lib/data'
import { formatCurrency, formatDate, statusPropostaLabel } from '@/lib/utils'
import { RESPONSAVEIS } from '@/lib/types'
import PageHeader from '@/components/ui/PageHeader'

const STATUS_CORES: Record<string, { bg: string; text: string; border: string }> = {
  rascunho:      { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' },
  enviada:       { bg: '#eff6ff', text: '#3b82f6', border: '#bfdbfe' },
  em_negociacao: { bg: '#fdf4ff', text: '#9333ea', border: '#e9d5ff' },
  aceita:        { bg: '#f0fdf4', text: '#15803d', border: '#86efac' },
  recusada:      { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
  vencida:       { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
  cancelada:     { bg: '#f9fafb', text: '#9ca3af', border: '#e5e7eb' },
}

export default async function PropostasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; clienteId?: string; responsavel?: string; vencida?: string }>
}) {
  await requirePermission('proposals:view')
  const role = await getCurrentRole()
  const canManage = hasPermission(role, 'proposals:manage')
  const params = await searchParams

  const [todas, clientes, abertas, aceitas, recusadas, vencidas, valorAbertas, valorAceitas, taxaConversao] = await Promise.all([
    getPropostas(),
    getClientes(),
    getPropostasAbertas(),
    getPropostasAceitas(),
    getPropostasRecusadas(),
    getPropostasVencidas(),
    getValorPropostasAbertas(),
    getValorPropostasAceitas(),
    getTaxaConversaoPropostas(),
  ])

  const clienteMap = Object.fromEntries(clientes.map((c) => [c.id, c.nome]))

  // Filtros
  let lista = todas
  if (params.status) lista = lista.filter((p) => p.status === params.status)
  if (params.clienteId) lista = lista.filter((p) => p.clienteId === params.clienteId)
  if (params.responsavel) lista = lista.filter((p) => p.responsavel === params.responsavel)
  if (params.vencida === '1') {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    lista = lista.filter((p) => {
      if (!p.validade || ['aceita', 'recusada', 'vencida', 'cancelada'].includes(p.status)) return false
      return new Date(p.validade) < hoje
    })
  }

  const temFiltro = !!(params.status || params.clienteId || params.responsavel || params.vencida)

  return (
    <div className="p-8">
      <PageHeader
        title="Propostas e Honorários"
        description="Controle de propostas enviadas, valores potenciais e conversão comercial"
        breadcrumbs={[
          { label: 'Comercial', href: '/comercial' },
          { label: 'Propostas' },
        ]}
        action={canManage ? (
          <Link
            href="/comercial/propostas/nova"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-medium text-white"
            style={{ backgroundColor: '#1F2346' }}
          >
            + Nova proposta
          </Link>
        ) : undefined}
      />

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Em aberto</div>
          <div className="text-2xl font-semibold text-gray-900">{abertas.length}</div>
          <div className="text-xs text-gray-400 mt-1">{formatCurrency(valorAbertas)}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Aceitas</div>
          <div className="text-2xl font-semibold" style={{ color: '#15803d' }}>{aceitas.length}</div>
          <div className="text-xs text-gray-400 mt-1">{formatCurrency(valorAceitas)}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Recusadas / Vencidas</div>
          <div className="text-2xl font-semibold text-gray-900">{recusadas.length + vencidas.length}</div>
          <div className="text-xs text-gray-400 mt-1">{recusadas.length} recusadas, {vencidas.length} vencidas</div>
        </div>
        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Taxa de conversão</div>
          <div className="text-2xl font-semibold text-gray-900">{taxaConversao}%</div>
          <div className="text-xs text-gray-400 mt-1">sobre propostas enviadas</div>
        </div>
      </div>

      {/* Filtros */}
      <form method="GET" className="bg-white border border-gray-200 rounded p-4 mb-6 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
          <select
            name="status"
            defaultValue={params.status ?? ''}
            className="border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400"
          >
            <option value="">Todos os status</option>
            <option value="rascunho">Rascunho</option>
            <option value="enviada">Enviada</option>
            <option value="em_negociacao">Em negociação</option>
            <option value="aceita">Aceita</option>
            <option value="recusada">Recusada</option>
            <option value="vencida">Vencida</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Cliente</label>
          <select
            name="clienteId"
            defaultValue={params.clienteId ?? ''}
            className="border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400"
          >
            <option value="">Todos os clientes</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Responsável</label>
          <select
            name="responsavel"
            defaultValue={params.responsavel ?? ''}
            className="border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400"
          >
            <option value="">Todos</option>
            {RESPONSAVEIS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1.5 pb-0.5">
          <input
            type="checkbox"
            name="vencida"
            value="1"
            defaultChecked={params.vencida === '1'}
            id="cb-vencida"
            className="rounded"
          />
          <label htmlFor="cb-vencida" className="text-sm text-gray-600 cursor-pointer">Validade vencida</label>
        </div>
        <button
          type="submit"
          className="px-4 py-1.5 rounded text-sm font-medium text-white"
          style={{ backgroundColor: '#1F2346' }}
        >
          Filtrar
        </button>
        {temFiltro && (
          <Link href="/comercial/propostas" className="px-4 py-1.5 rounded text-sm text-gray-500 hover:bg-gray-100 transition-colors">
            Limpar
          </Link>
        )}
      </form>

      {/* Tabela */}
      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Proposta</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Cliente</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Tipo</th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Valor</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Status</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Validade</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Responsável</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {lista.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-400">
                  Nenhuma proposta encontrada.
                </td>
              </tr>
            ) : (
              lista.map((p) => {
                const cores = STATUS_CORES[p.status] ?? STATUS_CORES.rascunho
                const hoje = new Date()
                hoje.setHours(0, 0, 0, 0)
                const validadeVencida = p.validade
                  ? new Date(p.validade) < hoje && !['aceita', 'recusada', 'vencida', 'cancelada'].includes(p.status)
                  : false

                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <Link
                        href={`/comercial/propostas/${p.id}`}
                        className="font-medium text-gray-800 hover:underline"
                      >
                        {p.titulo}
                      </Link>
                      {p.oportunidadeId && (
                        <div className="text-xs text-gray-400 mt-0.5">
                          <Link href={`/comercial/oportunidades/${p.oportunidadeId}`} className="hover:underline">
                            ver oportunidade →
                          </Link>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{clienteMap[p.clienteId] ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{p.tipoServico ?? '—'}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700 text-xs">{formatCurrency(p.valorTotal)}</td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                        style={{ backgroundColor: cores.bg, color: cores.text, border: `1px solid ${cores.border}` }}
                      >
                        {statusPropostaLabel(p.status)}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-xs ${validadeVencida ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                      {validadeVencida ? '⚠ ' : ''}{formatDate(p.validade)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{p.responsavel}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
        <div className="px-5 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
          {lista.length} proposta{lista.length !== 1 ? 's' : ''} exibida{lista.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  )
}
