import Link from 'next/link'
import { requirePermission } from '@/lib/auth'
import { criarCliente } from '@/lib/actions'
import { getCorretores, getImobiliarias } from '@/lib/data'
import PageHeader from '@/components/ui/PageHeader'

export default async function NovoClientePage() {
  await requirePermission('clients:manage')
  const [corretores, imobiliarias] = await Promise.all([getCorretores(), getImobiliarias()])

  return (
    <div className="p-8 max-w-2xl">
      <PageHeader
        title="Novo cliente"
        breadcrumbs={[
          { label: 'Comercial', href: '/comercial' },
          { label: 'Clientes', href: '/comercial/clientes' },
          { label: 'Novo' },
        ]}
      />

      <form action={criarCliente} className="bg-white border border-gray-200 rounded p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Nome completo *</label>
            <input name="nome" required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">CPF / CNPJ</label>
            <input name="documento" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Telefone</label>
            <input name="telefone" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">E-mail</label>
            <input name="email" type="email" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Origem *</label>
            <select name="origem" required defaultValue="corretor" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400">
              <option value="corretor">Corretor</option>
              <option value="imobiliaria">Imobiliária</option>
              <option value="indicacao_pf">Indicação PF</option>
              <option value="direto">Direto</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Corretor indicador</label>
            <select name="corretorId" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400">
              <option value="">— Nenhum —</option>
              {corretores.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Imobiliária</label>
            <select name="imobiliariaId" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400">
              <option value="">— Nenhuma —</option>
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
            Cadastrar cliente
          </button>
          <Link href="/comercial/clientes" className="px-5 py-2 rounded text-sm text-gray-600 hover:bg-gray-100 transition-colors">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
