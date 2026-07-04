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

- ❌ Não usar bibliotecas de UI externas (shadcn, MUI, etc.). Tailwind nativo.
- ❌ Não espalhar dados mockados em páginas. Sempre em `data/*.json`.
- ❌ Não criar tipos locais. Sempre em `lib/types.ts`.
- ❌ Não criar actions locais. Sempre em `lib/actions.ts`.
- ❌ Não implementar streaming de IA.
- ❌ Não implementar geração de contratos/PDF ainda.
- ❌ Não implementar upload/análise de PDF ainda.
- ❌ Não usar service role no frontend — nunca.
- ❌ Não expor chave sensível com NEXT_PUBLIC (exceto URL e anon key do Supabase, que são públicas por design).
- ❌ Não chamar API de IA diretamente do client.
- ❌ Não deixar /advisor público.
- ❌ Não usar service role para burlar RLS.
- ❌ Não desabilitar RLS como solução para erros de permissão.
- ❌ Não implementar permissões complexas por role ainda (Fase 9+).

---

## Regras de Administração e Configurações (Fase 9 — ativas desde 2026-05)

### Rota /configuracoes
- Página server-side única — não é tabbed, não tem subrotas
- Dados carregados via `getSystemHealth()` (lib/settings.ts) + `Promise.all` das listas de lib/data.ts
- `lib/settings.ts` é server-only — acessa `process.env.OPENAI_API_KEY`; jamais importar de Client Components

### Gestão de usuários
- Novos usuários devem ser criados pelo **Supabase Dashboard** (Authentication → Users)
- Ao criar, o trigger `on_auth_user_created` insere perfil em `profiles` automaticamente
- Não implementar convite/criação de usuário dentro do app ainda (Fase 9+)
- Não alterar schema sem necessidade
- Não criar arquitetura paralela de auth

### Variáveis de ambiente
- `OPENAI_API_KEY` — server-only. Nunca usar `NEXT_PUBLIC_OPENAI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` — são públicas por design do Supabase
- Checagem de variáveis via `getIntegrationStatus()` retorna booleano — nunca expõe valor

---

## Regras da Base de Conhecimento (Fase 10 — ativas desde 2026-05)

### Módulo /conhecimento
- Rota hub: `/conhecimento` — 4 sub-módulos: modelos, clausulas, checklists, orientacoes
- Cada sub-módulo: lista (`page.tsx`), nova (`novo/page.tsx` ou `nova/page.tsx`), detalhe+edição (`[id]/page.tsx`)
- Sidebar: link "Conhecimento" com ícone de livro, dentro da seção Jurídico

### Padrão document-store (herdado das outras tabelas)
- Tabelas: `modelos_juridicos`, `clausulas_padrao`, `checklists_juridicos`, `orientacoes_internas`
- Schema: `id text primary key, data jsonb not null` — igual a todas as outras tabelas
- RLS ativo: anon bloqueado, authenticated tem acesso completo

### Seed files vs runtime
- Seed files em `data/*.json` são para carga inicial no Supabase (SQL import) — jamais lidos em runtime
- Em runtime, todos os dados vêm via `getSupabaseServerClient()` através de `lib/data.ts`

### Arquivar vs deletar
- Jamais deletar modelos, cláusulas, checklists ou orientações — apenas arquivar (status `arquivado`)
- Arquivados ficam ocultos na lista principal mas preservados no banco
- Ação de arquivar redireciona para a lista; não há ação de desarquivar na UI

### Checklist de itens
- Items são armazenados como `ItemChecklist[]` no campo `itens` do ChecklistJuridico
- No formulário: textarea com um item por linha, convertido em array no Server Action
- Cada item recebe `randomUUID()` como id e `ordem` incremental

### Advisor — integração com Base de Conhecimento
- Advisor recebe apenas totais (`totalModelos`, `totalClausulas`, `totalChecklists`, `totalOrientacoes`)
- Não enviar conteúdo completo dos modelos/cláusulas para a IA (tamanho + privacidade)
- Interface `AdvisorContextBaseConhecimento` em `lib/advisor.ts`

### O que NÃO fazer (Fase 10)
- ❌ Não implementar geração automática de contratos
- ❌ Não implementar editor DOCX avançado
- ❌ Não implementar upload/análise de PDF com IA
- ❌ Não implementar RAG/vector database
- ❌ Não chamar OpenAI para gerar peças jurídicas
- ❌ Não remover o módulo Documentos/Arquivos existente

---

## Regras do Montador Assistido de Minutas (Fase 10.3 — ativas desde 2026-05)

### Módulo /minutas
- Rota lista: `/minutas` — stat cards + tabela de minutas ativas
- Rota criação: `/minutas/nova` — Server Component + `MinutaNovaWizard` (Client Component, 6 passos)
- Rota detalhe: `/minutas/[id]` — metadados, form de atualização de status/responsável, conteúdo, copiar, arquivar
- Sidebar: link "Minutas" na seção Jurídico
- Todos os detalhes de entidade (oportunidade, proposta, extrajudicial, processo, consultoria) têm link "Montar minuta assistida" com `entityType` e `entityId` como searchParams

### Geração de conteúdo
- Conteúdo gerado por `montarConteudoMinutaAssistida()` em `lib/utils.ts` — função pura, sem IA
- 5 seções obrigatórias: 1. Modelo base, 2. Cláusulas, 3. Checklist, 4. Orientações, 5. Observações
- Aviso jurídico sempre incluído ao final: "Não constitui instrumento jurídico finalizado"
- Conteúdo é gerado na criação e persistido — não é recalculado a cada visualização
- Montagem acontece no Server Action `criarMinutaAssistida()` via `lib/actions.ts`

### Tabela Supabase
- Tabela: `minutas_assistidas` — document-store (`id text pk, data jsonb`)
- RLS: anon bloqueado, authenticated com acesso total (BLOCO 16 de `rls-minimo-authenticated.sql`)
- Índice GIN em `data` para consultas de containment

### Arquivar vs deletar
- Jamais deletar minutas — apenas arquivar (status `arquivada`)
- Arquivadas ficam ocultas na lista principal (filtro `status !== 'arquivada'`)
- Ação de arquivar: Server Action `arquivarMinutaAssistida()` → redirect para `/minutas`
- Não há ação de desarquivar na UI

### Configurações
- Seção "Montador de Minutas" em `/configuracoes` mostra 5 contadores: total, rascunhos, em revisão, aprovadas, arquivadas
- Status "✓ Ativo" sempre hardcoded (sem feature flag)

### O que NÃO fazer (Fase 10.3)
- ❌ Não gerar contrato final automaticamente
- ❌ Não gerar peça processual completa
- ❌ Não implementar editor DOCX/RTF
- ❌ Não implementar exportação DOCX/PDF ainda
- ❌ Não chamar IA para redigir livremente a peça
- ❌ Não fazer RAG/vector database
- ❌ Não analisar PDF
- ❌ Não quebrar Advisor nem Base de Conhecimento
- ❌ Não usar JSON de `data/*.json` em runtime (apenas seed)

---

## Regras do Refinamento do Montador Assistido (Fase 10.4 — ativas desde 2026-05)

### Enriquecimento do conteúdo gerado
- `montarConteudoMinutaAssistida()` em `lib/utils.ts` agora tem 7 seções: 0. Contexto da origem (se `entityContext` presente), 1-4. iguais, 5. Observações, 6. Pontos de atenção (checklist fixo de 8 itens)
- Cláusulas agora incluem `aplicacao` e `riscos` na seção 2
- Itens de checklist com `obrigatorio=true` recebem marcador `[OBRIGATÓRIO]`
- Orientações com `tema` recebem label `[tema]`
- Server Action `criarMinutaAssistida()` busca contexto da entidade de origem (todos os 5 tipos) e passa `entityContext` para `montarConteudoMinutaAssistida()`

### Edição do conteúdo após criação
- `/minutas/[id]` tem `<details>` "Editar título e conteúdo" com textarea + form → `atualizarConteudoMinutaAssistida(id, formData)`
- `atualizarConteudoMinutaAssistida` em `lib/actions.ts`: atualiza `conteudo` e `titulo`, chama `revalidatePath` para `/minutas` e `/minutas/[id]`

### Edição do preview antes de salvar (wizard)
- Passo 6 do wizard usa `<textarea>` editável (não mais `<pre>` read-only)
- Estado `conteudoManual: string | null`: `null` = usar conteúdo gerado automaticamente, `string` = user editou
- `previewGerado` é computado por IIFE no render (sem `useEffect`) — evita `react-hooks/set-state-in-effect`
- `conteudoAtual = conteudoManual ?? previewGerado`
- Botão "↺ Regenerar" seta `conteudoManual = null` para voltar ao conteúdo automático
- Submit: se `conteudoManual !== null`, inclui `conteudoManual` no FormData para substituir o gerado

### Listagem e filtros
- `/minutas` aceita `searchParams`: `q`, `status`, `tipo`, `entityType`, `responsavel`
- 6 stat cards: total ativas, rascunhos, em revisão, aprovadas, arquivadas, últimos 7 dias
- `const agora = new Date().getTime()` — hoistado antes do `.filter()` para evitar `react-hooks/purity` (Date.now é impuro inline)
- Coluna Ações na tabela: botões "Duplicar" e "Arquivar" por row via Server Actions

### Duplicar minuta
- `duplicarMinutaAssistida(id)` em `lib/actions.ts`: copia todos os campos, gera novo UUID, seta `status='rascunho'`, limpa `revisadoEm`/`aprovadoEm`, seta `duplicadaDeId=original.id`
- Redirect para `/minutas/[novaMinuta.id]` após criação

### Timestamps de revisão
- `atualizarStatusMinuta()`: ao mudar para `em_revisao` → seta `revisadoEm=now`, ao mudar para `aprovada` → seta `aprovadoEm=now`
- Exibidos em `/minutas/[id]` quando presentes

### Link de origem clicável
- `getEntityHref(entityType, entityId)` em `lib/utils.ts` — mapa de `MinutaEntityType` para base URL
- `/minutas/[id]` exibe link clicável para a entidade de origem (processo, extrajudicial, consultoria, oportunidade, proposta)
- Detalhes de entidade exibem seção "Minutas assistidas vinculadas" via `getMinutasAssistidasByEntity(entityType, id)`

### Exportação (placeholder)
- `/minutas/[id]` tem botão "Exportar — em breve" desabilitado (`disabled`, `opacity-50`) com `title` explicativo
- Não implementar exportação DOCX/PDF nesta fase — o botão é apenas UI placeholder

### CopyButton
- `components/ui/CopyButton.tsx` tem `try/catch` + fallback via `document.execCommand('copy')` para ambientes non-HTTPS e browsers antigos

---

## Regras de Exportação de Minutas (Fase 10.5 — ativas desde 2026-05)

### Endpoint de exportação DOCX
- Rota: `GET /api/minutas/[id]/export/docx` — dentro do route group `(app)` para herdar o padrão de auth
- Biblioteca: `docx` v9 (server-side, puro Node.js, sem binários nativos)
- Auth: `createSupabaseServerClient()` + `getUser()` — retorna 401 se não autenticado (mesmo padrão de `/api/advisor`)
- Geração: Server Action equivalente — `gerarDocxMinuta(minuta)` em `lib/export-minutas.ts`
- Filename seguro: `nomeArquivoDocx(minuta)` — slug do título + fallback `minuta-[id].docx`
- Headers: `Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `Content-Disposition: attachment`, `Cache-Control: no-store`

### Conteúdo do DOCX
- Cabeçalho: "PIPE OS — Pré-Minuta Assistida"
- Título da minuta em destaque
- Tabela de metadados (status, tipo, responsável, origem, modelo, cláusulas, checklist, orientações)
- Conteúdo gerado dividido em parágrafos (linhas → `Paragraph`)
- Aviso final obrigatório: "exige revisão jurídica integral antes de qualquer envio, assinatura ou utilização"
- Rodapé com data de geração e nome do escritório

### Regras de segurança da exportação
- Exportação sempre server-side — nunca gerada no client
- `getMinutaAssistidaById` usa RLS autenticado (via `createSupabaseServerClient`) — sem service role
- Minutas arquivadas podem ser exportadas (histórico)
- ID arbitrário retorna 404 controlado — sem vazamento de dados
- Nenhum dado externo inserido no DOCX

### PDF (Fase 10.5.1)
- Biblioteca: `pdfkit` v0.18 (pure Node.js, sem binários nativos)
- `serverExternalPackages: ['pdfkit']` em `next.config.ts` — impede o Turbopack de bundlar o pdfkit e suas fontes internas
- Rota: `GET /api/minutas/[id]/export/pdf` — mesmo padrão de auth do DOCX
- Sanitização obrigatória: `sanitizarParaPdf()` converte chars Unicode fora de Latin-1 (═, ─, ▸, ⚠) para equivalentes ASCII antes de passar ao pdfkit
- Geração stream-based: `PDFDocument` → events `data`/`end`/`error` → `Promise<Buffer>`
- `import('pdfkit')` dinâmico — desfere o `require` para runtime, evitando análise estática do bundler
- Conteúdo: cabeçalho, linha dourada, título, tipo, metadados key:value, linha cinza, conteúdo com tipografia diferenciada por tipo de linha, aviso final com borda dourada, rodapé alinhado à direita

### O que NÃO fazer (Fase 10.5 — inviolável)
- ❌ Não implementar editor DOCX avançado (OnlyOffice, Quill, etc.)
- ❌ Não implementar exportação PDF nesta fase (aguarda 10.5.1)
- ❌ Não usar service role no endpoint de exportação
- ❌ Não gerar DOCX no client (sempre server-side)
- ❌ Não inserir conteúdo externo no DOCX
- ❌ Não aceitar path arbitrário no parâmetro `id`
- ❌ Não expor dados de outras minutas sem autenticação
- ❌ Não quebrar minutas existentes
- ❌ Não quebrar Base de Conhecimento nem Advisor
- ❌ Não adicionar dependências com binários nativos pesados

---

## Regras de Permissões por Role (Fase 11A + 11A.1 — ativas desde 2026-05)

### Status
- **Permissões no app:** ativas — `lib/permissions.ts` define matriz `Permission` × `UserRole`
- **RLS por role no banco:** NÃO implementado (aguarda Fase 11B)
- **RLS mínimo authenticated:** continua ativo e intacto

### Roles existentes (`lib/types.ts` → `UserRole`)
- `admin` — acesso total
- `advogado` — jurídico completo, comercial view, minutas completo, configurações view
- `assistente` — jurídico manage (processos/extrajudiciais/tarefas), minutas manage/export, conhecimento view, configurações view
- `comercial` — comercial completo, jurídico view, minutas view, sem export

### Camadas de enforcement (app-layer only — sem RLS adicional)
1. **Sidebar (`components/Sidebar.tsx`):** itens sem permissão ficam ocultos; `canSee` retorna `false` se `!userRole` (menor privilégio)
2. **Páginas — listagem:** `requirePermission(X:view)` no início de cada page function; todas as subpáginas protegidas
3. **Páginas — criação:** `requirePermission(X:manage)` em nova/novo pages
4. **Páginas — detalhe:** `requirePermission(X:view)`; botões mutáveis ocultos via `canManage`
5. **Server Actions (`requireActionPermission()` em `lib/actions.ts`):** retorna sem executar se sem permissão; cobre TODAS as actions mutáveis
6. **APIs (`hasPermission()` inline):** retorna 403 se sem permissão; `/api/advisor`, `/api/advisor/entity`, `/api/minutas/*/export/docx`, `/api/minutas/*/export/pdf`

### Componentes de controle de acesso
- `components/AccessControl.tsx` — `'use client'`; props: `role`, `permission`, `anyPermissions`, `allPermissions`, `fallback`; use em Client Components ou Server Components que recebem role por prop

### Helpers disponíveis
- `hasPermission(role, permission)` — `lib/permissions.ts` (client-safe, sem Supabase)
- `hasAnyPermission(role, permissions[])` — idem
- `hasAllPermissions(role, permissions[])` — idem
- `canAccessRoute(role, pathname)` — idem
- `requirePermission(permission)` — `lib/auth.ts` (server-only, redirect para /acesso-negado)
- `requireAnyPermission(permissions[])` — `lib/auth.ts` (server-only)
- `requireRole(roles[])` — `lib/auth.ts` (server-only)
- `getCurrentRole()` — `lib/auth.ts` (server-only, fallback = 'assistente')

### Fallback seguro
- Se `Profile` não existir no banco, role = `'assistente'` (menor privilégio)
- Sidebar com `userRole` ausente oculta todos os itens com permission (não mostra acesso indevido)

### Padrão de proteção em Server Component pages
```tsx
// Proteção de acesso:
await requirePermission('x:view')
// Visibilidade de botões:
const role = await getCurrentRole()
const canManage = hasPermission(role, 'x:manage')
// No JSX:
{canManage && <Link href="/x/novo">+ Novo</Link>}
```

### Gerenciamento de usuários
- Admin pode editar `role` e `status` de qualquer profile via `/configuracoes` → `atualizarProfileRoleStatus`
- Novos usuários continuam sendo criados pelo Supabase Dashboard (trigger cria profile automaticamente)
- Não criar convite/registro público nesta fase

### O que NÃO fazer (Fase 11A/11A.1 — inviolável)
- ❌ Não implementar RLS por role no banco nesta fase
- ❌ Não mexer nas policies atuais de RLS
- ❌ Não quebrar o RLS mínimo authenticated
- ❌ Não alterar Auth sem necessidade
- ❌ Não criar cadastro público
- ❌ Não quebrar exportação DOCX/PDF
- ❌ Não quebrar Advisor, Minutas, Base de Conhecimento
- ❌ Não fazer fallback permissivo no Sidebar (usar false quando sem userRole)

---

## Regras de RLS por Role no Banco (Fase 11B — ativas desde 2026-05)

### Status
- **Script:** `scripts/rls-role-based.sql` — aplicar manualmente no Supabase SQL Editor
- **Rollback:** `scripts/rls-rollback-authenticated.sql` — voltar ao RLS mínimo
- **Base:** `scripts/rls-minimo-authenticated.sql` — pré-requisito (ainda ativo)

### Funções helper criadas no banco
- `public.current_user_role()` — retorna o role do usuário autenticado (`admin`/`advogado`/`assistente`/`comercial`) ou NULL se inativo/sem profile; `security definer`, `stable`
- `public.has_any_role(allowed_roles text[])` — verifica se o usuário tem qualquer um dos roles; usado como condição nas policies; filtra por `status = 'ativo'`

### Por que NÃO usa auth.jwt() ->> 'role'
- O role real está em `public.profiles`, não em JWT custom claims
- As functions `current_user_role()` e `has_any_role()` consultam `public.profiles` via `auth.uid()`
- Usar `security definer` + `set search_path = public` evita injection e circularity

### Matriz de acesso por tabela (banco)

| Tabela | SELECT | INSERT/UPDATE/DELETE |
|--------|--------|---------------------|
| profiles | own (todos) + all (admin) | somente admin |
| imobiliarias | todos os 4 roles | admin, comercial |
| corretores | todos os 4 roles | admin, comercial |
| clientes | todos os 4 roles | admin, advogado, comercial |
| oportunidades | todos os 4 roles | admin, advogado, comercial |
| propostas | todos os 4 roles | admin, advogado, comercial |
| processos | todos os 4 roles | admin, advogado, assistente |
| extrajudiciais | todos os 4 roles | admin, advogado, assistente |
| consultorias | todos os 4 roles | admin, advogado |
| tarefas | todos os 4 roles | admin, advogado, assistente, comercial |
| arquivos | todos os 4 roles | admin, advogado, assistente |
| modelos_juridicos | todos os 4 roles | admin, advogado |
| clausulas_padrao | todos os 4 roles | admin, advogado |
| checklists_juridicos | todos os 4 roles | admin, advogado |
| orientacoes_internas | todos os 4 roles | admin, advogado |
| minutas_assistidas | todos os 4 roles | admin, advogado, assistente |

### Efeitos de status=inativo e sem profile
- `status = 'inativo'`: `has_any_role()` retorna false → usuário não acessa dados do negócio
- Sem profile no banco: `has_any_role()` retorna false → nenhuma tabela acessível
- O app (`requireUser()` + fallback role) adiciona proteção no nível da aplicação

### Convenção de policy names
- Policies novas: prefixo `rb_` (role-based) — ex: `rb_select_processos`
- Policies antigas: prefixo `op_full_` — foram removidas pelo script

### O que NÃO fazer (Fase 11B)
- ❌ Não usar `auth.jwt() ->> 'role'` (role está em public.profiles, não no JWT)
- ❌ Não usar service role no frontend
- ❌ Não resolver erros de RLS desabilitando RLS
- ❌ Não resolver com acesso admin indiscriminado
- ❌ Não expor chaves de service role
- ❌ Não depender de `anon` para qualquer tabela

---

## Regras de Autenticação e RLS (Fase 8 — ativas desde 2025-05)

### Status atual
- **Supabase Auth:** ativo — email/password via `@supabase/ssr` v0.10.3
- **RLS:** ativo em todas as 16 tabelas — `anon` bloqueado; `authenticated` com policies por role (Fase 11B)
- **Policies por role:** ativas desde Fase 11B — consultar `scripts/rls-role-based.sql`

### Regras de client Supabase
- **Server Components, Route Handlers, Server Actions:** sempre `createSupabaseServerClient()` de `lib/supabase-server.ts`
- **Client Components:** sempre `createSupabaseBrowserClient()` de `lib/supabase-browser.ts`
- **Nunca** usar o singleton anon (`lib/supabase.ts` está obsoleto após Fase 8.1)
- `createSupabaseServerClient()` deve ser chamado por request, nunca como singleton

### Route Groups (desde sprint técnica 2026-05)

Estrutura de layouts separados por contexto:

```
app/
  layout.tsx              ← Root layout mínimo: HTML shell, sem auth, sem Sidebar, sem force-dynamic
  global-error.tsx        ← 'use client', sem Supabase, sem auth, sem Sidebar
  globals.css
  (auth)/
    layout.tsx            ← force-dynamic; sem Sidebar
    login/
      page.tsx            ← /login (URL pública)
  (app)/
    layout.tsx            ← force-dynamic; requireUser() + Sidebar com email do usuário
    page.tsx              ← / (dashboard)
    advisor/              ← /advisor
    api/                  ← /api/advisor, /api/advisor/entity
    comercial/            ← /comercial/*
    configuracoes/        ← /configuracoes
    conhecimento/         ← /conhecimento/*
    consultorias/         ← /consultorias/*
    documentos/           ← /documentos/*
    extrajudiciais/       ← /extrajudiciais/*
    minutas/              ← /minutas/*
    processos/            ← /processos/*
    tarefas/              ← /tarefas/*
```

**Regras dos layouts:**
- `app/layout.tsx` raiz: apenas `<html>`, `<body>`, e import do CSS global — nada mais
- `app/(auth)/layout.tsx`: `force-dynamic` (obrigatório — bug Next.js 16), sem Sidebar, sem auth check
- `app/(app)/layout.tsx`: `force-dynamic`, chama `requireUser()` (redireciona se não autenticado), renderiza `<Sidebar userEmail={user.email} />`
- `app/global-error.tsx`: `'use client'`, sem imports de server-only, sem Sidebar — error boundary fatal

### Fluxo de autenticação
- `proxy.ts` protege todas as rotas — redireciona deslogado para `/login`, logado para fora de `/login`
- `app/(app)/layout.tsx` chama `requireUser()` — segunda barreira server-side para todas as rotas autenticadas
- Sidebar renderizada com `userEmail={user.email}` — condicional ao usuário autenticado
- Logout via Server Action `signOut()` em `lib/auth-actions.ts`
- `/api/advisor` tem dupla proteção: proxy redirect + 401 no route handler

### `lib/data.ts` e RLS
- Os 3 helpers base (`readAll`, `upsertOne`, `removeOne`) usam `createSupabaseServerClient()` por chamada
- Isso garante que o JWT do cookie é enviado ao Supabase em cada query
- Sem isso, Supabase trata o cliente como `anon` e RLS bloqueia tudo
- `react.cache()` ainda é usado para deduplicar reads dentro do mesmo request — não conflita com RLS

---

## ⚠️ Patch reprodutível em node_modules — Next.js 16.2.6 bug E1068

### Problema confirmado
`next build` falha com `InvariantError: Expected workStore to be initialized` nas rotas sintéticas `/_global-error` e `/_not-found` durante a geração estática. A mensagem do próprio Next.js diz: **"This is a bug in Next.js."** Investigação completa de causa raiz realizada em 2026-05.

### Causa raiz
O bug afeta TODAS as rotas prerendered no Next.js 16.2.6 + Turbopack: o `workAsyncStorage` não é inicializado antes da coleta de metadados em certos workers de prerender. A solução para rotas de aplicação é `force-dynamic` em cada layout. Para as rotas sintéticas `/_global-error` e `/_not-found`, que não pertencem a nenhum route group e não podem ter `force-dynamic` via layout, o único caminho é um patch no worker interno do Next.js.

### Workaround automatizado
**Script:** `scripts/patch-nextjs.mjs` — idempotente, detecta patch já aplicado via MARKER `// patch:E1068`

**O script é executado automaticamente em dois momentos:**
- `npm install` (via `postinstall` em `package.json`)
- `npm run build` (antes do `next build`)

**O que o patch faz:** no bloco `catch (err)` da função `exportAppPage` em `node_modules/next/dist/export/routes/app-page.js`, intercepta o InvariantError especificamente para `isDefaultGlobalError || isDefaultNotFound` e retorna `{ cacheControl: { revalidate: 0 } }` em vez de re-lançar.

### Remoção futura (obrigatório ao atualizar Next.js)
1. Remover `scripts/patch-nextjs.mjs`
2. Em `package.json`, remover `&& node scripts/patch-nextjs.mjs` do `build` e do `postinstall`
3. Rodar `npm run build` — se passar sem erro, o bug foi corrigido upstream
4. Remover esta seção do documento

### Marcador no código
`// patch:E1068` em `node_modules/next/dist/export/routes/app-page.js`
