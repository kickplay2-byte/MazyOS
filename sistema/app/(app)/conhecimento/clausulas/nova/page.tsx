import Link from 'next/link'
import { requirePermission } from '@/lib/auth'
import { criarClausulaPadrao } from '@/lib/actions'
import { CATEGORIAS_CLAUSULA, CATEGORIA_CLAUSULA_LABELS, STATUS_BASE_CONHECIMENTO, STATUS_BASE_CONHECIMENTO_LABELS, RESPONSAVEIS } from '@/lib/types'

export const metadata = { title: 'Nova Cláusula — PIPE OS' }

const inputClass = 'w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]'

export default async function NovaClausulaPage() {
  await requirePermission('conhecimento:manage')
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/conhecimento/clausulas" className="text-sm text-gray-400 hover:text-[#DFA568] transition-colors">
          ← Cláusulas Padrão
        </Link>
        <h1 className="text-xl font-semibold text-[#1F2346] mt-2">Nova cláusula padrão</h1>
      </div>

      <form action={criarClausulaPadrao} className="bg-white rounded border border-gray-200 p-6 space-y-6">
        <div>
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Identificação</div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Título *</label>
              <input name="titulo" required placeholder="Ex: Arras Confirmatórias" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Descrição</label>
              <input name="descricao" placeholder="Quando usar esta cláusula" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Categoria *</label>
                <select name="categoria" required className={inputClass}>
                  {CATEGORIAS_CLAUSULA.map((c) => (
                    <option key={c} value={c}>{CATEGORIA_CLAUSULA_LABELS[c]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status *</label>
                <select name="status" required className={inputClass}>
                  {STATUS_BASE_CONHECIMENTO.map((s) => (
                    <option key={s} value={s}>{STATUS_BASE_CONHECIMENTO_LABELS[s]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Responsável *</label>
                <select name="responsavel" required className={inputClass}>
                  {RESPONSAVEIS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Última revisão</label>
                <input type="date" name="ultimaRevisao" className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Aplicação *</label>
              <input name="aplicacao" required placeholder="Ex: Contratos de promessa de compra e venda em geral" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tags (separadas por vírgula)</label>
              <input name="tags" placeholder="Ex: arras, sinal, inadimplemento" className={inputClass} />
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Texto da cláusula *</div>
          <textarea
            name="texto"
            required
            rows={10}
            placeholder="Texto jurídico da cláusula..."
            className={`${inputClass} resize-y`}
          />
        </div>

        <div>
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Riscos e atenções</div>
          <textarea
            name="riscos"
            rows={3}
            placeholder="Riscos identificados, casos de uso inadequado, observações..."
            className={`${inputClass} resize-y`}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="px-5 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90" style={{ backgroundColor: '#DFA568' }}>
            Salvar cláusula
          </button>
          <Link href="/conhecimento/clausulas" className="px-5 py-2 text-sm font-medium rounded border border-gray-200 text-gray-500 hover:bg-gray-50">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
