import Link from 'next/link'
import {
  getResumoComercial,
  getResumoJuridico,
  getResumoTarefas,
  getResumoDocumentos,
  getAlertasExecutivos,
  getProximasAcoes,
  getRankingImobiliarias,
  getRankingCorretores,
  getPrazosProximos,
  getTarefasPorResponsavel,
  getOportunidadesParadas,
} from '@/lib/data'
import MetricCard from '@/components/ui/MetricCard'

function formatCurrency(value: number): string {
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(1).replace('.', ',')}k`
  return `R$ ${value.toLocaleString('pt-BR')}`
}

function formatDate(iso: string): string {
  return new Date(iso + (iso.length === 10 ? 'T12:00:00' : '')).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short',
  })
}

function diasLabel(n: number): string {
  if (n === 0) return 'Hoje'
  if (n === 1) return 'Amanhã'
  if (n < 0) return `${Math.abs(n)}d atrás`
  return `em ${n}d`
}

const NIVEL_CORES = {
  critico: { border: 'border-red-200', bg: 'bg-red-50', dot: 'bg-red-500', text: 'text-red-700' },
  alerta:  { border: 'border-amber-200', bg: 'bg-amber-50', dot: 'bg-amber-400', text: 'text-amber-700' },
  info:    { border: 'border-blue-200', bg: 'bg-blue-50', dot: 'bg-blue-400', text: 'text-blue-700' },
}

const TIPO_ACAO_LABEL: Record<string, string> = {
  followup:           'Follow-up',
  prazo_tarefa:       'Tarefa',
  prazo_processo:     'Prazo',
  prazo_extrajudicial:'Prazo',
  audiencia:          'Audiência',
  proposta_vencendo:  'Proposta',
}

const TIPO_ACAO_COR: Record<string, string> = {
  followup:            '#3b82f6',
  prazo_tarefa:        '#f59e0b',
  prazo_processo:      '#dc2626',
  prazo_extrajudicial: '#dc2626',
  audiencia:           '#7c3aed',
  proposta_vencendo:   '#DFA568',
}

export default async function Dashboard() {
  const [comercial, juridico, tarefas, documentos, alertas, acoes, prazos, imobRanking, corrRanking, paradas, porResp] = await Promise.all([
    getResumoComercial(),
    getResumoJuridico(),
    getResumoTarefas(),
    getResumoDocumentos(),
    getAlertasExecutivos(),
    getProximasAcoes(10),
    getPrazosProximos(7),
    getRankingImobiliarias(5),
    getRankingCorretores(5),
    getOportunidadesParadas(14),
    getTarefasPorResponsavel(),
  ])

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  return (
    <div className="p-8 space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F2346]">Dashboard Executivo</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Link
          href="/advisor"
          className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium text-white transition-opacity hover:opacity-90 shrink-0"
          style={{ backgroundColor: '#DFA568' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Abrir Advisor
        </Link>
      </div>

      {/* ── Alertas Executivos ── */}
      {alertas.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">Alertas</div>
          <div className="space-y-2">
            {alertas.map((a) => {
              const cores = NIVEL_CORES[a.nivel]
              return (
                <Link
                  key={a.id}
                  href={a.href}
                  className={`flex items-start gap-3 border ${cores.border} ${cores.bg} rounded px-4 py-3 hover:opacity-80 transition-opacity`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${cores.dot}`} />
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm font-medium ${cores.text}`}>{a.titulo}</span>
                    {a.descricao && (
                      <span className="text-xs text-gray-500 ml-2 truncate">{a.descricao}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">→</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Visão Geral — Métricas ── */}
      <div className="space-y-3">
        <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">Visão Geral</div>
        {/* Linha 1: Comercial */}
        <div className="grid grid-cols-4 gap-3">
          <MetricCard
            label="Imobiliárias ativas"
            value={comercial.imobiliariasAtivas}
            sub={`${comercial.corretoresAtivos} corretores ativos`}
            href="/comercial/imobiliarias"
          />
          <MetricCard
            label="Oportunidades abertas"
            value={comercial.oportunidadesAbertas}
            sub={comercial.followUpsAtrasados > 0 ? `${comercial.followUpsAtrasados} follow-up atrasado` : 'Follow-ups em dia'}
            href="/comercial/oportunidades"
            valueColor={comercial.followUpsAtrasados > 0 ? '#c2410c' : undefined}
            alert={comercial.followUpsAtrasados > 0}
          />
          <MetricCard
            label="Pipeline aberto"
            value={formatCurrency(comercial.valorPipeline)}
            sub={`Ponderado: ${formatCurrency(comercial.valorPipelinePonderado)}`}
            href="/comercial/oportunidades"
          />
          <MetricCard
            label="Propostas abertas"
            value={comercial.propostasAbertas}
            sub={`Taxa de conversão: ${comercial.taxaConversao}%`}
            href="/comercial/propostas"
          />
        </div>
        {/* Linha 2: Jurídico + Gestão */}
        <div className="grid grid-cols-4 gap-3">
          <MetricCard
            label="Processos ativos"
            value={juridico.processosAtivos}
            sub={`${juridico.prazosProximos7Dias} prazo(s) em 7 dias`}
            href="/processos"
            valueColor={juridico.demandasAtrasadas > 0 ? '#c2410c' : undefined}
            alert={juridico.demandasAtrasadas > 0}
          />
          <MetricCard
            label="Extrajudiciais ativas"
            value={juridico.extrajudiciaisEmAndamento}
            href="/extrajudiciais"
          />
          <MetricCard
            label="Consultorias ativas"
            value={juridico.consultoriasAtivas}
            href="/consultorias"
          />
          <MetricCard
            label="Tarefas pendentes"
            value={tarefas.pendentes + tarefas.emAndamento}
            sub={tarefas.atrasadas > 0 ? `${tarefas.atrasadas} atrasada(s)` : 'Sem atrasos'}
            href="/tarefas"
            valueColor={tarefas.atrasadas > 0 ? '#c2410c' : undefined}
            alert={tarefas.atrasadas > 0}
          />
        </div>
      </div>

      {/* ── Grid principal ── */}
      <div className="grid grid-cols-3 gap-6">

        {/* Próximas Ações */}
        <div className="col-span-2 bg-white border border-gray-200 rounded p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#1F2346]">Próximas ações — 14 dias</h2>
            <span className="text-xs text-gray-400">{acoes.length} item(s)</span>
          </div>
          {acoes.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhuma ação agendada nos próximos 14 dias.</p>
          ) : (
            <div className="space-y-2">
              {acoes.map((a) => {
                const d = new Date(a.data + (a.data.length === 10 ? 'T12:00:00' : ''))
                d.setHours(0, 0, 0, 0)
                const dias = Math.round((d.getTime() - hoje.getTime()) / 86400000)
                const vencido = dias < 0
                return (
                  <Link
                    key={a.id}
                    href={a.href}
                    className="flex items-center gap-3 group hover:bg-gray-50 rounded px-2 py-1.5 transition-colors"
                  >
                    <span
                      className="text-xs font-medium px-1.5 py-0.5 rounded shrink-0"
                      style={{
                        backgroundColor: (TIPO_ACAO_COR[a.tipo] ?? '#64748b') + '20',
                        color: TIPO_ACAO_COR[a.tipo] ?? '#64748b',
                      }}
                    >
                      {TIPO_ACAO_LABEL[a.tipo] ?? a.tipo}
                    </span>
                    <span className="flex-1 text-sm text-gray-700 truncate group-hover:text-[#DFA568] transition-colors">
                      {a.titulo}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0">{a.responsavel}</span>
                    <span
                      className={`text-xs font-semibold shrink-0 px-1.5 py-0.5 rounded ${
                        vencido ? 'bg-red-100 text-red-700' :
                        dias === 0 ? 'bg-red-50 text-red-600' :
                        dias <= 2 ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {diasLabel(dias)}
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Prazos jurídicos próximos */}
        <div className="bg-white border border-gray-200 rounded p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#1F2346]">Prazos jurídicos</h2>
            <Link href="/processos" className="text-xs text-[#DFA568] hover:underline">Ver todos</Link>
          </div>
          {prazos.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhum prazo nos próximos 7 dias.</p>
          ) : (
            <div className="space-y-3">
              {prazos.map((a, i) => (
                <Link
                  key={i}
                  href={`/${a.tipo === 'processo' ? 'processos' : 'extrajudiciais'}/${a.id}`}
                  className="flex items-start justify-between gap-2 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-700 truncate group-hover:text-[#DFA568] transition-colors">
                      {a.titulo}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{a.responsavel} · {formatDate(a.prazo)}</div>
                  </div>
                  <span
                    className={`text-xs font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                      a.diasRestantes === 0 ? 'bg-red-100 text-red-700' :
                      a.diasRestantes <= 2 ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {diasLabel(a.diasRestantes)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Rankings + Tarefas por responsável ── */}
      <div className="grid grid-cols-3 gap-6">

        {/* Ranking imobiliárias */}
        <div className="bg-white border border-gray-200 rounded p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#1F2346]">Top imobiliárias</h2>
            <Link href="/comercial/imobiliarias" className="text-xs text-[#DFA568] hover:underline">Ver todas</Link>
          </div>
          {imobRanking.length === 0 ? (
            <p className="text-sm text-gray-400">Sem dados.</p>
          ) : (
            <div className="space-y-3">
              {imobRanking.map((r, idx) => (
                <Link
                  key={r.imobiliariaId}
                  href={`/comercial/imobiliarias/${r.imobiliariaId}`}
                  className="flex items-center gap-3 group"
                >
                  <span className="text-xs font-bold text-gray-300 w-4 shrink-0">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-700 truncate group-hover:text-[#DFA568] transition-colors flex items-center gap-1.5">
                      {r.nome}
                      {r.temConsultoria && (
                        <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">contrato</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {r.oportunidadesAbertas} op. abertas · {r.propostasAceitas} aceitas
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {r.faturamentoFechado > 0 && (
                      <div className="text-xs font-medium text-[#15803d]">{formatCurrency(r.faturamentoFechado)}</div>
                    )}
                    {r.faturamentoPipeline > 0 && (
                      <div className="text-xs text-gray-400">{formatCurrency(r.faturamentoPipeline)}</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Ranking corretores */}
        <div className="bg-white border border-gray-200 rounded p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#1F2346]">Top corretores</h2>
            <Link href="/comercial/corretores" className="text-xs text-[#DFA568] hover:underline">Ver todos</Link>
          </div>
          {corrRanking.length === 0 ? (
            <p className="text-sm text-gray-400">Sem dados.</p>
          ) : (
            <div className="space-y-3">
              {corrRanking.map((r, idx) => (
                <Link
                  key={r.corretorId}
                  href={`/comercial/corretores/${r.corretorId}`}
                  className="flex items-center gap-3 group"
                >
                  <span className="text-xs font-bold text-gray-300 w-4 shrink-0">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-700 truncate group-hover:text-[#DFA568] transition-colors">
                      {r.nome}
                    </div>
                    <div className="text-xs text-gray-400 truncate">{r.imobiliariaNome}</div>
                  </div>
                  <div className="text-right shrink-0">
                    {r.faturamentoFechado > 0 && (
                      <div className="text-xs font-medium text-[#15803d]">{formatCurrency(r.faturamentoFechado)}</div>
                    )}
                    <div className="text-xs text-gray-400">{r.totalOportunidades} op.</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Tarefas por responsável + Documentos */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[#1F2346]">Tarefas por responsável</h2>
              <Link href="/tarefas" className="text-xs text-[#DFA568] hover:underline">Ver todas</Link>
            </div>
            {porResp.length === 0 ? (
              <p className="text-sm text-gray-400">Sem tarefas ativas.</p>
            ) : (
              <div className="space-y-2">
                {porResp.map((r) => (
                  <div key={r.responsavel} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{r.responsavel}</span>
                    <div className="flex gap-3 text-xs text-gray-400">
                      <span>{r.total} total</span>
                      <span>{r.pendentes} pend.</span>
                      {r.atrasadas > 0 && (
                        <span className="text-red-500 font-medium">{r.atrasadas} atras.</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[#1F2346]">Documentos</h2>
              <Link href="/documentos" className="text-xs text-[#DFA568] hover:underline">Ver todos</Link>
            </div>
            <div className="flex gap-4 text-sm">
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Pendentes</div>
                <div className="font-semibold text-orange-600">{documentos.pendentes}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Entregues</div>
                <div className="font-semibold text-blue-600">{documentos.entregues}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Aprovados</div>
                <div className="font-semibold text-green-600">{documentos.aprovados}</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── Oportunidades paradas ── */}
      {paradas.length > 0 && (
        <div className="bg-white border border-amber-100 rounded p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#1F2346] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              Oportunidades paradas há +14 dias
            </h2>
            <Link href="/comercial/oportunidades" className="text-xs text-[#DFA568] hover:underline">Ver pipeline</Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {paradas.map((o) => (
              <Link
                key={o.id}
                href={`/comercial/oportunidades/${o.id}`}
                className="border border-amber-100 rounded px-3 py-2 hover:border-[#DFA568] transition-colors"
              >
                <div className="text-sm text-gray-700 truncate">{o.titulo}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {o.responsavel} · {o.valorEstimado ? formatCurrency(o.valorEstimado) : '—'}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
