import { criarExtrajudicial } from '@/lib/actions'
import { requirePermission } from '@/lib/auth'
import { RESPONSAVEIS, STATUS_EXTRAJUDICIAL, TIPOS_EXTRAJUDICIAL } from '@/lib/types'
import { getClientes, getCorretores, getImobiliarias, getOportunidades, getPropostas } from '@/lib/data'
import Link from 'next/link'

export default async function NovaExtrajudicialPage() {
  await requirePermission('extrajudiciais:manage')
  const [clientes, corretores, imobiliarias, allOportunidades, allPropostas] = await Promise.all([
    getClientes(), getCorretores(), getImobiliarias(), getOportunidades(), getPropostas(),
  ])
  const oportunidades = allOportunidades.filter((o) => !['fechado', 'perdido'].includes(o.status))
  const propostas = allPropostas.filter((p) => ['rascunho', 'enviada', 'em_negociacao', 'aceita'].includes(p.status))

  const inputClass = 'w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]'

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/extrajudiciais" className="text-sm text-gray-400 hover:text-[#DFA568] transition-colors">
          ← Extrajudiciais
        </Link>
        <h1 className="text-2xl font-semibold text-[#1F2346] mt-2">Nova demanda extrajudicial</h1>
      </div>

      <form action={criarExtrajudicial} className="bg-white rounded border border-gray-200 p-6 space-y-6">

        {/* Identificação */}
        <div>
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Identificação</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tipo *</label>
              <select name="tipo" required className={inputClass}>
                {TIPOS_EXTRAJUDICIAL.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status *</label>
              <select name="status" required className={inputClass}>
                {STATUS_EXTRAJUDICIAL.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Título / Descrição breve *</label>
              <input name="titulo" required placeholder="Ex: Due diligence — Apto Rua XV, 820" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Nome do cliente (legado)</label>
              <input name="cliente" placeholder="Campo livre" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Prioridade</label>
              <select name="prioridade" defaultValue="normal" className={inputClass}>
                <option value="baixa">Baixa</option>
                <option value="normal">Normal</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Responsável *</label>
              <select name="responsavel" required className={inputClass}>
                {RESPONSAVEIS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Próximo prazo</label>
              <input type="date" name="proximoPrazo" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Vínculos comerciais */}
        <div>
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Vínculos comerciais <span className="font-normal normal-case">(opcional)</span></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Cliente</label>
              <select name="clienteId" className={inputClass}>
                <option value="">— Não vinculado —</option>
                {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Corretor</label>
              <select name="corretorId" className={inputClass}>
                <option value="">— Não vinculado —</option>
                {corretores.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Imobiliária</label>
              <select name="imobiliariaId" className={inputClass}>
                <option value="">— Não vinculado —</option>
                {imobiliarias.map((i) => <option key={i.id} value={i.id}>{i.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Oportunidade</label>
              <select name="oportunidadeId" className={inputClass}>
                <option value="">— Não vinculado —</option>
                {oportunidades.map((o) => <option key={o.id} value={o.id}>{o.titulo}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Proposta aceita</label>
              <select name="propostaId" className={inputClass}>
                <option value="">— Não vinculado —</option>
                {propostas.map((p) => <option key={p.id} value={p.id}>{p.titulo}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Observações</label>
          <textarea name="observacoes" rows={3} className={`${inputClass} resize-none`} />
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
