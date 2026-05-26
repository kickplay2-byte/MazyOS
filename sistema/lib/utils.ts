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
