# 06 — Modelo de Dados

## Entidades e relacionamentos

```
Imobiliaria 1 ──── N Corretor
Corretor    1 ──── N Cliente
Corretor    1 ──── N Oportunidade
Cliente     1 ──── N Oportunidade
Oportunidade 1 ─── N Proposta
Oportunidade 1 ─── N Extrajudicial
Proposta    1 ──── N Extrajudicial
Imobiliaria 1 ──── N Consultoria
Imobiliaria 1 ──── N Processo
Cliente     1 ──── N Processo
```

---

## 1. Imobiliaria

Arquivo: `data/imobiliarias.json`

| Campo | Tipo | Obrigatório | Notas |
|-------|------|-------------|-------|
| id | string | ✓ | `im-XXX` |
| nome | string | ✓ | Nome fantasia |
| cnpj | string | | Formatado |
| cidade | string | | |
| endereco | string | | |
| responsavel | Responsavel | ✓ | Giovanni ou Enrico |
| telefone | string | | |
| email | string | | |
| status | StatusImobiliaria | ✓ | |
| valorMensal | number | ✓ | R$ |
| dataInicio | string | | ISO date |
| dataRenovacao | string | | ISO date — alerta próxima |
| nivelRelacionamento | NivelRelacionamento | | |
| ultimaInteracao | string | | ISO date |
| proximaAcao | string | | Descrição da próxima ação |
| proximaAcaoData | string | | ISO date |
| observacoes | string | | |
| createdAt | string | ✓ | ISO datetime |
| updatedAt | string | ✓ | ISO datetime |

**StatusImobiliaria:** `ativa` | `inativa` | `suspensa`
**NivelRelacionamento:** `estrategico` | `ativo` | `neutro` | `em_risco`

---

## 2. Corretor

Arquivo: `data/corretores.json`

| Campo | Tipo | Obrigatório | Notas |
|-------|------|-------------|-------|
| id | string | ✓ | `co-XXX` |
| imobiliariaId | string | ✓ | FK → Imobiliaria |
| nome | string | ✓ | |
| telefone | string | | WhatsApp preferencial |
| email | string | | |
| creci | string | | |
| status | StatusCorretor | ✓ | |
| nivelRelacionamento | NivelRelacionamento | | |
| quantidadeIndicacoes | number | | Calculado ou manual |
| faturamentoGerado | number | | R$ acumulado |
| ultimaInteracao | string | | ISO date |
| proximaAcao | string | | |
| proximaAcaoData | string | | ISO date |
| observacoes | string | | |
| createdAt | string | ✓ | |
| updatedAt | string | ✓ | |

**StatusCorretor:** `ativo` | `inativo`

---

## 3. Cliente

Arquivo: `data/clientes.json`

| Campo | Tipo | Obrigatório | Notas |
|-------|------|-------------|-------|
| id | string | ✓ | `cl-XXX` |
| nome | string | ✓ | |
| documento | string | | CPF ou CNPJ |
| telefone | string | | |
| email | string | | |
| origem | OrigemCliente | ✓ | |
| corretorId | string | | FK → Corretor (se indicado) |
| imobiliariaId | string | | FK → Imobiliaria |
| observacoes | string | | |
| createdAt | string | ✓ | |
| updatedAt | string | ✓ | |

**OrigemCliente:** `corretor` | `imobiliaria` | `indicacao_pf` | `direto` | `outro`

---

## 4. Oportunidade

Arquivo: `data/oportunidades.json`

| Campo | Tipo | Obrigatório | Notas |
|-------|------|-------------|-------|
| id | string | ✓ | `op-XXX` |
| titulo | string | ✓ | Breve descrição |
| clienteId | string | ✓ | FK → Cliente |
| corretorId | string | | FK → Corretor |
| imobiliariaId | string | | FK → Imobiliaria |
| tipoServico | TipoExtrajudicial | | Tipo de serviço esperado |
| status | StatusComercial | ✓ | |
| valorEstimado | number | | R$ |
| probabilidade | number | | 0–100 |
| responsavel | Responsavel | ✓ | |
| proximoFollowUp | string | | ISO date |
| origem | string | | Como chegou |
| observacoes | string | | |
| motivoPerda | string | | Preenchido se status=perdido |
| createdAt | string | ✓ | |
| updatedAt | string | ✓ | |

**StatusComercial:** ver `03-operacao-comercial.md`

---

## 5. Proposta

Arquivo: `data/propostas.json`

| Campo | Tipo | Obrigatório | Notas |
|-------|------|-------------|-------|
| id | string | ✓ | `pr-XXX` |
| oportunidadeId | string | ✓ | FK → Oportunidade |
| clienteId | string | ✓ | FK → Cliente |
| titulo | string | ✓ | |
| escopo | string[] | ✓ | Lista de serviços |
| valorTotal | number | ✓ | R$ |
| entrada | number | | R$ |
| parcelas | number | | Quantidade |
| valorParcela | number | | R$ |
| status | StatusProposta | ✓ | |
| validade | string | | ISO date |
| dataEnvio | string | | ISO date |
| dataAceite | string | | ISO date |
| dataRecusa | string | | ISO date |
| motivoRecusa | string | | |
| observacoes | string | | |
| createdAt | string | ✓ | |
| updatedAt | string | ✓ | |

**StatusProposta:** `rascunho` | `enviada` | `aceita` | `recusada` | `expirada`

---

## 6. Extrajudicial (expandido)

Arquivo: `data/extrajudiciais.json` (já existe)

**Campos adicionais a incluir futuramente:**
- `clienteId: string` (FK → Cliente)
- `corretorId?: string` (FK → Corretor)
- `imobiliariaId?: string` (FK → Imobiliaria)
- `oportunidadeId?: string` (FK → Oportunidade)
- `propostaId?: string` (FK → Proposta)
- `prioridade: 'baixa' | 'normal' | 'alta' | 'urgente'`

---

## 7. Processo (expandido)

Arquivo: `data/processos.json` (já existe)

**Campos adicionais a incluir futuramente:**
- `clienteId?: string` (FK → Cliente)
- `imobiliariaId?: string` (FK → Imobiliaria)
- `valorCausa?: number` (R$)

---

## 8. Consultoria (expandida)

Arquivo: `data/consultorias.json` (já existe)

**Campo a ajustar:**
- `imobiliaria: string` → migrar para `imobiliariaId: string` (FK → Imobiliaria)
- Manter `imobiliaria: string` como campo de display durante transição

---

---

## 9. ModeloJuridico (Fase 10)

Tabela Supabase: `modelos_juridicos` (document-store: `id text pk, data jsonb`)

| Campo | Tipo | Obrigatório | Notas |
|-------|------|-------------|-------|
| id | string | ✓ | `mj-XXX` |
| titulo | string | ✓ | |
| descricao | string | | |
| categoria | CategoriaModelo | ✓ | contrato/notificacao/proposta/etc |
| tipoDocumento | TipoDocumento | ✓ | compra_venda/locacao/etc |
| area | string | ✓ | Ex: Direito Imobiliário |
| status | StatusBaseConhecimento | ✓ | ativo/rascunho/em_revisao/desatualizado/arquivado |
| versao | string | ✓ | Ex: 1.0 |
| conteudo | string | ✓ | Texto do modelo |
| tags | string[] | ✓ | |
| responsavel | Responsavel | ✓ | |
| ultimaRevisao | string | | ISO date |
| createdAt | string | ✓ | |
| updatedAt | string | ✓ | |

---

## 10. ClausulaPadrao (Fase 10)

Tabela Supabase: `clausulas_padrao` (document-store)

| Campo | Tipo | Obrigatório | Notas |
|-------|------|-------------|-------|
| id | string | ✓ | `cp-XXX` |
| titulo | string | ✓ | |
| descricao | string | | |
| categoria | CategoriaClausula | ✓ | pagamento/posse/financiamento/etc |
| area | string | ✓ | |
| aplicacao | string | ✓ | Onde se aplica |
| texto | string | ✓ | Texto da cláusula |
| riscos | string | | Riscos e pontos de atenção |
| tags | string[] | ✓ | |
| status | StatusBaseConhecimento | ✓ | |
| responsavel | Responsavel | ✓ | |
| ultimaRevisao | string | | |
| createdAt | string | ✓ | |
| updatedAt | string | ✓ | |

---

## 11. ChecklistJuridico (Fase 10)

Tabela Supabase: `checklists_juridicos` (document-store)

| Campo | Tipo | Obrigatório | Notas |
|-------|------|-------------|-------|
| id | string | ✓ | `cl-XXX` |
| titulo | string | ✓ | |
| descricao | string | | |
| tipoDemanda | string | ✓ | Ex: compra_venda_financiamento |
| area | string | ✓ | |
| itens | ItemChecklist[] | ✓ | Array de itens |
| status | StatusBaseConhecimento | ✓ | |
| responsavel | Responsavel | ✓ | |
| ultimaRevisao | string | | |
| createdAt | string | ✓ | |
| updatedAt | string | ✓ | |

**ItemChecklist:** `{ id: string; texto: string; obrigatorio: boolean; ordem: number; observacao?: string }`

---

## 12. OrientacaoInterna (Fase 10)

Tabela Supabase: `orientacoes_internas` (document-store)

| Campo | Tipo | Obrigatório | Notas |
|-------|------|-------------|-------|
| id | string | ✓ | `oi-XXX` |
| titulo | string | ✓ | |
| descricao | string | | |
| area | string | ✓ | |
| tema | string | ✓ | Ex: Financiamento Bancário |
| conteudo | string | ✓ | Texto livre estruturado |
| tags | string[] | ✓ | |
| status | StatusBaseConhecimento | ✓ | |
| responsavel | Responsavel | ✓ | |
| ultimaRevisao | string | | |
| createdAt | string | ✓ | |
| updatedAt | string | ✓ | |

---

## 13. MinutaAssistida (Fase 10.3 — campos expandidos na Fase 10.4)

Tabela Supabase: `minutas_assistidas` (document-store: `id text pk, data jsonb`)

| Campo | Tipo | Obrigatório | Notas |
|-------|------|-------------|-------|
| id | string | ✓ | UUID (`randomUUID()`) |
| titulo | string | ✓ | Título descritivo da minuta |
| status | StatusMinuta | ✓ | `rascunho` \| `em_revisao` \| `aprovada` \| `arquivada` |
| entityType | MinutaEntityType | | `processo` \| `extrajudicial` \| `consultoria` \| `oportunidade` \| `proposta` |
| entityId | string | | FK para a entidade de origem |
| entityLabel | string | | *(Fase 10.4)* Label desnormalizado da entidade de origem para exibição |
| tipoDocumento | TipoDocumentoMinuta | ✓ | `compra_e_venda` \| `locacao` \| `inventario` \| ... |
| modeloId | string | | FK → ModeloJuridico (opcional) |
| modeloTitulo | string | | Denormalizado para exibição |
| clausulaIds | string[] | ✓ | Array de IDs de ClausulaPadrao (pode ser vazio) |
| checklistId | string | | FK → ChecklistJuridico (opcional) |
| checklistTitulo | string | | Denormalizado para exibição |
| orientacaoIds | string[] | ✓ | Array de IDs de OrientacaoInterna (pode ser vazio) |
| conteudo | string | ✓ | Texto gerado por `montarConteudoMinutaAssistida()` — 7 seções + aviso jurídico (Fase 10.4: 0. Contexto, 6. Pontos de atenção) |
| responsavel | Responsavel | ✓ | Membro da equipe responsável |
| observacoes | string | | Observações internas |
| duplicadaDeId | string | | *(Fase 10.4)* ID da minuta original se esta for uma cópia via `duplicarMinutaAssistida` |
| revisadoEm | string | | *(Fase 10.4)* ISO datetime — preenchido automaticamente ao mudar status para `em_revisao` |
| aprovadoEm | string | | *(Fase 10.4)* ISO datetime — preenchido automaticamente ao mudar status para `aprovada` |
| createdAt | string | ✓ | ISO datetime |
| updatedAt | string | ✓ | ISO datetime |

**StatusMinuta:** `rascunho` | `em_revisao` | `aprovada` | `arquivada`

**TipoDocumentoMinuta:** `compra_e_venda` | `locacao` | `inventario` | `compromisso` | `procuracao` | `notificacao` | `parecer` | `outro`

**MinutaEntityType:** `processo` | `extrajudicial` | `consultoria` | `oportunidade` | `proposta`

**Restrições:**
- Nunca deletar — apenas arquivar (status `arquivada`)
- Arquivadas ficam ocultas na lista mas persistem no banco
- Conteúdo é gerado no momento da criação por `montarConteudoMinutaAssistida()` — não há IA
- Conteúdo pode ser editado manualmente pelo usuário após criação via `atualizarConteudoMinutaAssistida`
- Sem exportação DOCX/PDF (aguarda fase futura)

---

## Diagrama de relacionamentos

```
[Imobiliaria] ←── imobiliariaId ──── [Corretor]
[Imobiliaria] ←── imobiliariaId ──── [Consultoria]
[Imobiliaria] ←── imobiliariaId ──── [Extrajudicial]
[Corretor]    ←── corretorId   ──── [Cliente]
[Corretor]    ←── corretorId   ──── [Oportunidade]
[Cliente]     ←── clienteId    ──── [Oportunidade]
[Oportunidade]←── oportunidadeId ── [Proposta]
[Oportunidade]←── oportunidadeId ── [Extrajudicial]
[Proposta]    ←── propostaId   ──── [Extrajudicial]
[Cliente]     ←── clienteId    ──── [Extrajudicial]
[Cliente]     ←── clienteId    ──── [Processo]
```

---

## RLS por Role no Banco (Fase 11B — ativo desde 2026-05)

As 16 tabelas do sistema têm Row Level Security ativo com policies granulares por role.
O role do usuário é lido de `public.profiles` via função helper `has_any_role(text[])`.

### Profiles (relacional — Fase 8)
- Tabela: `profiles` (`id uuid pk → auth.users`, `role text`, `status text`)
- Status válidos: `ativo` | `inativo`
- Roles válidos: `admin` | `advogado` | `assistente` | `comercial`
- RLS: SELECT own profile (todos) + SELECT all (admin) + UPDATE all (admin)
- INSERT via trigger `on_auth_user_created` (security definer, bypassa RLS)

### Tabelas document-store (todas)
- Schema: `(id text pk, data jsonb)` — sem colunas individuais
- RLS via `has_any_role(array['role1', 'role2', ...])` em cada policy
- SELECT: todos os 4 roles ativos têm acesso completo de leitura
- WRITE: restrito por role conforme matriz em `04-regras-do-sistema.md`

### Funções helper SQL
```sql
-- Retorna o role do usuário ativo (NULL se inativo/sem profile)
public.current_user_role() returns text

-- Verifica se o usuário tem qualquer um dos roles listados
public.has_any_role(allowed_roles text[]) returns boolean
```

Ambas: `security definer`, `set search_path = public`, `stable`, grant apenas a `authenticated`.

### Scripts SQL
| Script | Propósito |
|--------|-----------|
| `scripts/rls-minimo-authenticated.sql` | Base: anon bloqueado, authenticated full access |
| `scripts/rls-role-based.sql` | Substituição: policies granulares por role (Fase 11B) |
| `scripts/rls-rollback-authenticated.sql` | Rollback de emergência para estado mínimo |
