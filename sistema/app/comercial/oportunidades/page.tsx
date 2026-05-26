import Link from 'next/link'
import { getOportunidades, getClientes, getCorretores } from '@/lib/data'
import { formatCurrency, formatDate, statusComercialLabel } from '@/lib/utils'
import PageHeader from '@/components/ui/PageHeader'

const STATUS_PIPELINE = [
  'novo_lead',
  'primeiro_contato',
  'diagnostico_pendente',
  'diagnostico_realizado',
  'proposta_enviada',
  'follow_up',
  'negociacao',
  'contrato_enviado',
] as const

const STATUS_CORES: Record<string, { bg: string; text: string; border: string }> = {
  novo_lead:              { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' },
  primeiro_contato:       { bg: '#eff6ff', text: '#3b82f6', border: '#bfdbfe' },
  diagnostico_pendente:   { bg: '#fefce8', text: '#ca8a04', border: '#fde68a' },
  diagnostico_realizado:  { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
  proposta_enviada:       { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
  follow_up:              { bg: '#f0fdf4', text: '#15803d', border: '#86efac' },
  negociacao:             { bg: '#fdf4ff', text: '#9333ea', border: '#e9d5ff' },
  contrato_enviado:       { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
  fechado:                { bg: '#f0fdf4', text: '#15803d', border: '#86efac' },
  perdido:                { bg: '#f9fafb', text: '#6b7280', border: '#e5e7eb' },
  nutricao:               { bg: '#f8fafc', text: '#94a3b8', border: '#e2e8f0' },
}

export default function OportunidadesPage() {
  const oportunidades = getOportunidades()
  const clientes = getClientes()
  const corretores = getCorretores()

  const clienteMap = Object.fromEntries(clientes.map((c) => [c.id, c.nome]))
  const corretorMap = Object.fromEntries(corretores.map((c) => [c.id, c.nome]))

  const pipeline = oportunidades.filter((o) => STATUS_PIPELINE.includes(o.status as typeof STATUS_PIPELINE[number]))
  const fechadas = oportunidades.filter((o) => o.status === 'fechado')
  const perdidas = oportunidades.filter((o) => o.status === 'perdido')
  const nutricao = oportunidades.filter((o) => o.status === 'nutricao')

  const valorPipeline = pipeline.reduce((s, o) => s + (o.valorEstimado ?? 0), 0)
  const valorFechado = fechadas.reduce((s, o) => s + (o.valorEstimado ?? 0), 0)

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const atrasadas = pipeline.filter((o) => {
    if (!o.proximoFollowUp) return false
    const d = new Date(o.proximoFollowUp)
    d.setHours(0, 0, 0, 0)
    return d <= hoje
  })

  // Agrupa por status para kanban
  const porStatus = STATUS_PIPELINE.reduce((acc, s) => {
    acc[s] = pipeline.filter((o) => o.status === s)
    return acc
  }, {} as Record<string, typeof pipeline>)

  return (
    <div className="p-8">
      <PageHeader
        title="Oportunidades"
        description="Pipeline comercial do escritório"
        action={
          <Link
            href="/comercial/oportunidades/nova"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-medium text-white"
            style={{ backgroundColor: '#1F2346' }}
          >
            + Nova oportunidade
          </Link>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Em pipeline</div>
          <div className="text-2xl font-semibold text-gray-900">{pipeline.length}</div>
          <div className="text-xs text-gray-400 mt-1">{formatCurrency(valorPipeline)} estimado</div>
        </div>
        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Follow-up atrasado</div>
          <div className="text-2xl font-semibold" style={{ color: atrasadas.length > 0 ? '#dc2626' : '#374151' }}>
            {atrasadas.length}
          </div>
          <div className="text-xs text-gray-400 mt-1">oportunidade{atrasadas.length !== 1 ? 's' : ''}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Fechadas</div>
          <div className="text-2xl font-semibold text-gray-900">{fechadas.length}</div>
          <div className="text-xs text-gray-400 mt-1">{formatCurrency(valorFechado)} gerado</div>
        </div>
        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Taxa de conversão</div>
          <div className="text-2xl font-semibold text-gray-900">
            {oportunidades.length > 0
              ? Math.round((fechadas.length / oportunidades.filter(o => o.status !== 'nutricao').length) * 100)
              : 0}%
          </div>
          <div className="text-xs text-gray-400 mt-1">sobre oportunidades ativas</div>
        </div>
      </div>

      {/* Kanban Pipeline */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-gray-600 mb-4 uppercase tracking-wide">Pipeline ativo</h2>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-max">
            {STATUS_PIPELINE.map((status) => {
              const cards = porStatus[status] ?? []
              const cores = STATUS_CORES[status]
              return (
                <div key={status} className="w-56 shrink-0">
                  <div
                    className="flex items-center justify-between px-3 py-2 rounded-t border border-b-0 text-xs font-medium"
                    style={{ backgroundColor: cores.bg, borderColor: cores.border, color: cores.text }}
                  >
                    <span>{statusComercialLabel(status)}</span>
                    <span className="ml-2 opacity-70">{cards.length}</span>
                  </div>
                  <div
                    className="min-h-24 rounded-b border space-y-2 p-2"
                    style={{ borderColor: cores.border, backgroundColor: cores.bg + '80' }}
                  >
                    {cards.map((op) => {
                      const followUpAtrasado = op.proximoFollowUp
                        ? new Date(op.proximoFollowUp) <= hoje
                        : false
                      return (
                        <Link
                          key={op.id}
                          href={`/comercial/oportunidades/${op.id}`}
                          className="block bg-white border border-gray-200 rounded p-2.5 hover:border-gray-300 transition-colors"
                        >
                          <div className="text-xs font-medium text-gray-800 leading-snug mb-1.5">{op.titulo}</div>
                          <div className="text-xs text-gray-400">{clienteMap[op.clienteId] ?? '—'}</div>
                          {op.valorEstimado && (
                            <div className="text-xs font-medium text-gray-600 mt-1">{formatCurrency(op.valorEstimado)}</div>
                          )}
                          {op.proximoFollowUp && (
                            <div className={`text-xs mt-1 ${followUpAtrasado ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                              {followUpAtrasado ? '⚠ ' : ''}Follow-up: {formatDate(op.proximoFollowUp)}
                            </div>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Fechadas / Perdidas / Nutrição */}
      {(fechadas.length > 0 || perdidas.length > 0 || nutricao.length > 0) && (
        <div className="mt-6">
          <h2 className="text-sm font-medium text-gray-600 mb-4 uppercase tracking-wide">Encerradas</h2>
          <div className="bg-white border border-gray-200 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Oportunidade</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Cliente</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Valor</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Responsável</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[...fechadas, ...perdidas, ...nutricao].map((op) => {
                  const cores = STATUS_CORES[op.status]
                  return (
                    <tr key={op.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <Link href={`/comercial/oportunidades/${op.id}`} className="font-medium text-gray-800 hover:underline">
                          {op.titulo}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{clienteMap[op.clienteId] ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                          style={{ backgroundColor: cores.bg, color: cores.text, border: `1px solid ${cores.border}` }}
                        >
                          {statusComercialLabel(op.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {op.valorEstimado ? formatCurrency(op.valorEstimado) : '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{op.responsavel}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
