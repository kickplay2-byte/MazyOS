import fs from 'fs'
import path from 'path'
import type { Processo, Consultoria, Extrajudicial, Imobiliaria, Corretor, Cliente, Oportunidade, Proposta, StatusProposta } from './types'

const DATA_DIR = path.join(process.cwd(), 'data')

function readJson<T>(filename: string): T {
  const file = path.join(DATA_DIR, filename)
  if (!fs.existsSync(file)) return [] as unknown as T
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as T
}

function writeJson<T>(filename: string, data: T): void {
  const file = path.join(DATA_DIR, filename)
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8')
}

// ── Processos ───────────────────────────────────────────────────────────────

export function getProcessos(): Processo[] {
  return readJson<Processo[]>('processos.json')
}

export function getProcesso(id: string): Processo | undefined {
  return getProcessos().find((p) => p.id === id)
}

export function saveProcesso(processo: Processo): void {
  const list = getProcessos()
  const idx = list.findIndex((p) => p.id === processo.id)
  if (idx >= 0) list[idx] = processo
  else list.push(processo)
  writeJson('processos.json', list)
}

export function deleteProcesso(id: string): void {
  writeJson('processos.json', getProcessos().filter((p) => p.id !== id))
}

// ── Consultorias ────────────────────────────────────────────────────────────

export function getConsultorias(): Consultoria[] {
  return readJson<Consultoria[]>('consultorias.json')
}

export function getConsultoria(id: string): Consultoria | undefined {
  return getConsultorias().find((c) => c.id === id)
}

export function saveConsultoria(c: Consultoria): void {
  const list = getConsultorias()
  const idx = list.findIndex((x) => x.id === c.id)
  if (idx >= 0) list[idx] = c
  else list.push(c)
  writeJson('consultorias.json', list)
}

export function deleteConsultoria(id: string): void {
  writeJson('consultorias.json', getConsultorias().filter((c) => c.id !== id))
}

// ── Extrajudiciais ──────────────────────────────────────────────────────────

export function getExtrajudiciais(): Extrajudicial[] {
  return readJson<Extrajudicial[]>('extrajudiciais.json')
}

export function getExtrajudicial(id: string): Extrajudicial | undefined {
  return getExtrajudiciais().find((e) => e.id === id)
}

export function saveExtrajudicial(e: Extrajudicial): void {
  const list = getExtrajudiciais()
  const idx = list.findIndex((x) => x.id === e.id)
  if (idx >= 0) list[idx] = e
  else list.push(e)
  writeJson('extrajudiciais.json', list)
}

export function deleteExtrajudicial(id: string): void {
  writeJson('extrajudiciais.json', getExtrajudiciais().filter((e) => e.id !== id))
}

// ── Imobiliárias ────────────────────────────────────────────────────────────

export function getImobiliarias(): Imobiliaria[] {
  return readJson<Imobiliaria[]>('imobiliarias.json')
}

export function getImobiliaria(id: string): Imobiliaria | undefined {
  return getImobiliarias().find((i) => i.id === id)
}

export function saveImobiliaria(imobiliaria: Imobiliaria): void {
  const list = getImobiliarias()
  const idx = list.findIndex((i) => i.id === imobiliaria.id)
  if (idx >= 0) list[idx] = imobiliaria
  else list.push(imobiliaria)
  writeJson('imobiliarias.json', list)
}

export function inactivateImobiliaria(id: string): void {
  const list = getImobiliarias()
  const idx = list.findIndex((i) => i.id === id)
  if (idx >= 0) {
    list[idx] = { ...list[idx], status: 'inativa', updatedAt: new Date().toISOString() }
    writeJson('imobiliarias.json', list)
  }
}

// ── Corretores ──────────────────────────────────────────────────────────────

export function getCorretores(): Corretor[] {
  return readJson<Corretor[]>('corretores.json')
}

export function getCorretor(id: string): Corretor | undefined {
  return getCorretores().find((c) => c.id === id)
}

export function getCorretoresByImobiliaria(imobiliariaId: string): Corretor[] {
  return getCorretores().filter((c) => c.imobiliariaId === imobiliariaId)
}

export function saveCorretor(corretor: Corretor): void {
  const list = getCorretores()
  const idx = list.findIndex((c) => c.id === corretor.id)
  if (idx >= 0) list[idx] = corretor
  else list.push(corretor)
  writeJson('corretores.json', list)
}

// ── Clientes ────────────────────────────────────────────────────────────────

export function getClientes(): Cliente[] {
  return readJson<Cliente[]>('clientes.json')
}

export function getCliente(id: string): Cliente | undefined {
  return getClientes().find((c) => c.id === id)
}

export function getClientesByCorretor(corretorId: string): Cliente[] {
  return getClientes().filter((c) => c.corretorId === corretorId)
}

export function getClientesByImobiliaria(imobiliariaId: string): Cliente[] {
  return getClientes().filter((c) => c.imobiliariaId === imobiliariaId)
}

export function saveCliente(cliente: Cliente): void {
  const list = getClientes()
  const idx = list.findIndex((c) => c.id === cliente.id)
  if (idx >= 0) list[idx] = cliente
  else list.push(cliente)
  writeJson('clientes.json', list)
}

export function deleteCliente(id: string): void {
  writeJson('clientes.json', getClientes().filter((c) => c.id !== id))
}

// ── Oportunidades ───────────────────────────────────────────────────────────

export function getOportunidades(): Oportunidade[] {
  return readJson<Oportunidade[]>('oportunidades.json')
}

export function getOportunidade(id: string): Oportunidade | undefined {
  return getOportunidades().find((o) => o.id === id)
}

export function getOportunidadesByCliente(clienteId: string): Oportunidade[] {
  return getOportunidades().filter((o) => o.clienteId === clienteId)
}

export function getOportunidadesByCorretor(corretorId: string): Oportunidade[] {
  return getOportunidades().filter((o) => o.corretorId === corretorId)
}

export function getOportunidadesByImobiliaria(imobiliariaId: string): Oportunidade[] {
  return getOportunidades().filter((o) => o.imobiliariaId === imobiliariaId)
}

export function saveOportunidade(oportunidade: Oportunidade): void {
  const list = getOportunidades()
  const idx = list.findIndex((o) => o.id === oportunidade.id)
  if (idx >= 0) list[idx] = oportunidade
  else list.push(oportunidade)
  writeJson('oportunidades.json', list)
}

export function getFollowUpsAtrasados(): Oportunidade[] {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const statusAtivos = ['novo_lead','primeiro_contato','diagnostico_pendente','diagnostico_realizado','proposta_enviada','follow_up','negociacao','contrato_enviado']
  return getOportunidades().filter((o) => {
    if (!statusAtivos.includes(o.status)) return false
    if (!o.proximoFollowUp) return false
    const d = new Date(o.proximoFollowUp)
    d.setHours(0, 0, 0, 0)
    return d <= hoje
  })
}

// ── Propostas ───────────────────────────────────────────────────────────────

export function getPropostas(): Proposta[] {
  return readJson<Proposta[]>('propostas.json')
}

export function getProposta(id: string): Proposta | undefined {
  return getPropostas().find((p) => p.id === id)
}

export function getPropostasByCliente(clienteId: string): Proposta[] {
  return getPropostas().filter((p) => p.clienteId === clienteId)
}

export function getPropostasByOportunidade(oportunidadeId: string): Proposta[] {
  return getPropostas().filter((p) => p.oportunidadeId === oportunidadeId)
}

export function getPropostasByCorretor(corretorId: string): Proposta[] {
  return getPropostas().filter((p) => p.corretorId === corretorId)
}

export function getPropostasByImobiliaria(imobiliariaId: string): Proposta[] {
  return getPropostas().filter((p) => p.imobiliariaId === imobiliariaId)
}

export function getPropostasByStatus(status: StatusProposta): Proposta[] {
  return getPropostas().filter((p) => p.status === status)
}

export function saveProposta(proposta: Proposta): void {
  const list = getPropostas()
  const idx = list.findIndex((p) => p.id === proposta.id)
  if (idx >= 0) list[idx] = proposta
  else list.push(proposta)
  writeJson('propostas.json', list)
}

export function deleteProposta(id: string): void {
  writeJson('propostas.json', getPropostas().filter((p) => p.id !== id))
}

// helpers analíticos
const STATUS_ABERTOS: StatusProposta[] = ['rascunho', 'enviada', 'em_negociacao']

export function getPropostasAbertas(): Proposta[] {
  return getPropostas().filter((p) => STATUS_ABERTOS.includes(p.status))
}

export function getPropostasAceitas(): Proposta[] {
  return getPropostasByStatus('aceita')
}

export function getPropostasRecusadas(): Proposta[] {
  return getPropostasByStatus('recusada')
}

export function getPropostasVencidas(): Proposta[] {
  return getPropostasByStatus('vencida')
}

export function getValorPropostasAbertas(): number {
  return getPropostasAbertas().reduce((s, p) => s + p.valorTotal, 0)
}

export function getValorPropostasAceitas(): number {
  return getPropostasAceitas().reduce((s, p) => s + p.valorTotal, 0)
}

export function getTaxaConversaoPropostas(): number {
  const propostas = getPropostas().filter((p) => p.status !== 'rascunho' && p.status !== 'cancelada')
  if (propostas.length === 0) return 0
  const aceitas = propostas.filter((p) => p.status === 'aceita').length
  return Math.round((aceitas / propostas.length) * 100)
}

export function getPropostasComValidadeProxima(dias = 7): Proposta[] {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const limite = new Date(hoje)
  limite.setDate(limite.getDate() + dias)
  return getPropostasAbertas().filter((p) => {
    if (!p.validade) return false
    const d = new Date(p.validade)
    d.setHours(0, 0, 0, 0)
    return d >= hoje && d <= limite
  })
}

// ── Dashboard helpers ───────────────────────────────────────────────────────

export interface PrazoAlert {
  tipo: 'processo' | 'extrajudicial'
  id: string
  titulo: string
  prazo: string
  diasRestantes: number
  responsavel: string
}

export function getPrazosProximos(dias = 7): PrazoAlert[] {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const limite = new Date(hoje)
  limite.setDate(limite.getDate() + dias)

  const alertas: PrazoAlert[] = []

  for (const p of getProcessos()) {
    for (const campo of [p.proximoPrazo, p.proximaAudiencia]) {
      if (!campo) continue
      const d = new Date(campo)
      d.setHours(0, 0, 0, 0)
      if (d >= hoje && d <= limite) {
        const diasRestantes = Math.round((d.getTime() - hoje.getTime()) / 86400000)
        alertas.push({
          tipo: 'processo',
          id: p.id,
          titulo: `${p.numero} — ${p.tipo}`,
          prazo: campo,
          diasRestantes,
          responsavel: p.responsavel,
        })
        break
      }
    }
  }

  for (const e of getExtrajudiciais()) {
    if (!e.proximoPrazo) continue
    const d = new Date(e.proximoPrazo)
    d.setHours(0, 0, 0, 0)
    if (d >= hoje && d <= limite) {
      const diasRestantes = Math.round((d.getTime() - hoje.getTime()) / 86400000)
      alertas.push({
        tipo: 'extrajudicial',
        id: e.id,
        titulo: e.titulo,
        prazo: e.proximoPrazo,
        diasRestantes,
        responsavel: e.responsavel,
      })
    }
  }

  return alertas.sort((a, b) => a.diasRestantes - b.diasRestantes)
}
