import Link from 'next/link'
import { requirePermission, getCurrentRole } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { getClientes, getCorretores, getImobiliarias } from '@/lib/data'
import { origemClienteLabel, formatDate } from '@/lib/utils'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'

export default async function ClientesPage() {
  await requirePermission('clients:view')
  const role = await getCurrentRole()
  const canManage = hasPermission(role, 'clients:manage')
  const [clientes, corretores, imobiliarias] = await Promise.all([getClientes(), getCorretores(), getImobiliarias()])

  const corretorMap = Object.fromEntries(corretores.map((c) => [c.id, c.nome]))
  const imobMap = Object.fromEntries(imobiliarias.map((i) => [i.id, i.nome]))

  return (
    <div className="p-8">
      <PageHeader
        title="Clientes"
        description={`${clientes.length} cliente${clientes.length !== 1 ? 's' : ''} cadastrado${clientes.length !== 1 ? 's' : ''}`}
        action={canManage ? (
          <Link
            href="/comercial/clientes/novo"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-medium text-white"
            style={{ backgroundColor: '#1F2346' }}
          >
            + Novo cliente
          </Link>
        ) : undefined}
      />

      {clientes.length === 0 ? (
        <EmptyState
          title="Nenhum cliente cadastrado"
          description="Clientes são cadastrados a partir de indicações de corretores ou imobiliárias."
          action={
            <Link
              href="/comercial/clientes/novo"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-medium text-white"
              style={{ backgroundColor: '#1F2346' }}
            >
              + Novo cliente
            </Link>
          }
        />
      ) : (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Cliente</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Origem</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Corretor</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Imobiliária</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Cadastro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clientes.map((cl) => (
                <tr key={cl.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <Link href={`/comercial/clientes/${cl.id}`} className="block group">
                      <div className="font-medium text-gray-900 group-hover:underline">{cl.nome}</div>
                      {cl.documento && <div className="text-xs text-gray-400">{cl.documento}</div>}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                      {origemClienteLabel(cl.origem)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 text-xs">
                    {cl.corretorId && corretorMap[cl.corretorId] ? (
                      <Link href={`/comercial/corretores/${cl.corretorId}`} className="hover:underline">
                        {corretorMap[cl.corretorId]}
                      </Link>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 text-xs">
                    {cl.imobiliariaId && imobMap[cl.imobiliariaId] ? (
                      <Link href={`/comercial/imobiliarias/${cl.imobiliariaId}`} className="hover:underline">
                        {imobMap[cl.imobiliariaId]}
                      </Link>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3.5 text-gray-400 text-xs">
                    {formatDate(cl.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
