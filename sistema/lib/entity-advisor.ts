import {
  getImobiliaria,
  getCorretoresByImobiliaria,
  getOportunidadesByImobiliaria,
  getPropostasByImobiliaria,
  getConsultorias,
  getCorretor,
  getClientesByCorretor,
  getOportunidadesByCorretor,
  getPropostasByCorretor,
  getCliente,
  getOportunidadesByCliente,
  getPropostasByCliente,
  getOportunidade,
  getPropostasByOportunidade,
  getProposta,
  getProcesso,
  getExtrajudicial,
  getConsultoria,
  getTarefasByVinculo,
  getArquivosByVinculo,
} from './data'
import { getKnowledgeRecommendationsByContext } from './knowledge-recommendations'
import type { AIMessage } from './ai'

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type EntityAdvisorType =
  | 'imobiliaria'
  | 'corretor'
  | 'cliente'
  | 'oportunidade'
  | 'proposta'
  | 'processo'
  | 'extrajudicial'
  | 'consultoria'
  | 'tarefa'
  | 'arquivo'

// ── Sanitização ───────────────────────────────────────────────────────────────

function trunc(s: string | undefined | null, max = 80): string {
  if (!s) return ''
  return s.length > max ? s.substring(0, max) + '…' : s
}

function limit<T>(arr: T[], max = 8): T[] {
  return arr.slice(0, max)
}

// ── Contextos por entidade ────────────────────────────────────────────────────

async function buildImobiliariaContext(id: string) {
  const imob = await getImobiliaria(id)
  if (!imob) return null

  const [corretores, oportunidades, propostas, todasConsultorias] = await Promise.all([
    getCorretoresByImobiliaria(id),
    getOportunidadesByImobiliaria(id),
    getPropostasByImobiliaria(id),
    getConsultorias(),
  ])

  const consultorias = todasConsultorias.filter((c) => c.imobiliaria === imob.nome)

  return {
    entidade: 'Imobiliária',
    nome: imob.nome,
    cidade: imob.cidade,
    status: imob.status,
    nivelRelacionamento: imob.nivelRelacionamento,
    valorMensal: imob.valorMensal,
    responsavel: imob.responsavel,
    dataInicio: imob.dataInicio,
    dataRenovacao: imob.dataRenovacao,
    ultimaInteracao: imob.ultimaInteracao,
    proximaAcao: imob.proximaAcao,
    proximaAcaoData: imob.proximaAcaoData,
    observacoes: trunc(imob.observacoes),
    totalCorretores: corretores.length,
    corretoresAtivos: corretores.filter((c) => c.status === 'ativo').length,
    corretores: limit(
      corretores.map((c) => ({
        nome: c.nome,
        status: c.status,
        nivelRelacionamento: c.nivelRelacionamento,
        quantidadeIndicacoes: c.quantidadeIndicacoes,
        faturamentoGerado: c.faturamentoGerado,
      }))
    ),
    totalOportunidades: oportunidades.length,
    oportunidades: limit(
      oportunidades.map((o) => ({
        titulo: trunc(o.titulo),
        status: o.status,
        valorEstimado: o.valorEstimado,
        responsavel: o.responsavel,
        proximoFollowUp: o.proximoFollowUp,
      }))
    ),
    totalPropostas: propostas.length,
    propostas: limit(
      propostas.map((p) => ({
        titulo: trunc(p.titulo),
        status: p.status,
        valorTotal: p.valorTotal,
        validade: p.validade,
      })),
      5
    ),
    consultorias: consultorias.map((c) => ({
      status: c.status,
      valorMensal: c.valorMensal,
      dataRenovacao: c.dataRenovacao,
    })),
  }
}

async function buildCorretorContext(id: string) {
  const corretor = await getCorretor(id)
  if (!corretor) return null

  const [imobiliaria, clientes, oportunidades, propostas] = await Promise.all([
    getImobiliaria(corretor.imobiliariaId),
    getClientesByCorretor(id),
    getOportunidadesByCorretor(id),
    getPropostasByCorretor(id),
  ])

  return {
    entidade: 'Corretor',
    nome: corretor.nome,
    status: corretor.status,
    nivelRelacionamento: corretor.nivelRelacionamento,
    quantidadeIndicacoes: corretor.quantidadeIndicacoes,
    faturamentoGerado: corretor.faturamentoGerado,
    ultimaInteracao: corretor.ultimaInteracao,
    proximaAcao: corretor.proximaAcao,
    proximaAcaoData: corretor.proximaAcaoData,
    observacoes: trunc(corretor.observacoes),
    imobiliaria: imobiliaria?.nome,
    imobiliariaStatus: imobiliaria?.status,
    totalClientes: clientes.length,
    clientes: limit(
      clientes.map((c) => ({
        nome: c.nome,
        origem: c.origem,
      }))
    ),
    totalOportunidades: oportunidades.length,
    oportunidades: limit(
      oportunidades.map((o) => ({
        titulo: trunc(o.titulo),
        status: o.status,
        valorEstimado: o.valorEstimado,
        responsavel: o.responsavel,
        proximoFollowUp: o.proximoFollowUp,
      }))
    ),
    totalPropostas: propostas.length,
    propostas: limit(
      propostas.map((p) => ({
        titulo: trunc(p.titulo),
        status: p.status,
        valorTotal: p.valorTotal,
        validade: p.validade,
      })),
      5
    ),
  }
}

async function buildClienteContext(id: string) {
  const cliente = await getCliente(id)
  if (!cliente) return null

  const [corretor, imobiliaria, oportunidades, propostas] = await Promise.all([
    cliente.corretorId ? getCorretor(cliente.corretorId) : Promise.resolve(undefined),
    cliente.imobiliariaId ? getImobiliaria(cliente.imobiliariaId) : Promise.resolve(undefined),
    getOportunidadesByCliente(id),
    getPropostasByCliente(id),
  ])

  return {
    entidade: 'Cliente',
    nome: cliente.nome,
    origem: cliente.origem,
    observacoes: trunc(cliente.observacoes),
    corretorNome: corretor?.nome,
    imobiliariaNome: imobiliaria?.nome,
    totalOportunidades: oportunidades.length,
    oportunidades: limit(
      oportunidades.map((o) => ({
        titulo: trunc(o.titulo),
        status: o.status,
        tipoServico: o.tipoServico,
        valorEstimado: o.valorEstimado,
        responsavel: o.responsavel,
        proximoFollowUp: o.proximoFollowUp,
      }))
    ),
    totalPropostas: propostas.length,
    propostas: limit(
      propostas.map((p) => ({
        titulo: trunc(p.titulo),
        status: p.status,
        tipoServico: p.tipoServico,
        valorTotal: p.valorTotal,
        validade: p.validade,
      })),
      5
    ),
  }
}

async function buildOportunidadeContext(id: string) {
  const oportunidade = await getOportunidade(id)
  if (!oportunidade) return null

  const [cliente, corretor, imobiliaria, propostas, tarefas, recs] = await Promise.all([
    getCliente(oportunidade.clienteId),
    oportunidade.corretorId ? getCorretor(oportunidade.corretorId) : Promise.resolve(undefined),
    oportunidade.imobiliariaId ? getImobiliaria(oportunidade.imobiliariaId) : Promise.resolve(undefined),
    getPropostasByOportunidade(id),
    getTarefasByVinculo('oportunidade', id),
    getKnowledgeRecommendationsByContext({
      entityType: 'oportunidade',
      tipoServico: oportunidade.tipoServico,
      titulo: oportunidade.titulo,
    }),
  ])

  return {
    entidade: 'Oportunidade',
    titulo: trunc(oportunidade.titulo, 120),
    tipoServico: oportunidade.tipoServico,
    status: oportunidade.status,
    valorEstimado: oportunidade.valorEstimado,
    probabilidade: oportunidade.probabilidade,
    responsavel: oportunidade.responsavel,
    proximoFollowUp: oportunidade.proximoFollowUp,
    origem: oportunidade.origem,
    motivoPerda: oportunidade.motivoPerda,
    observacoes: trunc(oportunidade.observacoes),
    clienteNome: cliente?.nome,
    corretorNome: corretor?.nome,
    imobiliariaNome: imobiliaria?.nome,
    interacoes: limit(
      (oportunidade.interacoes ?? []).map((i) => ({
        data: i.data,
        tipo: i.tipo,
        descricao: trunc(i.descricao),
        responsavel: i.responsavel,
      })),
      10
    ),
    totalPropostas: propostas.length,
    propostas: limit(
      propostas.map((p) => ({
        titulo: trunc(p.titulo),
        status: p.status,
        valorTotal: p.valorTotal,
        validade: p.validade,
      })),
      5
    ),
    tarefas: limit(
      tarefas.map((t) => ({
        titulo: trunc(t.titulo),
        status: t.status,
        responsavel: t.responsavel,
        prazo: t.prazo,
        prioridade: t.prioridade,
      }))
    ),
    baseConhecimento: {
      total: recs.total,
      modelos: recs.modelos.map((r) => ({ id: r.id, titulo: r.titulo, categoria: r.categoria })),
      clausulas: recs.clausulas.map((r) => ({ id: r.id, titulo: r.titulo, categoria: r.categoria })),
      checklists: recs.checklists.map((r) => ({ id: r.id, titulo: r.titulo, categoria: r.categoria })),
      orientacoes: recs.orientacoes.map((r) => ({ id: r.id, titulo: r.titulo, categoria: r.categoria })),
    },
  }
}

async function buildPropostaContext(id: string) {
  const proposta = await getProposta(id)
  if (!proposta) return null

  const [cliente, corretor, imobiliaria, oportunidade, recs] = await Promise.all([
    getCliente(proposta.clienteId),
    proposta.corretorId ? getCorretor(proposta.corretorId) : Promise.resolve(undefined),
    proposta.imobiliariaId ? getImobiliaria(proposta.imobiliariaId) : Promise.resolve(undefined),
    proposta.oportunidadeId ? getOportunidade(proposta.oportunidadeId) : Promise.resolve(undefined),
    getKnowledgeRecommendationsByContext({
      entityType: 'proposta',
      tipoServico: proposta.tipoServico,
      titulo: proposta.titulo,
    }),
  ])

  return {
    entidade: 'Proposta',
    titulo: trunc(proposta.titulo, 120),
    tipoServico: proposta.tipoServico,
    status: proposta.status,
    valorTotal: proposta.valorTotal,
    valorEntrada: proposta.valorEntrada,
    quantidadeParcelas: proposta.quantidadeParcelas,
    valorParcela: proposta.valorParcela,
    formaPagamento: proposta.formaPagamento,
    validade: proposta.validade,
    dataEnvio: proposta.dataEnvio,
    dataAceite: proposta.dataAceite,
    dataRecusa: proposta.dataRecusa,
    motivoRecusa: proposta.motivoRecusa,
    responsavel: proposta.responsavel,
    escopo: (proposta.escopo ?? []).slice(0, 10),
    observacoes: trunc(proposta.observacoes),
    clienteNome: cliente?.nome,
    corretorNome: corretor?.nome,
    imobiliariaNome: imobiliaria?.nome,
    oportunidadeTitulo: oportunidade ? trunc(oportunidade.titulo) : undefined,
    oportunidadeStatus: oportunidade?.status,
    baseConhecimento: {
      total: recs.total,
      modelos: recs.modelos.map((r) => ({ id: r.id, titulo: r.titulo, categoria: r.categoria })),
      clausulas: recs.clausulas.map((r) => ({ id: r.id, titulo: r.titulo, categoria: r.categoria })),
      checklists: recs.checklists.map((r) => ({ id: r.id, titulo: r.titulo, categoria: r.categoria })),
      orientacoes: recs.orientacoes.map((r) => ({ id: r.id, titulo: r.titulo, categoria: r.categoria })),
    },
  }
}

async function buildProcessoContext(id: string) {
  const processo = await getProcesso(id)
  if (!processo) return null

  const [tarefas, arquivos, recs] = await Promise.all([
    getTarefasByVinculo('processo', id),
    getArquivosByVinculo('processo', id),
    getKnowledgeRecommendationsByContext({
      entityType: 'processo',
      tipoProcesso: processo.tipo,
    }),
  ])

  return {
    entidade: 'Processo Judicial',
    numero: processo.numero,
    tipo: processo.tipo,
    vara: processo.vara,
    tribunal: processo.tribunal,
    autor: processo.autor,
    reu: processo.reu,
    status: processo.status,
    responsavel: processo.responsavel,
    faseAtual: processo.faseAtual,
    proximaAudiencia: processo.proximaAudiencia,
    proximoPrazo: processo.proximoPrazo,
    observacoes: trunc(processo.observacoes),
    movimentacoes: (processo.movimentacoes ?? []).slice(-8).map((m) => ({
      data: m.data,
      tipo: m.tipo,
      descricao: trunc(m.descricao),
    })),
    tarefas: limit(
      tarefas.map((t) => ({
        titulo: trunc(t.titulo),
        status: t.status,
        responsavel: t.responsavel,
        prazo: t.prazo,
        prioridade: t.prioridade,
      }))
    ),
    arquivos: limit(
      arquivos.map((a) => ({ nome: a.nome, status: a.status })),
      10
    ),
    baseConhecimento: {
      total: recs.total,
      modelos: recs.modelos.map((r) => ({ id: r.id, titulo: r.titulo, categoria: r.categoria })),
      clausulas: recs.clausulas.map((r) => ({ id: r.id, titulo: r.titulo, categoria: r.categoria })),
      checklists: recs.checklists.map((r) => ({ id: r.id, titulo: r.titulo, categoria: r.categoria })),
      orientacoes: recs.orientacoes.map((r) => ({ id: r.id, titulo: r.titulo, categoria: r.categoria })),
    },
  }
}

async function buildExtrajudicialContext(id: string) {
  const extrajudicial = await getExtrajudicial(id)
  if (!extrajudicial) return null

  const [tarefas, arquivos, recs] = await Promise.all([
    getTarefasByVinculo('extrajudicial', id),
    getArquivosByVinculo('extrajudicial', id),
    getKnowledgeRecommendationsByContext({
      entityType: 'extrajudicial',
      tipoServico: extrajudicial.tipo,
      titulo: extrajudicial.titulo,
    }),
  ])

  return {
    entidade: 'Demanda Extrajudicial',
    tipo: extrajudicial.tipo,
    titulo: trunc(extrajudicial.titulo, 120),
    status: extrajudicial.status,
    prioridade: extrajudicial.prioridade,
    responsavel: extrajudicial.responsavel,
    proximoPrazo: extrajudicial.proximoPrazo,
    observacoes: trunc(extrajudicial.observacoes),
    etapasConcluidas: (extrajudicial.etapas ?? []).filter((e) => e.concluida).length,
    etapasTotal: (extrajudicial.etapas ?? []).length,
    etapas: (extrajudicial.etapas ?? []).map((e) => ({
      titulo: e.titulo,
      concluida: e.concluida,
      prazo: e.prazo,
    })),
    documentosEntregues: (extrajudicial.documentos ?? []).filter((d) => d.entregue).length,
    documentosTotal: (extrajudicial.documentos ?? []).filter((d) => d.necessario).length,
    documentos: (extrajudicial.documentos ?? [])
      .filter((d) => d.necessario)
      .map((d) => ({
        nome: d.nome,
        entregue: d.entregue,
      })),
    tarefas: limit(
      tarefas.map((t) => ({
        titulo: trunc(t.titulo),
        status: t.status,
        responsavel: t.responsavel,
        prazo: t.prazo,
        prioridade: t.prioridade,
      }))
    ),
    arquivos: limit(
      arquivos.map((a) => ({ nome: a.nome, status: a.status })),
      10
    ),
    baseConhecimento: {
      total: recs.total,
      modelos: recs.modelos.map((r) => ({ id: r.id, titulo: r.titulo, categoria: r.categoria })),
      clausulas: recs.clausulas.map((r) => ({ id: r.id, titulo: r.titulo, categoria: r.categoria })),
      checklists: recs.checklists.map((r) => ({ id: r.id, titulo: r.titulo, categoria: r.categoria })),
      orientacoes: recs.orientacoes.map((r) => ({ id: r.id, titulo: r.titulo, categoria: r.categoria })),
    },
  }
}

async function buildConsultoriaContext(id: string) {
  const consultoria = await getConsultoria(id)
  if (!consultoria) return null

  const [tarefas, arquivos, recs] = await Promise.all([
    getTarefasByVinculo('consultoria', id),
    getArquivosByVinculo('consultoria', id),
    getKnowledgeRecommendationsByContext({
      entityType: 'consultoria',
      escopo: consultoria.escopo,
    }),
  ])

  return {
    entidade: 'Consultoria Mensal',
    imobiliaria: consultoria.imobiliaria,
    status: consultoria.status,
    valorMensal: consultoria.valorMensal,
    responsavel: consultoria.responsavel,
    dataRenovacao: consultoria.dataRenovacao,
    escopo: consultoria.escopo ?? [],
    observacoes: trunc(consultoria.observacoes),
    historico: (consultoria.historico ?? []).slice(-12).map((h) => ({
      mes: h.mes,
      status: h.status,
      observacao: h.observacao ? trunc(h.observacao) : undefined,
    })),
    tarefas: limit(
      tarefas.map((t) => ({
        titulo: trunc(t.titulo),
        status: t.status,
        responsavel: t.responsavel,
        prazo: t.prazo,
        prioridade: t.prioridade,
      }))
    ),
    arquivos: limit(
      arquivos.map((a) => ({ nome: a.nome, status: a.status })),
      10
    ),
    baseConhecimento: {
      total: recs.total,
      modelos: recs.modelos.map((r) => ({ id: r.id, titulo: r.titulo, categoria: r.categoria })),
      clausulas: recs.clausulas.map((r) => ({ id: r.id, titulo: r.titulo, categoria: r.categoria })),
      checklists: recs.checklists.map((r) => ({ id: r.id, titulo: r.titulo, categoria: r.categoria })),
      orientacoes: recs.orientacoes.map((r) => ({ id: r.id, titulo: r.titulo, categoria: r.categoria })),
    },
  }
}

// ── Dispatcher ────────────────────────────────────────────────────────────────

export async function getEntityAdvisorContext(
  entityType: EntityAdvisorType,
  entityId: string
): Promise<Record<string, unknown> | null> {
  switch (entityType) {
    case 'imobiliaria':
      return buildImobiliariaContext(entityId)
    case 'corretor':
      return buildCorretorContext(entityId)
    case 'cliente':
      return buildClienteContext(entityId)
    case 'oportunidade':
      return buildOportunidadeContext(entityId)
    case 'proposta':
      return buildPropostaContext(entityId)
    case 'processo':
      return buildProcessoContext(entityId)
    case 'extrajudicial':
      return buildExtrajudicialContext(entityId)
    case 'consultoria':
      return buildConsultoriaContext(entityId)
    default:
      return null
  }
}

// ── System prompt ─────────────────────────────────────────────────────────────

export const ENTITY_ADVISOR_SYSTEM_PROMPT = `Você é o Advisor do PIPE OS, sistema operacional jurídico-comercial da Vieira da Silva Advocacia, escritório especializado em direito imobiliário em Curitiba/PR.

Sua função é analisar os dados de uma entidade específica (imobiliária, corretor, cliente, oportunidade, proposta, processo, demanda extrajudicial ou consultoria) e gerar recomendações práticas e diretas para Giovanni Pianaro e sua equipe.

Equipe: Giovanni (sócio operador), Enrico, Jaqueline, Pedro, Maria, Giovana.

Regras:
- Responda sempre em português brasileiro.
- Use apenas os dados do contexto recebido. Não invente informações.
- Quando fizer inferências, identifique como inferências.
- Não redija contratos, pareceres jurídicos completos ou peças processuais.
- Quando não houver dado suficiente, diga isso claramente.
- Seja direto e objetivo. Prefira listas e tópicos a parágrafos longos.
- Tom: consultivo, estratégico, como um COO interno.
- Foco: ação prática, próximos passos concretos, riscos identificados.`

// ── Builder de mensagens ──────────────────────────────────────────────────────

export function buildEntityAdvisorMessages(
  question: string,
  context: Record<string, unknown>
): AIMessage[] {
  const ctx = JSON.stringify(context, null, 2)
  const userContent = `CONTEXTO DA ENTIDADE:
\`\`\`json
${ctx}
\`\`\`

PERGUNTA:
${question}`

  return [
    { role: 'system', content: ENTITY_ADVISOR_SYSTEM_PROMPT },
    { role: 'user', content: userContent },
  ]
}
