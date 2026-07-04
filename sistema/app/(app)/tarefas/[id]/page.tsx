import Link from 'next/link'
import { requirePermission } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { getTarefa, getProcesso, getExtrajudicial, getConsultoria } from '@/lib/data'
import { atualizarTarefa, excluirTarefa, alterarStatusTarefa } from '@/lib/actions'
import { RESPONSAVEIS, VINCULOS_TIPO, STATUS_TAREFA } from '@/lib/types'
import { formatDate, prazoLabel, statusTarefaLabel, prioridadeLabel, vinculoTipoLabel } from '@/lib/utils'


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

export default async function TarefaPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('tarefas:view')
  const { id } = await params
  const tarefa = await getTarefa(id)
  if (!tarefa) notFound()

  let vinculoNomeStr: string | undefined
  if (tarefa.vinculoTipo !== 'livre' && tarefa.vinculoId) {
    if (tarefa.vinculoTipo === 'processo') {
      const p = await getProcesso(tarefa.vinculoId)
      vinculoNomeStr = p ? `${p.numero} — ${p.tipo}` : tarefa.vinculoId
    } else if (tarefa.vinculoTipo === 'extrajudicial') {
      const e = await getExtrajudicial(tarefa.vinculoId)
      vinculoNomeStr = e ? e.titulo : tarefa.vinculoId
    } else if (tarefa.vinculoTipo === 'consultoria') {
      const c = await getConsultoria(tarefa.vinculoId)
      vinculoNomeStr = c ? c.imobiliaria : tarefa.vinculoId
    }
  }

  const prazo = prazoLabel(tarefa.prazo)
  const statusCores = STATUS_CORES[tarefa.status]

  const atualizarComId = atualizarTarefa.bind(null, id)
  const excluirComId = excluirTarefa.bind(null, id)

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/tarefas" className="text-sm text-gray-400 hover:text-[#DFA568] transition-colors">
          ← Tarefas
        </Link>
      </div>

      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#1F2346] leading-snug">{tarefa.titulo}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span
              className="text-xs font-medium px-2.5 py-1 rounded"
              style={{ backgroundColor: statusCores.bg, color: statusCores.text }}
            >
              {statusTarefaLabel(tarefa.status)}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PRIORIDADE_CORES[tarefa.prioridade] }} />
              {prioridadeLabel(tarefa.prioridade)}
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white border border-gray-200 rounded p-5 mb-5 grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-xs text-gray-400 mb-0.5">Responsável</div>
          <div className="text-gray-800">{tarefa.responsavel}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-0.5">Prazo</div>
          <div className={prazo?.urgente ? 'text-red-600 font-medium' : 'text-gray-800'}>
            {tarefa.prazo ? formatDate(tarefa.prazo) : '—'}
            {prazo && <span className="text-xs ml-1 text-gray-400">({prazo.texto})</span>}
          </div>
        </div>
        {tarefa.vinculoTipo !== 'livre' && (
          <div className="col-span-2">
            <div className="text-xs text-gray-400 mb-0.5">Vínculo</div>
            <div className="text-gray-800">
              {vinculoTipoLabel(tarefa.vinculoTipo)}
              {vinculoNomeStr && <span className="text-gray-500 ml-1">— {vinculoNomeStr}</span>}
            </div>
          </div>
        )}
        {tarefa.descricao && (
          <div className="col-span-2">
            <div className="text-xs text-gray-400 mb-0.5">Descrição</div>
            <div className="text-gray-700 whitespace-pre-wrap">{tarefa.descricao}</div>
          </div>
        )}
      </div>

      {/* Ações rápidas de status */}
      {tarefa.status !== 'concluida' && tarefa.status !== 'cancelada' && (
        <div className="flex gap-2 mb-6">
          {tarefa.status === 'pendente' && (
            <form action={alterarStatusTarefa.bind(null, id, 'em_andamento')}>
              <button type="submit" className="px-4 py-1.5 text-xs font-medium rounded border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors">
                Iniciar
              </button>
            </form>
          )}
          <form action={alterarStatusTarefa.bind(null, id, 'concluida')}>
            <button type="submit" className="px-4 py-1.5 text-xs font-medium rounded border border-green-200 text-green-700 hover:bg-green-50 transition-colors">
              Marcar como concluída
            </button>
          </form>
          <form action={alterarStatusTarefa.bind(null, id, 'cancelada')}>
            <button type="submit" className="px-4 py-1.5 text-xs font-medium rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
          </form>
        </div>
      )}

      {/* Formulário de edição */}
      <details className="bg-white border border-gray-200 rounded">
        <summary className="px-5 py-3.5 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 rounded">
          Editar tarefa
        </summary>
        <form action={atualizarComId} className="p-5 pt-0 space-y-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Título *</label>
              <input name="titulo" required defaultValue={tarefa.titulo} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Descrição</label>
              <textarea name="descricao" rows={2} defaultValue={tarefa.descricao} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568] resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Responsável</label>
              <select name="responsavel" defaultValue={tarefa.responsavel} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
                {RESPONSAVEIS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select name="status" defaultValue={tarefa.status} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
                {STATUS_TAREFA.map((s) => <option key={s} value={s}>{statusTarefaLabel(s)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Prioridade</label>
              <select name="prioridade" defaultValue={tarefa.prioridade} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
                <option value="baixa">Baixa</option>
                <option value="normal">Normal</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Prazo</label>
              <input type="date" name="prazo" defaultValue={tarefa.prazo} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tipo de vínculo</label>
              <select name="vinculoTipo" defaultValue={tarefa.vinculoTipo} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
                {VINCULOS_TIPO.map((v) => <option key={v} value={v}>{vinculoTipoLabel(v)}</option>)}
              </select>
            </div>
            <input type="hidden" name="vinculoId" value={tarefa.vinculoId ?? ''} />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" className="px-4 py-1.5 text-sm font-medium rounded text-[#1F2346] hover:opacity-90" style={{ backgroundColor: '#DFA568' }}>
              Salvar
            </button>
          </div>
        </form>
      </details>

      <div className="mt-4">
        <form action={excluirComId}>
          <button type="submit" className="text-xs text-gray-400 hover:text-red-500 transition-colors">
            Excluir tarefa
          </button>
        </form>
      </div>
    </div>
  )
}
