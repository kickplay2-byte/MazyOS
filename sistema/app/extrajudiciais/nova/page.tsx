import { criarExtrajudicial } from '@/lib/actions'
import { RESPONSAVEIS, STATUS_EXTRAJUDICIAL, TIPOS_EXTRAJUDICIAL } from '@/lib/types'
import Link from 'next/link'

export default function NovaExtrajudicialPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/extrajudiciais" className="text-sm text-gray-400 hover:text-[#DFA568] transition-colors">
          ← Extrajudiciais
        </Link>
        <h1 className="text-2xl font-semibold text-[#1F2346] mt-2">Nova demanda extrajudicial</h1>
      </div>

      <form action={criarExtrajudicial} className="bg-white rounded border border-gray-200 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Tipo *</label>
            <select name="tipo" required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
              {TIPOS_EXTRAJUDICIAL.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Status *</label>
            <select name="status" required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
              {STATUS_EXTRAJUDICIAL.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Título / Descrição breve *</label>
            <input
              name="titulo"
              required
              placeholder="Ex: Due diligence — Apto Rua XV, 820"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Cliente *</label>
            <input name="cliente" required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Responsável *</label>
            <select name="responsavel" required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
              {RESPONSAVEIS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Próximo prazo</label>
            <input type="date" name="proximoPrazo" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Observações</label>
            <textarea name="observacoes" rows={3} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568] resize-none" />
          </div>
        </div>

        <p className="text-xs text-gray-400">Etapas e documentos podem ser adicionados após o cadastro.</p>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="px-5 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90" style={{ backgroundColor: '#DFA568' }}>
            Salvar
          </button>
          <Link href="/extrajudiciais" className="px-5 py-2 text-sm font-medium rounded border border-gray-200 text-gray-500 hover:bg-gray-50">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
