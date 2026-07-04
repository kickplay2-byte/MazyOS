import Link from 'next/link'
import { requirePermission } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { getChecklistJuridicoById } from '@/lib/data'
import { STATUS_BASE_CONHECIMENTO, STATUS_BASE_CONHECIMENTO_LABELS, RESPONSAVEIS } from '@/lib/types'
import { atualizarChecklistJuridico, arquivarChecklistJuridico } from '@/lib/actions'

export default async function ChecklistPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('conhecimento:view')
  const { id } = await params
  const checklist = await getChecklistJuridicoById(id)
  if (!checklist) notFound()

  const isArquivado = checklist.status === 'arquivado'
  const inputClass = 'w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]'
  const obrigatorios = checklist.itens.filter((i) => i.obrigatorio).length

  const statusColors: Record<string, string> = {
    ativo: 'bg-green-50 text-green-700',
    rascunho: 'bg-gray-100 text-gray-500',
    em_revisao: 'bg-yellow-50 text-yellow-700',
    desatualizado: 'bg-orange-50 text-orange-700',
    arquivado: 'bg-gray-100 text-gray-400',
  }

  return (
    <div className="p-8 max-w-3xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/conhecimento/checklists" className="text-sm text-gray-400 hover:text-[#DFA568] transition-colors">
            ← Checklists Jurídicos
          </Link>
          <h1 className="text-xl font-semibold text-[#1F2346] mt-2">{checklist.titulo}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${statusColors[checklist.status] ?? 'bg-gray-100 text-gray-500'}`}>
              {STATUS_BASE_CONHECIMENTO_LABELS[checklist.status]}
            </span>
            <span className="text-xs text-gray-400">{checklist.tipoDemanda.replace(/_/g, ' ')} · {checklist.area}</span>
          </div>
        </div>
        {!isArquivado && (
          <form action={arquivarChecklistJuridico.bind(null, checklist.id)}>
            <button type="submit" className="text-xs px-3 py-1.5 border border-gray-200 rounded text-gray-400 hover:text-red-600 hover:border-red-200 transition-colors">
              Arquivar
            </button>
          </form>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded p-5">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div>
            <dt className="text-gray-400 text-xs">Total de itens</dt>
            <dd className="text-gray-800">{checklist.itens.length} ({obrigatorios} obrigatórios)</dd>
          </div>
          <div>
            <dt className="text-gray-400 text-xs">Responsável</dt>
            <dd className="text-gray-800">{checklist.responsavel}</dd>
          </div>
          <div>
            <dt className="text-gray-400 text-xs">Última revisão</dt>
            <dd className="text-gray-800">{checklist.ultimaRevisao ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-gray-400 text-xs">Atualizado</dt>
            <dd className="text-gray-800">{new Date(checklist.updatedAt).toLocaleDateString('pt-BR')}</dd>
          </div>
        </dl>
        {checklist.descricao && (
          <p className="mt-3 text-sm text-gray-600 border-t border-gray-50 pt-3">{checklist.descricao}</p>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded p-5">
        <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">Itens do checklist</div>
        <ol className="space-y-2">
          {[...checklist.itens]
            .sort((a, b) => a.ordem - b.ordem)
            .map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <span className="shrink-0 w-5 h-5 mt-0.5 rounded border border-gray-200 bg-gray-50 text-xs flex items-center justify-center text-gray-400">
                  {item.ordem}
                </span>
                <div className="flex-1">
                  <span className={`text-sm ${item.obrigatorio ? 'text-gray-900' : 'text-gray-500'}`}>
                    {item.texto}
                  </span>
                  {!item.obrigatorio && (
                    <span className="ml-2 text-xs text-gray-400">(opcional)</span>
                  )}
                  {item.observacao && (
                    <p className="text-xs text-gray-400 mt-0.5 italic">{item.observacao}</p>
                  )}
                </div>
              </li>
            ))}
        </ol>
      </div>

      {!isArquivado && (
        <details className="bg-white border border-gray-200 rounded">
          <summary className="px-5 py-4 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 rounded">
            Editar checklist
          </summary>
          <form action={atualizarChecklistJuridico.bind(null, checklist.id)} className="p-5 pt-0 space-y-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Título *</label>
                <input name="titulo" required defaultValue={checklist.titulo} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Descrição</label>
                <input name="descricao" defaultValue={checklist.descricao ?? ''} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Tipo de demanda *</label>
                <input name="tipoDemanda" required defaultValue={checklist.tipoDemanda} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Área</label>
                <input name="area" defaultValue={checklist.area} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status *</label>
                <select name="status" required defaultValue={checklist.status} className={inputClass}>
                  {STATUS_BASE_CONHECIMENTO.map((s) => <option key={s} value={s}>{STATUS_BASE_CONHECIMENTO_LABELS[s]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Responsável *</label>
                <select name="responsavel" required defaultValue={checklist.responsavel} className={inputClass}>
                  {RESPONSAVEIS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Última revisão</label>
                <input type="date" name="ultimaRevisao" defaultValue={checklist.ultimaRevisao ?? ''} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Itens (um por linha) *</label>
                <p className="text-xs text-gray-400 mb-1">Ao salvar, todos os itens serão recriados a partir deste texto.</p>
                <textarea
                  name="itens"
                  required
                  rows={12}
                  defaultValue={[...checklist.itens].sort((a, b) => a.ordem - b.ordem).map((i) => i.texto).join('\n')}
                  className={`${inputClass} resize-y font-mono text-xs`}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-5 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90" style={{ backgroundColor: '#DFA568' }}>
                Salvar alterações
              </button>
            </div>
          </form>
        </details>
      )}
    </div>
  )
}
