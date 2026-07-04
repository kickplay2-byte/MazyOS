import {
  getFollowUpsAtrasados,
  getTarefasVencidas,
  getPropostasAbertas,
  getDocumentosPendentes,
  getValorPipelineAberto,
  getResumoComercial,
  getResumoJuridico,
  getResumoTarefas,
} from '@/lib/data'
import AdvisorInsightCard from '@/components/advisor/AdvisorInsightCard'
import AdvisorChat from '@/components/advisor/AdvisorChat'
import { requirePermission } from '@/lib/auth'

function formatCurrency(value: number): string {
  if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1).replace('.', ',')}M`
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(1).replace('.', ',')}k`
  return `R$ ${value.toLocaleString('pt-BR')}`
}

export default async function AdvisorPage() {
  await requirePermission('advisor:view')
  const [
    followUps,
    tarefasVencidas,
    propostasAbertas,
    docPendentes,
    valorPipeline,
    resumoComercial,
    resumoJuridico,
    resumoTarefas,
  ] = await Promise.all([
    getFollowUpsAtrasados(),
    getTarefasVencidas(),
    getPropostasAbertas(),
    getDocumentosPendentes(),
    getValorPipelineAberto(),
    getResumoComercial(),
    getResumoJuridico(),
    getResumoTarefas(),
  ])

  const hasApiKey = !!process.env.OPENAI_API_KEY

  const insights = [
    {
      label: 'Follow-ups atrasados',
      value: followUps.length,
      href: '/comercial/oportunidades',
      alert: followUps.length > 0,
    },
    {
      label: 'Propostas em aberto',
      value: propostasAbertas.length,
      href: '/comercial/propostas',
      alert: false,
    },
    {
      label: 'Tarefas vencidas',
      value: tarefasVencidas.length,
      href: '/tarefas',
      alert: tarefasVencidas.length > 0,
    },
    {
      label: 'Documentos pendentes',
      value: docPendentes.length,
      href: '/documentos',
      alert: false,
    },
    {
      label: 'Pipeline aberto',
      value: formatCurrency(valorPipeline),
      href: '/comercial/oportunidades',
      alert: false,
    },
  ]

  const contextStats = {
    comercial: {
      imobiliariasAtivas: resumoComercial.imobiliariasAtivas,
      oportunidadesAbertas: resumoComercial.oportunidadesAbertas,
      propostasAbertas: resumoComercial.propostasAbertas,
    },
    juridico: {
      processosAtivos: resumoJuridico.processosAtivos,
      extrajudiciaisEmAndamento: resumoJuridico.extrajudiciaisEmAndamento,
      consultoriasAtivas: resumoJuridico.consultoriasAtivas,
    },
    gestao: {
      tarefasTotal: resumoTarefas.total,
      documentosPendentes: docPendentes.length,
    },
  }

  return (
    <div className="p-8 space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ backgroundColor: '#DFA568' }}
            >
              A
            </div>
            <h1 className="text-2xl font-semibold text-[#1F2346]">Advisor PIPE OS</h1>
          </div>
          <p className="text-sm text-gray-400 ml-11">
            IA executiva para leitura jurídica, comercial e operacional do escritório.
          </p>
        </div>
        <div
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            hasApiKey
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-gray-100 text-gray-400 border border-gray-200'
          }`}
        >
          {hasApiKey ? '● IA ativa' : '○ IA não configurada'}
        </div>
      </div>

      {/* Insight cards */}
      <div>
        <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
          Situação atual
        </div>
        <div className="grid grid-cols-5 gap-3">
          {insights.map((c) => (
            <AdvisorInsightCard
              key={c.label}
              label={c.label}
              value={c.value}
              href={c.href}
              alert={c.alert}
            />
          ))}
        </div>
      </div>

      {/* Chat */}
      <AdvisorChat contextStats={contextStats} hasApiKey={hasApiKey} />

    </div>
  )
}
