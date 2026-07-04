// Formatação de datas

export function formatDate(iso?: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR')
}

export function formatDateTime(iso?: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatMes(ym: string): string {
  const [y, m] = ym.split('-')
  return new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })
}

export function mesAtual(): string {
  return new Date().toISOString().slice(0, 7)
}

// Dias até uma data futura (negativo se passada)

export function diasAte(iso?: string | null): number | null {
  if (!iso) return null
  const d = new Date(iso)
  d.setHours(0, 0, 0, 0)
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  return Math.round((d.getTime() - hoje.getTime()) / 86400000)
}

export function prazoLabel(iso?: string | null): { texto: string; urgente: boolean } | null {
  const dias = diasAte(iso)
  if (dias === null) return null
  if (dias < 0) return { texto: `${Math.abs(dias)}d atrás`, urgente: true }
  if (dias === 0) return { texto: 'Hoje', urgente: true }
  if (dias === 1) return { texto: 'Amanhã', urgente: true }
  if (dias <= 7) return { texto: `${dias} dias`, urgente: true }
  return { texto: `${dias} dias`, urgente: false }
}

// Formatação de moeda

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Labels legíveis para status comercial

export function statusComercialLabel(status: string): string {
  const labels: Record<string, string> = {
    novo_lead: 'Novo lead',
    primeiro_contato: 'Primeiro contato',
    diagnostico_pendente: 'Diagnóstico pendente',
    diagnostico_realizado: 'Diagnóstico realizado',
    proposta_enviada: 'Proposta enviada',
    follow_up: 'Follow-up',
    negociacao: 'Negociação',
    contrato_enviado: 'Contrato enviado',
    fechado: 'Fechado',
    perdido: 'Perdido',
    nutricao: 'Nutrição',
  }
  return labels[status] ?? status
}

export function nivelRelacionamentoLabel(nivel: string): string {
  const labels: Record<string, string> = {
    estrategico: 'Estratégico',
    ativo: 'Ativo',
    neutro: 'Neutro',
    em_risco: 'Em risco',
  }
  return labels[nivel] ?? nivel
}

export function origemClienteLabel(origem: string): string {
  const labels: Record<string, string> = {
    corretor: 'Corretor',
    imobiliaria: 'Imobiliária',
    indicacao_pf: 'Indicação PF',
    direto: 'Direto',
    outro: 'Outro',
  }
  return labels[origem] ?? origem
}

export function statusPropostaLabel(status: string): string {
  const labels: Record<string, string> = {
    rascunho: 'Rascunho',
    enviada: 'Enviada',
    em_negociacao: 'Em negociação',
    aceita: 'Aceita',
    recusada: 'Recusada',
    vencida: 'Vencida',
    cancelada: 'Cancelada',
  }
  return labels[status] ?? status
}

export function formaPagamentoLabel(forma: string): string {
  const labels: Record<string, string> = {
    a_vista: 'À vista',
    entrada_mais_parcelas: 'Entrada + parcelas',
    parcelado: 'Parcelado',
    exito: 'Êxito',
    mensal: 'Mensal',
    outro: 'Outro',
  }
  return labels[forma] ?? forma
}

export function statusTarefaLabel(status: string): string {
  const labels: Record<string, string> = {
    pendente: 'Pendente',
    em_andamento: 'Em andamento',
    concluida: 'Concluída',
    cancelada: 'Cancelada',
  }
  return labels[status] ?? status
}

export function statusArquivoLabel(status: string): string {
  const labels: Record<string, string> = {
    pendente: 'Pendente',
    entregue: 'Entregue',
    aprovado: 'Aprovado',
  }
  return labels[status] ?? status
}

export function vinculoTipoLabel(tipo: string): string {
  const labels: Record<string, string> = {
    processo: 'Processo Judicial',
    extrajudicial: 'Extrajudicial',
    consultoria: 'Consultoria',
    livre: 'Livre',
  }
  return labels[tipo] ?? tipo
}

export function prioridadeLabel(prioridade: string): string {
  const labels: Record<string, string> = {
    baixa: 'Baixa',
    normal: 'Normal',
    alta: 'Alta',
    urgente: 'Urgente',
  }
  return labels[prioridade] ?? prioridade
}

// Truncar texto

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max) + '…'
}

// Iniciais de um nome (ex: "Giovanni Pianaro" → "GP")

export function iniciais(nome: string): string {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}

// ── Montador Assistido de Minutas ─────────────────────────────────────────────

export interface MontarMinutaInput {
  titulo: string
  tipoDocumentoLabel: string
  responsavel: string
  entityLabel?: string
  entityContext?: Array<{ label: string; valor: string }>
  modelo?: { titulo: string; descricao?: string; conteudo?: string } | null
  clausulas: { titulo: string; texto?: string; aplicacao?: string; riscos?: string }[]
  checklist?: { titulo: string; itens: { ordem: number; texto: string; obrigatorio?: boolean }[] } | null
  orientacoes: { titulo: string; conteudo: string; tema?: string }[]
  observacoes?: string
}

const SEP = '═'.repeat(60)
const DIV = '─'.repeat(60)

export function montarConteudoMinutaAssistida(input: MontarMinutaInput): string {
  const { titulo, tipoDocumentoLabel, responsavel, entityLabel, entityContext, modelo, clausulas, checklist, orientacoes, observacoes } = input
  const dataGeracao = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' } as Intl.DateTimeFormatOptions)

  const lines: string[] = []

  lines.push(`MINUTA ASSISTIDA — ${titulo.toUpperCase()}`)
  lines.push(SEP)
  lines.push('')
  lines.push(`Tipo de documento : ${tipoDocumentoLabel}`)
  lines.push(`Gerado em         : ${dataGeracao}`)
  lines.push(`Responsável       : ${responsavel}`)
  lines.push(`Origem            : ${entityLabel ?? 'Livre (sem vínculo)'}`)
  lines.push('')
  lines.push(SEP)
  lines.push('')

  // 0. Contexto da origem (se disponível)
  if (entityContext && entityContext.length > 0) {
    lines.push('CONTEXTO DA ORIGEM')
    lines.push(DIV)
    entityContext.forEach(({ label, valor }) => {
      lines.push(`${label.padEnd(22)}: ${valor}`)
    })
    lines.push('')
    lines.push(SEP)
    lines.push('')
  }

  // 1. Modelo base
  lines.push('1. MODELO BASE')
  lines.push(DIV)
  if (modelo) {
    lines.push(modelo.titulo)
    if (modelo.descricao) lines.push(modelo.descricao)
    if (modelo.conteudo) {
      lines.push('')
      lines.push(modelo.conteudo)
    }
  } else {
    lines.push('(Nenhum modelo selecionado)')
  }
  lines.push('')
  lines.push(SEP)
  lines.push('')

  // 2. Cláusulas
  lines.push('2. CLÁUSULAS SELECIONADAS')
  lines.push(DIV)
  if (clausulas.length > 0) {
    clausulas.forEach((c, i) => {
      lines.push(`§ ${i + 1}. ${c.titulo}`)
      if (c.aplicacao) lines.push(`   Aplicação: ${c.aplicacao}`)
      if (c.texto) {
        lines.push('')
        lines.push(c.texto)
      }
      if (c.riscos) {
        lines.push('')
        lines.push(`   ⚠ Riscos: ${c.riscos}`)
      }
      if (i < clausulas.length - 1) lines.push('')
    })
  } else {
    lines.push('(Nenhuma cláusula selecionada)')
  }
  lines.push('')
  lines.push(SEP)
  lines.push('')

  // 3. Checklist
  lines.push('3. CHECKLIST DE VERIFICAÇÃO')
  lines.push(DIV)
  if (checklist) {
    lines.push(checklist.titulo)
    lines.push('')
    const sorted = [...checklist.itens].sort((a, b) => a.ordem - b.ordem)
    sorted.forEach((item) => {
      const obrig = item.obrigatorio ? ' [OBRIGATÓRIO]' : ''
      lines.push(`[ ] ${item.texto}${obrig}`)
    })
  } else {
    lines.push('(Nenhum checklist selecionado)')
  }
  lines.push('')
  lines.push(SEP)
  lines.push('')

  // 4. Orientações
  lines.push('4. ORIENTAÇÕES APLICÁVEIS')
  lines.push(DIV)
  if (orientacoes.length > 0) {
    orientacoes.forEach((o, i) => {
      const temaLabel = o.tema ? ` [${o.tema}]` : ''
      lines.push(`▸ ${o.titulo}${temaLabel}`)
      lines.push(o.conteudo)
      if (i < orientacoes.length - 1) lines.push('')
    })
  } else {
    lines.push('(Nenhuma orientação selecionada)')
  }
  lines.push('')
  lines.push(SEP)
  lines.push('')

  // 5. Observações
  lines.push('5. OBSERVAÇÕES')
  lines.push(DIV)
  lines.push(observacoes?.trim() || '(Sem observações adicionais)')
  lines.push('')
  lines.push(SEP)
  lines.push('')

  // 6. Pontos de atenção
  lines.push('6. PONTOS DE ATENÇÃO — REVISÃO OBRIGATÓRIA')
  lines.push(DIV)
  const pontosAtencao = [
    'Conferir qualificação completa das partes.',
    'Conferir dados do imóvel/matrícula, se aplicável.',
    'Conferir valores, prazos, vencimentos e condições.',
    'Conferir responsabilidade por tributos, taxas, emolumentos e despesas.',
    'Conferir comissão de corretagem, se aplicável.',
    'Conferir riscos registrários e documentais.',
    'Conferir coerência entre proposta, contrato, anexos e documentos.',
    'Revisar juridicamente antes do envio.',
  ]
  pontosAtencao.forEach((p) => lines.push(`[ ] ${p}`))
  lines.push('')
  lines.push(SEP)
  lines.push('')

  // Aviso
  lines.push('⚠ AVISO — MINUTA DE TRABALHO')
  lines.push('Esta é uma pré-minuta assistida, elaborada a partir da Base de Conhecimento interna do')
  lines.push('escritório. O conteúdo exige revisão jurídica integral antes de qualquer envio,')
  lines.push('assinatura ou utilização.')

  return lines.join('\n')
}

// ── Helper de navegação entre entidades ──────────────────────────────────────

import type { MinutaEntityType } from './types'

export function getEntityHref(entityType: MinutaEntityType, entityId: string): string {
  const base: Record<MinutaEntityType, string> = {
    processo: '/processos',
    extrajudicial: '/extrajudiciais',
    consultoria: '/consultorias',
    oportunidade: '/comercial/oportunidades',
    proposta: '/comercial/propostas',
  }
  return `${base[entityType]}/${entityId}`
}
