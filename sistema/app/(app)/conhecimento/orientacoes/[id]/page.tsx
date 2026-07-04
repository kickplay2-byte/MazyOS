import Link from 'next/link'
import { requirePermission } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { getOrientacaoInternaById } from '@/lib/data'
import { STATUS_BASE_CONHECIMENTO, STATUS_BASE_CONHECIMENTO_LABELS, RESPONSAVEIS } from '@/lib/types'
import { atualizarOrientacaoInterna, arquivarOrientacaoInterna } from '@/lib/actions'

export default async function OrientacaoPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('conhecimento:view')
  const { id } = await params
  const orientacao = await getOrientacaoInternaById(id)
  if (!orientacao) notFound()

  const isArquivado = orientacao.status === 'arquivado'
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
          <Link href="/conhecimento/orientacoes" className="text-sm text-gray-400 hover:text-[#DFA568] transition-colors">
            ← Orientações Internas
          </Link>
          <h1 className="text-xl font-semibold text-[#1F2346] mt-2">{orientacao.titulo}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${statusColors[orientacao.status] ?? 'bg-gray-100 text-gray-500'}`}>
              {STATUS_BASE_CONHECIMENTO_LABELS[orientacao.status]}
            </span>
            <span className="text-xs text-gray-400">{orientacao.tema} · {orientacao.area}</span>
          </div>
        </div>
        {!isArquivado && (
          <form action={arquivarOrientacaoInterna.bind(null, orientacao.id)}>
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
            <dd className="text-gray-800">{orientacao.area}</dd>
          </div>
          <div>
            <dt className="text-gray-400 text-xs">Responsável</dt>
            <dd className="text-gray-800">{orientacao.responsavel}</dd>
          </div>
          <div>
            <dt className="text-gray-400 text-xs">Última revisão</dt>
            <dd className="text-gray-800">{orientacao.ultimaRevisao ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-gray-400 text-xs">Atualizado</dt>
            <dd className="text-gray-800">{new Date(orientacao.updatedAt).toLocaleDateString('pt-BR')}</dd>
          </div>
        </dl>
        {orientacao.descricao && (
          <p className="mt-3 text-sm text-gray-600 border-t border-gray-50 pt-3">{orientacao.descricao}</p>
        )}
        {orientacao.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {orientacao.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded p-5">
        <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Conteúdo</div>
        <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{orientacao.conteudo}</pre>
      </div>

      {!isArquivado && (
        <details className="bg-white border border-gray-200 rounded">
          <summary className="px-5 py-4 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 rounded">
            Editar orientação
          </summary>
          <form action={atualizarOrientacaoInterna.bind(null, orientacao.id)} className="p-5 pt-0 space-y-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Título *</label>
                <input name="titulo" required defaultValue={orientacao.titulo} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Descrição</label>
                <input name="descricao" defaultValue={orientacao.descricao ?? ''} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Tema *</label>
                <input name="tema" required defaultValue={orientacao.tema} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Área</label>
                <input name="area" defaultValue={orientacao.area} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status *</label>
                <select name="status" required defaultValue={orientacao.status} className={inputClass}>
                  {STATUS_BASE_CONHECIMENTO.map((s) => <option key={s} value={s}>{STATUS_BASE_CONHECIMENTO_LABELS[s]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Responsável *</label>
                <select name="responsavel" required defaultValue={orientacao.responsavel} className={inputClass}>
                  {RESPONSAVEIS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Última revisão</label>
                <input type="date" name="ultimaRevisao" defaultValue={orientacao.ultimaRevisao ?? ''} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Tags (separadas por vírgula)</label>
                <input name="tags" defaultValue={orientacao.tags.join(', ')} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Conteúdo *</label>
                <textarea name="conteudo" required rows={16} defaultValue={orientacao.conteudo} className={`${inputClass} resize-y`} />
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
