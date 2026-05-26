@AGENTS.md

---

# PIPE OS — Constituição do Sistema

> Sistema operacional jurídico-comercial da Vieira da Silva Advocacia.
> Leia este arquivo inteiro antes de qualquer implementação.

---

## O que é o PIPE OS

PIPE OS é o sistema interno da área imobiliária do escritório Vieira da Silva Advocacia. Não é apenas um software jurídico — é um sistema jurídico-comercial que integra:

- **Comercial:** imobiliárias (contas estratégicas), corretores (canal de aquisição), clientes, oportunidades, propostas de honorários
- **Jurídico:** demandas extrajudiciais, consultorias mensais recorrentes, processos judiciais
- **Gestão:** tarefas, prazos, documentos, relacionamento
- **Inteligência:** dashboard executivo com KPIs (IA advisor em Fase 7)

**Premissa central:** Todo corretor é um canal. Todo cliente é uma oportunidade. Toda oportunidade precisa de pipeline. Todo pipeline precisa de follow-up. Todo follow-up precisa de sistema.

---

## Contexto do negócio

- **Escritório:** Vieira da Silva Advocacia — direito imobiliário, empresarial e família
- **Operador:** Giovanni Pianaro (sócio, 27 anos, área imobiliária)
- **Equipe imobiliária:** Giovanni, Enrico, Jaqueline, Pedro, Maria, Giovana
- **Clientes:** 34 imobiliárias parceiras + ~500 corretores + clientes PF indicados
- **Faturamento atual:** ~R$ 40k/mês | **Meta:** R$ 1,5–2M/ano
- **Gargalo:** operação manual, sem pipeline, sem CRM, sem alertas

---

## Módulos do sistema (14 no total)

| # | Módulo | Fase | Status |
|---|--------|------|--------|
| 1 | Dashboard Executivo | Fase 1 | Base funcional |
| 2 | Imobiliárias | Fase 2 | A construir |
| 3 | Corretores | Fase 2 | A construir |
| 4 | Clientes | Fase 2 | A construir |
| 5 | Oportunidades | Fase 3 | A construir |
| 6 | Propostas de Honorários | Fase 4 | A construir |
| 7 | Demandas Extrajudiciais | Fase 1 | ✅ Funcional |
| 8 | Consultoria Mensal | Fase 1 | ✅ Funcional |
| 9 | Processos Judiciais | Fase 1 | ✅ Funcional |
| 10 | Tarefas e Checklists | Fase 5 | A construir |
| 11 | Documentos | Fase 5 | A construir |
| 12 | Relacionamento | Fase 5 | A construir |
| 13 | Dashboard Gerencial | Fase 6 | A construir |
| 14 | IA / Advisor | Fase 7 | A construir |

---

## Arquitetura do projeto

```
sistema/
  app/                    ← rotas Next.js (App Router, um diretório por módulo)
  components/
    ui/                   ← componentes atômicos reutilizáveis (StatusBadge, Card, etc.)
  lib/
    types.ts              ← TODOS os tipos TypeScript centralizados aqui
    data.ts               ← TODOS os CRUDs (leitura/escrita JSON)
    actions.ts            ← TODOS os Server Actions ('use server')
    utils.ts              ← funções utilitárias compartilhadas
  data/
    *.json                ← dados mockados (um arquivo por entidade)
  _memoria/               ← documentação viva do sistema
```

**Stack:** Next.js 16 / TypeScript / Tailwind CSS / JSON local → migração futura Supabase

---

## Identidade visual

- **Background sidebar:** `#1F2346` (azul marinho)
- **Accent / CTA / ativo:** `#DFA568` (dourado)
- **Background app:** `#f5f4f1` (off-white)
- **Cards:** `bg-white border border-gray-200 rounded`
- **Border-radius:** mínimo (máx `rounded`, 4px)
- **Sombras:** nenhuma ou `shadow-sm`
- **Fontes:** Questrial (corpo), sem fontes externas por enquanto
- **Nunca:** vermelho/verde como cor de marca — só em badges de status

---

## Regras de desenvolvimento

**Antes de qualquer implementação:**
1. Ler `_memoria/04-regras-do-sistema.md`
2. Ler `_memoria/06-modelo-de-dados.md`
3. Verificar se o tipo já existe em `lib/types.ts`
4. Verificar se o componente já existe em `components/`
5. Verificar qual fase do roadmap está sendo executada (`_memoria/05-roadmap.md`)

**Regras invioláveis:**
- Tipos sempre em `lib/types.ts` — nunca em arquivos de página ou componente
- CRUDs sempre em `lib/data.ts` — nunca em Server Actions ou componentes
- Dados mockados sempre em `data/*.json` — nunca hardcoded em páginas
- Mutações sempre via Server Actions em `lib/actions.ts`
- Componentes sempre reutilizáveis — nunca reescrever card, badge ou tabela inline
- Não quebrar módulos existentes ao adicionar novos

**O que não fazer neste projeto:**
- ❌ Supabase/PostgreSQL (ainda não)
- ❌ IA/LLM integrada (Fase 7)
- ❌ Bibliotecas de UI externas (sem shadcn, MUI, etc.)
- ❌ Autenticação/login (sistema interno por ora)
- ❌ Dados espalhados em páginas
- ❌ Tipos locais em componentes

---

## Modelo de dados resumido

**Entidades existentes:** Processo, Consultoria, Extrajudicial
**Entidades a construir:** Imobiliaria, Corretor, Cliente, Oportunidade, Proposta

**Relacionamento central:**
```
Imobiliaria → Corretor → Cliente → Oportunidade → Proposta → Demanda Jurídica
```

Ver detalhes completos em `_memoria/06-modelo-de-dados.md`.

---

## Status dos módulos existentes

### Processos Judiciais (`app/processos/`)
- Lista com filtro ativo/encerrado
- Detalhe com edição e histórico de movimentações
- Formulário de criação

### Consultoria Mensal (`app/consultorias/`)
- Lista com status do mês atual e total mensal
- Detalhe com escopo, histórico e edição

### Demandas Extrajudiciais (`app/extrajudiciais/`)
- Lista com progresso de etapas e prazo
- Detalhe com checklist de etapas (toggle) e documentos (toggle)

### Dashboard (`app/page.tsx`)
- Contadores: processos ativos, consultorias, extrajudiciais
- Alertas de prazo dos próximos 7 dias
- Lista de processos recentes

---

## Referências internas

- Visão geral e missão: `_memoria/00-visao-geral.md`
- Modelo de negócio: `_memoria/01-modelo-de-negocio.md`
- Operação jurídica: `_memoria/02-operacao-juridica.md`
- Operação comercial: `_memoria/03-operacao-comercial.md`
- Regras de desenvolvimento: `_memoria/04-regras-do-sistema.md`
- Roadmap por fases: `_memoria/05-roadmap.md`
- Modelo de dados: `_memoria/06-modelo-de-dados.md`
