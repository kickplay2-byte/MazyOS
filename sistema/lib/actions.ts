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
  deleteProposta,
} from './data'
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
} from './types'

// ── Processos ───────────────────────────────────────────────────────────────

export async function criarProcesso(formData: FormData) {
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
    observacoes: (formData.get('observacoes') as string) || undefined,
    movimentacoes: [],
    createdAt: now,
    updatedAt: now,
  }
  saveProcesso(processo)
  revalidatePath('/processos')
  redirect('/processos')
}

export async function atualizarProcesso(id: string, formData: FormData) {
  const existing = getProcesso(id)
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
    observacoes: (formData.get('observacoes') as string) || undefined,
    updatedAt: new Date().toISOString(),
  }
  saveProcesso(updated)
  revalidatePath('/processos')
  revalidatePath(`/processos/${id}`)
  redirect(`/processos/${id}`)
}

export async function excluirProcesso(id: string) {
  deleteProcesso(id)
  revalidatePath('/processos')
  redirect('/processos')
}

export async function adicionarMovimentacao(id: string, formData: FormData) {
  const processo = getProcesso(id)
  if (!processo) return
  processo.movimentacoes.unshift({
    id: randomUUID(),
    data: formData.get('data') as string,
    descricao: formData.get('descricao') as string,
    tipo: formData.get('tipo') as Processo['movimentacoes'][0]['tipo'],
  })
  processo.updatedAt = new Date().toISOString()
  saveProcesso(processo)
  revalidatePath(`/processos/${id}`)
}

// ── Consultorias ────────────────────────────────────────────────────────────

export async function criarConsultoria(formData: FormData) {
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
  saveConsultoria(consultoria)
  revalidatePath('/consultorias')
  redirect('/consultorias')
}

export async function atualizarConsultoria(id: string, formData: FormData) {
  const existing = getConsultoria(id)
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
  saveConsultoria(updated)
  revalidatePath('/consultorias')
  revalidatePath(`/consultorias/${id}`)
  redirect(`/consultorias/${id}`)
}

export async function excluirConsultoria(id: string) {
  deleteConsultoria(id)
  revalidatePath('/consultorias')
  redirect('/consultorias')
}

// ── Extrajudiciais ──────────────────────────────────────────────────────────

export async function criarExtrajudicial(formData: FormData) {
  const now = new Date().toISOString()
  const extrajudicial: Extrajudicial = {
    id: randomUUID(),
    tipo: formData.get('tipo') as TipoExtrajudicial,
    titulo: formData.get('titulo') as string,
    cliente: formData.get('cliente') as string,
    responsavel: formData.get('responsavel') as Responsavel,
    status: formData.get('status') as StatusExtrajudicial,
    proximoPrazo: (formData.get('proximoPrazo') as string) || undefined,
    etapas: [],
    documentos: [],
    observacoes: (formData.get('observacoes') as string) || undefined,
    createdAt: now,
    updatedAt: now,
  }
  saveExtrajudicial(extrajudicial)
  revalidatePath('/extrajudiciais')
  redirect('/extrajudiciais')
}

export async function atualizarExtrajudicial(id: string, formData: FormData) {
  const existing = getExtrajudicial(id)
  if (!existing) return
  const updated: Extrajudicial = {
    ...existing,
    tipo: formData.get('tipo') as TipoExtrajudicial,
    titulo: formData.get('titulo') as string,
    cliente: formData.get('cliente') as string,
    responsavel: formData.get('responsavel') as Responsavel,
    status: formData.get('status') as StatusExtrajudicial,
    proximoPrazo: (formData.get('proximoPrazo') as string) || undefined,
    observacoes: (formData.get('observacoes') as string) || undefined,
    updatedAt: new Date().toISOString(),
  }
  saveExtrajudicial(updated)
  revalidatePath('/extrajudiciais')
  revalidatePath(`/extrajudiciais/${id}`)
  redirect(`/extrajudiciais/${id}`)
}

export async function excluirExtrajudicial(id: string) {
  deleteExtrajudicial(id)
  revalidatePath('/extrajudiciais')
  redirect('/extrajudiciais')
}

export async function adicionarEtapa(id: string, formData: FormData) {
  const e = getExtrajudicial(id)
  if (!e) return
  e.etapas.push({
    id: randomUUID(),
    titulo: formData.get('titulo') as string,
    concluida: false,
    prazo: (formData.get('prazo') as string) || undefined,
  })
  e.updatedAt = new Date().toISOString()
  saveExtrajudicial(e)
  revalidatePath(`/extrajudiciais/${id}`)
}

export async function toggleEtapa(demandaId: string, etapaId: string) {
  const e = getExtrajudicial(demandaId)
  if (!e) return
  const etapa = e.etapas.find((et) => et.id === etapaId)
  if (etapa) etapa.concluida = !etapa.concluida
  e.updatedAt = new Date().toISOString()
  saveExtrajudicial(e)
  revalidatePath(`/extrajudiciais/${demandaId}`)
}

export async function adicionarDocumento(id: string, formData: FormData) {
  const e = getExtrajudicial(id)
  if (!e) return
  e.documentos.push({
    id: randomUUID(),
    nome: formData.get('nome') as string,
    necessario: true,
    entregue: false,
  })
  e.updatedAt = new Date().toISOString()
  saveExtrajudicial(e)
  revalidatePath(`/extrajudiciais/${id}`)
}

export async function toggleDocumento(demandaId: string, docId: string) {
  const e = getExtrajudicial(demandaId)
  if (!e) return
  const doc = e.documentos.find((d) => d.id === docId)
  if (doc) doc.entregue = !doc.entregue
  e.updatedAt = new Date().toISOString()
  saveExtrajudicial(e)
  revalidatePath(`/extrajudiciais/${demandaId}`)
}

// ── Imobiliárias ────────────────────────────────────────────────────────────

export async function criarImobiliaria(formData: FormData) {
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
  saveImobiliaria(imobiliaria)
  revalidatePath('/comercial/imobiliarias')
  redirect('/comercial/imobiliarias')
}

export async function atualizarImobiliaria(id: string, formData: FormData) {
  const existing = getImobiliaria(id)
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
  saveImobiliaria(updated)
  revalidatePath('/comercial/imobiliarias')
  revalidatePath(`/comercial/imobiliarias/${id}`)
  redirect(`/comercial/imobiliarias/${id}`)
}

export async function desativarImobiliaria(id: string) {
  inactivateImobiliaria(id)
  revalidatePath('/comercial/imobiliarias')
  revalidatePath(`/comercial/imobiliarias/${id}`)
  redirect('/comercial/imobiliarias')
}

// ── Corretores ──────────────────────────────────────────────────────────────

export async function criarCorretor(formData: FormData) {
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
  saveCorretor(corretor)
  revalidatePath('/comercial/corretores')
  redirect('/comercial/corretores')
}

export async function atualizarCorretor(id: string, formData: FormData) {
  const existing = getCorretor(id)
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
  saveCorretor(updated)
  revalidatePath('/comercial/corretores')
  revalidatePath(`/comercial/corretores/${id}`)
  redirect(`/comercial/corretores/${id}`)
}

// ── Clientes ────────────────────────────────────────────────────────────────

export async function criarCliente(formData: FormData) {
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
  saveCliente(cliente)
  revalidatePath('/comercial/clientes')
  redirect('/comercial/clientes')
}

export async function atualizarCliente(id: string, formData: FormData) {
  const existing = getCliente(id)
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
  saveCliente(updated)
  revalidatePath('/comercial/clientes')
  revalidatePath(`/comercial/clientes/${id}`)
  redirect(`/comercial/clientes/${id}`)
}

export async function excluirCliente(id: string) {
  deleteCliente(id)
  revalidatePath('/comercial/clientes')
  redirect('/comercial/clientes')
}

// ── Oportunidades ───────────────────────────────────────────────────────────

export async function criarOportunidade(formData: FormData) {
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
  saveOportunidade(oportunidade)
  revalidatePath('/comercial/oportunidades')
  redirect(`/comercial/oportunidades/${oportunidade.id}`)
}

export async function atualizarOportunidade(id: string, formData: FormData) {
  const existing = getOportunidade(id)
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
  saveOportunidade(updated)
  revalidatePath('/comercial/oportunidades')
  revalidatePath(`/comercial/oportunidades/${id}`)
  redirect(`/comercial/oportunidades/${id}`)
}

export async function moverStatusOportunidade(id: string, status: StatusComercial) {
  const existing = getOportunidade(id)
  if (!existing) return
  saveOportunidade({ ...existing, status, updatedAt: new Date().toISOString() })
  revalidatePath('/comercial/oportunidades')
  revalidatePath(`/comercial/oportunidades/${id}`)
}

export async function registrarPerda(id: string, formData: FormData) {
  const existing = getOportunidade(id)
  if (!existing) return
  saveOportunidade({
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
  const existing = getOportunidade(id)
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
  saveOportunidade(updated)
  revalidatePath(`/comercial/oportunidades/${id}`)
}

// ── Propostas ───────────────────────────────────────────────────────────────

export async function criarProposta(formData: FormData) {
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
  saveProposta(proposta)
  revalidatePath('/comercial/propostas')
  redirect(`/comercial/propostas/${proposta.id}`)
}

export async function atualizarProposta(id: string, formData: FormData) {
  const existing = getProposta(id)
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
  saveProposta(updated)
  revalidatePath('/comercial/propostas')
  revalidatePath(`/comercial/propostas/${id}`)
  redirect(`/comercial/propostas/${id}`)
}

export async function alterarStatusProposta(id: string, status: StatusProposta) {
  const existing = getProposta(id)
  if (!existing) return
  saveProposta({ ...existing, status, updatedAt: new Date().toISOString() })
  revalidatePath('/comercial/propostas')
  revalidatePath(`/comercial/propostas/${id}`)
  redirect(`/comercial/propostas/${id}`)
}

export async function marcarPropostaAceita(id: string) {
  const existing = getProposta(id)
  if (!existing) return
  saveProposta({
    ...existing,
    status: 'aceita',
    dataAceite: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString(),
  })
  revalidatePath('/comercial/propostas')
  revalidatePath(`/comercial/propostas/${id}`)
  redirect(`/comercial/propostas/${id}`)
}

export async function marcarPropostaRecusada(id: string, formData: FormData) {
  const existing = getProposta(id)
  if (!existing) return
  saveProposta({
    ...existing,
    status: 'recusada',
    motivoRecusa: formData.get('motivoRecusa') as string,
    dataRecusa: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString(),
  })
  revalidatePath('/comercial/propostas')
  revalidatePath(`/comercial/propostas/${id}`)
  redirect(`/comercial/propostas/${id}`)
}

export async function marcarPropostaVencida(id: string) {
  const existing = getProposta(id)
  if (!existing) return
  saveProposta({
    ...existing,
    status: 'vencida',
    updatedAt: new Date().toISOString(),
  })
  revalidatePath('/comercial/propostas')
  revalidatePath(`/comercial/propostas/${id}`)
  redirect(`/comercial/propostas/${id}`)
}

export async function arquivarProposta(id: string) {
  const existing = getProposta(id)
  if (!existing) return
  saveProposta({
    ...existing,
    status: 'cancelada',
    updatedAt: new Date().toISOString(),
  })
  revalidatePath('/comercial/propostas')
  revalidatePath(`/comercial/propostas/${id}`)
  redirect('/comercial/propostas')
}
