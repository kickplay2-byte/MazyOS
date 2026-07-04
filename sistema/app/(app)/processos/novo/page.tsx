import { criarProcesso } from '@/lib/actions'
import { requirePermission } from '@/lib/auth'
import { RESPONSAVEIS, STATUS_PROCESSO } from '@/lib/types'
import { getClientes, getImobiliarias } from '@/lib/data'
import Link from 'next/link'

export default async function NovoProcessoPage() {
  await requirePermission('processos:manage')
  const [clientes, imobiliarias] = await Promise.all([getClientes(), getImobiliarias()])

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/processos" className="text-sm text-gray-400 hover:text-[#DFA568] transition-colors">
          ← Processos
        </Link>
        <h1 className="text-2xl font-semibold text-[#1F2346] mt-2">Novo processo</h1>
      </div>

      <form action={criarProcesso} className="bg-white rounded border border-gray-200 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Número CNJ *</label>
            <input
              name="numero"
              required
              placeholder="0000000-00.0000.0.00.0000"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-[#1F2346] focus:outline-none focus:border-[#DFA568]"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Tipo de ação *</label>
            <input
              name="tipo"
              required
              placeholder="Ex: Reintegração de posse"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-[#1F2346] focus:outline-none focus:border-[#DFA568]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Tribunal *</label>
            <input
              name="tribunal"
              required
              placeholder="Ex: TJPR"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Vara *</label>
            <input
              name="vara"
              required
              placeholder="Ex: 2ª Vara Cível"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Autor (parte ativa) *</label>
            <input
              name="autor"
              required
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Réu (parte passiva) *</label>
            <input
              name="reu"
              required
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Responsável *</label>
            <select
              name="responsavel"
              required
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
            >
              {RESPONSAVEIS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Status *</label>
            <select
              name="status"
              required
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
            >
              {STATUS_PROCESSO.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Próxima audiência</label>
            <input
              type="date"
              name="proximaAudiencia"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Próximo prazo</label>
            <input
              type="date"
              name="proximoPrazo"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Fase atual *</label>
            <input
              name="faseAtual"
              required
              placeholder="Ex: Instrução — aguardando audiência"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Cliente / Imobiliária (campo livre)</label>
            <input
              name="cliente"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Cliente (sistema)</label>
            <select name="clienteId" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
              <option value="">— Não vinculado —</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Imobiliária (sistema)</label>
            <select name="imobiliariaId" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
              <option value="">— Não vinculado —</option>
              {imobiliarias.map((i) => <option key={i.id} value={i.id}>{i.nome}</option>)}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Observações</label>
            <textarea
              name="observacoes"
              rows={3}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568] resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#DFA568' }}
          >
            Salvar processo
          </button>
          <Link
            href="/processos"
            className="px-5 py-2 text-sm font-medium rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
