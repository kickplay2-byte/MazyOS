# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## O que é esse workspace

Operação da Vieira da Silva Advocacia. Aqui ficam todos os clientes, processos, demandas, conteúdo e entregas do escritório — rodando em cima do MazyOS.

**Estrutura de pastas:**
- `_memoria/` — quem é o escritório, como falamos, foco atual
- `identidade/` — marca do escritório (aplicada em todas as peças)
- `marketing/` — conteúdo institucional e de relacionamento
- `saidas/` — documentos pontuais, análises, relatórios
- `dados/` — arquivos a analisar (CSVs, PDFs, exports)
- `scripts/` — utilitários chamados pelas skills

---

## Contexto do negócio

No início de toda conversa, ler:

1. `_memoria/empresa.md` — quem é o escritório, equipe, clientes, ferramentas
2. `_memoria/preferencias.md` — tom de voz, estilo, o que evitar
3. `_memoria/estrategia.md` — gargalo atual, prioridades, meta de crescimento

Para qualquer tarefa visual, consultar `identidade/design-guide.md`. Não confirmar a leitura — usar o contexto naturalmente.

---

## Sobre o escritório

Vieira da Silva Advocacia — direito imobiliário, empresarial e família. Giovanni Pianaro (operador do sistema) é sócio da área imobiliária ao lado de Enrico Bianco e Dr. Fábio Vieira da Silva (fundador). Equipe: Betina Vieira (família), Jaqueline (assistente jurídica), Pedro / Maria / Giovana (estagiários).

**Clientes principais:** 34 imobiliárias (consultoria mensal recorrente) + ~500 corretores vinculados (canal de indicação) + clientes PF indicados pelos corretores.

**Volume atual:** ~70 processos judiciais ativos + demandas extrajudiciais consultivas contínuas. Faturamento imobiliário: ~R$ 40k/mês. Meta: R$ 1,5–2M/ano nessa área.

---

## Tom de voz

Formal mas próximo. O escritório é "o melhor amigo do corretor de imóveis" — jurídico com seriedade e confiança, sem distância. Leveza permitida quando o contexto permite.

**Nunca:** escrita desleixada, incompleta, com erros ou com jargão desnecessário para leigos.

---

## Fluxo de trabalho

Antes de executar qualquer tarefa, verificar se existe skill relevante em `.claude/skills/`. Se não, executar normalmente e, ao final, perguntar se a tarefa parece repetível o suficiente pra virar skill.

---

## Regras do sistema

- Novo cliente → criar pasta `clientes/<Nome>/` com briefing e subpastas conforme as entregas
- Novo processo → registrar em `processos/` com número, partes, prazo e responsável
- Proposta nova → `propostas/<cliente>-<data>.html` antes de fechar
- Conteúdo gerado pelas skills → salvar em `marketing/conteudo/<tipo>-<tema>-<data>/`

---

## Aprender com correções

Quando Giovanni corrigir algo ou der instrução permanente, perguntar:
> "Quer que eu salve isso pra não precisar repetir?"

- Sobre o escritório, clientes ou equipe → `_memoria/empresa.md`
- Sobre tom ou estilo → `_memoria/preferencias.md`
- Sobre prioridades → `_memoria/estrategia.md`
- Regra de comportamento → `CLAUDE.md`

---

## Manter contexto atualizado

Ao terminar tarefa que mudou algo relevante (cliente novo, processo encerrado, mudança de foco), perguntar:
> "Isso mudou algo no teu contexto. Quer que eu atualize a memória?"

Quando houver dúvida sobre o que atualizar, rodar `/atualizar`.

---

## Skills disponíveis

| Comando | O que faz |
|---|---|
| `/abrir` | Carrega contexto antes de cada sessão |
| `/salvar` | Commit + push no GitHub |
| `/atualizar` | Varre o projeto e atualiza a memória |
| `/novo-projeto` | Cria pasta isolada por cliente ou iniciativa |
| `/mapear-rotinas` | Transforma tarefas repetitivas em skills |
| `/analisar-dados` | Lê CSV/XLSX/PDF e gera resumo executivo |
| `/email-profissional` | Rascunha email a partir de contexto livre |
| `/carrossel` | Cria carrosséis com identidade da marca |
| `/publicar-tema` | Artigo + carrossel + legendas a partir de um tema |
| `/seo` | Fluxo completo de SEO |
| `/relatorio-ads` | Relatório semanal de anúncios |

---

## Ferramentas conectadas

- [ ] Notion
- [ ] Gmail
- [ ] Google Calendar
- [ ] Canva
- [ ] Google Drive
- [ ] WhatsApp (via integração a definir)

*(Marcar conforme for instalando os MCPs — ver `templates/ferramentas/catalogo.md`)*
