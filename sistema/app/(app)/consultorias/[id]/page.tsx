import { notFound } from 'next/navigation'
import { requirePermission } from '@/lib/auth'
import Link from 'next/link'
import { getConsultoria, getMinutasAssistidasByEntity } from '@/lib/data'
import { atualizarConsultoria, excluirConsultoria } from '@/lib/actions'
import StatusBadge from '@/components/StatusBadge'
import DeleteButton from '@/components/ui/DeleteButton'
import { RESPONSAVEIS, STATUS_CONSULTORIA, TIPO_DOCUMENTO_MINUTA_LABELS } from '@/lib/types'
import EntityAdvisorPanel from '@/components/advisor/EntityAdvisorPanel'
import KnowledgeRecommendations from '@/components/knowledge/KnowledgeRecommendations'

function formatCurrency(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR')
}

function formatMes(ym: string) {
  const [y, m] = ym.split('-')
  return new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

export default async function ConsultoriaPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('consultorias:view')
  const { id } = await params
  const [c, minutasVinculadas] = await Promise.all([
    getConsultoria(id),
    getMinutasAssistidasByEntity('consultoria', id),
  ])
  if (!c) notFound()

  const atualizarComId = atualizarConsultoria.bind(null, id)
  const excluirComId = excluirConsultoria.bind(null, id)

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/consultorias" className="text-sm text-gray-400 hover:text-[#DFA568] transition-colors">
          ← Consultorias
        </Link>
        <form action={excluirComId}>
          <DeleteButton
            confirmMessage="Excluir esta consultoria?"
            className="text-xs text-red-400 hover:text-red-600 transition-colors"
          >
            Excluir
          </DeleteButton>
        </form>
      </div>

      {/* Header */}
      <div className="bg-white rounded border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-[#1F2346]">{c.imobiliaria}</h1>
          <StatusBadge status={c.status} />
        </div>
        <div className="grid grid-cols-3 gap-6 text-sm">
          <div>
            <span className="text-xs text-gray-400 block">Responsável</span>
            <span>{c.responsavel}</span>
          </div>
          <div>
            <span className="text-xs text-gray-400 block">Valor mensal</span>
            <span className="font-semibold text-[#1F2346]">{formatCurrency(c.valorMensal)}</span>
          </div>
          <div>
            <span className="text-xs text-gray-400 block">Renovação</span>
            <span>{formatDate(c.dataRenovacao)}</span>
          </div>
        </div>
        {c.escopo.length > 0 && (
          <div className="mt-4">
            <span className="text-xs text-gray-400 block mb-2">Escopo mensal</span>
            <ul className="space-y-1">
              {c.escopo.map((item, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#DFA568] shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        {c.observacoes && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400 block mb-1">Observações</span>
            <p className="text-sm text-gray-600">{c.observacoes}</p>
          </div>
        )}
      </div>

      {/* Histórico */}
      {c.historico.length > 0 && (
        <div className="bg-white rounded border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-semibold text-[#1F2346] mb-4">Histórico de entregas</h2>
          <div className="space-y-2">
            {c.historico.map((h) => (
              <div key={h.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 capitalize">{formatMes(h.mes)}</span>
                <div className="flex items-center gap-3">
                  {h.observacao && <span className="text-xs text-gray-400">{h.observacao}</span>}
                  <StatusBadge status={h.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editar */}
      <details className="bg-white rounded border border-gray-200 p-6 group">
        <summary className="text-sm font-medium text-[#1F2346] cursor-pointer list-none flex items-center justify-between">
          Editar dados
          <span className="text-gray-400 text-xs group-open:rotate-180 transition-transform inline-block">▼</span>
        </summary>
        <form action={atualizarComId} className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Nome da imobiliária</label>
              <input name="imobiliaria" defaultValue={c.imobiliaria} required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Responsável</label>
              <select name="responsavel" defaultValue={c.responsavel} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
                {RESPONSAVEIS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select name="status" defaultValue={c.status} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
                {STATUS_CONSULTORIA.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Valor mensal (R$)</label>
              <input type="number" name="valorMensal" defaultValue={c.valorMensal} min="0" step="0.01" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Data de renovação</label>
              <input type="date" name="dataRenovacao" defaultValue={c.dataRenovacao} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Escopo (uma entrega por linha)</label>
              <textarea name="escopo" defaultValue={c.escopo.join('\n')} rows={4} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568] resize-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Observações</label>
              <textarea name="observacoes" defaultValue={c.observacoes} rows={2} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568] resize-none" />
            </div>
          </div>
          <button type="submit" className="px-4 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90" style={{ backgroundColor: '#DFA568' }}>
            Salvar
          </button>
        </form>
      </details>
      <EntityAdvisorPanel entityType="consultoria" entityId={c.id} />
      <KnowledgeRecommendations entityType="consultoria" entityId={c.id} />

      {/* Minutas vinculadas */}
      <div className="mt-6 bg-white border border-gray-200 rounded p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-700">Minutas assistidas vinculadas</h2>
          <Link
            href={`/minutas/nova?entityType=consultoria&entityId=${c.id}`}
            className="text-xs text-[#DFA568] hover:underline"
          >
            + Montar nova minuta
          </Link>
        </div>
        {minutasVinculadas.length === 0 ? (
          <p className="text-sm text-gray-400">Nenhuma minuta vinculada.</p>
        ) : (
          <div className="space-y-2">
            {minutasVinculadas.map((m) => (
              <div key={m.id} className="flex items-center justify-between text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                <div>
                  <Link href={`/minutas/${m.id}`} className="text-[#1F2346] hover:text-[#DFA568] font-medium transition-colors">
                    {m.titulo}
                  </Link>
                  <span className="ml-2 text-xs text-gray-400">{TIPO_DOCUMENTO_MINUTA_LABELS[m.tipoDocumento]}</span>
                </div>
                <StatusBadge status={m.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
