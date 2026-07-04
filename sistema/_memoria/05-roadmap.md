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

---

## Fase 8 — Autenticação e Segurança ✅ (2025-05)

**Objetivo:** Proteger o sistema com Supabase Auth e RLS antes de dados reais.

**Entregáveis:**
- [x] Supabase Auth com email/password (`@supabase/ssr` v0.10.3)
- [x] `proxy.ts` — proteção de todas as rotas (Next.js 16.x convention)
- [x] `lib/supabase-server.ts` — client server-side com cookies
- [x] `lib/supabase-browser.ts` — client browser para Client Components
- [x] `lib/auth.ts` — `getCurrentUser()`, `requireUser()`, `getCurrentProfile()`
- [x] `lib/auth-actions.ts` — Server Action `signOut()`
- [x] `app/login/page.tsx` — página de login com identidade VSADV
- [x] Sidebar condicional + email do usuário + botão logout
- [x] `/api/advisor` protegido por auth check (dupla proteção)
- [x] `lib/data.ts` — base helpers migrados para `createSupabaseServerClient()`
- [x] `scripts/schema.sql` — tabela `profiles` + trigger `on_auth_user_created`
- [x] `scripts/rls-minimo-authenticated.sql` — RLS em 11 tabelas, anon bloqueado
- [x] `lib/types.ts` — tipos `Profile`, `UserRole`, `UserStatus` adicionados

**Restrições ativas (invioláveis):**
- Service role nunca no frontend
- Nenhuma chave sensível com NEXT_PUBLIC
- IA nunca chamada diretamente do client
- /advisor sempre protegido por auth
- RLS nunca desabilitado como solução

---

## Fase 9 — Configurações e Administração Operacional ✅ (2026-05)


**Objetivo:** Centralizar estado operacional, integrações e usuários numa área administrativa.

**Entregáveis:**
- [x] `lib/settings.ts` — funções server-only: `getOfficeSettings`, `getIntegrationStatus`, `getSecurityStatus`, `getProfiles`, `computeProfilesResumo`, `getSystemHealth`
- [x] `app/configuracoes/page.tsx` — página única com 5 seções: Escritório / Usuários / Integrações / Segurança / Sistema
- [x] Sidebar — link "Configurações" com ícone de engrenagem, acima do rodapé
- [x] `_memoria/04-regras-do-sistema.md` — documentadas as regras de Fase 9
- [x] `_memoria/05-roadmap.md` — Fase 9 marcada como entregue

**Restrições (invioláveis, herdadas das fases anteriores):**
- Todas as restrições da Fase 8 continuam ativas
- Sem permissões complexas por role no banco ainda
- Sem alteração de schema
- Sem arquitetura paralela
- Sem JSON em runtime

**Restrições ativas:**
- Sem permissões complexas por role no banco ainda
- Sem alteração de schema sem necessidade

---

## Fase 10 — Modelos Jurídicos e Base de Conhecimento Interna ✅ (2026-05)

**Objetivo:** Repositório interno estruturado de modelos, cláusulas, checklists e orientações para uso operacional da equipe.

**Entregáveis:**
- [x] `lib/types.ts` — tipos: `ModeloJuridico`, `ClausulaPadrao`, `ChecklistJuridico`, `OrientacaoInterna`, `ItemChecklist`, `StatusBaseConhecimento`, `CategoriaModelo`, `TipoDocumento`, `CategoriaClausula` + constantes e labels
- [x] `scripts/schema.sql` — 4 novas tabelas document-store + GIN indexes + RLS inicial
- [x] `scripts/rls-minimo-authenticated.sql` — BLOCOs 12-15: RLS ativo nas 4 tabelas, anon bloqueado
- [x] `data/modelos-juridicos.json` — 8 modelos seed (compra e venda, locação, inventário, etc.)
- [x] `data/clausulas-padrao.json` — 12 cláusulas seed (arras, posse, ITBI, etc.)
- [x] `data/checklists-juridicos.json` — 6 checklists seed (compra com financiamento, inventário, etc.)
- [x] `data/orientacoes-internas.json` — 5 orientações seed (financiamento insuficiente, imóvel com ônus, etc.)
- [x] `lib/data.ts` — funções: `getModelosJuridicos`, `getModeloJuridicoById`, `saveModeloJuridico`, `getClausulasPadrao`, `getClausulaPadraoById`, `saveClausulaPadrao`, `getChecklistsJuridicos`, `getChecklistJuridicoById`, `saveChecklistJuridico`, `getOrientacoesInternas`, `getOrientacaoInternaById`, `saveOrientacaoInterna`, `getResumoBaseConhecimento`, `searchBaseConhecimento`
- [x] `lib/actions.ts` — 12 Server Actions: criar/atualizar/arquivar para cada sub-módulo
- [x] `lib/advisor.ts` — `AdvisorContextBaseConhecimento`, campo `baseConhecimento` no contexto (totais apenas)
- [x] `app/conhecimento/page.tsx` — hub com 6 stat boxes, 4 seções de recentes, links rápidos
- [x] `app/conhecimento/modelos/page.tsx` — lista + botão novo
- [x] `app/conhecimento/modelos/novo/page.tsx` — formulário de criação
- [x] `app/conhecimento/modelos/[id]/page.tsx` — detalhe + edição inline + arquivar
- [x] `app/conhecimento/clausulas/page.tsx` — lista + botão nova
- [x] `app/conhecimento/clausulas/nova/page.tsx` — formulário de criação
- [x] `app/conhecimento/clausulas/[id]/page.tsx` — detalhe + caixa amber de riscos + edição inline
- [x] `app/conhecimento/checklists/page.tsx` — grid de cards com contagem de itens
- [x] `app/conhecimento/checklists/novo/page.tsx` — formulário (itens: um por linha)
- [x] `app/conhecimento/checklists/[id]/page.tsx` — lista ordenada de itens + edição inline
- [x] `app/conhecimento/orientacoes/page.tsx` — lista com tags inline
- [x] `app/conhecimento/orientacoes/nova/page.tsx` — formulário com textarea estruturada
- [x] `app/conhecimento/orientacoes/[id]/page.tsx` — `<pre>` conteúdo + edição inline + arquivar
- [x] `components/Sidebar.tsx` — link "Conhecimento" na seção Jurídico
- [x] `app/configuracoes/page.tsx` — seção "Base de Conhecimento" com 4 contadores + status ativo
- [x] `_memoria/04-regras-do-sistema.md` — regras Fase 10 documentadas
- [x] `_memoria/05-roadmap.md` — Fase 10 marcada como entregue
- [x] `_memoria/06-modelo-de-dados.md` — 4 novas entidades documentadas

**Restrições respeitadas:**
- Nenhuma geração de contratos/PDF/DOCX
- Nenhuma chamada OpenAI para peças jurídicas
- Nenhum RAG/vector database
- Advisor não quebrado — apenas recebe totais da base
- Módulo Documentos/Arquivos existente preservado

---

## Fase 10.1 — Ativação Supabase da Base de Conhecimento ✅ (2026-05)

**Objetivo:** Criar as 4 tabelas no Supabase, importar seed, aplicar RLS e validar operação real.

**Entregáveis:**
- [x] `scripts/seed.mjs` — adicionadas as 4 novas tabelas; FILE_NAMES map para hífens → underscores
- [x] `scripts/schema-fase10.sql` — DDL isolado das 4 tabelas (idempotente, para reuso)
- [x] Tabelas criadas no Supabase: `modelos_juridicos`, `clausulas_padrao`, `checklists_juridicos`, `orientacoes_internas`
- [x] GIN indexes criados nas 4 tabelas
- [x] Seed executado: 31 registros importados (8 + 12 + 6 + 5) — 0 erros
- [x] RLS habilitado nas 4 tabelas: `anon` bloqueado, `authenticated` com acesso total (ALL)
- [x] Policies `op_full_*` verificadas via `pg_policies` — 4/4 corretas

**Estado do Supabase após Fase 10.1:**
- 15 tabelas operacionais com RLS (11 pré-existentes + 4 novas)
- 87 registros totais no banco (56 pré-existentes + 31 novos)
- Nenhuma tabela pública acessível por anon

**Próxima evolução (Fase 11 — Permissões por Role):**
- Policies diferenciadas por `role` (`admin` vs `advogado` vs `assistente` vs `comercial`)
- Perfil de usuário editável dentro do app
- Convidar novos usuários via email

---

## Fase 10.2 — Integração da Base de Conhecimento com Demandas, Oportunidades e Propostas ✅ (2026-05)

**Objetivo:** Surfacear itens relevantes da Base de Conhecimento no contexto de cada demanda, oportunidade e proposta — sem IA, sem RAG, sem conteúdo integral enviado.

**Entregáveis:**
- [x] `lib/knowledge-recommendations.ts` — engine de recomendação por keywords (MIN_SCORE=2, MAX_PER_KIND=3): tipos `KnowledgeEntityType`, `KnowledgeRecommendationContext`, `KnowledgeRecommendation`, `KnowledgeRecommendationsResult`; funções `buildContextFromEntity`, `getKnowledgeRecommendationsForEntity`, `getKnowledgeRecommendationsByContext`; `TIPO_KEYWORDS` para os 6 tipos de `TipoExtrajudicial`; `normalize()` com `\p{Mn}` Unicode; scoring por `tipoDocumento/categoria/tags/area/titulo` (modelos), `categoria/aplicacao/tags` (cláusulas), `tipoDemanda/titulo` (checklists), `tema/tags` (orientações)
- [x] `components/knowledge/KnowledgeRecommendations.tsx` — Server Component com badges por kind (azul/âmbar/verde/roxo), empty state, link para `/conhecimento`
- [x] `lib/entity-advisor.ts` — campo `baseConhecimento` adicionado a 5 context builders (oportunidade, proposta, processo, extrajudicial, consultoria): apenas `id/titulo/categoria` — sem conteúdo
- [x] `app/comercial/oportunidades/[id]/page.tsx` — `<KnowledgeRecommendations>` após `EntityAdvisorPanel`
- [x] `app/comercial/propostas/[id]/page.tsx` — `<KnowledgeRecommendations>` após `EntityAdvisorPanel`
- [x] `app/processos/[id]/page.tsx` — `<KnowledgeRecommendations>` após `EntityAdvisorPanel`
- [x] `app/extrajudiciais/[id]/page.tsx` — `<KnowledgeRecommendations>` após `EntityAdvisorPanel`
- [x] `app/consultorias/[id]/page.tsx` — `<KnowledgeRecommendations>` após `EntityAdvisorPanel`
- [x] Build validado: tsc 0 erros, eslint 0 warnings, next build 49 rotas — OK

**Restrições respeitadas:**
- Sem geração automática de contratos
- Sem RAG/vector database
- Sem conteúdo integral da base enviado para IA
- Sem alteração de Auth/RLS
- Advisor global/contextual preservado
- 0 novas rotas (49 rotas total, igual antes)

---

## Sprint Técnica — Estabilização de Build e Arquitetura de Auth ✅ (2026-05)

**Objetivo:** Eliminar patch manual em node_modules, restaurar autenticação condicional da Sidebar, separar layouts público e autenticado com Route Groups, tornar workaround do Next.js reprodutível.

**Entregáveis:**
- [x] Route Groups criados: `app/(auth)/` para rotas públicas, `app/(app)/` para rotas autenticadas
- [x] `app/layout.tsx` reduzido a HTML shell mínimo — sem Sidebar, sem auth, sem `force-dynamic`
- [x] `app/(auth)/layout.tsx` — `force-dynamic` (bug Next.js 16), sem Sidebar
- [x] `app/(app)/layout.tsx` — `force-dynamic`, `requireUser()` (redirect se não autenticado), `<Sidebar userEmail={user.email} />`
- [x] `app/global-error.tsx` — `'use client'` sem imports server-only, botão `reset`; `<a>` com eslint-disable (correto para boundary fatal)
- [x] Sidebar restaurada com `userEmail` condicional — mostra email do usuário autenticado
- [x] `/login` não renderiza Sidebar
- [x] `proxy.ts` protege todas as rotas (Next.js 16 naming convention — era Middleware, agora Proxy)
- [x] `scripts/patch-nextjs.mjs` — script idempotente para workaround do bug E1068 em `/_global-error` e `/_not-found`
- [x] `package.json` — `build` e `postinstall` executam o script automaticamente
- [x] Rotas movidas: 13 segmentos de `app/` para `app/(app)/`; `app/login/` para `app/(auth)/login/`
- [x] `_memoria/04-regras-do-sistema.md` — documentados Route Groups, layouts, fluxo de auth, patch reprodutível
- [x] `_memoria/05-roadmap.md` — sprint marcada como entregue
- [x] Build validado: tsc 0 erros, eslint 0 warnings, `next build` 52 rotas — OK

**Decisões técnicas:**
- `force-dynamic` necessário em TODOS os layouts (root, auth, app) por causa do bug E1068 do Next.js 16.2.6 — o bug afeta qualquer rota prerendered; `force-dynamic` previne a tentativa de prerender
- Exceção: `app/layout.tsx` raiz NÃO tem `force-dynamic` para que `/_global-error` e `/_not-found` não herdem a flag (essas rotas são cobertas pelo patch do script)
- Patch em node_modules agora é reprodutível via `scripts/patch-nextjs.mjs` — não há mais alteração manual invisível

---

## Fase 10.3 — Montador Assistido de Minutas ✅ (2026-05)

**Objetivo:** Permitir que a equipe monte minutas de trabalho estruturadas a partir da Base de Conhecimento, sem geração automática por IA e sem produção de documentos finalizados.

**Entregáveis:**
- [x] `lib/types.ts` — tipos: `MinutaAssistida`, `StatusMinuta`, `TipoDocumentoMinuta`, `MinutaEntityType` + constantes e labels
- [x] `lib/utils.ts` — `MontarMinutaInput`, `montarConteudoMinutaAssistida()` com 5 seções + aviso jurídico
- [x] `lib/data.ts` — funções: `getMinutasAssistidas`, `getMinutaAssistidaById`, `getMinutasAssistidasByEntity`, `saveMinutaAssistida`, `getResumoMinutasAssistidas`
- [x] `lib/actions.ts` — Server Actions: `criarMinutaAssistida`, `atualizarStatusMinuta`, `arquivarMinutaAssistida`
- [x] `app/(app)/minutas/page.tsx` — lista com stat cards (total/rascunhos/em revisão/aprovadas) + tabela + EmptyState
- [x] `app/(app)/minutas/nova/page.tsx` — Server Component carrega todas as entidades e KB via Promise.all
- [x] `app/(app)/minutas/nova/MinutaNovaWizard.tsx` — wizard cliente com 6 passos (origem, tipo, modelo base, cláusulas, checklist+orientações, revisão+submit)
- [x] `app/(app)/minutas/[id]/page.tsx` — detalhe com metadados, form de atualização de status+responsável, conteúdo formatado, CopyButton, arquivar
- [x] `scripts/schema-fase10-3.sql` — DDL isolado da tabela `minutas_assistidas` (idempotente)
- [x] `scripts/schema.sql` — tabela `minutas_assistidas` + índice GIN adicionados ao schema consolidado
- [x] `scripts/rls-minimo-authenticated.sql` — BLOCO 16: RLS ativo em `minutas_assistidas`, anon bloqueado, authenticated acesso total
- [x] `scripts/seed.mjs` — `minutas_assistidas` incluída (empty array → skip idempotente)
- [x] `data/minutas-assistidas.json` — arquivo seed vazio `[]`
- [x] Todos os 5 detalhes de entidade — links "Montar minuta assistida" com `entityType` e `entityId` como searchParams
- [x] `components/Sidebar.tsx` — link "Minutas" na seção Jurídico
- [x] `app/(app)/configuracoes/page.tsx` — seção "Montador de Minutas" com 4 contadores + status ativo
- [x] Build validado: tsc 0 erros, eslint 0 warnings, `next build` 38 rotas dinâmicas — OK

**Restrições respeitadas:**
- Nenhuma geração automática de contrato ou peça processual
- Nenhuma chamada de IA para redigir conteúdo
- Nenhum DOCX/PDF
- Nenhum RAG ou vector database
- Advisor não quebrado
- Base de Conhecimento preservada
- Auth/RLS não alterados

---

## Fase 10.3.1 — Ativação Supabase, RLS e Validação Real ✅ (2026-05)

**Objetivo:** Garantir que o módulo `/minutas` está operacional com Supabase, autenticação, RLS, persistência e todos os fluxos de criação/arquivamento.

**Entregáveis:**
- [x] Tabela `minutas_assistidas` criada no Supabase via `scripts/schema-fase10-3.sql`
- [x] Índice GIN em `minutas_assistidas.data`
- [x] RLS habilitado: BLOCO 16 do `rls-minimo-authenticated.sql` aplicado — anon bloqueado, authenticated acesso total
- [x] Seed tratado corretamente: empty array → skip (0 upserts, sem erro)
- [x] `proxy.ts` redireciona unauthenticated para `/login` em qualquer rota `/minutas*`
- [x] `app/(app)/layout.tsx` tem dupla barreira: `requireUser()` (segunda proteção server-side)
- [x] `/minutas` carrega sem erro — `readAll` usa `createSupabaseServerClient()` com JWT do cookie
- [x] `/minutas/nova` carrega KB do Supabase via Promise.all — nenhum JSON em runtime
- [x] Wizard pré-preenche origem quando `entityType` + `entityId` vêm por searchParams
- [x] Criação avulsa: conteúdo gerado com 5 seções + aviso jurídico, persiste no Supabase
- [x] Criação por entidade: todos os 5 links corretos — oportunidade, proposta, extrajudicial, processo, consultoria
- [x] `/minutas/[id]` exibe metadados, conteúdo, CopyButton e form de atualização
- [x] `atualizarStatusMinuta` corrigido: agora salva `responsavel` além de `status` e `observacoes`
- [x] Arquivamento: status → `arquivada`, redirect para `/minutas`, lista reflete contagem
- [x] Configurações: seção "Montador de Minutas" com 4 contadores + "✓ Ativo"
- [x] Sidebar: link "Minutas" com active state por pathname
- [x] Build final: tsc 0 erros, eslint 0 warnings, `next build` ✓ Compiled successfully in 8.2s

**Bug encontrado e corrigido:**
- `atualizarStatusMinuta` em `lib/actions.ts` ignorava o campo `responsavel` do form — corrigido para salvar `(formData.get('responsavel') as Responsavel) || existing.responsavel`

**Limitações ativas (por design):**
- Exportação DOCX/PDF: não implementada nesta fase — implementada na Fase 10.5
- Geração por IA: não implementada — restrição explícita do projeto
- Permissões por role: todos authenticated têm acesso total — aguarda Fase 11

---

## Fase 10.5 — Exportação DOCX Simples ✅ (2026-05)

**Objetivo:** Permitir que minutas assistidas sejam exportadas para arquivo Word (.docx) editável, server-side, com autenticação, sem IA e sem geração jurídica autônoma.

**Entregáveis:**
- [x] `package.json` — dependência `docx` v9 adicionada (biblioteca TypeScript pura, sem binários nativos)
- [x] `lib/export-minutas.ts` — funções: `gerarDocxMinuta(minuta)`, `formatarConteudoMinutaParaDocx(conteudo)`, `nomeArquivoDocx(minuta)`; DOCX com cabeçalho, título, tabela de metadados, conteúdo estruturado e aviso final
- [x] `app/(app)/api/minutas/[id]/export/docx/route.ts` — endpoint `GET /api/minutas/[id]/export/docx`; auth via `createSupabaseServerClient()` + `getUser()` → 401 se não autenticado; 404 para id inexistente; headers `Content-Type`, `Content-Disposition: attachment`, `Cache-Control: no-store`
- [x] `app/(app)/minutas/[id]/page.tsx` — botão "Exportar DOCX" (`<a href>` direto) + placeholder "PDF — em breve" preservado
- [x] `app/(app)/configuracoes/page.tsx` — linhas "Exportação DOCX: ✓ Ativa" e "Exportação PDF: Fase 10.5.1 — futura"
- [x] `_memoria/04-regras-do-sistema.md` — seção "Regras de Exportação de Minutas (Fase 10.5)" documentada
- [x] `_memoria/05-roadmap.md` — Fase 10.5 marcada como entregue

**Estrutura do DOCX gerado:**
1. Cabeçalho — "PIPE OS — Pré-Minuta Assistida"
2. Título da minuta (destaque, bold, 36pt)
3. Tabela de metadados (status, tipo, responsável, origem, modelo, cláusulas, checklist, orientações, observações)
4. Conteúdo da minuta (linhas → parágrafos; seções em bold; checklist em monospace; riscos em itálico âmbar)
5. Aviso final obrigatório de revisão jurídica humana
6. Rodapé com data e nome do escritório

**Segurança:**
- Geração sempre server-side — nunca no client
- `getMinutaAssistidaById` usa RLS autenticado (sem service role)
- Minutas arquivadas podem ser exportadas (histórico)
- ID arbitrário → 404 controlado

**Build final:**
- `eslint . --ext .ts,.tsx --max-warnings=0` — 0 erros, 0 warnings
- `npm run build` — ✓ Compiled successfully

**Limitações:**
- PDF implementado na Fase 10.5.1
- Formatação DOCX é simples (sem estilos avançados, sem imagens, sem tabelas de cláusulas)
- Sem campo de auditoria `ultimoExportDocxEm` nesta fase

---

## Fase 10.5.1 — Exportação PDF Simples ✅ (2026-05)

**Objetivo:** Adicionar exportação PDF complementar à DOCX, usando `pdfkit` (pure Node.js), server-side, com autenticação.

**Entregáveis:**
- [x] `package.json` — dependência `pdfkit` v0.18 + `@types/pdfkit` devDependency
- [x] `next.config.ts` — `serverExternalPackages: ['pdfkit']` adicionado
- [x] `lib/export-minutas.ts` — funções adicionadas: `sanitizarParaPdf()`, `nomeArquivoPdf(minuta)`, `gerarPdfMinuta(minuta)` (stream-based, dynamic import)
- [x] `app/(app)/api/minutas/[id]/export/pdf/route.ts` — endpoint `GET /api/minutas/[id]/export/pdf`; mesmo padrão de auth do DOCX; 401/404/500 controlados
- [x] `app/(app)/minutas/[id]/page.tsx` — botão "Exportar PDF" substituiu placeholder "PDF — em breve"
- [x] `app/(app)/configuracoes/page.tsx` — "Exportação PDF: ✓ Ativa"
- [x] `_memoria/04-regras-do-sistema.md` — regras PDF documentadas
- [x] `_memoria/05-roadmap.md` — Fase 10.5.1 marcada como entregue

**Estrutura do PDF gerado (pdfkit):**
1. Cabeçalho cinza + linha dourada
2. Título bold 18pt (azul marinho)
3. Tipo de documento 10pt (cinza)
4. Metadados key:value (label bold + value normal, 9pt)
5. Linha divisória cinza
6. Conteúdo linha a linha com tipografia diferenciada: seções bold azul, checklist `Courier`, riscos itálico âmbar, default 9pt cinza-escuro
7. Aviso final com borda dourada e texto itálico âmbar
8. Rodapé alinhado à direita

**Decisões técnicas:**
- `import('pdfkit')` dinâmico — evita análise estática do bundler sobre os internals do pdfkit (fontes, fs)
- `sanitizarParaPdf()` — converte chars Unicode fora de Latin-1 para equivalentes ASCII (pdfkit usa Helvetica built-in que cobre apenas Latin-1)
- Geração stream → Promise: `doc.on('data'/'end'/'error')` → `resolve(Buffer.concat(chunks))`

**Build final:**
- `eslint . --ext .ts,.tsx --max-warnings=0` — 0 erros, 0 warnings
- `npm run build` — ✓ Compiled successfully

**Limitações:**
- pdfkit usa fontes Helvetica/Courier built-in (Latin-1) — chars fora desse conjunto são sanitizados para ASCII
- Layout básico (sem header institucional com logo, sem numeração de páginas, sem sumário)
- Sem campo de auditoria `ultimoExportPdfEm`

---

## Fase 10.4 — Refinamento do Montador Assistido de Minutas ✅ (2026-05)

**Objetivo:** Melhorar qualidade, usabilidade e rastreabilidade do módulo de minutas sem quebrar funcionalidades existentes e sem introduzir IA, exportação ou RAG.

**Entregáveis:**

### Listagem e filtros
- [x] `/minutas` — 6 stat cards: total ativas, rascunhos, em revisão, aprovadas, arquivadas, últimos 7 dias
- [x] `/minutas` — filtros por `q` (texto), `status`, `tipo`, `entityType`, `responsavel` via `searchParams` + `<form method="GET">`
- [x] `/minutas` — contador "Arquivadas" visível no stat card (incluindo filtro `?status=arquivada`)
- [x] `/minutas` — coluna Ações na tabela: botões "Duplicar" e "Arquivar" por row como Server Action forms
- [x] `/configuracoes` — seção "Montador de Minutas" expandida para 5 contadores (arquivadas adicionado) com links filtrados

### Qualidade do conteúdo gerado
- [x] `lib/utils.ts` — `MontarMinutaInput` enriquecido: `entityContext`, `entityLabel`, clausulas com `aplicacao`/`riscos`, checklist items com `obrigatorio`, orientacoes com `tema`
- [x] `lib/utils.ts` — `montarConteudoMinutaAssistida()` agora produz 7 seções: 0. Contexto da origem, 1-4. existentes, 5. Observações, 6. Pontos de atenção (8 itens fixos)
- [x] `lib/utils.ts` — `getEntityHref(entityType, entityId)` para links de origem clicáveis
- [x] `lib/actions.ts` — `criarMinutaAssistida()` busca dados da entidade de origem para todos os 5 tipos e constrói `entityContext` para enriquecer o conteúdo gerado

### Edição do conteúdo
- [x] `MinutaNovaWizard.tsx` — passo 6: `<textarea>` editável substituindo `<pre>` read-only; estado `conteudoManual: string | null`; botão "↺ Regenerar"; IIFE para `previewGerado` (sem `useEffect`)
- [x] `app/(app)/minutas/[id]/page.tsx` — `<details>` "Editar título e conteúdo" com textarea + form → `atualizarConteudoMinutaAssistida`
- [x] `lib/actions.ts` — `atualizarConteudoMinutaAssistida(id, formData)` — atualiza `conteudo` e `titulo`

### Rastreabilidade e status
- [x] `lib/types.ts` — `MinutaAssistida` expandida: campos `entityLabel`, `duplicadaDeId`, `revisadoEm`, `aprovadoEm`
- [x] `lib/actions.ts` — `atualizarStatusMinuta()` seta `revisadoEm` ao mudar para `em_revisao`, `aprovadoEm` ao mudar para `aprovada`
- [x] `app/(app)/minutas/[id]/page.tsx` — exibe `revisadoEm`, `aprovadoEm`, `duplicadaDeId` (link para original), link de origem clicável via `getEntityHref`

### Duplicar minuta
- [x] `lib/actions.ts` — `duplicarMinutaAssistida(id)`: copia minuta, novo UUID, `status='rascunho'`, `duplicadaDeId=original.id`, limpa `revisadoEm`/`aprovadoEm`, redirect para nova minuta
- [x] `/minutas` e `/minutas/[id]` — botão "Duplicar" disponível

### Minutas vinculadas nas páginas de entidade
- [x] `app/(app)/comercial/oportunidades/[id]/page.tsx` — seção "Minutas assistidas vinculadas"
- [x] `app/(app)/comercial/propostas/[id]/page.tsx` — seção "Minutas assistidas vinculadas"
- [x] `app/(app)/extrajudiciais/[id]/page.tsx` — seção "Minutas assistidas vinculadas"
- [x] `app/(app)/processos/[id]/page.tsx` — seção "Minutas assistidas vinculadas"
- [x] `app/(app)/consultorias/[id]/page.tsx` — seção "Minutas assistidas vinculadas"

### Melhorias de UX
- [x] `components/ui/CopyButton.tsx` — `try/catch` + fallback `execCommand('copy')` para ambientes non-HTTPS
- [x] `/minutas/[id]` — botão "Exportar — em breve" (placeholder desabilitado, `opacity-50`, `title` explicativo)
- [x] `_memoria/04-regras-do-sistema.md` — regras da Fase 10.4 documentadas
- [x] `_memoria/05-roadmap.md` — Fase 10.4 marcada como entregue
- [x] `_memoria/06-modelo-de-dados.md` — MinutaAssistida atualizada com 4 novos campos

**Build final:**
- `eslint . --ext .ts,.tsx --max-warnings=0` — 0 erros, 0 warnings
- `npm run build` — ✓ Compiled successfully, 52 rotas, tsc 0 erros

**Restrições respeitadas:**
- Nenhuma exportação DOCX/PDF implementada
- Nenhuma geração por IA
- Nenhum RAG/vector database
- Nenhuma análise de PDF
- Auth/RLS não alterados
- Advisor preservado
- Base de Conhecimento preservada
- Todas as rotas existentes funcionando

---

## Fase 11A — Permissões por Role no App ✅ (2026-05)

**Objetivo:** Criar camada de autorização por perfil de usuário no nível da aplicação, antes de endurecer o RLS no banco (Fase 11B).

**Entregáveis:**
- [x] `lib/permissions.ts` — tipo `Permission` (34 permissões), `ROLE_PERMISSIONS` por `UserRole`, helpers: `getRolePermissions`, `hasPermission`, `hasAnyPermission`, `hasAllPermissions`, `canAccessRoute`, `canManageEntity`, `canViewEntity`
- [x] `lib/auth.ts` — helpers adicionados: `getCurrentRole()`, `requirePermission(permission)`, `requireAnyPermission(permissions[])`, `requireRole(roles[])`
- [x] `lib/data.ts` — funções adicionadas: `getProfileById(id)`, `saveProfile(profile)` (tabela profiles — queries diretas, não document-store)
- [x] `app/(app)/acesso-negado/page.tsx` — página de acesso negado com botão "Voltar ao Dashboard"
- [x] `components/Sidebar.tsx` — prop `userRole?: UserRole` adicionada; itens filtrados por permissão; exibe role no rodapé
- [x] `app/(app)/layout.tsx` — busca `getCurrentProfile()`, passa `userRole` para Sidebar; fallback = `'assistente'`
- [x] Proteção de 10 páginas principais: `/advisor`, `/comercial`, `/processos`, `/extrajudiciais`, `/consultorias`, `/tarefas`, `/documentos`, `/conhecimento`, `/minutas`, `/configuracoes` (via `requirePermission` em cada page.tsx)
- [x] APIs protegidas com 403: `/api/advisor` → `advisor:use`; `/api/minutas/[id]/export/docx` → `minutas:export`; `/api/minutas/[id]/export/pdf` → `minutas:export`
- [x] Server Actions protegidas com `requireActionPermission()`: criar/atualizar Processo, Consultoria, Extrajudicial, Imobiliária, Corretor, Cliente, Oportunidade, Proposta, Modelo, Minuta, arquivarMinuta
- [x] `lib/actions.ts` — `atualizarProfileRoleStatus` (requer `users:manage`)
- [x] `app/(app)/configuracoes/page.tsx` — admin vê formulários inline de edição de `role`/`status` por profile; não-admin vê só leitura
- [x] `_memoria/04-regras-do-sistema.md` — regras Fase 11A documentadas
- [x] `_memoria/05-roadmap.md` — Fase 11A marcada como entregue

**Matriz de permissões:**
- `admin`: acesso total (34 permissões)
- `advogado`: jurídico completo + minutas:export + commercial:view (sem manage) + settings:view
- `assistente`: jurídico manage (processos/extrajudiciais) + minutas:manage/export + conhecimento:view + settings:view
- `comercial`: comercial completo + jurídico:view + minutas:view (sem export) + settings:view

**Restrições respeitadas:**
- RLS por role no banco: NÃO implementado — aguarda Fase 11B
- RLS mínimo authenticated: ativo e intacto
- Auth/Supabase: não alterado
- Exportação DOCX/PDF: preservada (agora requer `minutas:export`)
- Advisor: preservado (agora requer `advisor:use`)
- Build/tsc/eslint: OK

---

## Fase 11A.1 — Hardening da Camada de Permissões no App ✅ (2026-05)

**Objetivo:** Fortalecer a camada de permissões antes da Fase 11B (RLS por role no banco), garantindo menor privilégio, UX coerente, proteção granular de subpáginas e todas as Server Actions cobertas.

**Entregáveis:**
- [x] `components/Sidebar.tsx` — `canSee` corrigido para menor privilégio: sem `userRole` → oculta itens com permission; rodapé exibe "Perfil não definido" quando sem role
- [x] `components/AccessControl.tsx` — novo componente `'use client'`; props: `role`, `permission`, `anyPermissions`, `allPermissions`, `fallback`
- [x] `/api/advisor/entity/route.ts` — proteção `advisor:use` adicionada (estava faltando na Fase 11A)
- [x] `lib/actions.ts` — guards `requireActionPermission()` adicionados a todas as 38+ actions mutáveis sem proteção: excluirProcesso, adicionarMovimentacao, excluirConsultoria, excluirExtrajudicial, adicionarEtapa, toggleEtapa, adicionarDocumento, toggleDocumento, desativarImobiliaria, excluirCliente, moverStatusOportunidade, registrarPerda, adicionarInteracao, alterarStatusProposta, marcarPropostaAceita, marcarPropostaRecusada, marcarPropostaVencida, arquivarProposta, criarTarefa, atualizarTarefa, alterarStatusTarefa, excluirTarefa, criarArquivo, alterarStatusArquivo, excluirArquivo, arquivarModeloJuridico, criarClausulaPadrao, atualizarClausulaPadrao, arquivarClausulaPadrao, criarChecklistJuridico, atualizarChecklistJuridico, arquivarChecklistJuridico, criarOrientacaoInterna, atualizarOrientacaoInterna, arquivarOrientacaoInterna, atualizarStatusMinuta, atualizarConteudoMinutaAssistida, duplicarMinutaAssistida
- [x] Proteção de 38 subpáginas com `requirePermission`: todas as subpáginas de comercial, jurídico, conhecimento, minutas, tarefas, documentos (listagem → `:view`, criação → `:manage`, detalhe → `:view`)
- [x] Botões "Novo/Criar" condicionados por role em 13 páginas de listagem: imobiliarias, corretores, clientes, oportunidades, propostas, processos, extrajudiciais, consultorias, modelos, clausulas, checklists, orientacoes, minutas
- [x] Botões de ação em minutas/[id]: Duplicar, Arquivar, Atualizar status, Editar conteúdo (`minutas:manage`); Exportar DOCX/PDF (`minutas:export`) — todos condicionados por role
- [x] `_memoria/04-regras-do-sistema.md` — regras Fase 11A.1 documentadas
- [x] `_memoria/05-roadmap.md` — Fase 11A.1 marcada como entregue

**Restrições respeitadas (todas as da 11A + novas):**
- RLS por role no banco: NÃO implementado — aguarda Fase 11B
- Nenhuma quebra de Auth, RLS, exportação DOCX/PDF, Advisor, Minutas, Base de Conhecimento
- Fallback de Sidebar corrigido para menor privilégio (sem fallback permissivo)

---

## Fase 11B — RLS por Role no Supabase ✅ (2026-05)

**Objetivo:** Adicionar defesa em profundidade no banco — policies Supabase granulares por role, alinhadas à matriz de permissões do app, impedindo bypass direto mesmo com JWT válido.

**Arquivos criados:**
- [x] `scripts/rls-role-based.sql` — script principal idempotente com: funções helper (`current_user_role`, `has_any_role`), policies de profiles, policies de 15 tabelas operacionais por role
- [x] `scripts/rls-rollback-authenticated.sql` — rollback de emergência para o estado de `rls-minimo-authenticated.sql`
- [x] `scripts/rls-minimo-authenticated.sql` — adicionado comentário de referência para `rls-role-based.sql`
- [x] `_memoria/04-regras-do-sistema.md` — regras Fase 11B documentadas (funções helper, matriz banco, convenção de nomes, efeitos de status=inativo)
- [x] `_memoria/05-roadmap.md` — Fase 11B marcada como entregue
- [x] `_memoria/06-modelo-de-dados.md` — RLS por role documentado nas entidades

**Funções SQL criadas:**
- `public.current_user_role()` — retorna role do usuário autenticado (consulta profiles por auth.uid(), filtra status=ativo)
- `public.has_any_role(text[])` — verifica role do usuário contra lista; usada como condição em todas as policies

**Políticas por tabela:**
- **profiles:** select own (todos) + select all (admin) + update (admin only)
- **imobiliarias/corretores:** select (todos) | write (admin, comercial)
- **clientes/oportunidades/propostas:** select (todos) | write (admin, advogado, comercial)
- **processos/extrajudiciais:** select (todos) | write (admin, advogado, assistente)
- **consultorias:** select (todos) | write (admin, advogado)
- **tarefas:** select (todos) | write (todos os 4 roles)
- **arquivos:** select (todos) | write (admin, advogado, assistente)
- **knowledge (4 tabelas):** select (todos) | write (admin, advogado)
- **minutas_assistidas:** select (todos) | write (admin, advogado, assistente)

**Decisões técnicas:**
- `security definer` + `set search_path = public` para segurança sem circular dependency
- `stable` para otimização (cache de resultado dentro de uma query)
- Roles em português: `admin`, `advogado`, `assistente`, `comercial`
- Status: `'ativo'` (não active)
- Grant revogado de `public`, concedido apenas a `authenticated`
- Assistente tem SELECT em imobiliarias/corretores (precisa para dropdowns em formulários jurídicos)

**Como aplicar:**
1. Ter rodado `rls-minimo-authenticated.sql` (pré-requisito)
2. Abrir Supabase Dashboard → SQL Editor → New query
3. Colar e rodar `scripts/rls-role-based.sql`
4. Verificar com queries de verificação do script
5. Testar cada role conforme plano de testes

**Restrições respeitadas:**
- JWT custom claims não usados (role lido de public.profiles)
- Service role não exposto
- Auth não alterado
- RLS mínimo authenticated continua válido como base
- App-layer (Fase 11A.1) permanece ativo como primeira camada
- Build/tsc/eslint: sem alterações de código TypeScript → OK (scripts SQL apenas)
