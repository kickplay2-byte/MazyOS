# 04 — Regras do Sistema (Constituição de Desenvolvimento)

## Regras gerais

- Não implementar tudo de uma vez. Cada sprint tem escopo definido.
- Não criar módulo funcional sem antes definir os tipos TypeScript e os dados mockados.
- Não criar uma página sem antes verificar se o componente pode ser reutilizado.
- Não quebrar páginas que já funcionam ao adicionar novas funcionalidades.
- Ao final de cada sprint, listar arquivos criados/alterados e sugerir a próxima sprint.

---

## Arquitetura de arquivos

```
sistema/
  app/                          ← rotas Next.js (App Router)
    [modulo]/
      page.tsx                  ← lista
      novo/page.tsx             ← criar
      [id]/page.tsx             ← detalhe + editar
  components/
    ui/                         ← componentes atômicos reutilizáveis
      StatusBadge.tsx           ✓ existe
      Card.tsx                  ← a criar (Fase 1)
      PageHeader.tsx            ← a criar (Fase 1)
      EmptyState.tsx            ← a criar (Fase 1)
      DataTable.tsx             ← a criar (Fase 1)
      FormField.tsx             ← a criar (Fase 1)
    [dominio]/                  ← componentes de domínio
  lib/
    types.ts                    ← TODOS os tipos TypeScript centralizados aqui
    data.ts                     ← TODOS os CRUDs centralizados aqui
    actions.ts                  ← TODOS os Server Actions centralizados aqui
    utils.ts                    ← funções utilitárias compartilhadas
  data/
    *.json                      ← dados mockados centralizados
  _memoria/                     ← documentação viva do sistema
```

---

## Regras de tipos TypeScript

- **Centralizar em `lib/types.ts`**. Nunca definir tipo em page.tsx ou component.tsx.
- Toda entidade tem `id: string`, `createdAt: string`, `updatedAt: string`.
- IDs usam UUID (`randomUUID()` do Node crypto).
- Datas são strings ISO 8601 (`YYYY-MM-DD` para datas simples, ISO completo para timestamps).
- Foreign keys são `string` com sufixo `_id` (ex: `imobiliaria_id: string`).
- Exportar constantes de arrays para uso em dropdowns: `RESPONSAVEIS`, `STATUS_PROCESSO`, etc.

---

## Regras de dados mockados

- **Centralizar em `data/*.json`**. Nunca hardcodar dados em páginas ou componentes.
- Cada entidade tem seu próprio arquivo JSON: `imobiliarias.json`, `corretores.json`, etc.
- IDs de mock seguem padrão: `im-001`, `co-001`, `cl-001`, `op-001`, `pr-001`.
- Foreign keys nos mocks devem referenciar IDs existentes no JSON correspondente.

---

## Regras de componentes

- **Sidebar:** estrutura com seções agrupadas (Comercial / Jurídico / Gestão).
- **StatusBadge:** reutilizar sempre. Nunca criar badge inline em página.
- **Formulários:** usar `<form action={serverAction}>` com HTML nativo. Sem biblioteca de formulários.
- **Cards:** componente `Card` com `border border-gray-200 bg-white rounded p-5`.
- **Tabelas:** componente `DataTable` com header padronizado.
- **PageHeader:** componente com título, subtítulo e botão de ação.
- Nunca usar `<div>` quando `<section>`, `<article>` ou `<nav>` são semanticamente corretos.

---

## Regras visuais (identidade)

- **Background sidebar:** `#1F2346`
- **Accent/CTA:** `#DFA568`
- **Background app:** `#f5f4f1`
- **Cards:** `bg-white border border-gray-200 rounded`
- **Border-radius:** mínimo. Máx `rounded` (4px no Tailwind).
- **Sombras:** nenhuma ou `shadow-sm` (nunca dramáticas).
- **Fontes:** Questrial (via CSS). Não usar fontes externas por enquanto.
- **Nunca:** vermelho/verde como cores de marca. Só em badges de status.

---

## Regras de Server Actions

- Todas as mutações de dados via Server Actions (`'use server'`).
- Após mutação: `revalidatePath()` + `redirect()`.
- Nunca fazer escrita de JSON em componente cliente.
- Validação básica no servidor (campos obrigatórios).

---

## Regras de relacionamento entre entidades

- Corretor sempre pertence a uma Imobiliária (`imobiliaria_id` obrigatório).
- Cliente sempre tem origem registrada (`origem`: `corretor` | `imobiliaria` | `direto` | `indicacao_pf`).
- Oportunidade sempre tem Cliente vinculado (`cliente_id` obrigatório).
- Proposta sempre tem Oportunidade vinculada (`oportunidade_id` obrigatório).
- Demanda jurídica pode ter: `cliente_id`, `corretor_id`, `imobiliaria_id`, `oportunidade_id`, `proposta_id` (todos opcionais mas sempre preenchidos quando possível).

---

## O que NÃO fazer

- ❌ Não implementar Supabase/PostgreSQL ainda. JSON primeiro, migration depois.
- ❌ Não implementar IA ainda. Fase 7 do roadmap.
- ❌ Não usar bibliotecas de UI externas (shadcn, MUI, etc.). Tailwind nativo.
- ❌ Não criar autenticação ainda. Sistema interno, sem login por ora.
- ❌ Não espalhar dados mockados em páginas. Sempre em `data/*.json`.
- ❌ Não criar tipos locais. Sempre em `lib/types.ts`.
- ❌ Não criar actions locais. Sempre em `lib/actions.ts`.
