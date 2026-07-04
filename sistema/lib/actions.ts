'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { randomUUID } from 'crypto'
import {
  saveProcesso,
  deleteProcesso,
  saveConsultoria,
  deleteConsultoria,
  saveExtrajudicial,
  deleteExtrajudicial,
  getProcesso,
  getConsultoria,
  getExtrajudicial,
  saveImobiliaria,
  inactivateImobiliaria,
  getImobiliaria,
  saveCorretor,
  getCorretor,
  saveCliente,
  deleteCliente,
  getCliente,
  saveOportunidade,
  getOportunidade,
  saveProposta,
  getProposta,
  saveTarefa,
  getTarefa,
  deleteTarefa,
  saveArquivo,
  getArquivo,
  deleteArquivo,
  saveModeloJuridico,
  getModeloJuridicoById,
  saveClausulaPadrao,
  getClausulaPadraoById,
  saveChecklistJuridico,
  getChecklistJuridicoById,
  saveOrientacaoInterna,
  getOrientacaoInternaById,
  saveMinutaAssistida,
  getMinutaAssistidaById,
  saveProfile,
  getProfileById,
} from './data'
import { getCurrentProfile } from './auth'
import { hasPermission } from './permissions'
import type { Permission } from './permissions'
import type { UserRole, UserStatus } from './types'

// ── Permission guard para Server Actions ────────────────────────────────────
// Retorna true se o usuário autenticado tem a permissão; false caso contrário.
// Server Actions NÃO redirecionam — apenas não executam se sem permissão.
async function requireActionPermission(permission: Permission): Promise<boolean> {
  const profile = await getCurrentProfile()
  if (!profile) return false
  return hasPermission(profile.role, permission)
}
import type {
  Processo,
  Consultoria,
  Extrajudicial,
  StatusProcesso,
  StatusConsultoria,
  StatusExtrajudicial,
  TipoExtrajudicial,
  Responsavel,
  Imobiliaria,
  StatusImobiliaria,
  NivelRelacionamento,
  Corretor,
  StatusCorretor,
  Cliente,
  OrigemCliente,
  Oportunidade,
  StatusComercial,
  TipoInteracao,
  Interacao,
  Proposta,
  StatusProposta,
  FormaPagamento,
  Tarefa,
  StatusTarefa,
  Prioridade,
  VinculoTipo,
  Arquivo,
  StatusArquivo,
  ModeloJuridico,
  CategoriaModelo,
  TipoDocumento,
  StatusBaseConhecimento,
  ClausulaPadrao,
  CategoriaClausula,
  ChecklistJuridico,
  ItemChecklist,
  OrientacaoInterna,
  MinutaAssistida,
  StatusMinuta,
  TipoDocumentoMinuta,
  MinutaEntityType,
} from './types'
import { montarConteudoMinutaAssistida } from './utils'

// ── Processos ───────────────────────────────────────────────────────────────

export async function criarProcesso(formData: FormData) {
  if (!await requireActionPermission('processos:manage')) return
  const now = new Date().toISOString()
  const processo: Processo = {
    id: randomUUID(),
    numero: formData.get('numero') as string,
    tipo: formData.get('tipo') as string,
    vara: formData.get('vara') as string,
    tribunal: formData.get('tribunal') as string,
    autor: formData.get('autor') as string,
    reu: formData.get('reu') as string,
    responsavel: formData.get('responsavel') as Responsavel,
    status: formData.get('status') as StatusProcesso,
    proximaAudiencia: (formData.get('proximaAudiencia') as string) || undefined,
    proximoPrazo: (formData.get('proximoPrazo') as string) || undefined,
    faseAtual: formData.get('faseAtual') as string,
    cliente: (formData.get('cliente') as string) || undefined,
    clienteId: (formData.get('clienteId') as string) || undefined,
    imobiliariaId: (formData.get('imobiliariaId') as string) || undefined,
    observacoes: (formData.get('observacoes') as string) || undefined,
    movimentacoes: [],
    createdAt: now,
    updatedAt: now,
  }
  await saveProcesso(processo)
  revalidatePath('/processos')
  redirect('/processos')
}

export async function atualizarProcesso(id: string, formData: FormData) {
  if (!await requireActionPermission('processos:manage')) return
  const existing = await getProcesso(id)
  if (!existing) return
  const updated: Processo = {
    ...existing,
    numero: formData.get('numero') as string,
    tipo: formData.get('tipo') as string,
    vara: formData.get('vara') as string,
    tribunal: formData.get('tribunal') as string,
    autor: formData.get('autor') as string,
    reu: formData.get('reu') as string,
    responsavel: formData.get('responsavel') as Responsavel,
    status: formData.get('status') as StatusProcesso,
    proximaAudiencia: (formData.get('proximaAudiencia') as string) || undefined,
    proximoPrazo: (formData.get('proximoPrazo') as string) || undefined,
    faseAtual: formData.get('faseAtual') as string,
    cliente: (formData.get('cliente') as string) || undefined,
    clienteId: (formData.get('clienteId') as string) || undefined,
    imobiliariaId: (formData.get('imobiliariaId') as string) || undefined,
    observacoes: (formData.get('observacoes') as string) || undefined,
    updatedAt: new Date().toISOString(),
  }
  await saveProcesso(updated)
  revalidatePath('/processos')
  revalidatePath(`/processos/${id}`)
  redirect(`/processos/${id}`)
}

export async function excluirProcesso(id: string) {
  if (!await requireActionPermission('processos:manage')) return
  await deleteProcesso(id)
  revalidatePath('/processos')
  redirect('/processos')
}

export async function adicionarMovimentacao(id: string, formData: FormData) {
  if (!await requireActionPermission('processos:manage')) return
  const processo = await getProcesso(id)
  if (!processo) return
  processo.movimentacoes.unshift({
    id: randomUUID(),
    data: formData.get('data') as string,
    descricao: formData.get('descricao') as string,
    tipo: formData.get('tipo') as Processo['movimentacoes'][0]['tipo'],
  })
  processo.updatedAt = new Date().toISOString()
  await saveProcesso(processo)
  revalidatePath(`/processos/${id}`)
}

// ── Consultorias ────────────────────────────────────────────────────────────

export async function criarConsultoria(formData: FormData) {
  if (!await requireActionPermission('consultorias:manage')) return
  const now = new Date().toISOString()
  const escopoRaw = formData.get('escopo') as string
  const consultoria: Consultoria = {
    id: randomUUID(),
    imobiliaria: formData.get('imobiliaria') as string,
    responsavel: formData.get('responsavel') as Responsavel,
    status: formData.get('status') as StatusConsultoria,
    valorMensal: parseFloat(formData.get('valorMensal') as string) || 0,
    dataRenovacao: (formData.get('dataRenovacao') as string) || undefined,
    escopo: escopoRaw ? escopoRaw.split('\n').map((s) => s.trim()).filter(Boolean) : [],
    historico: [],
    observacoes: (formData.get('observacoes') as string) || undefined,
    createdAt: now,
    updatedAt: now,
  }
  await saveConsultoria(consultoria)
  revalidatePath('/consultorias')
  redirect('/consultorias')
}

export async function atualizarConsultoria(id: string, formData: FormData) {
  if (!await requireActionPermission('consultorias:manage')) return
  const existing = await getConsultoria(id)
  if (!existing) return
  const escopoRaw = formData.get('escopo') as string
  const updated: Consultoria = {
    ...existing,
    imobiliaria: formData.get('imobiliaria') as string,
    responsavel: formData.get('responsavel') as Responsavel,
    status: formData.get('status') as StatusConsultoria,
    valorMensal: parseFloat(formData.get('valorMensal') as string) || 0,
    dataRenovacao: (formData.get('dataRenovacao') as string) || undefined,
    escopo: escopoRaw ? escopoRaw.split('\n').map((s) => s.trim()).filter(Boolean) : [],
    observacoes: (formData.get('observacoes') as string) || undefined,
    updatedAt: new Date().toISOString(),
  }
  await saveConsultoria(updated)
  revalidatePath('/consultorias')
  revalidatePath(`/consultorias/${id}`)
  redirect(`/consultorias/${id}`)
}

export async function excluirConsultoria(id: string) {
  if (!await requireActionPermission('consultorias:manage')) return
  await deleteConsultoria(id)
  revalidatePath('/consultorias')
  redirect('/consultorias')
}

// ── Extrajudiciais ──────────────────────────────────────────────────────────

export async function criarExtrajudicial(formData: FormData) {
  if (!await requireActionPermission('extrajudiciais:manage')) return
  const now = new Date().toISOString()
  const extrajudicial: Extrajudicial = {
    id: randomUUID(),
    tipo: formData.get('tipo') as TipoExtrajudicial,
    titulo: formData.get('titulo') as string,
    cliente: formData.get('cliente') as string,
    clienteId: (formData.get('clienteId') as string) || undefined,
    corretorId: (formData.get('corretorId') as string) || undefined,
    imobiliariaId: (formData.get('imobiliariaId') as string) || undefined,
    oportunidadeId: (formData.get('oportunidadeId') as string) || undefined,
    propostaId: (formData.get('propostaId') as string) || undefined,
    responsavel: formData.get('responsavel') as Responsavel,
    status: formData.get('status') as StatusExtrajudicial,
    prioridade: (formData.get('prioridade') as Prioridade) || 'normal',
    proximoPrazo: (formData.get('proximoPrazo') as string) || undefined,
    etapas: [],
    documentos: [],
    observacoes: (formData.get('observacoes') as string) || undefined,
    createdAt: now,
    updatedAt: now,
  }
  await saveExtrajudicial(extrajudicial)
  revalidatePath('/extrajudiciais')
  redirect('/extrajudiciais')
}

export async function atualizarExtrajudicial(id: string, formData: FormData) {
  if (!await requireActionPermission('extrajudiciais:manage')) return
  const existing = await getExtrajudicial(id)
  if (!existing) return
  const updated: Extrajudicial = {
    ...existing,
    tipo: formData.get('tipo') as TipoExtrajudicial,
    titulo: formData.get('titulo') as string,
    cliente: formData.get('cliente') as string,
    clienteId: (formData.get('clienteId') as string) || undefined,
    corretorId: (formData.get('corretorId') as string) || undefined,
    imobiliariaId: (formData.get('imobiliariaId') as string) || undefined,
    oportunidadeId: (formData.get('oportunidadeId') as string) || undefined,
    propostaId: (formData.get('propostaId') as string) || undefined,
    responsavel: formData.get('responsavel') as Responsavel,
    status: formData.get('status') as StatusExtrajudicial,
    prioridade: (formData.get('prioridade') as Prioridade) || existing.prioridade,
    proximoPrazo: (formData.get('proximoPrazo') as string) || undefined,
    observacoes: (formData.get('observacoes') as string) || undefined,
    updatedAt: new Date().toISOString(),
  }
  await saveExtrajudicial(updated)
  revalidatePath('/extrajudiciais')
  revalidatePath(`/extrajudiciais/${id}`)
  redirect(`/extrajudiciais/${id}`)
}

export async function excluirExtrajudicial(id: string) {
  if (!await requireActionPermission('extrajudiciais:manage')) return
  await deleteExtrajudicial(id)
  revalidatePath('/extrajudiciais')
  redirect('/extrajudiciais')
}

export async function adicionarEtapa(id: string, formData: FormData) {
  if (!await requireActionPermission('extrajudiciais:manage')) return
  const e = await getExtrajudicial(id)
  if (!e) return
  e.etapas.push({
    id: randomUUID(),
    titulo: formData.get('titulo') as string,
    concluida: false,
    prazo: (formData.get('prazo') as string) || undefined,
  })
  e.updatedAt = new Date().toISOString()
  await saveExtrajudicial(e)
  revalidatePath(`/extrajudiciais/${id}`)
}

export async function toggleEtapa(demandaId: string, etapaId: string) {
  if (!await requireActionPermission('extrajudiciais:manage')) return
  const e = await getExtrajudicial(demandaId)
  if (!e) return
  const etapa = e.etapas.find((et) => et.id === etapaId)
  if (etapa) etapa.concluida = !etapa.concluida
  e.updatedAt = new Date().toISOString()
  await saveExtrajudicial(e)
  revalidatePath(`/extrajudiciais/${demandaId}`)
}

export async function adicionarDocumento(id: string, formData: FormData) {
  if (!await requireActionPermission('extrajudiciais:manage')) return
  const e = await getExtrajudicial(id)
  if (!e) return
  e.documentos.push({
    id: randomUUID(),
    nome: formData.get('nome') as string,
    necessario: true,
    entregue: false,
  })
  e.updatedAt = new Date().toISOString()
  await saveExtrajudicial(e)
  revalidatePath(`/extrajudiciais/${id}`)
}

export async function toggleDocumento(demandaId: string, docId: string) {
  if (!await requireActionPermission('extrajudiciais:manage')) return
  const e = await getExtrajudicial(demandaId)
  if (!e) return
  const doc = e.documentos.find((d) => d.id === docId)
  if (doc) doc.entregue = !doc.entregue
  e.updatedAt = new Date().toISOString()
  await saveExtrajudicial(e)
  revalidatePath(`/extrajudiciais/${demandaId}`)
}

// ── Imobiliárias ────────────────────────────────────────────────────────────

export async function criarImobiliaria(formData: FormData) {
  if (!await requireActionPermission('organizations:manage')) return
  const now = new Date().toISOString()
  const imobiliaria: Imobiliaria = {
    id: randomUUID(),
    nome: formData.get('nome') as string,
    cnpj: (formData.get('cnpj') as string) || undefined,
    cidade: (formData.get('cidade') as string) || undefined,
    endereco: (formData.get('endereco') as string) || undefined,
    responsavel: formData.get('responsavel') as Responsavel,
    telefone: (formData.get('telefone') as string) || undefined,
    email: (formData.get('email') as string) || undefined,
    status: formData.get('status') as StatusImobiliaria,
    valorMensal: parseFloat(formData.get('valorMensal') as string) || 0,
    dataInicio: (formData.get('dataInicio') as string) || undefined,
    dataRenovacao: (formData.get('dataRenovacao') as string) || undefined,
    nivelRelacionamento: formData.get('nivelRelacionamento') as NivelRelacionamento,
    proximaAcao: (formData.get('proximaAcao') as string) || undefined,
    proximaAcaoData: (formData.get('proximaAcaoData') as string) || undefined,
    observacoes: (formData.get('observacoes') as string) || undefined,
    createdAt: now,
    updatedAt: now,
  }
  await saveImobiliaria(imobiliaria)
  revalidatePath('/comercial/imobiliarias')
  redirect('/comercial/imobiliarias')
}

export async function atualizarImobiliaria(id: string, formData: FormData) {
  if (!await requireActionPermission('organizations:manage')) return
  const existing = await getImobiliaria(id)
  if (!existing) return
  const updated: Imobiliaria = {
    ...existing,
    nome: formData.get('nome') as string,
    cnpj: (formData.get('cnpj') as string) || undefined,
    cidade: (formData.get('cidade') as string) || undefined,
    endereco: (formData.get('endereco') as string) || undefined,
    responsavel: formData.get('responsavel') as Responsavel,
    telefone: (formData.get('telefone') as string) || undefined,
    email: (formData.get('email') as string) || undefined,
    status: formData.get('status') as StatusImobiliaria,
    valorMensal: parseFloat(formData.get('valorMensal') as string) || 0,
    dataInicio: (formData.get('dataInicio') as string) || undefined,
    dataRenovacao: (formData.get('dataRenovacao') as string) || undefined,
    nivelRelacionamento: formData.get('nivelRelacionamento') as NivelRelacionamento,
    proximaAcao: (formData.get('proximaAcao') as string) || undefined,
    proximaAcaoData: (formData.get('proximaAcaoData') as string) || undefined,
    observacoes: (formData.get('observacoes') as string) || undefined,
    updatedAt: new Date().toISOString(),
  }
  await saveImobiliaria(updated)
  revalidatePath('/comercial/imobiliarias')
  revalidatePath(`/comercial/imobiliarias/${id}`)
  redirect(`/comercial/imobiliarias/${id}`)
}

export async function desativarImobiliaria(id: string) {
  if (!await requireActionPermission('organizations:manage')) return
  await inactivateImobiliaria(id)
  revalidatePath('/comercial/imobiliarias')
  revalidatePath(`/comercial/imobiliarias/${id}`)
  redirect('/comercial/imobiliarias')
}

// ── Corretores ──────────────────────────────────────────────────────────────

export async function criarCorretor(formData: FormData) {
  if (!await requireActionPermission('brokers:manage')) return
  const now = new Date().toISOString()
  const corretor: Corretor = {
    id: randomUUID(),
    imobiliariaId: formData.get('imobiliariaId') as string,
    nome: formData.get('nome') as string,
    telefone: (formData.get('telefone') as string) || undefined,
    email: (formData.get('email') as string) || undefined,
    creci: (formData.get('creci') as string) || undefined,
    status: formData.get('status') as StatusCorretor,
    nivelRelacionamento: formData.get('nivelRelacionamento') as NivelRelacionamento,
    quantidadeIndicacoes: 0,
    faturamentoGerado: 0,
    proximaAcao: (formData.get('proximaAcao') as string) || undefined,
    proximaAcaoData: (formData.get('proximaAcaoData') as string) || undefined,
    observacoes: (formData.get('observacoes') as string) || undefined,
    createdAt: now,
    updatedAt: now,
  }
  await saveCorretor(corretor)
  revalidatePath('/comercial/corretores')
  redirect('/comercial/corretores')
}

export async function atualizarCorretor(id: string, formData: FormData) {
  if (!await requireActionPermission('brokers:manage')) return
  const existing = await getCorretor(id)
  if (!existing) return
  const updated: Corretor = {
    ...existing,
    imobiliariaId: formData.get('imobiliariaId') as string,
    nome: formData.get('nome') as string,
    telefone: (formData.get('telefone') as string) || undefined,
    email: (formData.get('email') as string) || undefined,
    creci: (formData.get('creci') as string) || undefined,
    status: formData.get('status') as StatusCorretor,
    nivelRelacionamento: formData.get('nivelRelacionamento') as NivelRelacionamento,
    proximaAcao: (formData.get('proximaAcao') as string) || undefined,
    proximaAcaoData: (formData.get('proximaAcaoData') as string) || undefined,
    observacoes: (formData.get('observacoes') as string) || undefined,
    updatedAt: new Date().toISOString(),
  }
  await saveCorretor(updated)
  revalidatePath('/comercial/corretores')
  revalidatePath(`/comercial/corretores/${id}`)
  redirect(`/comercial/corretores/${id}`)
}

// ── Clientes ────────────────────────────────────────────────────────────────

export async function criarCliente(formData: FormData) {
  if (!await requireActionPermission('clients:manage')) return
  const now = new Date().toISOString()
  const cliente: Cliente = {
    id: randomUUID(),
    nome: formData.get('nome') as string,
    documento: (formData.get('documento') as string) || undefined,
    telefone: (formData.get('telefone') as string) || undefined,
    email: (formData.get('email') as string) || undefined,
    origem: formData.get('origem') as OrigemCliente,
    corretorId: (formData.get('corretorId') as string) || undefined,
    imobiliariaId: (formData.get('imobiliariaId') as string) || undefined,
    observacoes: (formData.get('observacoes') as string) || undefined,
    createdAt: now,
    updatedAt: now,
  }
  await saveCliente(cliente)
  revalidatePath('/comercial/clientes')
  redirect('/comercial/clientes')
}

export async function atualizarCliente(id: string, formData: FormData) {
  if (!await requireActionPermission('clients:manage')) return
  const existing = await getCliente(id)
  if (!existing) return
  const updated: Cliente = {
    ...existing,
    nome: formData.get('nome') as string,
    documento: (formData.get('documento') as string) || undefined,
    telefone: (formData.get('telefone') as string) || undefined,
    email: (formData.get('email') as string) || undefined,
    origem: formData.get('origem') as OrigemCliente,
    corretorId: (formData.get('corretorId') as string) || undefined,
    imobiliariaId: (formData.get('imobiliariaId') as string) || undefined,
    observacoes: (formData.get('observacoes') as string) || undefined,
    updatedAt: new Date().toISOString(),
  }
  await saveCliente(updated)
  revalidatePath('/comercial/clientes')
  revalidatePath(`/comercial/clientes/${id}`)
  redirect(`/comercial/clientes/${id}`)
}

export async function excluirCliente(id: string) {
  if (!await requireActionPermission('clients:manage')) return
  await deleteCliente(id)
  revalidatePath('/comercial/clientes')
  redirect('/comercial/clientes')
}

// ── Oportunidades ───────────────────────────────────────────────────────────

export async function criarOportunidade(formData: FormData) {
  if (!await requireActionPermission('opportunities:manage')) return
  const now = new Date().toISOString()
  const oportunidade: Oportunidade = {
    id: randomUUID(),
    titulo: formData.get('titulo') as string,
    clienteId: formData.get('clienteId') as string,
    corretorId: (formData.get('corretorId') as string) || undefined,
    imobiliariaId: (formData.get('imobiliariaId') as string) || undefined,
    tipoServico: (formData.get('tipoServico') as TipoExtrajudicial) || undefined,
    status: (formData.get('status') as StatusComercial) || 'novo_lead',
    valorEstimado: parseFloat(formData.get('valorEstimado') as string) || undefined,
    probabilidade: parseInt(formData.get('probabilidade') as string) || undefined,
    responsavel: formData.get('responsavel') as Responsavel,
    proximoFollowUp: (formData.get('proximoFollowUp') as string) || undefined,
    origem: (formData.get('origem') as string) || undefined,
    observacoes: (formData.get('observacoes') as string) || undefined,
    interacoes: [],
    createdAt: now,
    updatedAt: now,
  }
  await saveOportunidade(oportunidade)
  revalidatePath('/comercial/oportunidades')
  redirect(`/comercial/oportunidades/${oportunidade.id}`)
}

export async function atualizarOportunidade(id: string, formData: FormData) {
  if (!await requireActionPermission('opportunities:manage')) return
  const existing = await getOportunidade(id)
  if (!existing) return
  const updated: Oportunidade = {
    ...existing,
    titulo: formData.get('titulo') as string,
    clienteId: formData.get('clienteId') as string,
    corretorId: (formData.get('corretorId') as string) || undefined,
    imobiliariaId: (formData.get('imobiliariaId') as string) || undefined,
    tipoServico: (formData.get('tipoServico') as TipoExtrajudicial) || undefined,
    status: formData.get('status') as StatusComercial,
    valorEstimado: parseFloat(formData.get('valorEstimado') as string) || undefined,
    probabilidade: parseInt(formData.get('probabilidade') as string) || undefined,
    responsavel: formData.get('responsavel') as Responsavel,
    proximoFollowUp: (formData.get('proximoFollowUp') as string) || undefined,
    observacoes: (formData.get('observacoes') as string) || undefined,
    motivoPerda: (formData.get('motivoPerda') as string) || existing.motivoPerda,
    updatedAt: new Date().toISOString(),
  }
  await saveOportunidade(updated)
  revalidatePath('/comercial/oportunidades')
  revalidatePath(`/comercial/oportunidades/${id}`)
  redirect(`/comercial/oportunidades/${id}`)
}

export async function moverStatusOportunidade(id: string, status: StatusComercial) {
  if (!await requireActionPermission('opportunities:manage')) return
  const existing = await getOportunidade(id)
  if (!existing) return
  await saveOportunidade({ ...existing, status, updatedAt: new Date().toISOString() })
  revalidatePath('/comercial/oportunidades')
  revalidatePath(`/comercial/oportunidades/${id}`)
}

export async function registrarPerda(id: string, formData: FormData) {
  if (!await requireActionPermission('opportunities:manage')) return
  const existing = await getOportunidade(id)
  if (!existing) return
  await saveOportunidade({
    ...existing,
    status: 'perdido',
    motivoPerda: formData.get('motivoPerda') as string,
    proximoFollowUp: undefined,
    updatedAt: new Date().toISOString(),
  })
  revalidatePath('/comercial/oportunidades')
  revalidatePath(`/comercial/oportunidades/${id}`)
  redirect(`/comercial/oportunidades/${id}`)
}

export async function adicionarInteracao(id: string, formData: FormData) {
  if (!await requireActionPermission('opportunities:manage')) return
  const existing = await getOportunidade(id)
  if (!existing) return
  const interacao: Interacao = {
    id: randomUUID(),
    data: formData.get('data') as string,
    tipo: formData.get('tipo') as TipoInteracao,
    descricao: formData.get('descricao') as string,
    responsavel: formData.get('responsavel') as Responsavel,
  }
  const updated: Oportunidade = {
    ...existing,
    interacoes: [interacao, ...existing.interacoes],
    proximoFollowUp: (formData.get('proximoFollowUp') as string) || existing.proximoFollowUp,
    updatedAt: new Date().toISOString(),
  }
  await saveOportunidade(updated)
  revalidatePath(`/comercial/oportunidades/${id}`)
}

// ── Propostas ───────────────────────────────────────────────────────────────

export async function criarProposta(formData: FormData) {
  if (!await requireActionPermission('proposals:manage')) return
  const now = new Date().toISOString()
  const escopoRaw = formData.get('escopo') as string
  const proposta: Proposta = {
    id: randomUUID(),
    oportunidadeId: (formData.get('oportunidadeId') as string) || undefined,
    clienteId: formData.get('clienteId') as string,
    corretorId: (formData.get('corretorId') as string) || undefined,
    imobiliariaId: (formData.get('imobiliariaId') as string) || undefined,
    titulo: formData.get('titulo') as string,
    tipoServico: (formData.get('tipoServico') as TipoExtrajudicial) || undefined,
    escopo: escopoRaw ? escopoRaw.split('\n').map((s) => s.trim()).filter(Boolean) : [],
    valorTotal: parseFloat(formData.get('valorTotal') as string) || 0,
    valorEntrada: parseFloat(formData.get('valorEntrada') as string) || undefined,
    quantidadeParcelas: parseInt(formData.get('quantidadeParcelas') as string) || undefined,
    valorParcela: parseFloat(formData.get('valorParcela') as string) || undefined,
    formaPagamento: (formData.get('formaPagamento') as FormaPagamento) || undefined,
    status: (formData.get('status') as StatusProposta) || 'rascunho',
    validade: (formData.get('validade') as string) || undefined,
    dataEnvio: (formData.get('dataEnvio') as string) || undefined,
    responsavel: formData.get('responsavel') as Responsavel,
    observacoes: (formData.get('observacoes') as string) || undefined,
    createdAt: now,
    updatedAt: now,
  }
  await saveProposta(proposta)
  revalidatePath('/comercial/propostas')
  redirect(`/comercial/propostas/${proposta.id}`)
}

export async function atualizarProposta(id: string, formData: FormData) {
  if (!await requireActionPermission('proposals:manage')) return
  const existing = await getProposta(id)
  if (!existing) return
  const escopoRaw = formData.get('escopo') as string
  const updated: Proposta = {
    ...existing,
    oportunidadeId: (formData.get('oportunidadeId') as string) || existing.oportunidadeId,
    clienteId: formData.get('clienteId') as string,
    corretorId: (formData.get('corretorId') as string) || undefined,
    imobiliariaId: (formData.get('imobiliariaId') as string) || undefined,
    titulo: formData.get('titulo') as string,
    tipoServico: (formData.get('tipoServico') as TipoExtrajudicial) || undefined,
    escopo: escopoRaw ? escopoRaw.split('\n').map((s) => s.trim()).filter(Boolean) : existing.escopo,
    valorTotal: parseFloat(formData.get('valorTotal') as string) || existing.valorTotal,
    valorEntrada: parseFloat(formData.get('valorEntrada') as string) || undefined,
    quantidadeParcelas: parseInt(formData.get('quantidadeParcelas') as string) || undefined,
    valorParcela: parseFloat(formData.get('valorParcela') as string) || undefined,
    formaPagamento: (formData.get('formaPagamento') as FormaPagamento) || undefined,
    status: formData.get('status') as StatusProposta,
    validade: (formData.get('validade') as string) || undefined,
    dataEnvio: (formData.get('dataEnvio') as string) || existing.dataEnvio,
    responsavel: formData.get('responsavel') as Responsavel,
    observacoes: (formData.get('observacoes') as string) || undefined,
    updatedAt: new Date().toISOString(),
  }
  await saveProposta(updated)
  revalidatePath('/comercial/propostas')
  revalidatePath(`/comercial/propostas/${id}`)
  redirect(`/comercial/propostas/${id}`)
}

export async function alterarStatusProposta(id: string, status: StatusProposta) {
  if (!await requireActionPermission('proposals:manage')) return
  const existing = await getProposta(id)
  if (!existing) return
  await saveProposta({ ...existing, status, updatedAt: new Date().toISOString() })
  revalidatePath('/comercial/propostas')
  revalidatePath(`/comercial/propostas/${id}`)
  redirect(`/comercial/propostas/${id}`)
}

export async function marcarPropostaAceita(id: string) {
  if (!await requireActionPermission('proposals:manage')) return
  const existing = await getProposta(id)
  if (!existing) return
  await saveProposta({ ...existing, status: 'aceita', dataAceite: new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString() })
  revalidatePath('/comercial/propostas')
  revalidatePath(`/comercial/propostas/${id}`)
  redirect(`/comercial/propostas/${id}`)
}

export async function marcarPropostaRecusada(id: string, formData: FormData) {
  if (!await requireActionPermission('proposals:manage')) return
  const existing = await getProposta(id)
  if (!existing) return
  await saveProposta({ ...existing, status: 'recusada', motivoRecusa: formData.get('motivoRecusa') as string, dataRecusa: new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString() })
  revalidatePath('/comercial/propostas')
  revalidatePath(`/comercial/propostas/${id}`)
  redirect(`/comercial/propostas/${id}`)
}

export async function marcarPropostaVencida(id: string) {
  if (!await requireActionPermission('proposals:manage')) return
  const existing = await getProposta(id)
  if (!existing) return
  await saveProposta({ ...existing, status: 'vencida', updatedAt: new Date().toISOString() })
  revalidatePath('/comercial/propostas')
  revalidatePath(`/comercial/propostas/${id}`)
  redirect(`/comercial/propostas/${id}`)
}

export async function arquivarProposta(id: string) {
  if (!await requireActionPermission('proposals:manage')) return
  const existing = await getProposta(id)
  if (!existing) return
  await saveProposta({ ...existing, status: 'cancelada', updatedAt: new Date().toISOString() })
  revalidatePath('/comercial/propostas')
  revalidatePath(`/comercial/propostas/${id}`)
  redirect('/comercial/propostas')
}

// ── Tarefas ─────────────────────────────────────────────────────────────────

export async function criarTarefa(formData: FormData) {
  if (!await requireActionPermission('tarefas:manage')) return
  const now = new Date().toISOString()
  const tarefa: Tarefa = {
    id: randomUUID(),
    titulo: formData.get('titulo') as string,
    descricao: (formData.get('descricao') as string) || undefined,
    responsavel: formData.get('responsavel') as Responsavel,
    status: 'pendente',
    prioridade: (formData.get('prioridade') as Prioridade) || 'normal',
    prazo: (formData.get('prazo') as string) || undefined,
    vinculoTipo: (formData.get('vinculoTipo') as VinculoTipo) || 'livre',
    vinculoId: (formData.get('vinculoId') as string) || undefined,
    createdAt: now,
    updatedAt: now,
  }
  await saveTarefa(tarefa)
  revalidatePath('/tarefas')
  redirect('/tarefas')
}

export async function atualizarTarefa(id: string, formData: FormData) {
  if (!await requireActionPermission('tarefas:manage')) return
  const existing = await getTarefa(id)
  if (!existing) return
  const updated: Tarefa = {
    ...existing,
    titulo: formData.get('titulo') as string,
    descricao: (formData.get('descricao') as string) || undefined,
    responsavel: formData.get('responsavel') as Responsavel,
    status: formData.get('status') as StatusTarefa,
    prioridade: formData.get('prioridade') as Prioridade,
    prazo: (formData.get('prazo') as string) || undefined,
    vinculoTipo: formData.get('vinculoTipo') as VinculoTipo,
    vinculoId: (formData.get('vinculoId') as string) || undefined,
    updatedAt: new Date().toISOString(),
  }
  await saveTarefa(updated)
  revalidatePath('/tarefas')
  revalidatePath(`/tarefas/${id}`)
  redirect(`/tarefas/${id}`)
}

export async function alterarStatusTarefa(id: string, status: StatusTarefa) {
  if (!await requireActionPermission('tarefas:manage')) return
  const existing = await getTarefa(id)
  if (!existing) return
  await saveTarefa({ ...existing, status, updatedAt: new Date().toISOString() })
  revalidatePath('/tarefas')
  revalidatePath(`/tarefas/${id}`)
}

export async function excluirTarefa(id: string) {
  if (!await requireActionPermission('tarefas:manage')) return
  await deleteTarefa(id)
  revalidatePath('/tarefas')
  redirect('/tarefas')
}

// ── Arquivos / Documentos ───────────────────────────────────────────────────

const VINCULO_ROTAS: Record<string, string> = {
  processo: 'processos',
  extrajudicial: 'extrajudiciais',
  consultoria: 'consultorias',
}

function vinculoPath(vinculoTipo: string, vinculoId: string): string {
  return `/${VINCULO_ROTAS[vinculoTipo] ?? vinculoTipo + 's'}/${vinculoId}`
}

export async function criarArquivo(formData: FormData) {
  if (!await requireActionPermission('documentos:manage')) return
  const now = new Date().toISOString()
  const arquivo: Arquivo = {
    id: randomUUID(),
    nome: formData.get('nome') as string,
    url: (formData.get('url') as string) || undefined,
    descricao: (formData.get('descricao') as string) || undefined,
    status: 'pendente',
    vinculoTipo: formData.get('vinculoTipo') as Arquivo['vinculoTipo'],
    vinculoId: formData.get('vinculoId') as string,
    createdAt: now,
    updatedAt: now,
  }
  await saveArquivo(arquivo)
  revalidatePath('/documentos')
  revalidatePath(vinculoPath(arquivo.vinculoTipo, arquivo.vinculoId))
}

export async function alterarStatusArquivo(id: string, status: StatusArquivo) {
  if (!await requireActionPermission('documentos:manage')) return
  const existing = await getArquivo(id)
  if (!existing) return
  await saveArquivo({ ...existing, status, updatedAt: new Date().toISOString() })
  revalidatePath('/documentos')
  revalidatePath(vinculoPath(existing.vinculoTipo, existing.vinculoId))
}

export async function excluirArquivo(id: string) {
  if (!await requireActionPermission('documentos:manage')) return
  const existing = await getArquivo(id)
  if (!existing) return
  await deleteArquivo(id)
  revalidatePath('/documentos')
  revalidatePath(vinculoPath(existing.vinculoTipo, existing.vinculoId))
}

// ── Modelos Jurídicos ────────────────────────────────────────────────────────

export async function criarModeloJuridico(formData: FormData) {
  if (!await requireActionPermission('conhecimento:manage')) return
  const now = new Date().toISOString()
  const tagsRaw = formData.get('tags') as string
  const modelo: ModeloJuridico = {
    id: randomUUID(),
    titulo: formData.get('titulo') as string,
    descricao: (formData.get('descricao') as string) || undefined,
    categoria: formData.get('categoria') as CategoriaModelo,
    tipoDocumento: formData.get('tipoDocumento') as TipoDocumento,
    area: (formData.get('area') as string) || 'Direito Imobiliário',
    status: (formData.get('status') as StatusBaseConhecimento) || 'ativo',
    versao: (formData.get('versao') as string) || '1.0',
    conteudo: formData.get('conteudo') as string,
    tags: tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : [],
    responsavel: formData.get('responsavel') as Responsavel,
    ultimaRevisao: (formData.get('ultimaRevisao') as string) || undefined,
    createdAt: now,
    updatedAt: now,
  }
  await saveModeloJuridico(modelo)
  revalidatePath('/conhecimento/modelos')
  redirect(`/conhecimento/modelos/${modelo.id}`)
}

export async function atualizarModeloJuridico(id: string, formData: FormData) {
  if (!await requireActionPermission('conhecimento:manage')) return
  const existing = await getModeloJuridicoById(id)
  if (!existing) return
  const tagsRaw = formData.get('tags') as string
  const updated: ModeloJuridico = {
    ...existing,
    titulo: formData.get('titulo') as string,
    descricao: (formData.get('descricao') as string) || undefined,
    categoria: formData.get('categoria') as CategoriaModelo,
    tipoDocumento: formData.get('tipoDocumento') as TipoDocumento,
    area: (formData.get('area') as string) || existing.area,
    status: formData.get('status') as StatusBaseConhecimento,
    versao: (formData.get('versao') as string) || existing.versao,
    conteudo: formData.get('conteudo') as string,
    tags: tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : existing.tags,
    responsavel: formData.get('responsavel') as Responsavel,
    ultimaRevisao: (formData.get('ultimaRevisao') as string) || existing.ultimaRevisao,
    updatedAt: new Date().toISOString(),
  }
  await saveModeloJuridico(updated)
  revalidatePath('/conhecimento/modelos')
  revalidatePath(`/conhecimento/modelos/${id}`)
  redirect(`/conhecimento/modelos/${id}`)
}

export async function arquivarModeloJuridico(id: string) {
  if (!await requireActionPermission('conhecimento:manage')) return
  const existing = await getModeloJuridicoById(id)
  if (!existing) return
  await saveModeloJuridico({ ...existing, status: 'arquivado', updatedAt: new Date().toISOString() })
  revalidatePath('/conhecimento/modelos')
  revalidatePath(`/conhecimento/modelos/${id}`)
  redirect('/conhecimento/modelos')
}

// ── Cláusulas Padrão ─────────────────────────────────────────────────────────

export async function criarClausulaPadrao(formData: FormData) {
  if (!await requireActionPermission('conhecimento:manage')) return
  const now = new Date().toISOString()
  const tagsRaw = formData.get('tags') as string
  const clausula: ClausulaPadrao = {
    id: randomUUID(),
    titulo: formData.get('titulo') as string,
    descricao: (formData.get('descricao') as string) || undefined,
    categoria: formData.get('categoria') as CategoriaClausula,
    area: (formData.get('area') as string) || 'Direito Imobiliário',
    aplicacao: formData.get('aplicacao') as string,
    texto: formData.get('texto') as string,
    riscos: (formData.get('riscos') as string) || undefined,
    tags: tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : [],
    status: (formData.get('status') as StatusBaseConhecimento) || 'ativo',
    responsavel: formData.get('responsavel') as Responsavel,
    ultimaRevisao: (formData.get('ultimaRevisao') as string) || undefined,
    createdAt: now,
    updatedAt: now,
  }
  await saveClausulaPadrao(clausula)
  revalidatePath('/conhecimento/clausulas')
  redirect(`/conhecimento/clausulas/${clausula.id}`)
}

export async function atualizarClausulaPadrao(id: string, formData: FormData) {
  if (!await requireActionPermission('conhecimento:manage')) return
  const existing = await getClausulaPadraoById(id)
  if (!existing) return
  const tagsRaw = formData.get('tags') as string
  const updated: ClausulaPadrao = {
    ...existing,
    titulo: formData.get('titulo') as string,
    descricao: (formData.get('descricao') as string) || undefined,
    categoria: formData.get('categoria') as CategoriaClausula,
    area: (formData.get('area') as string) || existing.area,
    aplicacao: formData.get('aplicacao') as string,
    texto: formData.get('texto') as string,
    riscos: (formData.get('riscos') as string) || undefined,
    tags: tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : existing.tags,
    status: formData.get('status') as StatusBaseConhecimento,
    responsavel: formData.get('responsavel') as Responsavel,
    ultimaRevisao: (formData.get('ultimaRevisao') as string) || existing.ultimaRevisao,
    updatedAt: new Date().toISOString(),
  }
  await saveClausulaPadrao(updated)
  revalidatePath('/conhecimento/clausulas')
  revalidatePath(`/conhecimento/clausulas/${id}`)
  redirect(`/conhecimento/clausulas/${id}`)
}

export async function arquivarClausulaPadrao(id: string) {
  if (!await requireActionPermission('conhecimento:manage')) return
  const existing = await getClausulaPadraoById(id)
  if (!existing) return
  await saveClausulaPadrao({ ...existing, status: 'arquivado', updatedAt: new Date().toISOString() })
  revalidatePath('/conhecimento/clausulas')
  revalidatePath(`/conhecimento/clausulas/${id}`)
  redirect('/conhecimento/clausulas')
}

// ── Checklists Jurídicos ─────────────────────────────────────────────────────

export async function criarChecklistJuridico(formData: FormData) {
  if (!await requireActionPermission('conhecimento:manage')) return
  const now = new Date().toISOString()
  const itensRaw = formData.get('itens') as string
  const itens: ItemChecklist[] = itensRaw
    ? itensRaw
        .split('\n')
        .map((linha) => linha.trim())
        .filter(Boolean)
        .map((texto, idx) => ({
          id: randomUUID(),
          texto,
          obrigatorio: true,
          ordem: idx + 1,
        }))
    : []
  const checklist: ChecklistJuridico = {
    id: randomUUID(),
    titulo: formData.get('titulo') as string,
    descricao: (formData.get('descricao') as string) || undefined,
    tipoDemanda: formData.get('tipoDemanda') as string,
    area: (formData.get('area') as string) || 'Direito Imobiliário',
    itens,
    status: (formData.get('status') as StatusBaseConhecimento) || 'ativo',
    responsavel: formData.get('responsavel') as Responsavel,
    ultimaRevisao: (formData.get('ultimaRevisao') as string) || undefined,
    createdAt: now,
    updatedAt: now,
  }
  await saveChecklistJuridico(checklist)
  revalidatePath('/conhecimento/checklists')
  redirect(`/conhecimento/checklists/${checklist.id}`)
}

export async function atualizarChecklistJuridico(id: string, formData: FormData) {
  if (!await requireActionPermission('conhecimento:manage')) return
  const existing = await getChecklistJuridicoById(id)
  if (!existing) return
  const itensRaw = formData.get('itens') as string
  const itens: ItemChecklist[] = itensRaw
    ? itensRaw
        .split('\n')
        .map((linha) => linha.trim())
        .filter(Boolean)
        .map((texto, idx) => ({
          id: randomUUID(),
          texto,
          obrigatorio: true,
          ordem: idx + 1,
        }))
    : existing.itens
  const updated: ChecklistJuridico = {
    ...existing,
    titulo: formData.get('titulo') as string,
    descricao: (formData.get('descricao') as string) || undefined,
    tipoDemanda: formData.get('tipoDemanda') as string,
    area: (formData.get('area') as string) || existing.area,
    itens,
    status: formData.get('status') as StatusBaseConhecimento,
    responsavel: formData.get('responsavel') as Responsavel,
    ultimaRevisao: (formData.get('ultimaRevisao') as string) || existing.ultimaRevisao,
    updatedAt: new Date().toISOString(),
  }
  await saveChecklistJuridico(updated)
  revalidatePath('/conhecimento/checklists')
  revalidatePath(`/conhecimento/checklists/${id}`)
  redirect(`/conhecimento/checklists/${id}`)
}

export async function arquivarChecklistJuridico(id: string) {
  if (!await requireActionPermission('conhecimento:manage')) return
  const existing = await getChecklistJuridicoById(id)
  if (!existing) return
  await saveChecklistJuridico({ ...existing, status: 'arquivado', updatedAt: new Date().toISOString() })
  revalidatePath('/conhecimento/checklists')
  revalidatePath(`/conhecimento/checklists/${id}`)
  redirect('/conhecimento/checklists')
}

// ── Orientações Internas ─────────────────────────────────────────────────────

export async function criarOrientacaoInterna(formData: FormData) {
  if (!await requireActionPermission('conhecimento:manage')) return
  const now = new Date().toISOString()
  const tagsRaw = formData.get('tags') as string
  const orientacao: OrientacaoInterna = {
    id: randomUUID(),
    titulo: formData.get('titulo') as string,
    descricao: (formData.get('descricao') as string) || undefined,
    area: (formData.get('area') as string) || 'Direito Imobiliário',
    tema: formData.get('tema') as string,
    conteudo: formData.get('conteudo') as string,
    tags: tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : [],
    status: (formData.get('status') as StatusBaseConhecimento) || 'ativo',
    responsavel: formData.get('responsavel') as Responsavel,
    ultimaRevisao: (formData.get('ultimaRevisao') as string) || undefined,
    createdAt: now,
    updatedAt: now,
  }
  await saveOrientacaoInterna(orientacao)
  revalidatePath('/conhecimento/orientacoes')
  redirect(`/conhecimento/orientacoes/${orientacao.id}`)
}

export async function atualizarOrientacaoInterna(id: string, formData: FormData) {
  if (!await requireActionPermission('conhecimento:manage')) return
  const existing = await getOrientacaoInternaById(id)
  if (!existing) return
  const tagsRaw = formData.get('tags') as string
  const updated: OrientacaoInterna = {
    ...existing,
    titulo: formData.get('titulo') as string,
    descricao: (formData.get('descricao') as string) || undefined,
    area: (formData.get('area') as string) || existing.area,
    tema: formData.get('tema') as string,
    conteudo: formData.get('conteudo') as string,
    tags: tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : existing.tags,
    status: formData.get('status') as StatusBaseConhecimento,
    responsavel: formData.get('responsavel') as Responsavel,
    ultimaRevisao: (formData.get('ultimaRevisao') as string) || existing.ultimaRevisao,
    updatedAt: new Date().toISOString(),
  }
  await saveOrientacaoInterna(updated)
  revalidatePath('/conhecimento/orientacoes')
  revalidatePath(`/conhecimento/orientacoes/${id}`)
  redirect(`/conhecimento/orientacoes/${id}`)
}

export async function arquivarOrientacaoInterna(id: string) {
  if (!await requireActionPermission('conhecimento:manage')) return
  const existing = await getOrientacaoInternaById(id)
  if (!existing) return
  await saveOrientacaoInterna({ ...existing, status: 'arquivado', updatedAt: new Date().toISOString() })
  revalidatePath('/conhecimento/orientacoes')
  revalidatePath(`/conhecimento/orientacoes/${id}`)
  redirect('/conhecimento/orientacoes')
}

// ── Minutas Assistidas ───────────────────────────────────────────────────────

export async function criarMinutaAssistida(formData: FormData) {
  if (!await requireActionPermission('minutas:manage')) return
  const now = new Date().toISOString()

  const modeloId = (formData.get('modeloId') as string) || undefined
  const checklistId = (formData.get('checklistId') as string) || undefined
  const clausulaIdsRaw = (formData.get('clausulaIds') as string) || ''
  const orientacaoIdsRaw = (formData.get('orientacaoIds') as string) || ''
  const clausulaIds = clausulaIdsRaw ? clausulaIdsRaw.split(',').filter(Boolean) : []
  const orientacaoIds = orientacaoIdsRaw ? orientacaoIdsRaw.split(',').filter(Boolean) : []

  const tipoDocumento = formData.get('tipoDocumento') as TipoDocumentoMinuta
  const entityType = (formData.get('entityType') as MinutaEntityType) || undefined
  const entityId = (formData.get('entityId') as string) || undefined
  const entityLabel = (formData.get('entityLabel') as string) || undefined
  const conteudoManual = (formData.get('conteudoManual') as string) || ''

  // Fetch KB items for assembly
  const [modelo, clausulas, checklist, orientacoes] = await Promise.all([
    modeloId ? getModeloJuridicoById(modeloId) : Promise.resolve(null),
    Promise.all(clausulaIds.map((cid) => getClausulaPadraoById(cid))),
    checklistId ? getChecklistJuridicoById(checklistId) : Promise.resolve(null),
    Promise.all(orientacaoIds.map((oid) => getOrientacaoInternaById(oid))),
  ])

  // Build entity context for enriched content
  let entityContext: Array<{ label: string; valor: string }> | undefined
  if (entityType && entityId) {
    if (entityType === 'oportunidade') {
      const op = await getOportunidade(entityId)
      if (op) {
        entityContext = [
          { label: 'Título', valor: op.titulo },
          { label: 'Status', valor: op.status },
          ...(op.tipoServico ? [{ label: 'Tipo de serviço', valor: op.tipoServico }] : []),
          ...(op.valorEstimado ? [{ label: 'Valor estimado', valor: `R$ ${op.valorEstimado.toLocaleString('pt-BR')}` }] : []),
          ...(op.responsavel ? [{ label: 'Responsável', valor: op.responsavel }] : []),
        ]
      }
    } else if (entityType === 'proposta') {
      const prop = await getProposta(entityId)
      if (prop) {
        entityContext = [
          { label: 'Título', valor: prop.titulo },
          { label: 'Status', valor: prop.status },
          ...(prop.tipoServico ? [{ label: 'Tipo de serviço', valor: prop.tipoServico }] : []),
          { label: 'Valor total', valor: `R$ ${prop.valorTotal.toLocaleString('pt-BR')}` },
          ...(prop.validade ? [{ label: 'Validade', valor: new Date(prop.validade).toLocaleDateString('pt-BR') }] : []),
          ...(prop.formaPagamento ? [{ label: 'Pagamento', valor: prop.formaPagamento }] : []),
        ]
      }
    } else if (entityType === 'extrajudicial') {
      const ext = await getExtrajudicial(entityId)
      if (ext) {
        entityContext = [
          { label: 'Título', valor: ext.titulo },
          { label: 'Tipo', valor: ext.tipo },
          { label: 'Status', valor: ext.status },
          { label: 'Responsável', valor: ext.responsavel },
          ...(ext.proximoPrazo ? [{ label: 'Próximo prazo', valor: new Date(ext.proximoPrazo).toLocaleDateString('pt-BR') }] : []),
        ]
      }
    } else if (entityType === 'processo') {
      const proc = await getProcesso(entityId)
      if (proc) {
        entityContext = [
          { label: 'Número', valor: proc.numero },
          { label: 'Tipo', valor: proc.tipo },
          { label: 'Status', valor: proc.status },
          { label: 'Responsável', valor: proc.responsavel },
          ...(proc.proximoPrazo ? [{ label: 'Próximo prazo', valor: new Date(proc.proximoPrazo).toLocaleDateString('pt-BR') }] : []),
        ]
      }
    } else if (entityType === 'consultoria') {
      const cons = await getConsultoria(entityId)
      if (cons) {
        entityContext = [
          { label: 'Imobiliária', valor: cons.imobiliaria },
          { label: 'Status', valor: cons.status },
          { label: 'Responsável', valor: cons.responsavel },
          ...(cons.valorMensal ? [{ label: 'Valor mensal', valor: `R$ ${cons.valorMensal.toLocaleString('pt-BR')}` }] : []),
        ]
      }
    }
  }

  const conteudo = conteudoManual.trim()
    ? conteudoManual.trim()
    : montarConteudoMinutaAssistida({
        titulo: formData.get('titulo') as string,
        tipoDocumentoLabel: formData.get('tipoDocumentoLabel') as string,
        responsavel: formData.get('responsavel') as string,
        entityLabel,
        entityContext,
        modelo: modelo ? { titulo: modelo.titulo, descricao: modelo.descricao, conteudo: modelo.conteudo } : null,
        clausulas: (clausulas.filter(Boolean) as NonNullable<typeof clausulas[0]>[]).map((c) => ({
          titulo: c.titulo,
          texto: c.texto,
          aplicacao: c.aplicacao,
          riscos: c.riscos,
        })),
        checklist: checklist
          ? {
              titulo: checklist.titulo,
              itens: checklist.itens.map((it) => ({ ordem: it.ordem, texto: it.texto, obrigatorio: it.obrigatorio })),
            }
          : null,
        orientacoes: (orientacoes.filter(Boolean) as NonNullable<typeof orientacoes[0]>[]).map((o) => ({
          titulo: o.titulo,
          conteudo: o.conteudo,
          tema: o.tema,
        })),
        observacoes: (formData.get('observacoes') as string) || undefined,
      })

  const minuta: MinutaAssistida = {
    id: randomUUID(),
    titulo: formData.get('titulo') as string,
    status: 'rascunho' as StatusMinuta,
    entityType,
    entityId,
    entityLabel,
    tipoDocumento,
    modeloId,
    modeloTitulo: modelo?.titulo,
    clausulaIds,
    checklistId,
    checklistTitulo: checklist?.titulo,
    orientacaoIds,
    conteudo,
    responsavel: formData.get('responsavel') as Responsavel,
    observacoes: (formData.get('observacoes') as string) || undefined,
    createdAt: now,
    updatedAt: now,
  }

  await saveMinutaAssistida(minuta)
  revalidatePath('/minutas')
  redirect(`/minutas/${minuta.id}`)
}

export async function atualizarStatusMinuta(id: string, formData: FormData) {
  if (!await requireActionPermission('minutas:manage')) return
  const existing = await getMinutaAssistidaById(id)
  if (!existing) return
  const novoStatus = formData.get('status') as StatusMinuta
  const now = new Date().toISOString()
  await saveMinutaAssistida({
    ...existing,
    status: novoStatus,
    responsavel: (formData.get('responsavel') as Responsavel) || existing.responsavel,
    observacoes: (formData.get('observacoes') as string) || existing.observacoes,
    revisadoEm: novoStatus === 'em_revisao' ? now : existing.revisadoEm,
    aprovadoEm: novoStatus === 'aprovada' ? now : existing.aprovadoEm,
    updatedAt: now,
  })
  revalidatePath('/minutas')
  revalidatePath(`/minutas/${id}`)
}

export async function atualizarConteudoMinutaAssistida(id: string, formData: FormData) {
  if (!await requireActionPermission('minutas:manage')) return
  const existing = await getMinutaAssistidaById(id)
  if (!existing) return
  const novoConteudo = (formData.get('conteudo') as string)?.trim()
  const novoTitulo = (formData.get('titulo') as string)?.trim()
  if (!novoConteudo) return
  await saveMinutaAssistida({
    ...existing,
    titulo: novoTitulo || existing.titulo,
    conteudo: novoConteudo,
    updatedAt: new Date().toISOString(),
  })
  revalidatePath('/minutas')
  revalidatePath(`/minutas/${id}`)
}

export async function duplicarMinutaAssistida(id: string) {
  if (!await requireActionPermission('minutas:manage')) return
  const original = await getMinutaAssistidaById(id)
  if (!original) return
  const now = new Date().toISOString()
  const novaMinuta: MinutaAssistida = {
    ...original,
    id: randomUUID(),
    titulo: `Cópia de ${original.titulo}`,
    status: 'rascunho' as StatusMinuta,
    duplicadaDeId: original.id,
    revisadoEm: undefined,
    aprovadoEm: undefined,
    createdAt: now,
    updatedAt: now,
  }
  await saveMinutaAssistida(novaMinuta)
  revalidatePath('/minutas')
  redirect(`/minutas/${novaMinuta.id}`)
}

export async function arquivarMinutaAssistida(id: string) {
  if (!await requireActionPermission('minutas:manage')) return
  const existing = await getMinutaAssistidaById(id)
  if (!existing) return
  await saveMinutaAssistida({ ...existing, status: 'arquivada', updatedAt: new Date().toISOString() })
  revalidatePath('/minutas')
  redirect('/minutas')
}

// ── Profiles — Administração ────────────────────────────────────────────────

export async function atualizarProfileRoleStatus(formData: FormData) {
  if (!await requireActionPermission('users:manage')) return
  const profileId = formData.get('profileId') as string
  if (!profileId) return
  const existing = await getProfileById(profileId)
  if (!existing) return
  await saveProfile({
    id: profileId,
    nome: (formData.get('nome') as string) || existing.nome,
    role: (formData.get('role') as UserRole) || existing.role,
    status: (formData.get('status') as UserStatus) || existing.status,
  })
  revalidatePath('/configuracoes')
}
