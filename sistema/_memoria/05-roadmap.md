# 05 — Roadmap do PIPE OS

## Fase 1 — Fundação ✅ (em andamento)

**Objetivo:** Estabelecer a base técnica e organizacional do sistema.

**Entregáveis:**
- [x] Projeto Next.js 16 inicializado
- [x] Tailwind configurado com identidade VSADV
- [x] `lib/types.ts` centralizado
- [x] `lib/data.ts` centralizado
- [x] `lib/actions.ts` centralizado
- [x] Sidebar com navegação base
- [x] Componente StatusBadge
- [x] Módulo Processos Judiciais (lista + novo + detalhe + movimentações)
- [x] Módulo Consultoria Mensal (lista + novo + detalhe)
- [x] Módulo Demandas Extrajudiciais (lista + novo + detalhe + etapas + documentos)
- [x] Dashboard base com alertas de prazo
- [x] Arquivos _memoria do PIPE OS
- [x] CLAUDE.md do PIPE OS
- [ ] Componentes UI reutilizáveis (Card, PageHeader, EmptyState, DataTable)
- [ ] `lib/utils.ts` com funções compartilhadas
- [ ] Tipos expandidos (Imobiliária, Corretor, Cliente, Oportunidade, Proposta)
- [ ] JSONs de fundação para novas entidades

---

## Fase 2 — CRM Comercial

**Objetivo:** Base de dados de contas, canais e clientes.

**Entregáveis:**
- [ ] Módulo Imobiliárias (lista + detalhe + edição)
  - Campos: nome, CNPJ, cidade, responsável, status, valor mensal, última interação, próxima ação
  - Corretores vinculados (sub-lista)
  - Demandas geradas (sub-lista)
- [ ] Módulo Corretores (lista + detalhe)
  - Campos: nome, imobiliária, CRECI, telefone, nível de relacionamento, indicações, faturamento gerado
  - Histórico de interações
- [ ] Módulo Clientes (lista + detalhe)
  - Campos: nome, CPF/CNPJ, contato, origem, corretor, imobiliária
  - Demandas vinculadas
- [ ] Sidebar expandida com seção "Comercial"
- [ ] Vínculo imobiliária → corretores → clientes funcionando

---

## Fase 3 — Pipeline Comercial

**Objetivo:** Controle de oportunidades do diagnóstico ao fechamento.

**Entregáveis:**
- [ ] Módulo Oportunidades (lista + kanban + detalhe)
  - Kanban com colunas por status comercial
  - Cards com título, cliente, valor, responsável, prazo de follow-up
  - Filtros por responsável, imobiliária, status
- [ ] Histórico de interações por oportunidade (log de ações)
- [ ] Alerta de follow-up atrasado no dashboard
- [ ] Motivo de perda registrado e consultável
- [ ] Dashboard: funil de conversão (leads → fechamentos)

---

## Fase 4 — Propostas e Honorários

**Objetivo:** Controle do ciclo de proposta até aceite.

**Entregáveis:**
- [ ] Módulo Propostas (lista + criação + visualização)
  - Campos: escopo, valor total, entrada, parcelas, validade, status
  - Vínculo com oportunidade
  - Status: rascunho → enviada → aceita/recusada/expirada
- [ ] Geração de HTML/PDF da proposta (template com identidade VSADV)
- [ ] Fluxo: proposta aceita → abre demanda jurídica automaticamente
- [ ] Dashboard: valor em propostas abertas, taxa de conversão

---

## Fase 5 — Demandas Jurídicas (expansão)

**Objetivo:** Integrar o módulo jurídico ao modelo relacional completo.

**Entregáveis:**
- [ ] Vincular demandas extrajudiciais a Cliente + Corretor + Imobiliária + Oportunidade + Proposta
- [ ] Vincular processos judiciais a Cliente + Imobiliária
- [ ] Módulo de Tarefas (lista + kanban por responsável)
  - Tarefas vinculadas a demandas ou processos
  - Prazo, responsável, status
- [ ] Módulo Documentos (repositório por demanda)
  - Upload (Google Drive / link externo)
  - Status: pendente / entregue / aprovado
- [ ] Status jurídicos granulares implementados

---

## Fase 6 — Dashboard Gerencial

**Objetivo:** Inteligência de negócio para tomada de decisão.

**Entregáveis:**
- [ ] KPIs comerciais: leads recebidos, propostas enviadas, taxa de conversão, valor fechado
- [ ] KPIs jurídicos: demandas abertas, atrasadas, prazos críticos
- [ ] Ranking de corretores (por indicações e faturamento)
- [ ] Ranking de imobiliárias (por volume e faturamento)
- [ ] Oportunidades paradas há mais de X dias
- [ ] Propostas sem resposta há mais de 7 dias
- [ ] Faturamento estimado vs. realizado

---

## Fase 7 — IA / Advisor

**Objetivo:** Inteligência artificial integrada à operação.

**Entregáveis:**
- [ ] Resumo automático de demanda (IA lê campos e escreve síntese)
- [ ] Sugestão de checklist por tipo de demanda
- [ ] Sugestão de próximo follow-up com base no histórico
- [ ] Rascunho de resposta para corretor com base no contexto
- [ ] Análise de oportunidade (risco, probabilidade, valor)
- [ ] Alertas executivos (o que merece atenção hoje?)
- [ ] Advisor de crescimento (sugestões baseadas nos dados do escritório)
