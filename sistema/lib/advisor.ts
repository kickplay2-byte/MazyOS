import {
  getResumoComercial,
  getResumoJuridico,
  getResumoTarefas,
  getResumoDocumentos,
  getAlertasExecutivos,
  getProximasAcoes,
  getRankingImobiliarias,
  getRankingCorretores,
  getOportunidadesParadas,
  getTarefasVencidas,
  getDemandasAtrasadas,
  getPropostasAbertas,
  getResumoBaseConhecimento,
} from './data'
import type { AIMessage } from './ai'

// ── Tipos do contexto ─────────────────────────────────────────────────────────

export interface AdvisorContextComercial {
  imobiliariasAtivas: number
  corretoresAtivos: number
  oportunidadesAbertas: number
  valorPipeline: number
  valorPipelinePonderado: number
  propostasAbertas: number
  taxaConversao: number
  followUpsAtrasados: number
  oportunidadesParadas: Array<{ titulo: string; responsavel: string; diasParada: number; valorEstimado?: number }>
  propostas: Array<{ titulo: string; status: string; valorTotal: number; validade?: string }>
}

export interface AdvisorContextJuridico {
  processosAtivos: number
  extrajudiciaisEmAndamento: number
  consultoriasAtivas: number
  prazosProximos7Dias: number
  demandasAtrasadas: Array<{ titulo: string; tipo: string; responsavel: string; prazo: string }>
}

export interface AdvisorContextGestao {
  tarefasTotal: number
  tarefasPendentes: number
  tarefasAtrasadas: number
  tarefasVencidas: Array<{ titulo: string; responsavel: string; prazo: string }>
  documentosPendentes: number
  documentosTotal: number
}

export interface AdvisorContextBaseConhecimento {
  totalModelos: number
  totalClausulas: number
  totalChecklists: number
  totalOrientacoes: number
}

export interface AdvisorContext {
  dataHoje: string
  comercial: AdvisorContextComercial
  juridico: AdvisorContextJuridico
  gestao: AdvisorContextGestao
  baseConhecimento: AdvisorContextBaseConhecimento
  alertas: Array<{ nivel: string; titulo: string; descricao: string }>
  rankings: {
    imobiliarias: Array<{ nome: string; oportunidadesAbertas: number; propostasAceitas: number; faturamentoFechado: number; faturamentoPipeline: number }>
    corretores: Array<{ nome: string; imobiliaria: string; totalOportunidades: number; faturamentoFechado: number }>
  }
  proximasAcoes: Array<{ tipo: string; titulo: string; data: string; responsavel: string }>
}

// ── Helpers de sanitização ────────────────────────────────────────────────────

function trunc(s: string | undefined | null, max = 70): string {
  if (!s) return ''
  return s.length > max ? s.substring(0, max) + '…' : s
}

function limit<T>(arr: T[], max = 8): T[] {
  return arr.slice(0, max)
}

// ── Construção do contexto ────────────────────────────────────────────────────

export async function getAdvisorContext(): Promise<AdvisorContext> {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const [
    resumoComercial,
    resumoJuridico,
    resumoTarefas,
    resumoDocumentos,
    alertas,
    proximasAcoes,
    rankingImobiliarias,
    rankingCorretores,
    oportunidadesParadas,
    tarefasVencidas,
    demandasAtrasadas,
    propostasAbertas,
    resumoBaseConhecimento,
  ] = await Promise.all([
    getResumoComercial(),
    getResumoJuridico(),
    getResumoTarefas(),
    getResumoDocumentos(),
    getAlertasExecutivos(),
    getProximasAcoes(10),
    getRankingImobiliarias(5),
    getRankingCorretores(5),
    getOportunidadesParadas(14),
    getTarefasVencidas(),
    getDemandasAtrasadas(),
    getPropostasAbertas(),
    getResumoBaseConhecimento(),
  ])

  return {
    dataHoje: hoje.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),

    comercial: {
      imobiliariasAtivas: resumoComercial.imobiliariasAtivas,
      corretoresAtivos: resumoComercial.corretoresAtivos,
      oportunidadesAbertas: resumoComercial.oportunidadesAbertas,
      valorPipeline: resumoComercial.valorPipeline,
      valorPipelinePonderado: resumoComercial.valorPipelinePonderado,
      propostasAbertas: resumoComercial.propostasAbertas,
      taxaConversao: resumoComercial.taxaConversao,
      followUpsAtrasados: resumoComercial.followUpsAtrasados,
      oportunidadesParadas: limit(
        oportunidadesParadas.map((o) => ({
          titulo: trunc(o.titulo),
          responsavel: o.responsavel,
          diasParada: Math.round(
            (new Date().getTime() - new Date(o.updatedAt).getTime()) / 86400000
          ),
          valorEstimado: o.valorEstimado,
        }))
      ),
      propostas: limit(
        propostasAbertas.map((p) => ({
          titulo: trunc(p.titulo),
          status: p.status,
          valorTotal: p.valorTotal,
          validade: p.validade,
        }))
      ),
    },

    juridico: {
      processosAtivos: resumoJuridico.processosAtivos,
      extrajudiciaisEmAndamento: resumoJuridico.extrajudiciaisEmAndamento,
      consultoriasAtivas: resumoJuridico.consultoriasAtivas,
      prazosProximos7Dias: resumoJuridico.prazosProximos7Dias,
      demandasAtrasadas: limit(
        demandasAtrasadas.map((d) => ({
          titulo: trunc(d.titulo),
          tipo: d.tipo,
          responsavel: d.responsavel,
          prazo: d.prazo,
        }))
      ),
    },

    gestao: {
      tarefasTotal: resumoTarefas.total,
      tarefasPendentes: resumoTarefas.pendentes,
      tarefasAtrasadas: resumoTarefas.atrasadas,
      tarefasVencidas: limit(
        tarefasVencidas.map((t) => ({
          titulo: trunc(t.titulo),
          responsavel: t.responsavel,
          prazo: t.prazo ?? '',
        }))
      ),
      documentosPendentes: resumoDocumentos.pendentes,
      documentosTotal: resumoDocumentos.total,
    },

    baseConhecimento: {
      totalModelos: resumoBaseConhecimento.totalModelos,
      totalClausulas: resumoBaseConhecimento.totalClausulas,
      totalChecklists: resumoBaseConhecimento.totalChecklists,
      totalOrientacoes: resumoBaseConhecimento.totalOrientacoes,
    },

    alertas: limit(
      alertas.map((a) => ({
        nivel: a.nivel,
        titulo: trunc(a.titulo, 90),
        descricao: trunc(a.descricao, 90),
      }))
    ),

    rankings: {
      imobiliarias: rankingImobiliarias.map((r) => ({
        nome: r.nome,
        oportunidadesAbertas: r.oportunidadesAbertas,
        propostasAceitas: r.propostasAceitas,
        faturamentoFechado: r.faturamentoFechado,
        faturamentoPipeline: r.faturamentoPipeline,
      })),
      corretores: rankingCorretores.map((r) => ({
        nome: r.nome,
        imobiliaria: r.imobiliariaNome,
        totalOportunidades: r.totalOportunidades,
        faturamentoFechado: r.faturamentoFechado,
      })),
    },

    proximasAcoes: limit(
      proximasAcoes.map((a) => ({
        tipo: a.tipo,
        titulo: trunc(a.titulo),
        data: a.data,
        responsavel: a.responsavel,
      }))
    ),
  }
}

// ── System prompt ─────────────────────────────────────────────────────────────

export const ADVISOR_SYSTEM_PROMPT = `Você é o Advisor do PIPE OS, sistema operacional jurídico-comercial da Vieira da Silva Advocacia, escritório especializado em direito imobiliário em Curitiba/PR.

Sua função é analisar os dados internos do escritório e gerar recomendações estratégicas, comerciais e operacionais para Giovanni Pianaro (sócio operador, 27 anos) e sua equipe (Enrico, Jaqueline, Pedro, Maria, Giovana).

O modelo de negócio do escritório:
- ~34 imobiliárias parceiras (consultoria mensal recorrente)
- ~500 corretores vinculados (canal de indicação de clientes)
- Clientes PF indicados pelos corretores (due diligence, regularização, inventário, etc.)
- ~70 processos judiciais ativos
- Meta: R$ 1,5–2M/ano na área imobiliária

Você deve ajudar a identificar prioridades, gargalos, oportunidades comerciais, propostas pendentes, tarefas vencidas, documentos pendentes, riscos operacionais e próximos passos concretos.

Regras invioláveis:
- Responda sempre em português brasileiro.
- Não invente dados. Use apenas o contexto recebido.
- Quando fizer inferências, identifique claramente como inferências.
- Não redija contratos, pareceres jurídicos completos ou peças processuais. Se solicitado, explique que esta versão do Advisor é focada em análise executiva e operacional.
- Quando não houver dado suficiente, diga isso claramente.
- Evite respostas genéricas. Baseie cada recomendação nos números e dados do contexto.
- Formate a resposta com seções e marcadores quando facilitar a leitura.
- Tom: consultivo, direto, estratégico — como um COO interno do escritório.
- Priorize recomendações práticas e plano de ação concreto.`

// ── Construção do prompt do usuário ──────────────────────────────────────────

export function buildAdvisorMessages(
  question: string,
  context: AdvisorContext
): AIMessage[] {
  const ctx = JSON.stringify(context, null, 2)
  const userContent = `Data de hoje: ${context.dataHoje}

CONTEXTO DO ESCRITÓRIO (dados do PIPE OS):
\`\`\`json
${ctx}
\`\`\`

PERGUNTA:
${question}`

  return [
    { role: 'system', content: ADVISOR_SYSTEM_PROMPT },
    { role: 'user', content: userContent },
  ]
}

// ── Prompts rápidos ───────────────────────────────────────────────────────────

export const QUICK_PROMPTS = [
  'Resumo executivo de hoje',
  'Prioridades do dia',
  'Oportunidades paradas',
  'Propostas que precisam de follow-up',
  'Dinheiro parado no pipeline',
  'Corretores estratégicos',
  'Imobiliárias que merecem atenção',
  'Tarefas e documentos críticos',
  'Plano de ação da semana',
  'Gargalos do escritório',
] as const
