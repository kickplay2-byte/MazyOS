import Link from 'next/link'
import { requirePermission } from '@/lib/auth'
import { criarArquivo } from '@/lib/actions'
import { getProcessos, getExtrajudiciais, getConsultorias } from '@/lib/data'

export default async function NovoDocumentoPage() {
  await requirePermission('documentos:manage')
  const [processos, extrajudiciais, consultorias] = await Promise.all([getProcessos(), getExtrajudiciais(), getConsultorias()])

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/documentos" className="text-sm text-gray-400 hover:text-[#DFA568] transition-colors">
          ← Documentos
        </Link>
        <h1 className="text-2xl font-semibold text-[#1F2346] mt-2">Novo documento</h1>
      </div>

      <form action={criarArquivo} className="bg-white rounded border border-gray-200 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Nome do documento *</label>
            <input
              name="nome"
              required
              placeholder="Ex: Matrícula do imóvel"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Link (Google Drive ou URL)</label>
            <input
              name="url"
              type="url"
              placeholder="https://drive.google.com/..."
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Descrição / Observação</label>
            <input
              name="descricao"
              placeholder="Ex: Versão atualizada em 05/2026"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Tipo de demanda *</label>
            <select name="vinculoTipo" required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
              <option value="extrajudicial">Extrajudicial</option>
              <option value="processo">Processo Judicial</option>
              <option value="consultoria">Consultoria</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Demanda *</label>
            <select name="vinculoId" required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
              <option value="">— Selecionar —</option>
              <optgroup label="Extrajudiciais">
                {extrajudiciais.map((e) => (
                  <option key={e.id} value={e.id}>{e.titulo}</option>
                ))}
              </optgroup>
              <optgroup label="Processos Judiciais">
                {processos.map((p) => (
                  <option key={p.id} value={p.id}>{p.numero} — {p.tipo}</option>
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

        <p className="text-xs text-gray-400">{'O status inicial será "Pendente". Atualize após a entrega.'}</p>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90"
            style={{ backgroundColor: '#DFA568' }}
          >
            Salvar documento
          </button>
          <Link href="/documentos" className="px-5 py-2 text-sm font-medium rounded border border-gray-200 text-gray-500 hover:bg-gray-50">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
