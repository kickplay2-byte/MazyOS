import { notFound } from 'next/navigation'
import { requirePermission } from '@/lib/auth'
import Link from 'next/link'
import {
  getProposta,
  getCliente,
  getCorretor,
  getImobiliaria,
  getOportunidade,
  getClientes,
  getCorretores,
  getImobiliarias,
  getMinutasAssistidasByEntity,
} from '@/lib/data'
import {
  atualizarProposta,
  marcarPropostaAceita,
  marcarPropostaRecusada,
  marcarPropostaVencida,
  arquivarProposta,
  alterarStatusProposta,
} from '@/lib/actions'
import { formatCurrency, formatDate, statusPropostaLabel, formaPagamentoLabel } from '@/lib/utils'
import { RESPONSAVEIS, TIPOS_EXTRAJUDICIAL, TIPO_DOCUMENTO_MINUTA_LABELS } from '@/lib/types'
import PageHeader from '@/components/ui/PageHeader'
import EntityAdvisorPanel from '@/components/advisor/EntityAdvisorPanel'
import KnowledgeRecommendations from '@/components/knowledge/KnowledgeRecommendations'
import StatusBadge from '@/components/StatusBadge'

const STATUS_CORES: Record<string, { bg: string; text: string; border: string }> = {
  rascunho:      { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' },
  enviada:       { bg: '#eff6ff', text: '#3b82f6', border: '#bfdbfe' },
  em_negociacao: { bg: '#fdf4ff', text: '#9333ea', border: '#e9d5ff' },
  aceita:        { bg: '#f0fdf4', text: '#15803d', border: '#86efac' },
  recusada:      { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
  vencida:       { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
  cancelada:     { bg: '#f9fafb', text: '#9ca3af', border: '#e5e7eb' },
}

export default async function PropostaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('proposals:view')
  const { id } = await params
  const proposta = await getProposta(id)
  if (!proposta) notFound()

  const [cliente, corretor, imobiliaria, oportunidade, clientes, corretores, imobiliarias, minutasVinculadas] = await Promise.all([
    getCliente(proposta.clienteId),
    proposta.corretorId ? getCorretor(proposta.corretorId) : Promise.resolve(undefined),
    proposta.imobiliariaId ? getImobiliaria(proposta.imobiliariaId) : Promise.resolve(undefined),
    proposta.oportunidadeId ? getOportunidade(proposta.oportunidadeId) : Promise.resolve(undefined),
    getClientes(),
    getCorretores(),
    getImobiliarias(),
    getMinutasAssistidasByEntity('proposta', id),
  ])
  const atualizar = atualizarProposta.bind(null, id)
  const aceitar = marcarPropostaAceita.bind(null, id)
  const vencer = marcarPropostaVencida.bind(null, id)
  const arquivar = arquivarProposta.bind(null, id)
  const recusarAction = marcarPropostaRecusada.bind(null, id)

  const marcarEnviada = alterarStatusProposta.bind(null, id, 'enviada')
  const marcarNegociacao = alterarStatusProposta.bind(null, id, 'em_negociacao')

  const cores = STATUS_CORES[proposta.status] ?? STATUS_CORES.rascunho

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const validadeVencida = proposta.validade
    ? new Date(proposta.validade) < hoje && !['aceita', 'recusada', 'vencida', 'cancelada'].includes(proposta.status)
    : false

  const encerrada = ['aceita', 'recusada', 'vencida', 'cancelada'].includes(proposta.status)

  return (
    <div className="p-8">
      <PageHeader
        title={proposta.titulo}
        breadcrumbs={[
          { label: 'Comercial', href: '/comercial' },
          { label: 'Propostas', href: '/comercial/propostas' },
          { label: proposta.titulo },
        ]}
      />

      <div className="grid grid-cols-3 gap-6">
        {/* Coluna principal */}
        <div className="col-span-2 space-y-5">

          {/* Cabeçalho de status */}
          <div className="bg-white border border-gray-200 rounded p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="inline-block px-3 py-1 rounded text-sm font-medium"
                  style={{ backgroundColor: cores.bg, color: cores.text, border: `1px solid ${cores.border}` }}
                >
                  {statusPropostaLabel(proposta.status)}
                </span>
                {validadeVencida && (
                  <span className="text-xs text-red-500 font-medium">
                    ⚠ Validade expirada em {formatDate(proposta.validade)}
                  </span>
                )}
              </div>
              <div className="text-2xl font-semibold text-gray-900">{formatCurrency(proposta.valorTotal)}</div>
            </div>

            {/* Forma de pagamento */}
            {proposta.formaPagamento && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-5 text-sm text-gray-600">
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">Pagamento</span>
                  {formaPagamentoLabel(proposta.formaPagamento)}
                </div>
                {proposta.valorEntrada && (
                  <div>
                    <span className="text-xs text-gray-400 block mb-0.5">Entrada</span>
                    {formatCurrency(proposta.valorEntrada)}
                  </div>
                )}
                {proposta.quantidadeParcelas && (
                  <div>
                    <span className="text-xs text-gray-400 block mb-0.5">Parcelas</span>
                    {proposta.quantidadeParcelas}x {proposta.valorParcela ? formatCurrency(proposta.valorParcela) : ''}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Escopo */}
          <div className="bg-white border border-gray-200 rounded p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-3">Escopo dos serviços</h2>
            {proposta.escopo.length > 0 ? (
              <ul className="space-y-1.5">
                {proposta.escopo.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-gray-300 mt-0.5">›</span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">Escopo não definido.</p>
            )}
          </div>

          {/* Dados gerais */}
          <div className="bg-white border border-gray-200 rounded p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Dados da proposta</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <dt className="text-xs text-gray-400 mb-0.5">Cliente</dt>
                <dd className="text-gray-700 font-medium">
                  {cliente ? (
                    <Link href={`/comercial/clientes/${cliente.id}`} className="hover:underline">
                      {cliente.nome}
                    </Link>
                  ) : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400 mb-0.5">Tipo de serviço</dt>
                <dd className="text-gray-700">{proposta.tipoServico ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400 mb-0.5">Responsável</dt>
                <dd className="text-gray-700">{proposta.responsavel}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400 mb-0.5">Corretor indicador</dt>
                <dd className="text-gray-700">
                  {corretor ? (
                    <Link href={`/comercial/corretores/${corretor.id}`} className="hover:underline">
                      {corretor.nome}
                    </Link>
                  ) : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400 mb-0.5">Imobiliária</dt>
                <dd className="text-gray-700">
                  {imobiliaria ? (
                    <Link href={`/comercial/imobiliarias/${imobiliaria.id}`} className="hover:underline">
                      {imobiliaria.nome}
                    </Link>
                  ) : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400 mb-0.5">Oportunidade vinculada</dt>
                <dd className="text-gray-700">
                  {oportunidade ? (
                    <Link href={`/comercial/oportunidades/${oportunidade.id}`} className="hover:underline">
                      {oportunidade.titulo}
                    </Link>
                  ) : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400 mb-0.5">Validade</dt>
                <dd className={`font-medium ${validadeVencida ? 'text-red-500' : 'text-gray-700'}`}>
                  {formatDate(proposta.validade)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400 mb-0.5">Data de envio</dt>
                <dd className="text-gray-700">{formatDate(proposta.dataEnvio)}</dd>
              </div>
              {proposta.dataAceite && (
                <div>
                  <dt className="text-xs text-gray-400 mb-0.5">Data de aceite</dt>
                  <dd className="text-gray-700 font-medium" style={{ color: '#15803d' }}>{formatDate(proposta.dataAceite)}</dd>
                </div>
              )}
              {proposta.dataRecusa && (
                <div>
                  <dt className="text-xs text-gray-400 mb-0.5">Data de recusa</dt>
                  <dd className="text-gray-700 font-medium text-red-600">{formatDate(proposta.dataRecusa)}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-gray-400 mb-0.5">Criada em</dt>
                <dd className="text-gray-500">{formatDate(proposta.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400 mb-0.5">Atualizada em</dt>
                <dd className="text-gray-500">{formatDate(proposta.updatedAt)}</dd>
              </div>
            </dl>

            {proposta.motivoRecusa && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <dt className="text-xs text-gray-400 mb-1">Motivo da recusa</dt>
                <dd className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
                  {proposta.motivoRecusa}
                </dd>
              </div>
            )}

            {proposta.observacoes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <dt className="text-xs text-gray-400 mb-1">Observações</dt>
                <dd className="text-sm text-gray-600">{proposta.observacoes}</dd>
              </div>
            )}
          </div>

          {/* Botão futuro — desabilitado */}
          <div className="bg-gray-50 border border-gray-200 rounded p-4 flex items-center gap-3">
            <div className="text-sm text-gray-400">
              <span className="font-medium text-gray-500">Converter em demanda jurídica</span>
              {' '}— disponível em fase futura do sistema.
            </div>
            <button
              disabled
              className="ml-auto px-4 py-1.5 rounded text-xs font-medium text-gray-400 bg-gray-200 cursor-not-allowed shrink-0"
            >
              Em breve
            </button>
          </div>
        </div>

        {/* Coluna de ações */}
        <div className="space-y-4">

          {/* Ações rápidas */}
          {!encerrada && (
            <div className="bg-white border border-gray-200 rounded p-5">
              <h2 className="text-sm font-medium text-gray-700 mb-4">Ações rápidas</h2>
              <div className="space-y-2">

                {proposta.status === 'rascunho' && (
                  <form action={marcarEnviada}>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 rounded text-sm font-medium text-white transition-colors"
                      style={{ backgroundColor: '#3b82f6' }}
                    >
                      Marcar como enviada
                    </button>
                  </form>
                )}

                {(proposta.status === 'enviada') && (
                  <form action={marcarNegociacao}>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 rounded text-sm font-medium text-white transition-colors"
                      style={{ backgroundColor: '#9333ea' }}
                    >
                      Marcar em negociação
                    </button>
                  </form>
                )}

                {['enviada', 'em_negociacao'].includes(proposta.status) && (
                  <form action={aceitar}>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 rounded text-sm font-medium text-white transition-colors"
                      style={{ backgroundColor: '#15803d' }}
                    >
                      ✓ Marcar como aceita
                    </button>
                  </form>
                )}

                {['enviada', 'em_negociacao'].includes(proposta.status) && (
                  <form action={vencer}>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 rounded text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      Marcar como vencida
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Registrar recusa */}
          {!encerrada && (
            <div className="bg-white border border-gray-200 rounded p-5">
              <h2 className="text-sm font-medium text-gray-700 mb-3">Registrar recusa</h2>
              <form action={recusarAction} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Motivo da recusa *</label>
                  <textarea
                    name="motivoRecusa"
                    required
                    rows={3}
                    placeholder="Ex: Valor acima do orçamento do cliente"
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 rounded text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                >
                  Registrar recusa
                </button>
              </form>
            </div>
          )}

          {/* Editar proposta */}
          <div className="bg-white border border-gray-200 rounded p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Editar proposta</h2>
            <form action={atualizar} className="space-y-3">
              {/* campos ocultos para relações */}
              <input type="hidden" name="oportunidadeId" value={proposta.oportunidadeId ?? ''} />

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Título</label>
                <input
                  name="titulo"
                  required
                  defaultValue={proposta.titulo}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Cliente</label>
                <select
                  name="clienteId"
                  required
                  defaultValue={proposta.clienteId}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                >
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Corretor</label>
                <select
                  name="corretorId"
                  defaultValue={proposta.corretorId ?? ''}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                >
                  <option value="">Nenhum</option>
                  {corretores.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Imobiliária</label>
                <select
                  name="imobiliariaId"
                  defaultValue={proposta.imobiliariaId ?? ''}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                >
                  <option value="">Nenhuma</option>
                  {imobiliarias.map((i) => (
                    <option key={i.id} value={i.id}>{i.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Tipo de serviço</label>
                <select
                  name="tipoServico"
                  defaultValue={proposta.tipoServico ?? ''}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                >
                  <option value="">Selecione...</option>
                  {TIPOS_EXTRAJUDICIAL.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select
                  name="status"
                  defaultValue={proposta.status}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                >
                  <option value="rascunho">Rascunho</option>
                  <option value="enviada">Enviada</option>
                  <option value="em_negociacao">Em negociação</option>
                  <option value="aceita">Aceita</option>
                  <option value="recusada">Recusada</option>
                  <option value="vencida">Vencida</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Valor total (R$)</label>
                <input
                  name="valorTotal"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  defaultValue={proposta.valorTotal}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Forma de pagamento</label>
                <select
                  name="formaPagamento"
                  defaultValue={proposta.formaPagamento ?? ''}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                >
                  <option value="">—</option>
                  <option value="a_vista">À vista</option>
                  <option value="entrada_mais_parcelas">Entrada + parcelas</option>
                  <option value="parcelado">Parcelado</option>
                  <option value="exito">Êxito</option>
                  <option value="mensal">Mensal</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Validade</label>
                <input
                  name="validade"
                  type="date"
                  required
                  defaultValue={proposta.validade ?? ''}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Data de envio</label>
                <input
                  name="dataEnvio"
                  type="date"
                  defaultValue={proposta.dataEnvio ?? ''}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Responsável</label>
                <select
                  name="responsavel"
                  defaultValue={proposta.responsavel}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                >
                  {RESPONSAVEIS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Escopo (um item por linha)</label>
                <textarea
                  name="escopo"
                  rows={4}
                  defaultValue={proposta.escopo.join('\n')}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Observações</label>
                <textarea
                  name="observacoes"
                  rows={2}
                  defaultValue={proposta.observacoes ?? ''}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 rounded text-sm font-medium text-white"
                style={{ backgroundColor: '#1F2346' }}
              >
                Salvar alterações
              </button>
            </form>
          </div>

          {/* Arquivar */}
          {!encerrada && (
            <div className="bg-white border border-gray-200 rounded p-4">
              <form action={arquivar}>
                <button
                  type="submit"
                  className="w-full px-4 py-2 rounded text-sm text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Cancelar proposta
                </button>
              </form>
            </div>
          )}

          <EntityAdvisorPanel entityType="proposta" entityId={proposta.id} />
          <KnowledgeRecommendations entityType="proposta" entityId={proposta.id} />

          {/* Minutas vinculadas */}
          <div className="mt-4 bg-white border border-gray-200 rounded p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-gray-700">Minutas assistidas vinculadas</h2>
              <Link
                href={`/minutas/nova?entityType=proposta&entityId=${proposta.id}`}
                className="text-xs text-[#DFA568] hover:underline"
              >
                + Montar nova minuta
              </Link>
            </div>
            {minutasVinculadas.length === 0 ? (
              <p className="text-sm text-gray-400">Nenhuma minuta vinculada.</p>
            ) : (
              <div className="space-y-2">
                {minutasVinculadas.map((m) => (
                  <div key={m.id} className="flex items-center justify-between text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                    <div>
                      <Link href={`/minutas/${m.id}`} className="text-[#1F2346] hover:text-[#DFA568] font-medium transition-colors">
                        {m.titulo}
                      </Link>
                      <span className="ml-2 text-xs text-gray-400">{TIPO_DOCUMENTO_MINUTA_LABELS[m.tipoDocumento]}</span>
                    </div>
                    <StatusBadge status={m.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/comercial/propostas"
            className="block text-center text-sm text-gray-400 hover:text-gray-600 py-1"
          >
            ← Voltar para Propostas
          </Link>
        </div>
      </div>
    </div>
  )
}
