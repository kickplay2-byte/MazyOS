import Link from 'next/link'
import { requirePermission } from '@/lib/auth'
import { criarTarefa } from '@/lib/actions'
import { RESPONSAVEIS, VINCULOS_TIPO } from '@/lib/types'
import { getProcessos, getExtrajudiciais, getConsultorias } from '@/lib/data'
import { vinculoTipoLabel } from '@/lib/utils'

export default async function NovaTarefaPage() {
  await requirePermission('tarefas:manage')
  const [processos, extrajudiciais, consultorias] = await Promise.all([getProcessos(), getExtrajudiciais(), getConsultorias()])

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/tarefas" className="text-sm text-gray-400 hover:text-[#DFA568] transition-colors">
          ← Tarefas
        </Link>
        <h1 className="text-2xl font-semibold text-[#1F2346] mt-2">Nova tarefa</h1>
      </div>

      <form action={criarTarefa} className="bg-white rounded border border-gray-200 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Título *</label>
            <input
              name="titulo"
              required
              placeholder="Ex: Protocolar petição inicial"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Descrição</label>
            <textarea
              name="descricao"
              rows={2}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Responsável *</label>
            <select name="responsavel" required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
              {RESPONSAVEIS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Prioridade</label>
            <select name="prioridade" defaultValue="normal" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
              <option value="baixa">Baixa</option>
              <option value="normal">Normal</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Prazo</label>
            <input type="date" name="prazo" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Vínculo</label>
            <select name="vinculoTipo" defaultValue="livre" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
              {VINCULOS_TIPO.map((v) => (
                <option key={v} value={v}>{vinculoTipoLabel(v)}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Demanda vinculada</label>
            <select name="vinculoId" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
              <option value="">— Nenhuma (tarefa livre) —</option>
              <optgroup label="Processos Judiciais">
                {processos.map((p) => (
                  <option key={p.id} value={p.id}>{p.numero} — {p.tipo}</option>
                ))}
              </optgroup>
              <optgroup label="Extrajudiciais">
                {extrajudiciais.map((e) => (
                  <option key={e.id} value={e.id}>{e.titulo}</option>
                ))}
              </optgroup>
              <optgroup label="Consultorias">
                {consultorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.imobiliaria}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90"
            style={{ backgroundColor: '#DFA568' }}
          >
            Salvar tarefa
          </button>
          <Link href="/tarefas" className="px-5 py-2 text-sm font-medium rounded border border-gray-200 text-gray-500 hover:bg-gray-50">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
