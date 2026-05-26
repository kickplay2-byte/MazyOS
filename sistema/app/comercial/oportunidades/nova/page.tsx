import { criarOportunidade } from '@/lib/actions'
import { getClientes, getCorretores, getImobiliarias } from '@/lib/data'
import { RESPONSAVEIS, TIPOS_EXTRAJUDICIAL } from '@/lib/types'
import PageHeader from '@/components/ui/PageHeader'

export default function NovaOportunidadePage() {
  const clientes = getClientes()
  const corretores = getCorretores()
  const imobiliarias = getImobiliarias()

  return (
    <div className="p-8 max-w-2xl">
      <PageHeader
        title="Nova oportunidade"
        breadcrumbs={[
          { label: 'Comercial', href: '/comercial' },
          { label: 'Oportunidades', href: '/comercial/oportunidades' },
          { label: 'Nova' },
        ]}
      />

      <form action={criarOportunidade} className="bg-white border border-gray-200 rounded p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Título *</label>
            <input name="titulo" required placeholder="Ex: Distrato — João Silva (Ecoville)" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Cliente *</label>
            <select name="clienteId" required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400">
              <option value="">Selecione...</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tipo de serviço</label>
            <select name="tipoServico" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400">
              <option value="">Selecione...</option>
              {TIPOS_EXTRAJUDICIAL.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status inicial *</label>
            <select name="status" required defaultValue="novo_lead" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400">
              <option value="novo_lead">Novo lead</option>
              <option value="primeiro_contato">Primeiro contato</option>
              <option value="diagnostico_pendente">Diagnóstico pendente</option>
              <option value="diagnostico_realizado">Diagnóstico realizado</option>
              <option value="proposta_enviada">Proposta enviada</option>
              <option value="follow_up">Follow-up</option>
              <option value="negociacao">Negociação</option>
              <option value="contrato_enviado">Contrato enviado</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Responsável *</label>
            <select name="responsavel" required defaultValue="Giovanni" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400">
              {RESPONSAVEIS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Valor estimado (R$)</label>
            <input name="valorEstimado" type="number" step="0.01" min="0" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Probabilidade (%)</label>
            <input name="probabilidade" type="number" min="0" max="100" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Próximo follow-up</label>
            <input name="proximoFollowUp" type="date" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Corretor</label>
            <select name="corretorId" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400">
              <option value="">Nenhum</option>
              {corretores.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Imobiliária</label>
            <select name="imobiliariaId" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400">
              <option value="">Nenhuma</option>
              {imobiliarias.map((im) => (
                <option key={im.id} value={im.id}>{im.nome}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Observações</label>
            <textarea name="observacoes" rows={3} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400 resize-none" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2 rounded text-sm font-medium text-white"
            style={{ backgroundColor: '#1F2346' }}
          >
            Criar oportunidade
          </button>
          <a href="/comercial/oportunidades" className="px-5 py-2 rounded text-sm text-gray-600 hover:bg-gray-100 transition-colors">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}
