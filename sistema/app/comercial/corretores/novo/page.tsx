import { criarCorretor } from '@/lib/actions'
import { getImobiliarias } from '@/lib/data'
import PageHeader from '@/components/ui/PageHeader'

export default function NovoCorretorPage({
  searchParams,
}: {
  searchParams: Promise<{ imobiliariaId?: string }>
}) {
  const imobiliarias = getImobiliarias()

  return (
    <div className="p-8 max-w-2xl">
      <PageHeader
        title="Novo corretor"
        breadcrumbs={[
          { label: 'Comercial', href: '/comercial' },
          { label: 'Corretores', href: '/comercial/corretores' },
          { label: 'Novo' },
        ]}
      />

      <form action={criarCorretor} className="bg-white border border-gray-200 rounded p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Nome *</label>
            <input name="nome" required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Imobiliária *</label>
            <select name="imobiliariaId" required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400">
              <option value="">Selecione...</option>
              {imobiliarias.map((im) => (
                <option key={im.id} value={im.id}>{im.nome}</option>
              ))}
            </select>
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
            <label className="block text-xs font-medium text-gray-600 mb-1">CRECI</label>
            <input name="creci" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status *</label>
            <select name="status" required defaultValue="ativo" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400">
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
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
            Cadastrar corretor
          </button>
          <a href="/comercial/corretores" className="px-5 py-2 rounded text-sm text-gray-600 hover:bg-gray-100 transition-colors">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}
