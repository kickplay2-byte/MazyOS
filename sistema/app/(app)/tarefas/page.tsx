import Link from 'next/link'
import { getTarefas } from '@/lib/data'
import { prazoLabel, prioridadeLabel, vinculoTipoLabel } from '@/lib/utils'
import { RESPONSAVEIS } from '@/lib/types'
import PageHeader from '@/components/ui/PageHeader'
import { requirePermission } from '@/lib/auth'

const STATUS_CORES: Record<string, { bg: string; text: string }> = {
  pendente:     { bg: '#f8fafc', text: '#64748b' },
  em_andamento: { bg: '#eff6ff', text: '#3b82f6' },
  concluida:    { bg: '#f0fdf4', text: '#15803d' },
  cancelada:    { bg: '#f9fafb', text: '#9ca3af' },
}

const PRIORIDADE_CORES: Record<string, string> = {
  baixa:   '#94a3b8',
  normal:  '#64748b',
  alta:    '#f59e0b',
  urgente: '#dc2626',
}

const COLUNAS = [
  { key: 'pendente',     label: 'Pendente' },
  { key: 'em_andamento', label: 'Em andamento' },
  { key: 'concluida',    label: 'Concluída' },
]

export default async function TarefasPage() {
  await requirePermission('tarefas:view')
  const tarefas = (await getTarefas()).filter((t) => t.status !== 'cancelada')

  const porResponsavel = RESPONSAVEIS.map((r) => ({
    responsavel: r,
    total: tarefas.filter((t) => t.responsavel === r).length,
    pendentes: tarefas.filter((t) => t.responsavel === r && t.status === 'pendente').length,
    atrasadas: tarefas.filter((t) => {
      if (t.responsavel !== r) return false
      if (t.status === 'concluida' || t.status === 'cancelada') return false
      if (!t.prazo) return false
      return new Date(t.prazo) < new Date()
    }).length,
  })).filter((r) => r.total > 0)

  return (
    <div className="p-8">
      <PageHeader
        title="Tarefas"
        description="Acompanhamento por responsável e status"
        action={
          <Link href="/tarefas/nova" className="px-4 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90" style={{ backgroundColor: '#DFA568' }}>
            + Nova tarefa
          </Link>
        }
      />

      {/* Resumo por responsável */}
      {porResponsavel.length > 0 && (
        <div className="flex gap-3 mb-8 flex-wrap">
          {porResponsavel.map((r) => (
            <div key={r.responsavel} className="bg-white border border-gray-200 rounded px-4 py-3 min-w-[140px]">
              <div className="text-xs text-gray-400 mb-1">{r.responsavel}</div>
              <div className="text-lg font-semibold text-gray-900">{r.total}</div>
              <div className="flex gap-3 mt-1 text-xs text-gray-400">
                <span>{r.pendentes} pend.</span>
                {r.atrasadas > 0 && <span className="text-red-500">{r.atrasadas} atras.</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Kanban */}
      <div className="grid grid-cols-3 gap-5">
        {COLUNAS.map((col) => {
          const colTarefas = tarefas.filter((t) => t.status === col.key)
          const cores = STATUS_CORES[col.key]
          return (
            <div key={col.key}>
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded"
                  style={{ backgroundColor: cores.bg, color: cores.text }}
                >
                  {col.label}
                </span>
                <span className="text-xs text-gray-400">{colTarefas.length}</span>
              </div>
              <div className="space-y-2">
                {colTarefas.length === 0 && (
                  <div className="bg-white border border-dashed border-gray-200 rounded p-4 text-center text-xs text-gray-400">
                    Nenhuma tarefa
                  </div>
                )}
                {colTarefas.map((t) => {
                  const prazo = prazoLabel(t.prazo)
                  return (
                    <Link
                      key={t.id}
                      href={`/tarefas/${t.id}`}
                      className="block bg-white border border-gray-200 rounded p-3.5 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-sm text-gray-800 leading-snug">{t.titulo}</span>
                        <div
                          className="w-2 h-2 rounded-full shrink-0 mt-1"
                          style={{ backgroundColor: PRIORIDADE_CORES[t.prioridade] }}
                          title={prioridadeLabel(t.prioridade)}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{t.responsavel}</span>
                        {prazo && (
                          <span style={{ color: prazo.urgente ? '#dc2626' : undefined }}>
                            {prazo.texto}
                          </span>
                        )}
                      </div>
                      {t.vinculoTipo !== 'livre' && (
                        <div className="mt-1.5 text-xs text-gray-400">
                          {vinculoTipoLabel(t.vinculoTipo)}
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
  )
}
