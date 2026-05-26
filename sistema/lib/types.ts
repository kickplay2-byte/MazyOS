export type Responsavel = 'Giovanni' | 'Enrico' | 'Jaqueline' | 'Pedro' | 'Maria' | 'Giovana'

export const RESPONSAVEIS: Responsavel[] = ['Giovanni', 'Enrico', 'Jaqueline', 'Pedro', 'Maria', 'Giovana']

// ── Processos Judiciais ─────────────────────────────────────────────────────

export type StatusProcesso =
  | 'Em andamento'
  | 'Aguardando movimento'
  | 'Recurso'
  | 'Suspenso'
  | 'Encerrado'

export const STATUS_PROCESSO: StatusProcesso[] = [
  'Em andamento',
  'Aguardando movimento',
  'Recurso',
  'Suspenso',
  'Encerrado',
]

export type TipoMovimentacao = 'audiencia' | 'prazo' | 'despacho' | 'peticao' | 'outro'

export interface Movimentacao {
  id: string
  data: string
  descricao: string
  tipo: TipoMovimentacao
}

export interface Processo {
  id: string
  numero: string
  tipo: string
  vara: string
  tribunal: string
  autor: string
  reu: string
  responsavel: Responsavel
  status: StatusProcesso
  proximaAudiencia?: string
  proximoPrazo?: string
  faseAtual: string
  cliente?: string
  observacoes?: string
  movimentacoes: Movimentacao[]
  createdAt: string
  updatedAt: string
}

// ── Consultoria Mensal ──────────────────────────────────────────────────────

export type StatusConsultoria = 'Em dia' | 'Pendente entrega' | 'Inadimplente' | 'Inativa'

export const STATUS_CONSULTORIA: StatusConsultoria[] = [
  'Em dia',
  'Pendente entrega',
  'Inadimplente',
  'Inativa',
]

export interface EntregaMensal {
  id: string
  mes: string
  status: 'Realizada' | 'Pendente' | 'Atrasada'
  observacao?: string
}

export interface Consultoria {
  id: string
  imobiliaria: string
  responsavel: Responsavel
  status: StatusConsultoria
  valorMensal: number
  dataRenovacao?: string
  escopo: string[]
  historico: EntregaMensal[]
  observacoes?: string
  createdAt: string
  updatedAt: string
}

// ── Demandas Extrajudiciais ─────────────────────────────────────────────────

export type TipoExtrajudicial =
  | 'Due diligence'
  | 'Parecer'
  | 'Análise contratual'
  | 'Regularização'
  | 'Usucapião'
  | 'Inventário'
  | 'Outro'

export const TIPOS_EXTRAJUDICIAL: TipoExtrajudicial[] = [
  'Due diligence',
  'Parecer',
  'Análise contratual',
  'Regularização',
  'Usucapião',
  'Inventário',
  'Outro',
]

export type StatusExtrajudicial =
  | 'Aberta'
  | 'Em andamento'
  | 'Aguardando cliente'
  | 'Aguardando terceiro'
  | 'Concluída'
  | 'Arquivada'

export const STATUS_EXTRAJUDICIAL: StatusExtrajudicial[] = [
  'Aberta',
  'Em andamento',
  'Aguardando cliente',
  'Aguardando terceiro',
  'Concluída',
  'Arquivada',
]

export interface Etapa {
  id: string
  titulo: string
  concluida: boolean
  prazo?: string
  observacao?: string
}

export interface Documento {
  id: string
  nome: string
  necessario: boolean
  entregue: boolean
}

export interface Extrajudicial {
  id: string
  tipo: TipoExtrajudicial
  titulo: string
  // legado: campo livre — migrar para clienteId quando módulo Clientes existir
  cliente: string
  clienteId?: string
  corretorId?: string
  imobiliariaId?: string
  oportunidadeId?: string
  propostaId?: string
  responsavel: Responsavel
  status: StatusExtrajudicial
  prioridade?: Prioridade
  proximoPrazo?: string
  etapas: Etapa[]
  documentos: Documento[]
  observacoes?: string
  createdAt: string
  updatedAt: string
}

// ── Prioridade (compartilhada) ──────────────────────────────────────────────

export type Prioridade = 'baixa' | 'normal' | 'alta' | 'urgente'

export const PRIORIDADES: Prioridade[] = ['baixa', 'normal', 'alta', 'urgente']

// ── Imobiliárias ────────────────────────────────────────────────────────────

export type StatusImobiliaria = 'ativa' | 'inativa' | 'suspensa' | 'prospect'

export const STATUS_IMOBILIARIA: StatusImobiliaria[] = ['ativa', 'inativa', 'suspensa', 'prospect']

export type NivelRelacionamento = 'estrategico' | 'ativo' | 'neutro' | 'em_risco'

export const NIVEIS_RELACIONAMENTO: NivelRelacionamento[] = [
  'estrategico',
  'ativo',
  'neutro',
  'em_risco',
]

export interface Imobiliaria {
  id: string
  nome: string
  cnpj?: string
  cidade?: string
  endereco?: string
  responsavel: Responsavel
  telefone?: string
  email?: string
  status: StatusImobiliaria
  valorMensal: number
  dataInicio?: string
  dataRenovacao?: string
  nivelRelacionamento: NivelRelacionamento
  ultimaInteracao?: string
  proximaAcao?: string
  proximaAcaoData?: string
  observacoes?: string
  createdAt: string
  updatedAt: string
}

// ── Corretores ──────────────────────────────────────────────────────────────

export type StatusCorretor = 'ativo' | 'inativo'

export const STATUS_CORRETOR: StatusCorretor[] = ['ativo', 'inativo']

export interface Corretor {
  id: string
  imobiliariaId: string
  nome: string
  telefone?: string
  email?: string
  creci?: string
  status: StatusCorretor
  nivelRelacionamento: NivelRelacionamento
  quantidadeIndicacoes: number
  faturamentoGerado: number
  ultimaInteracao?: string
  proximaAcao?: string
  proximaAcaoData?: string
  observacoes?: string
  createdAt: string
  updatedAt: string
}

// ── Clientes ────────────────────────────────────────────────────────────────

export type OrigemCliente = 'corretor' | 'imobiliaria' | 'indicacao_pf' | 'direto' | 'outro'

export const ORIGENS_CLIENTE: OrigemCliente[] = [
  'corretor',
  'imobiliaria',
  'indicacao_pf',
  'direto',
  'outro',
]

export interface Cliente {
  id: string
  nome: string
  documento?: string
  telefone?: string
  email?: string
  origem: OrigemCliente
  corretorId?: string
  imobiliariaId?: string
  observacoes?: string
  createdAt: string
  updatedAt: string
}

// ── Oportunidades ───────────────────────────────────────────────────────────

export type StatusComercial =
  | 'novo_lead'
  | 'primeiro_contato'
  | 'diagnostico_pendente'
  | 'diagnostico_realizado'
  | 'proposta_enviada'
  | 'follow_up'
  | 'negociacao'
  | 'contrato_enviado'
  | 'fechado'
  | 'perdido'
  | 'nutricao'

export const STATUS_COMERCIAL: StatusComercial[] = [
  'novo_lead',
  'primeiro_contato',
  'diagnostico_pendente',
  'diagnostico_realizado',
  'proposta_enviada',
  'follow_up',
  'negociacao',
  'contrato_enviado',
  'fechado',
  'perdido',
  'nutricao',
]

export const STATUS_COMERCIAL_LABELS: Record<StatusComercial, string> = {
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

export type TipoInteracao = 'ligacao' | 'whatsapp' | 'email' | 'reuniao' | 'proposta' | 'outro'

export interface Interacao {
  id: string
  data: string
  tipo: TipoInteracao
  descricao: string
  responsavel: Responsavel
}

export interface Oportunidade {
  id: string
  titulo: string
  clienteId: string
  corretorId?: string
  imobiliariaId?: string
  tipoServico?: TipoExtrajudicial
  status: StatusComercial
  valorEstimado?: number
  probabilidade?: number
  responsavel: Responsavel
  proximoFollowUp?: string
  origem?: string
  observacoes?: string
  motivoPerda?: string
  interacoes: Interacao[]
  createdAt: string
  updatedAt: string
}

// ── Propostas ───────────────────────────────────────────────────────────────

export type StatusProposta =
  | 'rascunho'
  | 'enviada'
  | 'em_negociacao'
  | 'aceita'
  | 'recusada'
  | 'vencida'
  | 'cancelada'

export const STATUS_PROPOSTA: StatusProposta[] = [
  'rascunho',
  'enviada',
  'em_negociacao',
  'aceita',
  'recusada',
  'vencida',
  'cancelada',
]

export type FormaPagamento =
  | 'a_vista'
  | 'entrada_mais_parcelas'
  | 'parcelado'
  | 'exito'
  | 'mensal'
  | 'outro'

export const FORMAS_PAGAMENTO: FormaPagamento[] = [
  'a_vista',
  'entrada_mais_parcelas',
  'parcelado',
  'exito',
  'mensal',
  'outro',
]

export interface Proposta {
  id: string
  oportunidadeId?: string
  clienteId: string
  corretorId?: string
  imobiliariaId?: string
  titulo: string
  tipoServico?: TipoExtrajudicial
  escopo: string[]
  valorTotal: number
  valorEntrada?: number
  quantidadeParcelas?: number
  valorParcela?: number
  formaPagamento?: FormaPagamento
  status: StatusProposta
  validade?: string
  dataEnvio?: string
  dataAceite?: string
  dataRecusa?: string
  motivoRecusa?: string
  responsavel: Responsavel
  observacoes?: string
  createdAt: string
  updatedAt: string
}
