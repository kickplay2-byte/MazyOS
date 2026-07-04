import { notFound } from 'next/navigation'
import { requirePermission } from '@/lib/auth'
import Link from 'next/link'
import { getImobiliaria, getCorretoresByImobiliaria, getClientesByImobiliaria } from '@/lib/data'
import { formatCurrency, formatDate, nivelRelacionamentoLabel } from '@/lib/utils'
import { atualizarImobiliaria, desativarImobiliaria } from '@/lib/actions'
import PageHeader from '@/components/ui/PageHeader'
import EntityAdvisorPanel from '@/components/advisor/EntityAdvisorPanel'

const nivelDot: Record<string, string> = {
  estrategico: '#DFA568',
  ativo: '#16a34a',
  neutro: '#9ca3af',
  em_risco: '#dc2626',
}

export default async function ImobiliariaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('organizations:view')
  const { id } = await params
  const [imobiliaria, corretores, clientes] = await Promise.all([
    getImobiliaria(id), getCorretoresByImobiliaria(id), getClientesByImobiliaria(id),
  ])
  if (!imobiliaria) notFound()

  const atualizar = atualizarImobiliaria.bind(null, id)
  const desativar = desativarImobiliaria.bind(null, id)

  return (
    <div className="p-8">
      <PageHeader
        title={imobiliaria.nome}
        description={imobiliaria.cidade ?? undefined}
        breadcrumbs={[
          { label: 'Comercial', href: '/comercial' },
          { label: 'Imobiliárias', href: '/comercial/imobiliarias' },
          { label: imobiliaria.nome },
        ]}
      />

      <div className="grid grid-cols-3 gap-6">
        {/* Coluna principal */}
        <div className="col-span-2 space-y-5">
          {/* Info */}
          <div className="bg-white border border-gray-200 rounded p-5">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: nivelDot[imobiliaria.nivelRelacionamento] ?? '#9ca3af' }}
              />
              <span className="text-sm text-gray-600">{nivelRelacionamentoLabel(imobiliaria.nivelRelacionamento)}</span>
              <span className="text-gray-200">|</span>
              <span className="text-sm text-gray-500">{imobiliaria.status === 'ativa' ? 'Ativa' : imobiliaria.status === 'prospect' ? 'Prospect' : 'Inativa'}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              {imobiliaria.cnpj && (
                <div><span className="text-gray-400">CNPJ</span><div className="text-gray-800">{imobiliaria.cnpj}</div></div>
              )}
              {imobiliaria.telefone && (
                <div><span className="text-gray-400">Telefone</span><div className="text-gray-800">{imobiliaria.telefone}</div></div>
              )}
              {imobiliaria.email && (
                <div><span className="text-gray-400">E-mail</span><div className="text-gray-800">{imobiliaria.email}</div></div>
              )}
              {imobiliaria.endereco && (
                <div className="col-span-2"><span className="text-gray-400">Endereço</span><div className="text-gray-800">{imobiliaria.endereco}</div></div>
              )}
              <div>
                <span className="text-gray-400">Valor mensal</span>
                <div className="text-gray-800 font-medium">{formatCurrency(imobiliaria.valorMensal)}</div>
              </div>
              <div><span className="text-gray-400">Responsável</span><div className="text-gray-800">{imobiliaria.responsavel}</div></div>
              {imobiliaria.dataInicio && (
                <div><span className="text-gray-400">Início</span><div className="text-gray-800">{formatDate(imobiliaria.dataInicio)}</div></div>
              )}
              {imobiliaria.dataRenovacao && (
                <div><span className="text-gray-400">Renovação</span><div className="text-gray-800">{formatDate(imobiliaria.dataRenovacao)}</div></div>
              )}
            </div>
            {imobiliaria.observacoes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-400 mb-1">Observações</div>
                <p className="text-sm text-gray-600 leading-relaxed">{imobiliaria.observacoes}</p>
              </div>
            )}
          </div>

          {/* Próxima ação */}
          {imobiliaria.proximaAcao && (
            <div className="bg-white border border-gray-200 rounded p-5">
              <div className="text-xs text-gray-400 mb-1">Próxima ação</div>
              <div className="text-sm text-gray-800">{imobiliaria.proximaAcao}</div>
              {imobiliaria.proximaAcaoData && (
                <div className="text-xs text-gray-400 mt-1">{formatDate(imobiliaria.proximaAcaoData)}</div>
              )}
            </div>
          )}

          {/* Corretores */}
          <div className="bg-white border border-gray-200 rounded p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-700">Corretores ({corretores.length})</h2>
              <Link href={`/comercial/corretores/novo?imobiliariaId=${id}`} className="text-xs text-gray-400 hover:text-gray-600">
                + Adicionar
              </Link>
            </div>
            {corretores.length === 0 ? (
              <p className="text-sm text-gray-400">Nenhum corretor vinculado.</p>
            ) : (
              <div className="space-y-2">
                {corretores.map((c) => (
                  <Link
                    key={c.id}
                    href={`/comercial/corretores/${c.id}`}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
                  >
                    <div>
                      <div className="text-sm text-gray-800">{c.nome}</div>
                      <div className="text-xs text-gray-400">{c.creci ?? 'Sem CRECI'} · {c.quantidadeIndicacoes} indicações</div>
                    </div>
                    <div className="text-xs text-gray-500">{c.status === 'ativo' ? 'Ativo' : 'Inativo'}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Clientes */}
          {clientes.length > 0 && (
            <div className="bg-white border border-gray-200 rounded p-5">
              <h2 className="text-sm font-medium text-gray-700 mb-4">Clientes vinculados ({clientes.length})</h2>
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

        {/* Coluna lateral: edição */}
        <div>
          <div className="bg-white border border-gray-200 rounded p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Editar</h2>
            <form action={atualizar} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nome</label>
                <input name="nome" defaultValue={imobiliaria.nome} required className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Cidade</label>
                <input name="cidade" defaultValue={imobiliaria.cidade ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Telefone</label>
                <input name="telefone" defaultValue={imobiliaria.telefone ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">E-mail</label>
                <input name="email" type="email" defaultValue={imobiliaria.email ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">CNPJ</label>
                <input name="cnpj" defaultValue={imobiliaria.cnpj ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Endereço</label>
                <input name="endereco" defaultValue={imobiliaria.endereco ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Responsável</label>
                <select name="responsavel" defaultValue={imobiliaria.responsavel} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400">
                  <option value="Giovanni">Giovanni</option>
                  <option value="Enrico">Enrico</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Status</label>
                <select name="status" defaultValue={imobiliaria.status} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400">
                  <option value="ativa">Ativa</option>
                  <option value="prospect">Prospect</option>
                  <option value="inativa">Inativa</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nível relacionamento</label>
                <select name="nivelRelacionamento" defaultValue={imobiliaria.nivelRelacionamento} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400">
                  <option value="estrategico">Estratégico</option>
                  <option value="ativo">Ativo</option>
                  <option value="neutro">Neutro</option>
                  <option value="em_risco">Em risco</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Valor mensal (R$)</label>
                <input name="valorMensal" type="number" step="0.01" defaultValue={imobiliaria.valorMensal} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Início</label>
                <input name="dataInicio" type="date" defaultValue={imobiliaria.dataInicio ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Renovação</label>
                <input name="dataRenovacao" type="date" defaultValue={imobiliaria.dataRenovacao ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Próxima ação</label>
                <input name="proximaAcao" defaultValue={imobiliaria.proximaAcao ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Data próxima ação</label>
                <input name="proximaAcaoData" type="date" defaultValue={imobiliaria.proximaAcaoData ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Observações</label>
                <textarea name="observacoes" rows={3} defaultValue={imobiliaria.observacoes ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400 resize-none" />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded text-sm font-medium text-white mt-2"
                style={{ backgroundColor: '#1F2346' }}
              >
                Salvar alterações
              </button>
            </form>

            {imobiliaria.status === 'ativa' && (
              <form action={desativar} className="mt-3">
                <button
                  type="submit"
                  className="w-full py-2 rounded text-sm text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
                >
                  Desativar imobiliária
                </button>
              </form>
            )}
          </div>
          <EntityAdvisorPanel entityType="imobiliaria" entityId={imobiliaria.id} />
        </div>
      </div>
    </div>
  )
}
