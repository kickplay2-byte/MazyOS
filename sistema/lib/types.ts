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
  clienteId?: string
  imobiliariaId?: string
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

// ── Tarefas ─────────────────────────────────────────────────────────────────

export type StatusTarefa = 'pendente' | 'em_andamento' | 'concluida' | 'cancelada'

export const STATUS_TAREFA: StatusTarefa[] = ['pendente', 'em_andamento', 'concluida', 'cancelada']

export type VinculoTipo = 'processo' | 'extrajudicial' | 'consultoria' | 'livre'

export const VINCULOS_TIPO: VinculoTipo[] = ['processo', 'extrajudicial', 'consultoria', 'livre']

export interface Tarefa {
  id: string
  titulo: string
  descricao?: string
  responsavel: Responsavel
  status: StatusTarefa
  prioridade: Prioridade
  prazo?: string
  vinculoTipo: VinculoTipo
  vinculoId?: string
  createdAt: string
  updatedAt: string
}

// ── Dashboard Executivo ─────────────────────────────────────────────────────

export type NivelAlerta = 'critico' | 'alerta' | 'info'
export type TipoAlerta = 'prazo' | 'followup' | 'inadimplencia' | 'tarefa' | 'proposta'

export interface AlertaExecutivo {
  id: string
  tipo: TipoAlerta
  nivel: NivelAlerta
  titulo: string
  descricao: string
  href: string
}

export interface RankingImobiliaria {
  imobiliariaId: string
  nome: string
  totalOportunidades: number
  oportunidadesAbertas: number
  propostasAceitas: number
  faturamentoFechado: number
  faturamentoPipeline: number
  temConsultoria: boolean
}

export interface RankingCorretor {
  corretorId: string
  nome: string
  imobiliariaNome: string
  totalOportunidades: number
  faturamentoFechado: number
  faturamentoPipeline: number
}

export type TipoProximaAcao = 'followup' | 'prazo_tarefa' | 'prazo_processo' | 'prazo_extrajudicial' | 'audiencia' | 'proposta_vencendo'

export interface ProximaAcao {
  id: string
  tipo: TipoProximaAcao
  titulo: string
  data: string
  responsavel: string
  href: string
}

// ── Autenticação / Perfis ───────────────────────────────────────────────────

export type UserRole = 'admin' | 'advogado' | 'assistente' | 'comercial'

export const USER_ROLES: UserRole[] = ['admin', 'advogado', 'assistente', 'comercial']

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  advogado: 'Advogado',
  assistente: 'Assistente',
  comercial: 'Comercial',
}

export type UserStatus = 'ativo' | 'inativo'

export interface Profile {
  id: string
  nome: string
  email: string
  role: UserRole
  status: UserStatus
  created_at: string
  updated_at: string
}

// ── Base de Conhecimento ────────────────────────────────────────────────────

export type StatusBaseConhecimento = 'ativo' | 'rascunho' | 'em_revisao' | 'desatualizado' | 'arquivado'

export const STATUS_BASE_CONHECIMENTO: StatusBaseConhecimento[] = [
  'ativo',
  'rascunho',
  'em_revisao',
  'desatualizado',
  'arquivado',
]

export const STATUS_BASE_CONHECIMENTO_LABELS: Record<StatusBaseConhecimento, string> = {
  ativo: 'Ativo',
  rascunho: 'Rascunho',
  em_revisao: 'Em revisão',
  desatualizado: 'Desatualizado',
  arquivado: 'Arquivado',
}

// ── Modelos Jurídicos ────────────────────────────────────────────────────────

export type CategoriaModelo =
  | 'contrato'
  | 'notificacao'
  | 'proposta'
  | 'peticao'
  | 'parecer'
  | 'checklist'
  | 'orientacao'
  | 'clausula'
  | 'outro'

export const CATEGORIAS_MODELO: CategoriaModelo[] = [
  'contrato',
  'notificacao',
  'proposta',
  'peticao',
  'parecer',
  'checklist',
  'orientacao',
  'clausula',
  'outro',
]

export const CATEGORIA_MODELO_LABELS: Record<CategoriaModelo, string> = {
  contrato: 'Contrato',
  notificacao: 'Notificação',
  proposta: 'Proposta',
  peticao: 'Petição',
  parecer: 'Parecer',
  checklist: 'Checklist',
  orientacao: 'Orientação',
  clausula: 'Cláusula',
  outro: 'Outro',
}

export type TipoDocumento =
  | 'compra_venda'
  | 'locacao'
  | 'administracao_imoveis'
  | 'permuta'
  | 'incorporacao'
  | 'loteamento'
  | 'distrato'
  | 'notificacao_extrajudicial'
  | 'inventario'
  | 'usucapiao'
  | 'adjudicacao'
  | 'cobranca'
  | 'processo_judicial'
  | 'consultoria'
  | 'outro'

export const TIPOS_DOCUMENTO: TipoDocumento[] = [
  'compra_venda',
  'locacao',
  'administracao_imoveis',
  'permuta',
  'incorporacao',
  'loteamento',
  'distrato',
  'notificacao_extrajudicial',
  'inventario',
  'usucapiao',
  'adjudicacao',
  'cobranca',
  'processo_judicial',
  'consultoria',
  'outro',
]

export const TIPO_DOCUMENTO_LABELS: Record<TipoDocumento, string> = {
  compra_venda: 'Compra e Venda',
  locacao: 'Locação',
  administracao_imoveis: 'Administração de Imóveis',
  permuta: 'Permuta',
  incorporacao: 'Incorporação',
  loteamento: 'Loteamento',
  distrato: 'Distrato',
  notificacao_extrajudicial: 'Notificação Extrajudicial',
  inventario: 'Inventário',
  usucapiao: 'Usucapião',
  adjudicacao: 'Adjudicação',
  cobranca: 'Cobrança',
  processo_judicial: 'Processo Judicial',
  consultoria: 'Consultoria',
  outro: 'Outro',
}

export interface ModeloJuridico {
  id: string
  titulo: string
  descricao?: string
  categoria: CategoriaModelo
  tipoDocumento: TipoDocumento
  area: string
  status: StatusBaseConhecimento
  versao: string
  conteudo: string
  tags: string[]
  responsavel: Responsavel
  ultimaRevisao?: string
  createdAt: string
  updatedAt: string
}

// ── Cláusulas Padrão ─────────────────────────────────────────────────────────

export type CategoriaClausula =
  | 'pagamento'
  | 'posse'
  | 'financiamento'
  | 'arras'
  | 'corretagem'
  | 'multa'
  | 'rescisao'
  | 'condicao_resolutiva'
  | 'alienacao_fiduciaria'
  | 'hipoteca'
  | 'permuta'
  | 'prazo'
  | 'declaracoes'
  | 'responsabilidade'
  | 'confidencialidade'
  | 'outro'

export const CATEGORIAS_CLAUSULA: CategoriaClausula[] = [
  'pagamento',
  'posse',
  'financiamento',
  'arras',
  'corretagem',
  'multa',
  'rescisao',
  'condicao_resolutiva',
  'alienacao_fiduciaria',
  'hipoteca',
  'permuta',
  'prazo',
  'declaracoes',
  'responsabilidade',
  'confidencialidade',
  'outro',
]

export const CATEGORIA_CLAUSULA_LABELS: Record<CategoriaClausula, string> = {
  pagamento: 'Pagamento',
  posse: 'Posse',
  financiamento: 'Financiamento',
  arras: 'Arras',
  corretagem: 'Corretagem',
  multa: 'Multa',
  rescisao: 'Rescisão',
  condicao_resolutiva: 'Condição Resolutiva',
  alienacao_fiduciaria: 'Alienação Fiduciária',
  hipoteca: 'Hipoteca',
  permuta: 'Permuta',
  prazo: 'Prazo',
  declaracoes: 'Declarações',
  responsabilidade: 'Responsabilidade',
  confidencialidade: 'Confidencialidade',
  outro: 'Outro',
}

export interface ClausulaPadrao {
  id: string
  titulo: string
  descricao?: string
  categoria: CategoriaClausula
  area: string
  aplicacao: string
  texto: string
  riscos?: string
  tags: string[]
  status: StatusBaseConhecimento
  responsavel: Responsavel
  ultimaRevisao?: string
  createdAt: string
  updatedAt: string
}

// ── Checklists Jurídicos ─────────────────────────────────────────────────────

export interface ItemChecklist {
  id: string
  texto: string
  obrigatorio: boolean
  ordem: number
  observacao?: string
}

export interface ChecklistJuridico {
  id: string
  titulo: string
  descricao?: string
  tipoDemanda: string
  area: string
  itens: ItemChecklist[]
  status: StatusBaseConhecimento
  responsavel: Responsavel
  ultimaRevisao?: string
  createdAt: string
  updatedAt: string
}

// ── Orientações Internas ─────────────────────────────────────────────────────

export interface OrientacaoInterna {
  id: string
  titulo: string
  descricao?: string
  area: string
  tema: string
  conteudo: string
  tags: string[]
  status: StatusBaseConhecimento
  responsavel: Responsavel
  ultimaRevisao?: string
  createdAt: string
  updatedAt: string
}

// ── Minutas Assistidas ──────────────────────────────────────────────────────

export type StatusMinuta = 'rascunho' | 'em_revisao' | 'aprovada' | 'arquivada'

export const STATUS_MINUTA: StatusMinuta[] = ['rascunho', 'em_revisao', 'aprovada', 'arquivada']

export const STATUS_MINUTA_LABELS: Record<StatusMinuta, string> = {
  rascunho: 'Rascunho',
  em_revisao: 'Em revisão',
  aprovada: 'Aprovada',
  arquivada: 'Arquivada',
}

export type TipoDocumentoMinuta =
  | 'compra_e_venda'
  | 'locacao'
  | 'inventario'
  | 'compromisso'
  | 'procuracao'
  | 'notificacao'
  | 'parecer'
  | 'outro'

export const TIPOS_DOCUMENTO_MINUTA: TipoDocumentoMinuta[] = [
  'compra_e_venda',
  'locacao',
  'inventario',
  'compromisso',
  'procuracao',
  'notificacao',
  'parecer',
  'outro',
]

export const TIPO_DOCUMENTO_MINUTA_LABELS: Record<TipoDocumentoMinuta, string> = {
  compra_e_venda: 'Compra e Venda',
  locacao: 'Locação',
  inventario: 'Inventário',
  compromisso: 'Compromisso de Compra e Venda',
  procuracao: 'Procuração',
  notificacao: 'Notificação Extrajudicial',
  parecer: 'Parecer Jurídico',
  outro: 'Outro',
}

export type MinutaEntityType = 'processo' | 'extrajudicial' | 'consultoria' | 'oportunidade' | 'proposta'

export const MINUTA_ENTITY_TYPES: MinutaEntityType[] = [
  'processo',
  'extrajudicial',
  'consultoria',
  'oportunidade',
  'proposta',
]

export const MINUTA_ENTITY_TYPE_LABELS: Record<MinutaEntityType, string> = {
  processo: 'Processo Judicial',
  extrajudicial: 'Demanda Extrajudicial',
  consultoria: 'Consultoria Mensal',
  oportunidade: 'Oportunidade',
  proposta: 'Proposta',
}

export interface MinutaAssistida {
  id: string
  titulo: string
  status: StatusMinuta
  entityType?: MinutaEntityType
  entityId?: string
  entityLabel?: string
  tipoDocumento: TipoDocumentoMinuta
  modeloId?: string
  modeloTitulo?: string
  clausulaIds: string[]
  checklistId?: string
  checklistTitulo?: string
  orientacaoIds: string[]
  conteudo: string
  responsavel: Responsavel
  observacoes?: string
  duplicadaDeId?: string
  revisadoEm?: string
  aprovadoEm?: string
  createdAt: string
  updatedAt: string
}

// ── Documentos / Arquivos ───────────────────────────────────────────────────

export type StatusArquivo = 'pendente' | 'entregue' | 'aprovado'

export const STATUS_ARQUIVO: StatusArquivo[] = ['pendente', 'entregue', 'aprovado']

export interface Arquivo {
  id: string
  nome: string
  url?: string
  descricao?: string
  status: StatusArquivo
  vinculoTipo: 'processo' | 'extrajudicial' | 'consultoria'
  vinculoId: string
  createdAt: string
  updatedAt: string
}
