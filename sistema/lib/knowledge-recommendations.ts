import {
  getModelosJuridicos,
  getClausulasPadrao,
  getChecklistsJuridicos,
  getOrientacoesInternas,
  getOportunidade,
  getProposta,
  getProcesso,
  getExtrajudicial,
  getConsultoria,
} from './data'
import type { ModeloJuridico, ClausulaPadrao, ChecklistJuridico, OrientacaoInterna } from './types'

export type KnowledgeEntityType =
  | 'oportunidade'
  | 'proposta'
  | 'processo'
  | 'extrajudicial'
  | 'consultoria'

export interface KnowledgeRecommendationContext {
  entityType: KnowledgeEntityType
  tipoServico?: string
  tipoProcesso?: string
  escopo?: string[]
  titulo?: string
}

export interface KnowledgeRecommendation {
  kind: 'modelo' | 'clausula' | 'checklist' | 'orientacao'
  id: string
  titulo: string
  categoria: string
  score: number
  href: string
}

export interface KnowledgeRecommendationsResult {
  modelos: KnowledgeRecommendation[]
  clausulas: KnowledgeRecommendation[]
  checklists: KnowledgeRecommendation[]
  orientacoes: KnowledgeRecommendation[]
  total: number
}

const TIPO_KEYWORDS: Record<string, string[]> = {
  'Due diligence': ['due', 'diligence', 'compra_venda', 'compra', 'venda', 'analise', 'imovel'],
  'Parecer': ['parecer', 'juridico', 'analise'],
  'Análise contratual': ['contrato', 'contratual', 'analise', 'compra_venda', 'locacao', 'clausula'],
  'Regularização': ['regularizacao', 'usucapiao', 'adjudicacao', 'registro'],
  'Usucapião': ['usucapiao', 'posse', 'prescricao', 'adjudicacao'],
  'Inventário': ['inventario', 'heranca', 'sucessao', 'espolio', 'partilha'],
  'Outro': [],
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .replace(/[^a-z0-9_]/g, ' ')
    .trim()
}

function extractKeywords(ctx: KnowledgeRecommendationContext): string[] {
  const kw = new Set<string>()

  if (ctx.tipoServico) {
    kw.add(normalize(ctx.tipoServico))
    for (const k of TIPO_KEYWORDS[ctx.tipoServico] ?? []) {
      kw.add(normalize(k))
    }
  }

  if (ctx.tipoProcesso) {
    const norm = normalize(ctx.tipoProcesso)
    for (const word of norm.split(' ').filter((w) => w.length > 3)) {
      kw.add(word)
    }
    if (norm.includes('compra') || norm.includes('venda')) kw.add('compra_venda')
    if (norm.includes('locacao') || norm.includes('despejo') || norm.includes('locatario')) kw.add('locacao')
    if (norm.includes('inventario') || norm.includes('espolio') || norm.includes('heranca')) kw.add('inventario')
    if (norm.includes('usucapiao') || norm.includes('posse')) kw.add('usucapiao')
    if (norm.includes('cobranca') || norm.includes('inadimpl')) kw.add('cobranca')
    if (norm.includes('regulariz') || norm.includes('adjudicacao')) kw.add('regularizacao')
  }

  if (ctx.titulo) {
    for (const word of normalize(ctx.titulo).split(' ').filter((w) => w.length > 4)) {
      kw.add(word)
    }
  }

  if (ctx.escopo) {
    for (const item of ctx.escopo) {
      const norm = normalize(item)
      for (const word of norm.split(' ').filter((w) => w.length > 4)) {
        kw.add(word)
      }
      if (norm.includes('locacao') || norm.includes('aluguel') || norm.includes('locatario')) kw.add('locacao')
      if (norm.includes('compra') || norm.includes('venda') || norm.includes('financiamento')) kw.add('compra_venda')
      if (norm.includes('due') || norm.includes('diligence')) kw.add('due')
      if (norm.includes('inventario') || norm.includes('espolio')) kw.add('inventario')
      if (norm.includes('usucapiao')) kw.add('usucapiao')
    }
  }

  return Array.from(kw).filter((k) => k.length >= 3)
}

function fieldHits(keywords: string[], ...fields: (string | undefined)[]): number {
  let count = 0
  for (const field of fields) {
    if (!field) continue
    const norm = normalize(field)
    for (const kw of keywords) {
      if (norm.includes(kw)) {
        count++
        break
      }
    }
  }
  return count
}

const MIN_SCORE = 2
const MAX_PER_KIND = 3

function scoreModelo(m: ModeloJuridico, keywords: string[]): number {
  if (m.status !== 'ativo') return 0
  let score = 0
  score += fieldHits(keywords, m.tipoDocumento) * 3
  score += fieldHits(keywords, m.categoria) * 2
  score += Math.min(fieldHits(keywords, ...m.tags) * 2, 6)
  score += fieldHits(keywords, m.area)
  score += fieldHits(keywords, m.titulo)
  return score
}

function scoreClausula(c: ClausulaPadrao, keywords: string[]): number {
  if (c.status !== 'ativo') return 0
  let score = 0
  score += fieldHits(keywords, c.categoria) * 3
  score += fieldHits(keywords, c.aplicacao) * 2
  score += Math.min(fieldHits(keywords, ...c.tags) * 2, 6)
  score += fieldHits(keywords, c.area)
  score += fieldHits(keywords, c.titulo)
  return score
}

function scoreChecklist(cl: ChecklistJuridico, keywords: string[]): number {
  if (cl.status !== 'ativo') return 0
  let score = 0
  score += fieldHits(keywords, cl.tipoDemanda) * 4
  score += fieldHits(keywords, cl.titulo) * 2
  score += fieldHits(keywords, cl.area)
  return score
}

function scoreOrientacao(o: OrientacaoInterna, keywords: string[]): number {
  if (o.status !== 'ativo') return 0
  let score = 0
  score += fieldHits(keywords, o.tema) * 3
  score += Math.min(fieldHits(keywords, ...o.tags) * 2, 6)
  score += fieldHits(keywords, o.area)
  score += fieldHits(keywords, o.titulo)
  return score
}

type Scored<T> = { item: T; score: number }

export async function buildContextFromEntity(
  entityType: KnowledgeEntityType,
  entityId: string
): Promise<KnowledgeRecommendationContext | null> {
  switch (entityType) {
    case 'oportunidade': {
      const op = await getOportunidade(entityId)
      if (!op) return null
      return { entityType, tipoServico: op.tipoServico, titulo: op.titulo }
    }
    case 'proposta': {
      const pr = await getProposta(entityId)
      if (!pr) return null
      return { entityType, tipoServico: pr.tipoServico, titulo: pr.titulo }
    }
    case 'processo': {
      const proc = await getProcesso(entityId)
      if (!proc) return null
      return { entityType, tipoProcesso: proc.tipo, titulo: proc.numero }
    }
    case 'extrajudicial': {
      const ext = await getExtrajudicial(entityId)
      if (!ext) return null
      return { entityType, tipoServico: ext.tipo, titulo: ext.titulo }
    }
    case 'consultoria': {
      const con = await getConsultoria(entityId)
      if (!con) return null
      return { entityType, escopo: con.escopo, titulo: con.imobiliaria }
    }
  }
}

export async function getKnowledgeRecommendationsForEntity(
  entityType: KnowledgeEntityType,
  entityId: string
): Promise<KnowledgeRecommendationsResult> {
  const ctx = await buildContextFromEntity(entityType, entityId)
  if (!ctx) return { modelos: [], clausulas: [], checklists: [], orientacoes: [], total: 0 }
  return getKnowledgeRecommendationsByContext(ctx)
}

export async function getKnowledgeRecommendationsByContext(
  ctx: KnowledgeRecommendationContext
): Promise<KnowledgeRecommendationsResult> {
  const keywords = extractKeywords(ctx)

  if (keywords.length === 0) {
    return { modelos: [], clausulas: [], checklists: [], orientacoes: [], total: 0 }
  }

  const [modelos, clausulas, checklists, orientacoes] = await Promise.all([
    getModelosJuridicos(),
    getClausulasPadrao(),
    getChecklistsJuridicos(),
    getOrientacoesInternas(),
  ])

  const topModelos = modelos
    .map((m): Scored<ModeloJuridico> => ({ item: m, score: scoreModelo(m, keywords) }))
    .filter(({ score }) => score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_PER_KIND)
    .map(({ item, score }): KnowledgeRecommendation => ({
      kind: 'modelo',
      id: item.id,
      titulo: item.titulo,
      categoria: item.categoria,
      score,
      href: `/conhecimento/modelos/${item.id}`,
    }))

  const topClausulas = clausulas
    .map((c): Scored<ClausulaPadrao> => ({ item: c, score: scoreClausula(c, keywords) }))
    .filter(({ score }) => score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_PER_KIND)
    .map(({ item, score }): KnowledgeRecommendation => ({
      kind: 'clausula',
      id: item.id,
      titulo: item.titulo,
      categoria: item.categoria,
      score,
      href: `/conhecimento/clausulas/${item.id}`,
    }))

  const topChecklists = checklists
    .map((cl): Scored<ChecklistJuridico> => ({ item: cl, score: scoreChecklist(cl, keywords) }))
    .filter(({ score }) => score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_PER_KIND)
    .map(({ item, score }): KnowledgeRecommendation => ({
      kind: 'checklist',
      id: item.id,
      titulo: item.titulo,
      categoria: item.tipoDemanda,
      score,
      href: `/conhecimento/checklists/${item.id}`,
    }))

  const topOrientacoes = orientacoes
    .map((o): Scored<OrientacaoInterna> => ({ item: o, score: scoreOrientacao(o, keywords) }))
    .filter(({ score }) => score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_PER_KIND)
    .map(({ item, score }): KnowledgeRecommendation => ({
      kind: 'orientacao',
      id: item.id,
      titulo: item.titulo,
      categoria: item.tema,
      score,
      href: `/conhecimento/orientacoes/${item.id}`,
    }))

  const total = topModelos.length + topClausulas.length + topChecklists.length + topOrientacoes.length

  return {
    modelos: topModelos,
    clausulas: topClausulas,
    checklists: topChecklists,
    orientacoes: topOrientacoes,
    total,
  }
}
