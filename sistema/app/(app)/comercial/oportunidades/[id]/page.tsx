import { notFound } from 'next/navigation'
import { requirePermission } from '@/lib/auth'
import Link from 'next/link'
import { getOportunidade, getCliente, getCorretor, getImobiliaria, getClientes, getCorretores, getImobiliarias, getPropostasByOportunidade, getMinutasAssistidasByEntity } from '@/lib/data'
import { formatCurrency, formatDate, statusComercialLabel, statusPropostaLabel } from '@/lib/utils'
import { atualizarOportunidade, adicionarInteracao, registrarPerda } from '@/lib/actions'
import { RESPONSAVEIS, TIPOS_EXTRAJUDICIAL, STATUS_COMERCIAL, TIPO_DOCUMENTO_MINUTA_LABELS } from '@/lib/types'
import PageHeader from '@/components/ui/PageHeader'
import EntityAdvisorPanel from '@/components/advisor/EntityAdvisorPanel'
import KnowledgeRecommendations from '@/components/knowledge/KnowledgeRecommendations'
import StatusBadge from '@/components/StatusBadge'

const TIPO_INTERACAO_LABELS: Record<string, string> = {
  ligacao: 'Ligação',
  whatsapp: 'WhatsApp',
  email: 'E-mail',
  reuniao: 'Reunião',
  proposta: 'Proposta',
  outro: 'Outro',
}

const STATUS_CORES: Record<string, { bg: string; text: string; border: string }> = {
  novo_lead:              { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' },
  primeiro_contato:       { bg: '#eff6ff', text: '#3b82f6', border: '#bfdbfe' },
  diagnostico_pendente:   { bg: '#fefce8', text: '#ca8a04', border: '#fde68a' },
  diagnostico_realizado:  { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
  proposta_enviada:       { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
  follow_up:              { bg: '#f0fdf4', text: '#15803d', border: '#86efac' },
  negociacao:             { bg: '#fdf4ff', text: '#9333ea', border: '#e9d5ff' },
  contrato_enviado:       { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
  fechado:                { bg: '#f0fdf4', text: '#15803d', border: '#86efac' },
  perdido:                { bg: '#f9fafb', text: '#6b7280', border: '#e5e7eb' },
  nutricao:               { bg: '#f8fafc', text: '#94a3b8', border: '#e2e8f0' },
}


export default async function OportunidadeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('opportunities:view')
  const { id } = await params
  const op = await getOportunidade(id)
  if (!op) notFound()

  const [cliente, corretor, imobiliaria, clientes, corretores, imobiliarias, propostasVinculadas, minutasVinculadas] = await Promise.all([
    getCliente(op.clienteId),
    op.corretorId ? getCorretor(op.corretorId) : Promise.resolve(undefined),
    op.imobiliariaId ? getImobiliaria(op.imobiliariaId) : Promise.resolve(undefined),
    getClientes(),
    getCorretores(),
    getImobiliarias(),
    getPropostasByOportunidade(id),
    getMinutasAssistidasByEntity('oportunidade', id),
  ])

  const atualizar = atualizarOportunidade.bind(null, id)
  const adicionarInt = adicionarInteracao.bind(null, id)
  const registrarPerdaAction = registrarPerda.bind(null, id)

  const cores = STATUS_CORES[op.status] ?? STATUS_CORES.novo_lead

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const followUpAtrasado = op.proximoFollowUp
    ? new Date(op.proximoFollowUp) <= hoje && !['fechado', 'perdido', 'nutricao'].includes(op.status)
    : false

  return (
    <div className="p-8">
      <PageHeader
        title={op.titulo}
        breadcrumbs={[
          { label: 'Comercial', href: '/comercial' },
          { label: 'Oportunidades', href: '/comercial/oportunidades' },
          { label: op.titulo },
        ]}
      />

      <div className="grid grid-cols-3 gap-6">
        {/* Coluna principal */}
        <div className="col-span-2 space-y-5">

          {/* Status + info */}
          <div className="bg-white border border-gray-200 rounded p-5">
            <div className="flex items-center gap-3 mb-5">
              <span
                className="inline-block px-3 py-1 rounded text-sm font-medium"
                style={{ backgroundColor: cores.bg, color: cores.text, border: `1px solid ${cores.border}` }}
              >
                {statusComercialLabel(op.status)}
              </span>
              {followUpAtrasado && (
                <span className="text-xs text-red-500 font-medium">⚠ Follow-up atrasado</span>
              )}
              {op.proximoFollowUp && !followUpAtrasado && (
                <span className="text-xs text-gray-400">Follow-up: {formatDate(op.proximoFollowUp)}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <span className="text-gray-400">Cliente</span>
                <div className="text-gray-800">
                  {cliente ? (
                    <Link href={`/comercial/clientes/${cliente.id}`} className="hover:underline">{cliente.nome}</Link>
                  ) : '—'}
                </div>
              </div>
              <div>
                <span className="text-gray-400">Responsável</span>
                <div className="text-gray-800">{op.responsavel}</div>
              </div>
              {op.valorEstimado && (
                <div>
                  <span className="text-gray-400">Valor estimado</span>
                  <div className="text-gray-800 font-medium">{formatCurrency(op.valorEstimado)}</div>
                </div>
              )}
              {op.probabilidade !== undefined && (
                <div>
                  <span className="text-gray-400">Probabilidade</span>
                  <div className="text-gray-800">{op.probabilidade}%</div>
                </div>
              )}
              {op.tipoServico && (
                <div>
                  <span className="text-gray-400">Tipo de serviço</span>
                  <div className="text-gray-800">{op.tipoServico}</div>
                </div>
              )}
              {corretor && (
                <div>
                  <span className="text-gray-400">Corretor</span>
                  <div className="text-gray-800">
                    <Link href={`/comercial/corretores/${corretor.id}`} className="hover:underline">{corretor.nome}</Link>
                  </div>
                </div>
              )}
              {imobiliaria && (
                <div>
                  <span className="text-gray-400">Imobiliária</span>
                  <div className="text-gray-800">
                    <Link href={`/comercial/imobiliarias/${imobiliaria.id}`} className="hover:underline">{imobiliaria.nome}</Link>
                  </div>
                </div>
              )}
              <div>
                <span className="text-gray-400">Criada em</span>
                <div className="text-gray-800">{formatDate(op.createdAt)}</div>
              </div>
            </div>

            {op.observacoes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-400 mb-1">Observações</div>
                <p className="text-sm text-gray-600 leading-relaxed">{op.observacoes}</p>
              </div>
            )}

            {op.motivoPerda && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-400 mb-1">Motivo da perda</div>
                <p className="text-sm text-red-600">{op.motivoPerda}</p>
              </div>
            )}
          </div>

          {/* Propostas vinculadas */}
          <div className="bg-white border border-gray-200 rounded p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-700">Propostas vinculadas</h2>
              <Link
                href={`/comercial/propostas/nova?oportunidadeId=${op.id}`}
                className="text-xs px-3 py-1 rounded font-medium text-white"
                style={{ backgroundColor: '#1F2346' }}
              >
                + Criar proposta
              </Link>
            </div>
            {propostasVinculadas.length === 0 ? (
              <p className="text-sm text-gray-400 py-2 text-center">Nenhuma proposta vinculada.</p>
            ) : (
              <div className="space-y-2">
                {propostasVinculadas.map((pr) => {
                  const STATUS_CORES_PR: Record<string, { bg: string; text: string; border: string }> = {
                    rascunho:      { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' },
                    enviada:       { bg: '#eff6ff', text: '#3b82f6', border: '#bfdbfe' },
                    em_negociacao: { bg: '#fdf4ff', text: '#9333ea', border: '#e9d5ff' },
                    aceita:        { bg: '#f0fdf4', text: '#15803d', border: '#86efac' },
                    recusada:      { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
                    vencida:       { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
                    cancelada:     { bg: '#f9fafb', text: '#9ca3af', border: '#e5e7eb' },
                  }
                  const cores = STATUS_CORES_PR[pr.status] ?? STATUS_CORES_PR.rascunho
                  return (
                    <Link
                      key={pr.id}
                      href={`/comercial/propostas/${pr.id}`}
                      className="flex items-center justify-between py-2 px-3 border border-gray-100 rounded hover:border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <div className="text-sm text-gray-700 font-medium">{pr.titulo}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          Validade: {formatDate(pr.validade)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-3">
                        <div className="text-sm font-medium text-gray-700">{formatCurrency(pr.valorTotal)}</div>
                        <span
                          className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                          style={{ backgroundColor: cores.bg, color: cores.text, border: `1px solid ${cores.border}` }}
                        >
                          {statusPropostaLabel(pr.status)}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Histórico de interações */}
          <div className="bg-white border border-gray-200 rounded p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Histórico de interações</h2>

            {/* Formulário nova interação */}
            {!['fechado', 'perdido'].includes(op.status) && (
              <form action={adicionarInt} className="mb-5 pb-5 border-b border-gray-100 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Data</label>
                    <input
                      name="data"
                      type="date"
                      required
                      defaultValue={new Date().toISOString().slice(0, 10)}
                      className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Tipo</label>
                    <select name="tipo" className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400">
                      <option value="whatsapp">WhatsApp</option>
                      <option value="ligacao">Ligação</option>
                      <option value="email">E-mail</option>
                      <option value="reuniao">Reunião</option>
                      <option value="proposta">Proposta</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Responsável</label>
                    <select name="responsavel" defaultValue={op.responsavel} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400">
                      {RESPONSAVEIS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Descrição *</label>
                  <textarea name="descricao" required rows={2} placeholder="O que aconteceu nessa interação?" className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400 resize-none" />
                </div>
                <div className="flex items-end gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Próximo follow-up</label>
                    <input name="proximoFollowUp" type="date" className="border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded text-sm font-medium text-white"
                    style={{ backgroundColor: '#1F2346' }}
                  >
                    Registrar interação
                  </button>
                </div>
              </form>
            )}

            {/* Lista de interações */}
            {op.interacoes.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Nenhuma interação registrada.</p>
            ) : (
              <div className="space-y-3">
                {op.interacoes.map((int) => (
                  <div key={int.id} className="flex gap-3">
                    <div className="shrink-0 w-20 text-xs text-gray-400 pt-0.5">{formatDate(int.data)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          {TIPO_INTERACAO_LABELS[int.tipo] ?? int.tipo}
                        </span>
                        <span className="text-xs text-gray-400">{int.responsavel}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{int.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Coluna lateral */}
        <div className="space-y-4">
          {/* Editar */}
          <div className="bg-white border border-gray-200 rounded p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Editar</h2>
            <form action={atualizar} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Título</label>
                <input name="titulo" defaultValue={op.titulo} required className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Cliente</label>
                <select name="clienteId" defaultValue={op.clienteId} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400">
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Status</label>
                <select name="status" defaultValue={op.status} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400">
                  {STATUS_COMERCIAL.map((s) => (
                    <option key={s} value={s}>{statusComercialLabel(s)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Tipo de serviço</label>
                <select name="tipoServico" defaultValue={op.tipoServico ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400">
                  <option value="">—</option>
                  {TIPOS_EXTRAJUDICIAL.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Responsável</label>
                <select name="responsavel" defaultValue={op.responsavel} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400">
                  {RESPONSAVEIS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Valor estimado (R$)</label>
                <input name="valorEstimado" type="number" step="0.01" defaultValue={op.valorEstimado ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Probabilidade (%)</label>
                <input name="probabilidade" type="number" min="0" max="100" defaultValue={op.probabilidade ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Próximo follow-up</label>
                <input name="proximoFollowUp" type="date" defaultValue={op.proximoFollowUp ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Corretor</label>
                <select name="corretorId" defaultValue={op.corretorId ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400">
                  <option value="">Nenhum</option>
                  {corretores.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Imobiliária</label>
                <select name="imobiliariaId" defaultValue={op.imobiliariaId ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400">
                  <option value="">Nenhuma</option>
                  {imobiliarias.map((im) => (
                    <option key={im.id} value={im.id}>{im.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Observações</label>
                <textarea name="observacoes" rows={3} defaultValue={op.observacoes ?? ''} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400 resize-none" />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded text-sm font-medium text-white"
                style={{ backgroundColor: '#1F2346' }}
              >
                Salvar alterações
              </button>
            </form>
          </div>

          {/* Registrar perda */}
          {!['fechado', 'perdido'].includes(op.status) && (
            <div className="bg-white border border-gray-200 rounded p-5">
              <h2 className="text-sm font-medium text-gray-700 mb-3">Registrar perda</h2>
              <form action={registrarPerdaAction} className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Motivo *</label>
                  <textarea name="motivoPerda" required rows={2} placeholder="Ex: Concorrência, valor, timing..." className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400 resize-none" />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded text-sm text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
                >
                  Marcar como perdida
                </button>
              </form>
            </div>
          )}
          <EntityAdvisorPanel entityType="oportunidade" entityId={op.id} />
          <KnowledgeRecommendations entityType="oportunidade" entityId={op.id} />

          {/* Minutas vinculadas */}
          <div className="mt-4 bg-white border border-gray-200 rounded p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-gray-700">Minutas assistidas vinculadas</h2>
              <Link
                href={`/minutas/nova?entityType=oportunidade&entityId=${op.id}`}
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
        </div>
      </div>
    </div>
  )
}
