# 03 — Operação Comercial

## O que é a operação comercial do escritório

O escritório não tem um setor comercial formal. Giovanni opera o comercial de forma pessoal e direta, principalmente via WhatsApp com corretores e gestores de imobiliárias.

O problema: sem sistema, a maioria das oportunidades morre por falta de follow-up.

---

## Fontes de geração de oportunidades

| Fonte | Mecanismo | Volume estimado |
|-------|-----------|----------------|
| Corretores vinculados | Indicação direta via WhatsApp | Principal |
| Gestores de imobiliárias | Demanda da conta mensal | Secundário |
| Indicação de clientes PF atendidos | Boca a boca | Esporádico |
| Eventos / treinamentos | Contato presencial | Esporádico |

---

## Ciclo comercial completo

```
Lead entra
    → Primeiro contato (WhatsApp/telefone)
    → Diagnóstico (qual a demanda real?)
    → Proposta de honorários (valor, escopo, prazo)
    → Follow-up (1, 3, 7 dias)
    → Negociação (ajuste de valor ou escopo)
    → Fechamento → Demanda jurídica aberta
           ou
    → Perda → Motivo registrado (valor, timing, concorrente, sem necessidade)
```

---

## Status comerciais do pipeline

| Status | Significado |
|--------|-------------|
| `novo_lead` | Indicação recebida, ainda não contatada |
| `primeiro_contato` | Contato feito, aguardando resposta |
| `diagnostico_pendente` | Respondeu, precisa de diagnóstico |
| `diagnostico_realizado` | Diagnóstico feito, pronto para proposta |
| `proposta_enviada` | Proposta enviada, aguardando resposta |
| `follow_up` | Em acompanhamento pós-proposta |
| `negociacao` | Negociando valor ou escopo |
| `contrato_enviado` | Contrato enviado para assinatura |
| `fechado` | Oportunidade convertida |
| `perdido` | Oportunidade perdida (registrar motivo) |
| `nutricao` | Lead frio mantido para abordagem futura |

---

## Gestão de Imobiliárias (Contas Estratégicas)

Cada imobiliária é uma conta que precisa de gestão ativa:

**Relacionamento:**
- Responsável interno (Giovanni ou Enrico)
- Nível de relacionamento: `estrategico` | `ativo` | `neutro` | `em_risco`
- Última interação registrada
- Próxima ação planejada (data + descrição)

**Financeiro:**
- Valor mensal da consultoria
- Status de pagamento
- Data de renovação do contrato
- Histórico de faturas

**Oportunidades:**
- Demandas ativas geradas por corretores dessa imobiliária
- Volume histórico de indicações
- Faturamento total gerado

---

## Gestão de Corretores (Canal de Aquisição)

Cada corretor é um canal. Corretores precisam de relacionamento ativo para gerar indicações.

**Dados críticos:**
- Imobiliária à qual pertence
- Nível de relacionamento: `ativo` | `neutro` | `frio` | `inativo`
- Quantidade de indicações históricas
- Faturamento gerado (soma das demandas que originou)
- Última interação
- Próxima ação planejada

**Regra comercial:** Um corretor que fez 3+ indicações é um corretor ativo. Deve receber atenção e reconhecimento periódico.

---

## Propostas de Honorários

Toda oportunidade que avança para proposta precisa de:

| Campo | Descrição |
|-------|-----------|
| Título | Nome da proposta |
| Escopo | Lista de serviços inclusos |
| Valor total | Honorários totais |
| Entrada | Valor da entrada |
| Parcelas | Quantidade e valor das parcelas |
| Validade | Data de validade da proposta |
| Status | `rascunho` / `enviada` / `aceita` / `recusada` / `expirada` |
| Motivo recusa | Registrado quando status = recusada |
| Data aceite/recusa | Para cálculo de tempo de decisão |

Proposta aceita → abre demanda jurídica automaticamente (vínculo `proposta_id`).

---

## Follow-up e CRM

Sem sistema de follow-up, o escritório perde oportunidades por esquecimento. O PIPE OS deve mostrar:

- Oportunidades sem interação há mais de X dias → **alerta**
- Propostas enviadas há mais de 7 dias sem resposta → **alerta**
- Corretores sem contato há mais de 30 dias → **sugestão de reativação**
- Imobiliárias com entrega mensal pendente → **alerta**
