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
