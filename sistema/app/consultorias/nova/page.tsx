import { criarConsultoria } from '@/lib/actions'
import { RESPONSAVEIS, STATUS_CONSULTORIA } from '@/lib/types'
import Link from 'next/link'

export default function NovaConsultoriaPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/consultorias" className="text-sm text-gray-400 hover:text-[#DFA568] transition-colors">
          ← Consultorias
        </Link>
        <h1 className="text-2xl font-semibold text-[#1F2346] mt-2">Nova imobiliária</h1>
      </div>

      <form action={criarConsultoria} className="bg-white rounded border border-gray-200 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Nome da imobiliária *</label>
            <input
              name="imobiliaria"
              required
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Responsável *</label>
            <select name="responsavel" required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
              {RESPONSAVEIS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Status *</label>
            <select name="status" required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
              {STATUS_CONSULTORIA.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Valor mensal (R$) *</label>
            <input
              type="number"
              name="valorMensal"
              required
              min="0"
              step="0.01"
              placeholder="0,00"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Data de renovação</label>
            <input type="date" name="dataRenovacao" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Escopo mensal</label>
            <textarea
              name="escopo"
              rows={4}
              placeholder="Uma entrega por linha, ex:&#10;Análise de contratos de locação&#10;Consultoria em vendas&#10;Resposta a dúvidas dos corretores"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568] resize-none"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Observações</label>
            <textarea name="observacoes" rows={2} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568] resize-none" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="px-5 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90" style={{ backgroundColor: '#DFA568' }}>
            Salvar
          </button>
          <Link href="/consultorias" className="px-5 py-2 text-sm font-medium rounded border border-gray-200 text-gray-500 hover:bg-gray-50">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
