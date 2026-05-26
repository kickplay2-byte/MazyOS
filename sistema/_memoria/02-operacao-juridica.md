# 02 — Operação Jurídica

## Três linhas de operação jurídica imobiliária

### 1. Processos Judiciais (~70 ativos)

Demandas que tramitam em juízo. Requerem acompanhamento contínuo de prazos e audiências.

**Campos críticos:**
- Número CNJ
- Tipo de ação (reintegração, usucapião, cobrança, rescisão, etc.)
- Tribunal e Vara
- Partes (autor e réu)
- Responsável interno
- Próxima audiência
- Próximo prazo (campo mais importante — aciona alertas)
- Fase atual (texto livre descritivo)
- Histórico de movimentações (timeline cronológica)

**Fluxo de vida de um processo:**
```
Abertura → Citação → Instrução → Audiência(s) → Sentença → [Recurso] → Trânsito em julgado → Encerrado
```

**Status:**
`Em andamento` | `Aguardando movimento` | `Recurso` | `Suspenso` | `Encerrado`

**Alertas críticos:**
- Prazo vencendo em menos de 7 dias → urgente
- Prazo vencendo em menos de 2 dias → crítico
- Audiência amanhã → notificação

---

### 2. Demandas Extrajudiciais (volume crescente)

Demandas que não tramitam em juízo mas são complexas, multi-etapa e multi-documento.

**Tipos:**
- Due diligence (análise de risco antes de compra/venda)
- Análise contratual (contratos de locação, venda, incorporação)
- Parecer jurídico
- Regularização de imóvel (averbação, CRI, prefeitura)
- Usucapião extrajudicial
- Inventário extrajudicial
- Outros

**O que cada demanda precisa:**
1. **Etapas** — checklist sequencial com prazos por etapa
2. **Documentos** — lista do que é necessário vs. o que foi entregue
3. **Status** — posição atual no fluxo
4. **Próximo prazo** — data crítica da próxima entrega
5. **Histórico** — linha do tempo de ações tomadas

**Status:**
`Aberta` | `Em andamento` | `Aguardando cliente` | `Aguardando terceiro` | `Concluída` | `Arquivada`

**Futuros status PIPE OS (mais granulares):**
`recebida` | `triagem_pendente` | `documentos_pendentes` | `em_analise` | `em_elaboracao` | `em_revisao` | `aguardando_cliente` | `aguardando_terceiro` | `concluida` | `cancelada` | `suspensa`

---

### 3. Consultoria Mensal (34 imobiliárias recorrentes)

Serviço de consultoria jurídica mensal para imobiliárias parceiras.

**O que inclui (varia por contrato):**
- Análise de contratos de locação e venda
- Resposta a dúvidas jurídicas de corretores
- Revisão de minutas e propostas
- Consultoria em financiamentos
- Treinamentos periódicos para equipe

**O que o sistema precisa controlar:**
- Status do mês atual (Realizada / Pendente / Atrasada)
- Histórico mensal de entregas
- Valor mensal contratado
- Data de renovação do contrato
- Escopo acordado (array de serviços)
- Inadimplência (status "Inadimplente")

**Status:**
`Em dia` | `Pendente entrega` | `Inadimplente` | `Inativa`

---

## Vínculo jurídico-comercial (importante)

Toda demanda jurídica deve estar vinculada ao seu contexto comercial:
- `imobiliaria_id` (qual imobiliária gerou?)
- `corretor_id` (qual corretor indicou?)
- `cliente_id` (qual cliente?)
- `oportunidade_id` (de qual oportunidade veio?)
- `proposta_id` (qual proposta foi aceita?)

Isso permite saber: **"Quantas demandas a Imobiliária Alfa gerou este ano? Qual o faturamento?"**

---

## Responsáveis internos

| Responsável | Foco |
|-------------|------|
| Giovanni | Comercial + demandas estratégicas + processos complexos |
| Enrico | Demandas operacionais + acompanhamento de processos |
| Jaqueline | Triagem de demandas + controle de prazos + documentos |
| Pedro | Suporte operacional (coleta de documentos, atualizações) |
| Maria | Suporte operacional (coleta de documentos, atualizações) |
| Giovana | Apoio administrativo |
