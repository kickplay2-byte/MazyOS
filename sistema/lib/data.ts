import { cache } from 'react'
import { createSupabaseServerClient } from './supabase-server'
import type { Processo, Consultoria, Extrajudicial, Imobiliaria, Corretor, Cliente, Oportunidade, Proposta, StatusProposta, StatusComercial, Tarefa, Arquivo, AlertaExecutivo, RankingImobiliaria, RankingCorretor, ProximaAcao, ModeloJuridico, ClausulaPadrao, ChecklistJuridico, OrientacaoInterna, MinutaAssistida, MinutaEntityType, Profile, UserRole, UserStatus } from './types'

// â”€â”€ Base helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Uses createSupabaseServerClient (reads auth cookie) so RLS authenticated
// policies apply correctly. Never uses the anon singleton after RLS is enabled.

async function readAll<T>(table: string): Promise<T[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.from(table).select('data')
  if (error) throw error
  return ((data ?? []) as { data: T }[]).map((r) => r.data)
}

async function upsertOne<T extends { id: string }>(table: string, item: T): Promise<void> {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from(table).upsert({ id: item.id, data: item })
  if (error) throw error
}

async function removeOne(table: string, id: string): Promise<void> {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw error
}

// â”€â”€ Processos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const getProcessos = cache((): Promise<Processo[]> => readAll<Processo>('processos'))

export async function getProcesso(id: string): Promise<Processo | undefined> {
  return (await getProcessos()).find((p) => p.id === id)
}

export async function saveProcesso(processo: Processo): Promise<void> {
  await upsertOne('processos', processo)
}

export async function deleteProcesso(id: string): Promise<void> {
  await removeOne('processos', id)
}

// â”€â”€ Consultorias â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const getConsultorias = cache((): Promise<Consultoria[]> => readAll<Consultoria>('consultorias'))

export async function getConsultoria(id: string): Promise<Consultoria | undefined> {
  return (await getConsultorias()).find((c) => c.id === id)
}

export async function saveConsultoria(c: Consultoria): Promise<void> {
  await upsertOne('consultorias', c)
}

export async function deleteConsultoria(id: string): Promise<void> {
  await removeOne('consultorias', id)
}

// â”€â”€ Extrajudiciais â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const getExtrajudiciais = cache((): Promise<Extrajudicial[]> => readAll<Extrajudicial>('extrajudiciais'))

export async function getExtrajudicial(id: string): Promise<Extrajudicial | undefined> {
  return (await getExtrajudiciais()).find((e) => e.id === id)
}

export async function saveExtrajudicial(e: Extrajudicial): Promise<void> {
  await upsertOne('extrajudiciais', e)
}

export async function deleteExtrajudicial(id: string): Promise<void> {
  await removeOne('extrajudiciais', id)
}

// â”€â”€ ImobiliÃ¡rias â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const getImobiliarias = cache((): Promise<Imobiliaria[]> => readAll<Imobiliaria>('imobiliarias'))

export async function getImobiliaria(id: string): Promise<Imobiliaria | undefined> {
  return (await getImobiliarias()).find((i) => i.id === id)
}

export async function saveImobiliaria(imobiliaria: Imobiliaria): Promise<void> {
  await upsertOne('imobiliarias', imobiliaria)
}

export async function inactivateImobiliaria(id: string): Promise<void> {
  const item = await getImobiliaria(id)
  if (!item) return
  await saveImobiliaria({ ...item, status: 'inativa', updatedAt: new Date().toISOString() })
}

// â”€â”€ Corretores â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const getCorretores = cache((): Promise<Corretor[]> => readAll<Corretor>('corretores'))

export async function getCorretor(id: string): Promise<Corretor | undefined> {
  return (await getCorretores()).find((c) => c.id === id)
}

export async function getCorretoresByImobiliaria(imobiliariaId: string): Promise<Corretor[]> {
  return (await getCorretores()).filter((c) => c.imobiliariaId === imobiliariaId)
}

export async function saveCorretor(corretor: Corretor): Promise<void> {
  await upsertOne('corretores', corretor)
}

// â”€â”€ Clientes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const getClientes = cache((): Promise<Cliente[]> => readAll<Cliente>('clientes'))

export async function getCliente(id: string): Promise<Cliente | undefined> {
  return (await getClientes()).find((c) => c.id === id)
}

export async function getClientesByCorretor(corretorId: string): Promise<Cliente[]> {
  return (await getClientes()).filter((c) => c.corretorId === corretorId)
}

export async function getClientesByImobiliaria(imobiliariaId: string): Promise<Cliente[]> {
  return (await getClientes()).filter((c) => c.imobiliariaId === imobiliariaId)
}

export async function saveCliente(cliente: Cliente): Promise<void> {
  await upsertOne('clientes', cliente)
}

export async function deleteCliente(id: string): Promise<void> {
  await removeOne('clientes', id)
}

// â”€â”€ Oportunidades â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const getOportunidades = cache((): Promise<Oportunidade[]> => readAll<Oportunidade>('oportunidades'))

export async function getOportunidade(id: string): Promise<Oportunidade | undefined> {
  return (await getOportunidades()).find((o) => o.id === id)
}

export async function getOportunidadesByCliente(clienteId: string): Promise<Oportunidade[]> {
  return (await getOportunidades()).filter((o) => o.clienteId === clienteId)
}

export async function getOportunidadesByCorretor(corretorId: string): Promise<Oportunidade[]> {
  return (await getOportunidades()).filter((o) => o.corretorId === corretorId)
}

export async function getOportunidadesByImobiliaria(imobiliariaId: string): Promise<Oportunidade[]> {
  return (await getOportunidades()).filter((o) => o.imobiliariaId === imobiliariaId)
}

export async function saveOportunidade(oportunidade: Oportunidade): Promise<void> {
  await upsertOne('oportunidades', oportunidade)
}

export async function getFollowUpsAtrasados(): Promise<Oportunidade[]> {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const statusAtivos: StatusComercial[] = ['novo_lead','primeiro_contato','diagnostico_pendente','diagnostico_realizado','proposta_enviada','follow_up','negociacao','contrato_enviado']
  return (await getOportunidades()).filter((o) => {
    if (!statusAtivos.includes(o.status)) return false
    if (!o.proximoFollowUp) return false
    const d = new Date(o.proximoFollowUp)
    d.setHours(0, 0, 0, 0)
    return d <= hoje
  })
}

// â”€â”€ Propostas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const getPropostas = cache((): Promise<Proposta[]> => readAll<Proposta>('propostas'))

export async function getProposta(id: string): Promise<Proposta | undefined> {
  return (await getPropostas()).find((p) => p.id === id)
}

export async function getPropostasByCliente(clienteId: string): Promise<Proposta[]> {
  return (await getPropostas()).filter((p) => p.clienteId === clienteId)
}

export async function getPropostasByOportunidade(oportunidadeId: string): Promise<Proposta[]> {
  return (await getPropostas()).filter((p) => p.oportunidadeId === oportunidadeId)
}

export async function getPropostasByCorretor(corretorId: string): Promise<Proposta[]> {
  return (await getPropostas()).filter((p) => p.corretorId === corretorId)
}

export async function getPropostasByImobiliaria(imobiliariaId: string): Promise<Proposta[]> {
  return (await getPropostas()).filter((p) => p.imobiliariaId === imobiliariaId)
}

export async function getPropostasByStatus(status: StatusProposta): Promise<Proposta[]> {
  return (await getPropostas()).filter((p) => p.status === status)
}

export async function saveProposta(proposta: Proposta): Promise<void> {
  await upsertOne('propostas', proposta)
}

export async function deleteProposta(id: string): Promise<void> {
  await removeOne('propostas', id)
}

const STATUS_ABERTOS: StatusProposta[] = ['rascunho', 'enviada', 'em_negociacao']

export async function getPropostasAbertas(): Promise<Proposta[]> {
  return (await getPropostas()).filter((p) => STATUS_ABERTOS.includes(p.status))
}

export async function getPropostasAceitas(): Promise<Proposta[]> {
  return getPropostasByStatus('aceita')
}

export async function getPropostasRecusadas(): Promise<Proposta[]> {
  return getPropostasByStatus('recusada')
}

export async function getPropostasVencidas(): Promise<Proposta[]> {
  return getPropostasByStatus('vencida')
}

export async function getValorPropostasAbertas(): Promise<number> {
  return (await getPropostasAbertas()).reduce((s, p) => s + p.valorTotal, 0)
}

export async function getValorPropostasAceitas(): Promise<number> {
  return (await getPropostasAceitas()).reduce((s, p) => s + p.valorTotal, 0)
}

export async function getTaxaConversaoPropostas(): Promise<number> {
  const propostas = (await getPropostas()).filter((p) => p.status !== 'rascunho' && p.status !== 'cancelada')
  if (propostas.length === 0) return 0
  const aceitas = propostas.filter((p) => p.status === 'aceita').length
  return Math.round((aceitas / propostas.length) * 100)
}

export async function getPropostasComValidadeProxima(dias = 7): Promise<Proposta[]> {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const limite = new Date(hoje)
  limite.setDate(limite.getDate() + dias)
  return (await getPropostasAbertas()).filter((p) => {
    if (!p.validade) return false
    const d = new Date(p.validade)
    d.setHours(0, 0, 0, 0)
    return d >= hoje && d <= limite
  })
}

// â”€â”€ Tarefas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const getTarefas = cache((): Promise<Tarefa[]> => readAll<Tarefa>('tarefas'))

export async function getTarefa(id: string): Promise<Tarefa | undefined> {
  return (await getTarefas()).find((t) => t.id === id)
}

export async function getTarefasByResponsavel(responsavel: string): Promise<Tarefa[]> {
  return (await getTarefas()).filter((t) => t.responsavel === responsavel)
}

export async function getTarefasByVinculo(vinculoTipo: string, vinculoId: string): Promise<Tarefa[]> {
  return (await getTarefas()).filter((t) => t.vinculoTipo === vinculoTipo && t.vinculoId === vinculoId)
}

export async function getTarefasAtrasadas(): Promise<Tarefa[]> {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  return (await getTarefas()).filter((t) => {
    if (t.status === 'concluida' || t.status === 'cancelada') return false
    if (!t.prazo) return false
    const d = new Date(t.prazo)
    d.setHours(0, 0, 0, 0)
    return d < hoje
  })
}

export async function saveTarefa(tarefa: Tarefa): Promise<void> {
  await upsertOne('tarefas', tarefa)
}

export async function deleteTarefa(id: string): Promise<void> {
  await removeOne('tarefas', id)
}

// â”€â”€ Arquivos / Documentos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const getArquivos = cache((): Promise<Arquivo[]> => readAll<Arquivo>('arquivos'))

export async function getArquivo(id: string): Promise<Arquivo | undefined> {
  return (await getArquivos()).find((a) => a.id === id)
}

export async function getArquivosByVinculo(vinculoTipo: string, vinculoId: string): Promise<Arquivo[]> {
  return (await getArquivos()).filter((a) => a.vinculoTipo === vinculoTipo && a.vinculoId === vinculoId)
}

export async function saveArquivo(arquivo: Arquivo): Promise<void> {
  await upsertOne('arquivos', arquivo)
}

export async function deleteArquivo(id: string): Promise<void> {
  await removeOne('arquivos', id)
}

// â”€â”€ Dashboard helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface PrazoAlert {
  tipo: 'processo' | 'extrajudicial'
  id: string
  titulo: string
  prazo: string
  diasRestantes: number
  responsavel: string
}

export async function getPrazosProximos(dias = 7): Promise<PrazoAlert[]> {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const limite = new Date(hoje)
  limite.setDate(limite.getDate() + dias)

  const [processos, extrajudiciais] = await Promise.all([getProcessos(), getExtrajudiciais()])
  const alertas: PrazoAlert[] = []

  for (const p of processos) {
    for (const campo of [p.proximoPrazo, p.proximaAudiencia]) {
      if (!campo) continue
      const d = new Date(campo)
      d.setHours(0, 0, 0, 0)
      if (d >= hoje && d <= limite) {
        const diasRestantes = Math.round((d.getTime() - hoje.getTime()) / 86400000)
        alertas.push({ tipo: 'processo', id: p.id, titulo: `${p.numero} â€” ${p.tipo}`, prazo: campo, diasRestantes, responsavel: p.responsavel })
        break
      }
    }
  }

  for (const e of extrajudiciais) {
    if (!e.proximoPrazo) continue
    const d = new Date(e.proximoPrazo)
    d.setHours(0, 0, 0, 0)
    if (d >= hoje && d <= limite) {
      const diasRestantes = Math.round((d.getTime() - hoje.getTime()) / 86400000)
      alertas.push({ tipo: 'extrajudicial', id: e.id, titulo: e.titulo, prazo: e.proximoPrazo, diasRestantes, responsavel: e.responsavel })
    }
  }

  return alertas.sort((a, b) => a.diasRestantes - b.diasRestantes)
}

// â”€â”€ Agregadores Comerciais â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const STATUS_PIPELINE_ABERTO: StatusComercial[] = [
  'novo_lead', 'primeiro_contato', 'diagnostico_pendente', 'diagnostico_realizado',
  'proposta_enviada', 'follow_up', 'negociacao', 'contrato_enviado',
]

export async function getOportunidadesAbertas(): Promise<Oportunidade[]> {
  return (await getOportunidades()).filter((o) => STATUS_PIPELINE_ABERTO.includes(o.status))
}

export async function getValorPipelineAberto(): Promise<number> {
  return (await getOportunidadesAbertas()).reduce((s, o) => s + (o.valorEstimado ?? 0), 0)
}

export async function getValorPipelinePonderado(): Promise<number> {
  return Math.round(
    (await getOportunidadesAbertas()).reduce((s, o) => s + (o.valorEstimado ?? 0) * ((o.probabilidade ?? 50) / 100), 0)
  )
}

export async function getOportunidadesParadas(diasSemInteracao = 14): Promise<Oportunidade[]> {
  const limite = new Date()
  limite.setDate(limite.getDate() - diasSemInteracao)
  return (await getOportunidadesAbertas()).filter((o) => new Date(o.updatedAt) < limite)
}

export interface ResumoComercial {
  imobiliariasAtivas: number
  corretoresAtivos: number
  oportunidadesAbertas: number
  valorPipeline: number
  valorPipelinePonderado: number
  propostasAbertas: number
  taxaConversao: number
  followUpsAtrasados: number
}

export async function getResumoComercial(): Promise<ResumoComercial> {
  const [imobiliarias, corretores, oportunidadesAbertas, propostasAbertas, taxaConversao, followUps] = await Promise.all([
    getImobiliarias(),
    getCorretores(),
    getOportunidadesAbertas(),
    getPropostasAbertas(),
    getTaxaConversaoPropostas(),
    getFollowUpsAtrasados(),
  ])
  return {
    imobiliariasAtivas: imobiliarias.filter((i) => i.status === 'ativa').length,
    corretoresAtivos: corretores.filter((c) => c.status === 'ativo').length,
    oportunidadesAbertas: oportunidadesAbertas.length,
    valorPipeline: oportunidadesAbertas.reduce((s, o) => s + (o.valorEstimado ?? 0), 0),
    valorPipelinePonderado: Math.round(oportunidadesAbertas.reduce((s, o) => s + (o.valorEstimado ?? 0) * ((o.probabilidade ?? 50) / 100), 0)),
    propostasAbertas: propostasAbertas.length,
    taxaConversao,
    followUpsAtrasados: followUps.length,
  }
}

export async function getRankingImobiliarias(top = 5): Promise<RankingImobiliaria[]> {
  const [imobiliarias, oportunidades, propostas, consultorias] = await Promise.all([
    getImobiliarias(),
    getOportunidades(),
    getPropostas(),
    getConsultorias(),
  ])
  return imobiliarias
    .map((i) => {
      const ops = oportunidades.filter((o) => o.imobiliariaId === i.id)
      const opsAbertas = ops.filter((o) => STATUS_PIPELINE_ABERTO.includes(o.status))
      const propsAceitas = propostas.filter((p) => p.imobiliariaId === i.id && p.status === 'aceita')
      return {
        imobiliariaId: i.id,
        nome: i.nome,
        totalOportunidades: ops.length,
        oportunidadesAbertas: opsAbertas.length,
        propostasAceitas: propsAceitas.length,
        faturamentoFechado: propsAceitas.reduce((s, p) => s + p.valorTotal, 0),
        faturamentoPipeline: opsAbertas.reduce((s, o) => s + (o.valorEstimado ?? 0), 0),
        temConsultoria: consultorias.some((c) => c.imobiliaria === i.nome),
      }
    })
    .filter((r) => r.totalOportunidades > 0 || r.temConsultoria)
    .sort((a, b) => b.faturamentoFechado - a.faturamentoFechado || b.totalOportunidades - a.totalOportunidades)
    .slice(0, top)
}

export async function getRankingCorretores(top = 5): Promise<RankingCorretor[]> {
  const [corretores, oportunidades, propostas, imobiliarias] = await Promise.all([
    getCorretores(),
    getOportunidades(),
    getPropostas(),
    getImobiliarias(),
  ])
  return corretores
    .filter((c) => c.status === 'ativo')
    .map((c) => {
      const imob = imobiliarias.find((i) => i.id === c.imobiliariaId)
      const ops = oportunidades.filter((o) => o.corretorId === c.id)
      const opsAbertas = ops.filter((o) => STATUS_PIPELINE_ABERTO.includes(o.status))
      const propsAceitas = propostas.filter((p) => p.corretorId === c.id && p.status === 'aceita')
      return {
        corretorId: c.id,
        nome: c.nome,
        imobiliariaNome: imob?.nome ?? 'â€”',
        totalOportunidades: ops.length,
        faturamentoFechado: propsAceitas.reduce((s, p) => s + p.valorTotal, 0),
        faturamentoPipeline: opsAbertas.reduce((s, o) => s + (o.valorEstimado ?? 0), 0),
      }
    })
    .filter((r) => r.totalOportunidades > 0)
    .sort((a, b) => b.faturamentoFechado - a.faturamentoFechado || b.totalOportunidades - a.totalOportunidades)
    .slice(0, top)
}

// â”€â”€ Agregadores JurÃ­dicos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface DemandaAtrasada {
  tipo: 'processo' | 'extrajudicial'
  id: string
  titulo: string
  responsavel: string
  prazo: string
}

export interface ResumoJuridico {
  processosAtivos: number
  extrajudiciaisEmAndamento: number
  consultoriasAtivas: number
  prazosProximos7Dias: number
  demandasAtrasadas: number
}

export async function getProcessosAtivos(): Promise<Processo[]> {
  return (await getProcessos()).filter((p) => p.status !== 'Encerrado')
}

export async function getExtrajudiciaisEmAndamento(): Promise<Extrajudicial[]> {
  return (await getExtrajudiciais()).filter((e) => !['ConcluÃ­da', 'Arquivada'].includes(e.status))
}

export async function getConsultoriasAtivas(): Promise<Consultoria[]> {
  return (await getConsultorias()).filter((c) => c.status !== 'Inativa')
}

export async function getDemandasAtrasadas(): Promise<DemandaAtrasada[]> {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const [processosAtivos, extrajudiciaisEmAndamento] = await Promise.all([
    getProcessosAtivos(),
    getExtrajudiciaisEmAndamento(),
  ])
  const result: DemandaAtrasada[] = []

  for (const p of processosAtivos) {
    const prazo = p.proximoPrazo ?? p.proximaAudiencia
    if (!prazo) continue
    const d = new Date(prazo)
    d.setHours(0, 0, 0, 0)
    if (d < hoje) result.push({ tipo: 'processo', id: p.id, titulo: `${p.numero} â€” ${p.tipo}`, responsavel: p.responsavel, prazo })
  }

  for (const e of extrajudiciaisEmAndamento) {
    if (!e.proximoPrazo) continue
    const d = new Date(e.proximoPrazo)
    d.setHours(0, 0, 0, 0)
    if (d < hoje) result.push({ tipo: 'extrajudicial', id: e.id, titulo: e.titulo, responsavel: e.responsavel, prazo: e.proximoPrazo })
  }

  return result
}

export async function getResumoJuridico(): Promise<ResumoJuridico> {
  const [processosAtivos, extrajudiciaisEmAndamento, consultoriasAtivas, prazosProximos, demandasAtrasadas] = await Promise.all([
    getProcessosAtivos(),
    getExtrajudiciaisEmAndamento(),
    getConsultoriasAtivas(),
    getPrazosProximos(7),
    getDemandasAtrasadas(),
  ])
  return {
    processosAtivos: processosAtivos.length,
    extrajudiciaisEmAndamento: extrajudiciaisEmAndamento.length,
    consultoriasAtivas: consultoriasAtivas.length,
    prazosProximos7Dias: prazosProximos.length,
    demandasAtrasadas: demandasAtrasadas.length,
  }
}

// â”€â”€ Agregadores de GestÃ£o â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface ResumoTarefas {
  total: number
  pendentes: number
  emAndamento: number
  concluidas: number
  atrasadas: number
}

export interface TarefasPorResponsavel {
  responsavel: string
  total: number
  pendentes: number
  atrasadas: number
}

export interface ResumoDocumentos {
  total: number
  pendentes: number
  entregues: number
  aprovados: number
}

export async function getResumoTarefas(): Promise<ResumoTarefas> {
  const [tarefas, atrasadas] = await Promise.all([getTarefas(), getTarefasAtrasadas()])
  const ativas = tarefas.filter((t) => t.status !== 'cancelada')
  return {
    total: ativas.length,
    pendentes: ativas.filter((t) => t.status === 'pendente').length,
    emAndamento: ativas.filter((t) => t.status === 'em_andamento').length,
    concluidas: ativas.filter((t) => t.status === 'concluida').length,
    atrasadas: atrasadas.length,
  }
}

export async function getTarefasVencidas(): Promise<Tarefa[]> {
  return getTarefasAtrasadas()
}

export async function getTarefasPorResponsavel(): Promise<TarefasPorResponsavel[]> {
  const [tarefas, atrasadas] = await Promise.all([getTarefas(), getTarefasAtrasadas()])
  const ativas = tarefas.filter((t) => t.status !== 'cancelada')
  const responsaveis = [...new Set(ativas.map((t) => t.responsavel))]
  return responsaveis.map((r) => ({
    responsavel: r,
    total: ativas.filter((t) => t.responsavel === r).length,
    pendentes: ativas.filter((t) => t.responsavel === r && t.status === 'pendente').length,
    atrasadas: atrasadas.filter((t) => t.responsavel === r).length,
  }))
}

export async function getResumoDocumentos(): Promise<ResumoDocumentos> {
  const arquivos = await getArquivos()
  return {
    total: arquivos.length,
    pendentes: arquivos.filter((a) => a.status === 'pendente').length,
    entregues: arquivos.filter((a) => a.status === 'entregue').length,
    aprovados: arquivos.filter((a) => a.status === 'aprovado').length,
  }
}

export async function getDocumentosPendentes(): Promise<Arquivo[]> {
  return (await getArquivos()).filter((a) => a.status === 'pendente')
}

// â”€â”€ Alertas Executivos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function getAlertasExecutivos(): Promise<AlertaExecutivo[]> {
  const [demandasAtrasadas, consultorias, followUps, propostasVencendo, tarefasAtrasadas] = await Promise.all([
    getDemandasAtrasadas(),
    getConsultorias(),
    getFollowUpsAtrasados(),
    getPropostasComValidadeProxima(3),
    getTarefasAtrasadas(),
  ])

  const alertas: AlertaExecutivo[] = []
  let seq = 0

  for (const d of demandasAtrasadas) {
    alertas.push({
      id: `alerta-prazo-${++seq}`,
      tipo: 'prazo',
      nivel: 'critico',
      titulo: 'Prazo vencido',
      descricao: d.titulo,
      href: `/${d.tipo === 'processo' ? 'processos' : 'extrajudiciais'}/${d.id}`,
    })
  }

  for (const c of consultorias.filter((c) => c.status === 'Inadimplente')) {
    alertas.push({
      id: `alerta-inad-${++seq}`,
      tipo: 'inadimplencia',
      nivel: 'critico',
      titulo: `InadimplÃªncia â€” ${c.imobiliaria}`,
      descricao: 'Consultoria mensal inadimplente',
      href: `/consultorias/${c.id}`,
    })
  }

  if (followUps.length > 0) {
    alertas.push({
      id: `alerta-fu-${++seq}`,
      tipo: 'followup',
      nivel: followUps.length >= 3 ? 'critico' : 'alerta',
      titulo: `${followUps.length} follow-up${followUps.length > 1 ? 's' : ''} atrasado${followUps.length > 1 ? 's' : ''}`,
      descricao: followUps.map((o) => o.titulo).slice(0, 3).join(', '),
      href: '/comercial/oportunidades',
    })
  }

  for (const p of propostasVencendo) {
    alertas.push({
      id: `alerta-prop-${++seq}`,
      tipo: 'proposta',
      nivel: 'alerta',
      titulo: `Proposta vencendo â€” ${p.titulo}`,
      descricao: p.validade ? `VÃ¡lida atÃ© ${new Date(p.validade + 'T12:00:00').toLocaleDateString('pt-BR')}` : 'Validade nÃ£o definida',
      href: `/comercial/propostas/${p.id}`,
    })
  }

  if (tarefasAtrasadas.length > 0) {
    const lista = tarefasAtrasadas.map((t) => t.titulo).slice(0, 3).join(', ')
    alertas.push({
      id: `alerta-tar-${++seq}`,
      tipo: 'tarefa',
      nivel: 'alerta',
      titulo: `${tarefasAtrasadas.length} tarefa${tarefasAtrasadas.length > 1 ? 's' : ''} atrasada${tarefasAtrasadas.length > 1 ? 's' : ''}`,
      descricao: lista.length > 80 ? lista.substring(0, 80) + 'â€¦' : lista,
      href: '/tarefas',
    })
  }

  return alertas
}

// â”€â”€ PrÃ³ximas AÃ§Ãµes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function getProximasAcoes(limite = 10): Promise<ProximaAcao[]> {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const horizonte = new Date(hoje)
  horizonte.setDate(horizonte.getDate() + 14)

  const [oportunidadesAbertas, processosAtivos, extrajudiciaisEmAndamento, tarefas] = await Promise.all([
    getOportunidadesAbertas(),
    getProcessosAtivos(),
    getExtrajudiciaisEmAndamento(),
    getTarefas(),
  ])

  const acoes: ProximaAcao[] = []

  for (const o of oportunidadesAbertas) {
    if (!o.proximoFollowUp) continue
    const d = new Date(o.proximoFollowUp)
    d.setHours(0, 0, 0, 0)
    if (d <= horizonte) {
      acoes.push({ id: `acao-op-${o.id}`, tipo: 'followup', titulo: `Follow-up: ${o.titulo}`, data: o.proximoFollowUp, responsavel: o.responsavel, href: `/comercial/oportunidades/${o.id}` })
    }
  }

  for (const p of processosAtivos) {
    for (const campo of [p.proximoPrazo, p.proximaAudiencia] as (string | undefined)[]) {
      if (!campo) continue
      const d = new Date(campo)
      d.setHours(0, 0, 0, 0)
      if (d >= hoje && d <= horizonte) {
        acoes.push({ id: `acao-proc-${p.id}`, tipo: p.proximaAudiencia === campo ? 'audiencia' : 'prazo_processo', titulo: `${p.tipo} â€” ${p.tribunal}`, data: campo, responsavel: p.responsavel, href: `/processos/${p.id}` })
        break
      }
    }
  }

  for (const e of extrajudiciaisEmAndamento) {
    if (!e.proximoPrazo) continue
    const d = new Date(e.proximoPrazo)
    d.setHours(0, 0, 0, 0)
    if (d >= hoje && d <= horizonte) {
      acoes.push({ id: `acao-extra-${e.id}`, tipo: 'prazo_extrajudicial', titulo: e.titulo, data: e.proximoPrazo, responsavel: e.responsavel, href: `/extrajudiciais/${e.id}` })
    }
  }

  for (const t of tarefas.filter((t) => t.status !== 'concluida' && t.status !== 'cancelada')) {
    if (!t.prazo) continue
    const d = new Date(t.prazo)
    d.setHours(0, 0, 0, 0)
    if (d >= hoje && d <= horizonte) {
      acoes.push({ id: `acao-tar-${t.id}`, tipo: 'prazo_tarefa', titulo: t.titulo, data: t.prazo, responsavel: t.responsavel, href: `/tarefas/${t.id}` })
    }
  }

  return acoes
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .slice(0, limite)
}

// â”€â”€ Base de Conhecimento â€” Modelos JurÃ­dicos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const getModelosJuridicos = cache((): Promise<ModeloJuridico[]> => readAll<ModeloJuridico>('modelos_juridicos'))

export async function getModeloJuridicoById(id: string): Promise<ModeloJuridico | undefined> {
  return (await getModelosJuridicos()).find((m) => m.id === id)
}

export async function getModelosJuridicosByCategoria(categoria: string): Promise<ModeloJuridico[]> {
  return (await getModelosJuridicos()).filter((m) => m.categoria === categoria)
}

export async function getModelosJuridicosByTipoDocumento(tipo: string): Promise<ModeloJuridico[]> {
  return (await getModelosJuridicos()).filter((m) => m.tipoDocumento === tipo)
}

export async function saveModeloJuridico(modelo: ModeloJuridico): Promise<void> {
  await upsertOne('modelos_juridicos', modelo)
}

// â”€â”€ Base de Conhecimento â€” ClÃ¡usulas PadrÃ£o â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const getClausulasPadrao = cache((): Promise<ClausulaPadrao[]> => readAll<ClausulaPadrao>('clausulas_padrao'))

export async function getClausulaPadraoById(id: string): Promise<ClausulaPadrao | undefined> {
  return (await getClausulasPadrao()).find((c) => c.id === id)
}

export async function getClausulasByCategoria(categoria: string): Promise<ClausulaPadrao[]> {
  return (await getClausulasPadrao()).filter((c) => c.categoria === categoria)
}

export async function saveClausulaPadrao(clausula: ClausulaPadrao): Promise<void> {
  await upsertOne('clausulas_padrao', clausula)
}

// â”€â”€ Base de Conhecimento â€” Checklists JurÃ­dicos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const getChecklistsJuridicos = cache((): Promise<ChecklistJuridico[]> => readAll<ChecklistJuridico>('checklists_juridicos'))

export async function getChecklistJuridicoById(id: string): Promise<ChecklistJuridico | undefined> {
  return (await getChecklistsJuridicos()).find((c) => c.id === id)
}

export async function getChecklistsByTipoDemanda(tipo: string): Promise<ChecklistJuridico[]> {
  return (await getChecklistsJuridicos()).filter((c) => c.tipoDemanda === tipo)
}

export async function saveChecklistJuridico(checklist: ChecklistJuridico): Promise<void> {
  await upsertOne('checklists_juridicos', checklist)
}

// â”€â”€ Base de Conhecimento â€” OrientaÃ§Ãµes Internas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const getOrientacoesInternas = cache((): Promise<OrientacaoInterna[]> => readAll<OrientacaoInterna>('orientacoes_internas'))

export async function getOrientacaoInternaById(id: string): Promise<OrientacaoInterna | undefined> {
  return (await getOrientacoesInternas()).find((o) => o.id === id)
}

export async function getOrientacoesByTema(tema: string): Promise<OrientacaoInterna[]> {
  return (await getOrientacoesInternas()).filter((o) => o.tema.toLowerCase().includes(tema.toLowerCase()))
}

export async function saveOrientacaoInterna(orientacao: OrientacaoInterna): Promise<void> {
  await upsertOne('orientacoes_internas', orientacao)
}

// â”€â”€ Base de Conhecimento â€” Agregados â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface ResumoBaseConhecimento {
  totalModelos: number
  totalClausulas: number
  totalChecklists: number
  totalOrientacoes: number
  ativos: number
  emRevisao: number
  desatualizados: number
}

export async function getResumoBaseConhecimento(): Promise<ResumoBaseConhecimento> {
  const [modelos, clausulas, checklists, orientacoes] = await Promise.all([
    getModelosJuridicos(),
    getClausulasPadrao(),
    getChecklistsJuridicos(),
    getOrientacoesInternas(),
  ])
  const todos = [...modelos, ...clausulas, ...checklists, ...orientacoes]
  return {
    totalModelos: modelos.length,
    totalClausulas: clausulas.length,
    totalChecklists: checklists.length,
    totalOrientacoes: orientacoes.length,
    ativos: todos.filter((i) => i.status === 'ativo').length,
    emRevisao: todos.filter((i) => i.status === 'em_revisao').length,
    desatualizados: todos.filter((i) => i.status === 'desatualizado').length,
  }
}

export async function searchBaseConhecimento(query: string): Promise<{ tipo: string; id: string; titulo: string; descricao?: string }[]> {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  const [modelos, clausulas, checklists, orientacoes] = await Promise.all([
    getModelosJuridicos(),
    getClausulasPadrao(),
    getChecklistsJuridicos(),
    getOrientacoesInternas(),
  ])
  const results: { tipo: string; id: string; titulo: string; descricao?: string }[] = []
  for (const m of modelos) {
    if (m.titulo.toLowerCase().includes(q) || m.descricao?.toLowerCase().includes(q) || m.tags.some((t) => t.toLowerCase().includes(q))) {
      results.push({ tipo: 'modelo', id: m.id, titulo: m.titulo, descricao: m.descricao })
    }
  }
  for (const c of clausulas) {
    if (c.titulo.toLowerCase().includes(q) || c.descricao?.toLowerCase().includes(q) || c.tags.some((t) => t.toLowerCase().includes(q))) {
      results.push({ tipo: 'clausula', id: c.id, titulo: c.titulo, descricao: c.descricao })
    }
  }
  for (const c of checklists) {
    if (c.titulo.toLowerCase().includes(q) || c.descricao?.toLowerCase().includes(q)) {
      results.push({ tipo: 'checklist', id: c.id, titulo: c.titulo, descricao: c.descricao })
    }
  }
  for (const o of orientacoes) {
    if (o.titulo.toLowerCase().includes(q) || o.descricao?.toLowerCase().includes(q) || o.tags.some((t) => t.toLowerCase().includes(q))) {
      results.push({ tipo: 'orientacao', id: o.id, titulo: o.titulo, descricao: o.descricao })
    }
  }
  return results.slice(0, 20)
}

// â”€â”€ Minutas Assistidas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const getMinutasAssistidas = cache((): Promise<MinutaAssistida[]> => readAll<MinutaAssistida>('minutas_assistidas'))

export async function getMinutaAssistidaById(id: string): Promise<MinutaAssistida | null> {
  const all = await getMinutasAssistidas()
  return all.find((m) => m.id === id) ?? null
}

export async function getMinutasAssistidasByEntity(entityType: MinutaEntityType, entityId: string): Promise<MinutaAssistida[]> {
  const all = await getMinutasAssistidas()
  return all.filter((m) => m.entityType === entityType && m.entityId === entityId && m.status !== 'arquivada')
}

export async function saveMinutaAssistida(m: MinutaAssistida): Promise<void> {
  return upsertOne('minutas_assistidas', m)
}

export async function getResumoMinutasAssistidas(): Promise<{ total: number; rascunhos: number; emRevisao: number; aprovadas: number; arquivadas: number }> {
  const all = await getMinutasAssistidas()
  const ativas = all.filter((m) => m.status !== 'arquivada')
  return {
    total: ativas.length,
    rascunhos: ativas.filter((m) => m.status === 'rascunho').length,
    emRevisao: ativas.filter((m) => m.status === 'em_revisao').length,
    aprovadas: ativas.filter((m) => m.status === 'aprovada').length,
    arquivadas: all.filter((m) => m.status === 'arquivada').length,
  }
}

// ── Profiles ──────────────────────────────────────────────────────────────────
// Profiles é uma tabela normal (não document-store), portanto usa queries diretas.

export async function getProfileById(id: string): Promise<Profile | null> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase
      .from('profiles')
      .select('id, nome, email, role, status, created_at, updated_at')
      .eq('id', id)
      .single()
    return (data as Profile) ?? null
  } catch {
    return null
  }
}

export async function saveProfile(profile: Pick<Profile, 'id' | 'nome' | 'role' | 'status'>): Promise<void> {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('profiles')
    .update({
      nome: profile.nome,
      role: profile.role as UserRole,
      status: profile.status as UserStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', profile.id)
  if (error) throw error
}
