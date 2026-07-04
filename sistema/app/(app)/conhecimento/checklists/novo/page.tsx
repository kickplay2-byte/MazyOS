import Link from 'next/link'
import { requirePermission } from '@/lib/auth'
import { criarChecklistJuridico } from '@/lib/actions'
import { STATUS_BASE_CONHECIMENTO, STATUS_BASE_CONHECIMENTO_LABELS, RESPONSAVEIS } from '@/lib/types'

export const metadata = { title: 'Novo Checklist — PIPE OS' }

const inputClass = 'w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]'

export default async function NovoChecklistPage() {
  await requirePermission('conhecimento:manage')
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/conhecimento/checklists" className="text-sm text-gray-400 hover:text-[#DFA568] transition-colors">
          ← Checklists Jurídicos
        </Link>
        <h1 className="text-xl font-semibold text-[#1F2346] mt-2">Novo checklist jurídico</h1>
      </div>

      <form action={criarChecklistJuridico} className="bg-white rounded border border-gray-200 p-6 space-y-6">
        <div>
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Identificação</div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Título *</label>
              <input name="titulo" required placeholder="Ex: Compra e Venda com Financiamento" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Descrição</label>
              <input name="descricao" placeholder="Quando usar este checklist" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Tipo de demanda *</label>
                <input name="tipoDemanda" required placeholder="Ex: compra_venda, inventario" className={inputClass} />
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
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Itens do checklist *</div>
          <p className="text-xs text-gray-400 mb-2">
            Um item por linha. Todos serão marcados como obrigatórios. Você pode ajustar depois no detalhe.
          </p>
          <textarea
            name="itens"
            required
            rows={12}
            placeholder={"Matrícula atualizada do imóvel\nCertidão de ônus reais\nCertidão negativa de IPTU\nHabite-se ou certidão de conclusão de obra\n..."}
            className={`${inputClass} resize-y font-mono text-xs`}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="px-5 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90" style={{ backgroundColor: '#DFA568' }}>
            Salvar checklist
          </button>
          <Link href="/conhecimento/checklists" className="px-5 py-2 text-sm font-medium rounded border border-gray-200 text-gray-500 hover:bg-gray-50">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
