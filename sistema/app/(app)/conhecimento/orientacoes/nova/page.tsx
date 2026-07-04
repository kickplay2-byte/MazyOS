import Link from 'next/link'
import { requirePermission } from '@/lib/auth'
import { criarOrientacaoInterna } from '@/lib/actions'
import { STATUS_BASE_CONHECIMENTO, STATUS_BASE_CONHECIMENTO_LABELS, RESPONSAVEIS } from '@/lib/types'

export const metadata = { title: 'Nova Orientação — PIPE OS' }

const inputClass = 'w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]'

export default async function NovaOrientacaoPage() {
  await requirePermission('conhecimento:manage')
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/conhecimento/orientacoes" className="text-sm text-gray-400 hover:text-[#DFA568] transition-colors">
          ← Orientações Internas
        </Link>
        <h1 className="text-xl font-semibold text-[#1F2346] mt-2">Nova orientação interna</h1>
      </div>

      <form action={criarOrientacaoInterna} className="bg-white rounded border border-gray-200 p-6 space-y-6">
        <div>
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Identificação</div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Título *</label>
              <input name="titulo" required placeholder="Ex: Como Tratar Financiamento Insuficiente" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Descrição</label>
              <input name="descricao" placeholder="Resumo do que esta orientação trata" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Tema *</label>
                <input name="tema" required placeholder="Ex: Financiamento Bancário" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Área</label>
                <input name="area" defaultValue="Direito Imobiliário" className={inputClass} />
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
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Última revisão</label>
                <input type="date" name="ultimaRevisao" className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tags (separadas por vírgula)</label>
              <input name="tags" placeholder="Ex: financiamento, banco, procedimento" className={inputClass} />
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Conteúdo *</div>
          <p className="text-xs text-gray-400 mb-2">Descreva o procedimento, as situações e os alertas. Use títulos em MAIÚSCULAS para organizar.</p>
          <textarea
            name="conteudo"
            required
            rows={16}
            placeholder={'SITUAÇÃO\n...\n\nPROCEDIMENTO\n1. ...\n2. ...\n\nALERTA\n...'}
            className={`${inputClass} resize-y`}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="px-5 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90" style={{ backgroundColor: '#DFA568' }}>
            Salvar orientação
          </button>
          <Link href="/conhecimento/orientacoes" className="px-5 py-2 text-sm font-medium rounded border border-gray-200 text-gray-500 hover:bg-gray-50">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
