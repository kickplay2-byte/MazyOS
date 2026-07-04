import { notFound } from 'next/navigation'
import { requirePermission } from '@/lib/auth'
import Link from 'next/link'
import { getCorretor, getImobiliaria, getClientesByCorretor } from '@/lib/data'
import { formatCurrency, formatDate, nivelRelacionamentoLabel } from '@/lib/utils'
import { atualizarCorretor } from '@/lib/actions'
import { getImobiliarias } from '@/lib/data'
import PageHeader from '@/components/ui/PageHeader'
import EntityAdvisorPanel from '@/components/advisor/EntityAdvisorPanel'

export default async function CorretorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('brokers:view')
  const { id } = await params
  const corretor = await getCorretor(id)
  if (!corretor) notFound()

  const [imobiliaria, clientes, imobiliarias] = await Promise.all([
    getImobiliaria(corretor.imobiliariaId), getClientesByCorretor(id), getImobiliarias(),
  ])

  const atualizar = atualizarCorretor.bind(null, id)

  return (
    <div className="p-8">
      <PageHeader
        title={corretor.nome}
        description={imobiliaria ? imobiliaria.nome : undefined}
        breadcrumbs={[
          { label: 'Comercial', href: '/comercial' },
          { label: 'Corretores', href: '/comercial/corretores' },
          { label: corretor.nome },
        ]}
      />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-5">
          {/* KPIs */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded p-4">
              <div className="text-xs text-gray-400 mb-1">Indicações</div>
              <div className="text-2xl font-semibold text-gray-900">{corretor.quantidadeIndicacoes}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded p-4">
              <div className="text-xs text-gray-400 mb-1">Faturamento gerado</div>
              <div className="text-xl font-semibold text-gray-900">{formatCurrency(corretor.faturamentoGerado)}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded p-4">
              <div className="text-xs text-gray-400 mb-1">Clientes vinculados</div>
              <div className="text-2xl font-semibold text-gray-900">{clientes.length}</div>
            </div>
          </div>

          {/* Dados */}
          <div className="bg-white border border-gray-200 rounded p-5">
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              {corretor.creci && (
                <div><span className="text-gray-400">CRECI</span><div className="text-gray-800">{corretor.creci}</div></div>
              )}
              {corretor.telefone && (
                <div><span className="text-gray-400">Telefone</span><div className="text-gray-800">{corretor.telefone}</div></div>
              )}
              {corretor.email && (
                <div><span className="text-gray-400">E-mail</span><div className="text-gray-800">{corretor.email}</div></div>
              )}
              <div>
                <span className="text-gray-400">Imobiliária</span>
                <div className="text-gray-800">
                  {imobiliaria ? (
                    <Link href={`/comercial/imobiliarias/${imobiliaria.id}`} className="hover:underline">
                      {imobiliaria.nome}
                    </Link>
                  ) : '—'}
                </div>
              </div>
              <div>
                <span className="text-gray-400">Relacionamento</span>
                <div className="text-gray-800">{nivelRelacionamentoLabel(corretor.nivelRelacionamento)}</div>
              </div>
              {corretor.ultimaInteracao && (
                <div>
                  <span className="text-gray-400">Última interação</span>
                  <div className="text-gray-800">{formatDate(corretor.ultimaInteracao)}</div>
                </div>
              )}
            </div>
            {corretor.observacoes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-400 mb-1">Observações</div>
                <p className="text-sm text-gray-600 leading-relaxed">{corretor.observacoes}</p>
              </div>
            )}
          </div>

          {/* Próxima ação */}
          {corretor.proximaAcao && (
            <div className="bg-white border border-gray-200 rounded p-5">
              <div className="text-xs text-gray-400 mb-1">Próxima ação</div>
              <div className="text-sm text-gray-800">{corretor.proximaAcao}</div>
              {corretor.proximaAcaoData && (
                <div className="text-xs text-gray-400 mt-1">{formatDate(corretor.proximaAcaoData)}</div>
              )}
            </div>
          )}

          {/* Clientes */}
          {clientes.length > 0 && (
            <div className="bg-white border border-gray-200 rounded p-5">
              <h2 className="text-sm font-medium text-gray-700 mb-4">Clientes indicados ({clientes.length})</h2>
              <div className="space-y-2">
                {clientes.map((cl) => (
                  <Link
                    key={cl.id}
                    href={`/comercial/clientes/${cl.id}`}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
                  >
                    <div className="text-sm text-gray-800">{cl.nome}</div>
                    <div className="text-xs text-gray-400">{formatDate(cl.createdAt)}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Edição */}
        <div>
          <div className="bg-white border border-gray-200 rounded p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Editar</h2>
            <form action={atualizar} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nome</label>
                <input name="nome" defaultValue={corretor.nome} required className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Imobiliária</label>
                <select name="imobiliariaId" defaultValue={corretor.imobiliariaId} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400">
                  {imobiliarias.map((im) => (
                    <option key={im.id} value={im.id}>{im.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Telefone</label>
                <input name="telefone" defaultValue={corretor.telefone ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">E-mail</label>
                <input name="email" type="email" defaultValue={corretor.email ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">CRECI</label>
                <input name="creci" defaultValue={corretor.creci ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Status</label>
                <select name="status" defaultValue={corretor.status} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400">
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nível relacionamento</label>
                <select name="nivelRelacionamento" defaultValue={corretor.nivelRelacionamento} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400">
                  <option value="estrategico">Estratégico</option>
                  <option value="ativo">Ativo</option>
                  <option value="neutro">Neutro</option>
                  <option value="em_risco">Em risco</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Próxima ação</label>
                <input name="proximaAcao" defaultValue={corretor.proximaAcao ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Data próxima ação</label>
                <input name="proximaAcaoData" type="date" defaultValue={corretor.proximaAcaoData ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Observações</label>
                <textarea name="observacoes" rows={3} defaultValue={corretor.observacoes ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400 resize-none" />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded text-sm font-medium text-white mt-2"
                style={{ backgroundColor: '#1F2346' }}
              >
                Salvar alterações
              </button>
            </form>
          </div>
          <EntityAdvisorPanel entityType="corretor" entityId={corretor.id} />
        </div>
      </div>
    </div>
  )
}
