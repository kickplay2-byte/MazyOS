import Link from 'next/link'
import { requirePermission } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { getClausulaPadraoById } from '@/lib/data'
import { CATEGORIAS_CLAUSULA, CATEGORIA_CLAUSULA_LABELS, STATUS_BASE_CONHECIMENTO, STATUS_BASE_CONHECIMENTO_LABELS, RESPONSAVEIS } from '@/lib/types'
import { atualizarClausulaPadrao, arquivarClausulaPadrao } from '@/lib/actions'

export default async function ClausulaPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('conhecimento:view')
  const { id } = await params
  const clausula = await getClausulaPadraoById(id)
  if (!clausula) notFound()

  const isArquivado = clausula.status === 'arquivado'
  const inputClass = 'w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]'

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
          <Link href="/conhecimento/clausulas" className="text-sm text-gray-400 hover:text-[#DFA568] transition-colors">
            ← Cláusulas Padrão
          </Link>
          <h1 className="text-xl font-semibold text-[#1F2346] mt-2">{clausula.titulo}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${statusColors[clausula.status] ?? 'bg-gray-100 text-gray-500'}`}>
              {STATUS_BASE_CONHECIMENTO_LABELS[clausula.status]}
            </span>
            <span className="text-xs text-gray-400">{CATEGORIA_CLAUSULA_LABELS[clausula.categoria] ?? clausula.categoria}</span>
          </div>
        </div>
        {!isArquivado && (
          <form action={arquivarClausulaPadrao.bind(null, clausula.id)}>
            <button type="submit" className="text-xs px-3 py-1.5 border border-gray-200 rounded text-gray-400 hover:text-red-600 hover:border-red-200 transition-colors">
              Arquivar
            </button>
          </form>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded p-5">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div>
            <dt className="text-gray-400 text-xs">Área</dt>
            <dd className="text-gray-800">{clausula.area}</dd>
          </div>
          <div>
            <dt className="text-gray-400 text-xs">Responsável</dt>
            <dd className="text-gray-800">{clausula.responsavel}</dd>
          </div>
          <div>
            <dt className="text-gray-400 text-xs">Última revisão</dt>
            <dd className="text-gray-800">{clausula.ultimaRevisao ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-gray-400 text-xs">Atualizado</dt>
            <dd className="text-gray-800">{new Date(clausula.updatedAt).toLocaleDateString('pt-BR')}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-gray-400 text-xs">Aplicação</dt>
            <dd className="text-gray-800 mt-0.5">{clausula.aplicacao}</dd>
          </div>
        </dl>
        {clausula.descricao && (
          <p className="mt-3 text-sm text-gray-600 border-t border-gray-50 pt-3">{clausula.descricao}</p>
        )}
        {clausula.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {clausula.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded p-5">
        <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Texto da cláusula</div>
        <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{clausula.texto}</pre>
      </div>

      {clausula.riscos && (
        <div className="bg-amber-50 border border-amber-200 rounded p-4">
          <div className="text-xs font-medium text-amber-700 uppercase tracking-widest mb-2">Riscos e atenções</div>
          <p className="text-sm text-amber-800 leading-relaxed">{clausula.riscos}</p>
        </div>
      )}

      {!isArquivado && (
        <details className="bg-white border border-gray-200 rounded">
          <summary className="px-5 py-4 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 rounded">
            Editar cláusula
          </summary>
          <form action={atualizarClausulaPadrao.bind(null, clausula.id)} className="p-5 pt-0 space-y-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Título *</label>
                <input name="titulo" required defaultValue={clausula.titulo} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Descrição</label>
                <input name="descricao" defaultValue={clausula.descricao ?? ''} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Categoria *</label>
                <select name="categoria" required defaultValue={clausula.categoria} className={inputClass}>
                  {CATEGORIAS_CLAUSULA.map((c) => <option key={c} value={c}>{CATEGORIA_CLAUSULA_LABELS[c]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status *</label>
                <select name="status" required defaultValue={clausula.status} className={inputClass}>
                  {STATUS_BASE_CONHECIMENTO.map((s) => <option key={s} value={s}>{STATUS_BASE_CONHECIMENTO_LABELS[s]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Responsável *</label>
                <select name="responsavel" required defaultValue={clausula.responsavel} className={inputClass}>
                  {RESPONSAVEIS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Última revisão</label>
                <input type="date" name="ultimaRevisao" defaultValue={clausula.ultimaRevisao ?? ''} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Aplicação *</label>
                <input name="aplicacao" required defaultValue={clausula.aplicacao} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Tags (separadas por vírgula)</label>
                <input name="tags" defaultValue={clausula.tags.join(', ')} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Texto da cláusula *</label>
                <textarea name="texto" required rows={10} defaultValue={clausula.texto} className={`${inputClass} resize-y`} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Riscos e atenções</label>
                <textarea name="riscos" rows={3} defaultValue={clausula.riscos ?? ''} className={`${inputClass} resize-y`} />
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
