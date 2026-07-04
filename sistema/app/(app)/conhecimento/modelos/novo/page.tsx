import Link from 'next/link'
import { requirePermission } from '@/lib/auth'
import { criarModeloJuridico } from '@/lib/actions'
import { CATEGORIAS_MODELO, CATEGORIA_MODELO_LABELS, TIPOS_DOCUMENTO, TIPO_DOCUMENTO_LABELS, STATUS_BASE_CONHECIMENTO, STATUS_BASE_CONHECIMENTO_LABELS, RESPONSAVEIS } from '@/lib/types'

export const metadata = { title: 'Novo Modelo — PIPE OS' }

const inputClass = 'w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]'

export default async function NovoModeloPage() {
  await requirePermission('conhecimento:manage')
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/conhecimento/modelos" className="text-sm text-gray-400 hover:text-[#DFA568] transition-colors">
          ← Modelos Jurídicos
        </Link>
        <h1 className="text-xl font-semibold text-[#1F2346] mt-2">Novo modelo jurídico</h1>
      </div>

      <form action={criarModeloJuridico} className="bg-white rounded border border-gray-200 p-6 space-y-6">
        <div>
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Identificação</div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Título *</label>
              <input name="titulo" required placeholder="Ex: Contrato de Compra e Venda com Financiamento" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Descrição</label>
              <input name="descricao" placeholder="Breve descrição do modelo e quando usar" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Categoria *</label>
                <select name="categoria" required className={inputClass}>
                  {CATEGORIAS_MODELO.map((c) => (
                    <option key={c} value={c}>{CATEGORIA_MODELO_LABELS[c]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Tipo de documento *</label>
                <select name="tipoDocumento" required className={inputClass}>
                  {TIPOS_DOCUMENTO.map((t) => (
                    <option key={t} value={t}>{TIPO_DOCUMENTO_LABELS[t]}</option>
                  ))}
                </select>
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
                <label className="block text-xs font-medium text-gray-500 mb-1">Versão</label>
                <input name="versao" defaultValue="1.0" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Responsável *</label>
                <select name="responsavel" required className={inputClass}>
                  {RESPONSAVEIS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Última revisão</label>
              <input type="date" name="ultimaRevisao" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tags (separadas por vírgula)</label>
              <input name="tags" placeholder="Ex: financiamento, compra-venda, CEF" className={inputClass} />
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Conteúdo *</div>
          <p className="text-xs text-gray-400 mb-2">Use [CAMPO] para indicar variáveis a preencher. Preserve as quebras de linha.</p>
          <textarea
            name="conteudo"
            required
            rows={18}
            placeholder="Texto do modelo jurídico..."
            className={`${inputClass} resize-y font-mono text-xs leading-relaxed`}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="px-5 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90" style={{ backgroundColor: '#DFA568' }}>
            Salvar modelo
          </button>
          <Link href="/conhecimento/modelos" className="px-5 py-2 text-sm font-medium rounded border border-gray-200 text-gray-500 hover:bg-gray-50">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
