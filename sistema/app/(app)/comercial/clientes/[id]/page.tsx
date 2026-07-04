import { notFound } from 'next/navigation'
import { requirePermission } from '@/lib/auth'
import Link from 'next/link'
import { getCliente, getCorretor, getImobiliaria, getCorretores, getImobiliarias } from '@/lib/data'
import { origemClienteLabel, formatDate } from '@/lib/utils'
import { atualizarCliente, excluirCliente } from '@/lib/actions'
import PageHeader from '@/components/ui/PageHeader'
import EntityAdvisorPanel from '@/components/advisor/EntityAdvisorPanel'

export default async function ClienteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('clients:view')
  const { id } = await params
  const cliente = await getCliente(id)
  if (!cliente) notFound()

  const [corretor, imobiliaria, corretores, imobiliarias] = await Promise.all([
    cliente.corretorId ? getCorretor(cliente.corretorId) : Promise.resolve(undefined),
    cliente.imobiliariaId ? getImobiliaria(cliente.imobiliariaId) : Promise.resolve(undefined),
    getCorretores(),
    getImobiliarias(),
  ])

  const atualizar = atualizarCliente.bind(null, id)
  const excluir = excluirCliente.bind(null, id)

  return (
    <div className="p-8">
      <PageHeader
        title={cliente.nome}
        description={origemClienteLabel(cliente.origem)}
        breadcrumbs={[
          { label: 'Comercial', href: '/comercial' },
          { label: 'Clientes', href: '/comercial/clientes' },
          { label: cliente.nome },
        ]}
      />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-5">
          {/* Dados */}
          <div className="bg-white border border-gray-200 rounded p-5">
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              {cliente.documento && (
                <div><span className="text-gray-400">Documento</span><div className="text-gray-800">{cliente.documento}</div></div>
              )}
              {cliente.telefone && (
                <div><span className="text-gray-400">Telefone</span><div className="text-gray-800">{cliente.telefone}</div></div>
              )}
              {cliente.email && (
                <div><span className="text-gray-400">E-mail</span><div className="text-gray-800">{cliente.email}</div></div>
              )}
              <div>
                <span className="text-gray-400">Origem</span>
                <div>
                  <span className="inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 mt-0.5">
                    {origemClienteLabel(cliente.origem)}
                  </span>
                </div>
              </div>
              {corretor && (
                <div>
                  <span className="text-gray-400">Corretor</span>
                  <div className="text-gray-800">
                    <Link href={`/comercial/corretores/${corretor.id}`} className="hover:underline">
                      {corretor.nome}
                    </Link>
                  </div>
                </div>
              )}
              {imobiliaria && (
                <div>
                  <span className="text-gray-400">Imobiliária</span>
                  <div className="text-gray-800">
                    <Link href={`/comercial/imobiliarias/${imobiliaria.id}`} className="hover:underline">
                      {imobiliaria.nome}
                    </Link>
                  </div>
                </div>
              )}
              <div>
                <span className="text-gray-400">Cadastrado em</span>
                <div className="text-gray-800">{formatDate(cliente.createdAt)}</div>
              </div>
            </div>
            {cliente.observacoes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-400 mb-1">Observações</div>
                <p className="text-sm text-gray-600 leading-relaxed">{cliente.observacoes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Edição */}
        <div>
          <div className="bg-white border border-gray-200 rounded p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Editar</h2>
            <form action={atualizar} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nome</label>
                <input name="nome" defaultValue={cliente.nome} required className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Documento</label>
                <input name="documento" defaultValue={cliente.documento ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Telefone</label>
                <input name="telefone" defaultValue={cliente.telefone ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">E-mail</label>
                <input name="email" type="email" defaultValue={cliente.email ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Origem</label>
                <select name="origem" defaultValue={cliente.origem} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400">
                  <option value="corretor">Corretor</option>
                  <option value="imobiliaria">Imobiliária</option>
                  <option value="indicacao_pf">Indicação PF</option>
                  <option value="direto">Direto</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Corretor</label>
                <select name="corretorId" defaultValue={cliente.corretorId ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400">
                  <option value="">Nenhum</option>
                  {corretores.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Imobiliária</label>
                <select name="imobiliariaId" defaultValue={cliente.imobiliariaId ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400">
                  <option value="">Nenhuma</option>
                  {imobiliarias.map((im) => (
                    <option key={im.id} value={im.id}>{im.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Observações</label>
                <textarea name="observacoes" rows={3} defaultValue={cliente.observacoes ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400 resize-none" />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded text-sm font-medium text-white mt-2"
                style={{ backgroundColor: '#1F2346' }}
              >
                Salvar alterações
              </button>
            </form>

            <form action={excluir} className="mt-3">
              <button
                type="submit"
                className="w-full py-2 rounded text-sm text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
              >
                Excluir cliente
              </button>
            </form>
          </div>
          <EntityAdvisorPanel entityType="cliente" entityId={cliente.id} />
        </div>
      </div>
    </div>
  )
}
