import { criarImobiliaria } from '@/lib/actions'
import PageHeader from '@/components/ui/PageHeader'

export default function NovaImobiliariaPage() {
  return (
    <div className="p-8 max-w-2xl">
      <PageHeader
        title="Nova imobiliária"
        breadcrumbs={[
          { label: 'Comercial', href: '/comercial' },
          { label: 'Imobiliárias', href: '/comercial/imobiliarias' },
          { label: 'Nova' },
        ]}
      />

      <form action={criarImobiliaria} className="bg-white border border-gray-200 rounded p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Nome *</label>
            <input name="nome" required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">CNPJ</label>
            <input name="cnpj" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Cidade</label>
            <input name="cidade" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Endereço</label>
            <input name="endereco" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Telefone</label>
            <input name="telefone" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">E-mail</label>
            <input name="email" type="email" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Responsável *</label>
            <select name="responsavel" required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400">
              <option value="Giovanni">Giovanni</option>
              <option value="Enrico">Enrico</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status *</label>
            <select name="status" required defaultValue="ativa" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400">
              <option value="ativa">Ativa</option>
              <option value="prospect">Prospect</option>
              <option value="inativa">Inativa</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nível de relacionamento *</label>
            <select name="nivelRelacionamento" required defaultValue="neutro" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400">
              <option value="estrategico">Estratégico</option>
              <option value="ativo">Ativo</option>
              <option value="neutro">Neutro</option>
              <option value="em_risco">Em risco</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Valor mensal (R$)</label>
            <input name="valorMensal" type="number" step="0.01" min="0" defaultValue="0" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Início do contrato</label>
            <input name="dataInicio" type="date" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Renovação</label>
            <input name="dataRenovacao" type="date" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Próxima ação</label>
            <input name="proximaAcao" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Data da próxima ação</label>
            <input name="proximaAcaoData" type="date" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
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
            Cadastrar imobiliária
          </button>
          <a href="/comercial/imobiliarias" className="px-5 py-2 rounded text-sm text-gray-600 hover:bg-gray-100 transition-colors">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}
