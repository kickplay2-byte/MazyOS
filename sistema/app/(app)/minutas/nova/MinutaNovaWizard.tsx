'use client'

import { useState, useTransition } from 'react'
import { criarMinutaAssistida } from '@/lib/actions'
import {
  TIPOS_DOCUMENTO_MINUTA,
  TIPO_DOCUMENTO_MINUTA_LABELS,
  MINUTA_ENTITY_TYPE_LABELS,
  STATUS_MINUTA_LABELS,
} from '@/lib/types'
import type {
  TipoDocumentoMinuta,
  MinutaEntityType,
  ModeloJuridico,
  ClausulaPadrao,
  ChecklistJuridico,
  OrientacaoInterna,
} from '@/lib/types'
import { montarConteudoMinutaAssistida } from '@/lib/utils'

interface EntityOption {
  id: string
  label: string
}

interface Props {
  modelos: ModeloJuridico[]
  clausulas: ClausulaPadrao[]
  checklists: ChecklistJuridico[]
  orientacoes: OrientacaoInterna[]
  responsaveis: string[]
  entidades: Record<MinutaEntityType, EntityOption[]>
  initialEntityType?: string
  initialEntityId?: string
}

type EntityTypeOrLivre = MinutaEntityType | 'livre'

const STEPS = ['Origem', 'Tipo de documento', 'Modelo base', 'Cláusulas', 'Checklist & Orientações', 'Revisão']
const TOTAL = STEPS.length

export default function MinutaNovaWizard({
  modelos,
  clausulas,
  checklists,
  orientacoes,
  responsaveis,
  entidades,
  initialEntityType,
  initialEntityId,
}: Props) {
  const [step, setStep] = useState(1)
  const [isPending, startTransition] = useTransition()

  // Step 1
  const [entityType, setEntityType] = useState<EntityTypeOrLivre>(
    (initialEntityType as MinutaEntityType) ?? 'livre'
  )
  const [entityId, setEntityId] = useState(initialEntityId ?? '')

  // Step 2
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumentoMinuta | ''>('')
  const [titulo, setTitulo] = useState('')

  // Step 3
  const [modeloId, setModeloId] = useState('')

  // Step 4
  const [clausulaIds, setClausulaIds] = useState<string[]>([])

  // Step 5
  const [checklistId, setChecklistId] = useState('')
  const [orientacaoIds, setOrientacaoIds] = useState<string[]>([])

  // Step 6
  const [responsavel, setResponsavel] = useState(responsaveis[0] ?? '')
  const [observacoes, setObservacoes] = useState('')
  // null = usar conteúdo gerado automaticamente; string = conteúdo editado pelo usuário
  const [conteudoManual, setConteudoManual] = useState<string | null>(null)

  const entityLabel =
    entityType !== 'livre'
      ? entidades[entityType]?.find((e) => e.id === entityId)?.label
      : undefined

  const selectedModelo = modelos.find((m) => m.id === modeloId)
  const selectedClausulas = clausulas.filter((c) => clausulaIds.includes(c.id))
  const selectedChecklist = checklists.find((c) => c.id === checklistId)
  const selectedOrientacoes = orientacoes.filter((o) => orientacaoIds.includes(o.id))

  const previewGerado = (() => {
    if (!titulo || !tipoDocumento) return ''
    return montarConteudoMinutaAssistida({
      titulo,
      tipoDocumentoLabel: tipoDocumento ? TIPO_DOCUMENTO_MINUTA_LABELS[tipoDocumento] : '',
      responsavel,
      entityLabel,
      modelo: selectedModelo
        ? { titulo: selectedModelo.titulo, descricao: selectedModelo.descricao, conteudo: selectedModelo.conteudo }
        : null,
      clausulas: selectedClausulas.map((c) => ({
        titulo: c.titulo,
        texto: c.texto,
        aplicacao: c.aplicacao,
        riscos: c.riscos,
      })),
      checklist: selectedChecklist
        ? {
            titulo: selectedChecklist.titulo,
            itens: selectedChecklist.itens.map((it) => ({
              ordem: it.ordem,
              texto: it.texto,
              obrigatorio: it.obrigatorio,
            })),
          }
        : null,
      orientacoes: selectedOrientacoes.map((o) => ({
        titulo: o.titulo,
        conteudo: o.conteudo,
        tema: o.tema,
      })),
      observacoes,
    })
  })()

  const conteudoAtual = conteudoManual ?? previewGerado
  const conteudoManualmenteEditado = conteudoManual !== null

  function toggleClausula(id: string) {
    setClausulaIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function toggleOrientacao(id: string) {
    setOrientacaoIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function autoTitulo(tipo: TipoDocumentoMinuta) {
    const label = TIPO_DOCUMENTO_MINUTA_LABELS[tipo]
    setTitulo((prev) => (prev === '' || TIPOS_DOCUMENTO_MINUTA.some((t) => TIPO_DOCUMENTO_MINUTA_LABELS[t] === prev) ? label : prev))
  }

  function handleConteudoChange(valor: string) {
    setConteudoManual(valor !== previewGerado ? valor : null)
  }

  function regenerarConteudo() {
    setConteudoManual(null)
  }

  const canNext = (): boolean => {
    if (step === 2) return tipoDocumento !== '' && titulo.trim() !== ''
    return true
  }

  function handleSubmit() {
    const fd = new FormData()
    fd.set('titulo', titulo)
    fd.set('tipoDocumento', tipoDocumento as string)
    fd.set('tipoDocumentoLabel', tipoDocumento ? TIPO_DOCUMENTO_MINUTA_LABELS[tipoDocumento as TipoDocumentoMinuta] : '')
    fd.set('responsavel', responsavel)
    fd.set('observacoes', observacoes)
    if (conteudoManual !== null && conteudoManual.trim()) {
      fd.set('conteudoManual', conteudoManual.trim())
    }
    if (entityType !== 'livre') {
      fd.set('entityType', entityType)
      fd.set('entityId', entityId)
      if (entityLabel) fd.set('entityLabel', entityLabel)
    }
    if (modeloId) fd.set('modeloId', modeloId)
    if (clausulaIds.length) fd.set('clausulaIds', clausulaIds.join(','))
    if (checklistId) fd.set('checklistId', checklistId)
    if (orientacaoIds.length) fd.set('orientacaoIds', orientacaoIds.join(','))
    startTransition(() => criarMinutaAssistida(fd))
  }

  return (
    <div className="max-w-3xl">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center shrink-0 ${
                i + 1 === step
                  ? 'text-[#1F2346]'
                  : i + 1 < step
                  ? 'bg-[#1F2346] text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
              style={i + 1 === step ? { backgroundColor: '#DFA568' } : undefined}
            >
              {i + 1 < step ? '✓' : i + 1}
            </div>
            <span
              className={`text-xs hidden sm:inline ${
                i + 1 === step ? 'text-[#1F2346] font-medium' : i + 1 < step ? 'text-gray-400' : 'text-gray-300'
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="w-8 h-px bg-gray-200 shrink-0" />}
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded p-6">
        {/* ── Step 1 ── */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold text-[#1F2346]">Origem da minuta</h2>
            <p className="text-sm text-gray-500">Vincule esta minuta a uma entidade existente ou crie livremente.</p>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Tipo de origem</label>
              <div className="grid grid-cols-3 gap-2">
                {(['livre', ...Object.keys(entidades)] as EntityTypeOrLivre[]).map((et) => (
                  <button
                    key={et}
                    type="button"
                    onClick={() => { setEntityType(et); setEntityId('') }}
                    className={`px-3 py-2 text-xs rounded border transition-colors ${
                      entityType === et
                        ? 'border-[#DFA568] bg-amber-50 text-[#1F2346] font-medium'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {et === 'livre' ? 'Livre (sem vínculo)' : MINUTA_ENTITY_TYPE_LABELS[et as MinutaEntityType]}
                  </button>
                ))}
              </div>
            </div>

            {entityType !== 'livre' && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {MINUTA_ENTITY_TYPE_LABELS[entityType as MinutaEntityType]}
                </label>
                <select
                  value={entityId}
                  onChange={(e) => setEntityId(e.target.value)}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
                >
                  <option value="">— Selecione —</option>
                  {entidades[entityType as MinutaEntityType].map((e) => (
                    <option key={e.id} value={e.id}>{e.label}</option>
                  ))}
                </select>
                {entidades[entityType as MinutaEntityType].length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">Nenhum registro encontrado. Você pode continuar sem vínculo.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold text-[#1F2346]">Tipo de documento</h2>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Tipo</label>
              <div className="grid grid-cols-2 gap-2">
                {TIPOS_DOCUMENTO_MINUTA.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setTipoDocumento(t); autoTitulo(t) }}
                    className={`px-3 py-2 text-xs rounded border text-left transition-colors ${
                      tipoDocumento === t
                        ? 'border-[#DFA568] bg-amber-50 text-[#1F2346] font-medium'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {TIPO_DOCUMENTO_MINUTA_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Título da minuta <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Compra e Venda — Apartamento Rua das Flores"
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
              />
              {!titulo.trim() && tipoDocumento && (
                <button
                  type="button"
                  onClick={() => autoTitulo(tipoDocumento)}
                  className="text-xs text-amber-600 hover:text-amber-700 mt-1"
                >
                  Usar título sugerido: &quot;{TIPO_DOCUMENTO_MINUTA_LABELS[tipoDocumento]}&quot;
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Step 3 ── */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#1F2346]">Modelo base</h2>
              <span className="text-xs text-gray-400">Opcional</span>
            </div>

            <p className="text-sm text-gray-500">Selecione um modelo da Base de Conhecimento para usar como referência de estrutura.</p>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              <button
                type="button"
                onClick={() => setModeloId('')}
                className={`w-full text-left px-4 py-3 rounded border text-sm transition-colors ${
                  modeloId === ''
                    ? 'border-[#DFA568] bg-amber-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="font-medium text-gray-500">Nenhum modelo</span>
                <span className="block text-xs text-gray-400 mt-0.5">Continuar sem modelo base</span>
              </button>
              {modelos.filter((m) => m.status === 'ativo').map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModeloId(m.id)}
                  className={`w-full text-left px-4 py-3 rounded border text-sm transition-colors ${
                    modeloId === m.id
                      ? 'border-[#DFA568] bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium text-[#1F2346]">{m.titulo}</span>
                  {m.descricao && <span className="block text-xs text-gray-400 mt-0.5 line-clamp-2">{m.descricao}</span>}
                  <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{m.categoria}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 4 ── */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#1F2346]">Cláusulas</h2>
              <span className="text-xs text-gray-400">Opcional · {clausulaIds.length} selecionada(s)</span>
            </div>
            <p className="text-sm text-gray-500">Selecione as cláusulas padrão a incluir na minuta.</p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {clausulas.filter((c) => c.status === 'ativo').map((c) => (
                <label
                  key={c.id}
                  className={`flex items-start gap-3 px-4 py-3 rounded border cursor-pointer transition-colors ${
                    clausulaIds.includes(c.id)
                      ? 'border-[#DFA568] bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={clausulaIds.includes(c.id)}
                    onChange={() => toggleClausula(c.id)}
                    className="mt-0.5 accent-amber-500 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-[#1F2346]">{c.titulo}</span>
                    {c.aplicacao && <span className="block text-xs text-gray-400 mt-0.5">{c.aplicacao}</span>}
                    {c.descricao && !c.aplicacao && <span className="block text-xs text-gray-400 mt-0.5 line-clamp-2">{c.descricao}</span>}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{c.categoria}</span>
                      {c.riscos && <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">⚠ tem riscos</span>}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 5 ── */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-[#1F2346]">Checklist de verificação</h2>
                <span className="text-xs text-gray-400">Opcional</span>
              </div>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setChecklistId('')}
                  className={`w-full text-left px-4 py-3 rounded border text-sm transition-colors ${
                    checklistId === ''
                      ? 'border-[#DFA568] bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium text-gray-500">Nenhum checklist</span>
                </button>
                {checklists.filter((c) => c.status === 'ativo').map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setChecklistId(c.id)}
                    className={`w-full text-left px-4 py-3 rounded border text-sm transition-colors ${
                      checklistId === c.id
                        ? 'border-[#DFA568] bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-medium text-[#1F2346]">{c.titulo}</span>
                    <span className="block text-xs text-gray-400 mt-0.5">{c.itens.length} item(s)</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-[#1F2346]">Orientações aplicáveis</h2>
                <span className="text-xs text-gray-400">Opcional · {orientacaoIds.length} selecionada(s)</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {orientacoes.filter((o) => o.status === 'ativo').map((o) => (
                  <label
                    key={o.id}
                    className={`flex items-start gap-3 px-4 py-3 rounded border cursor-pointer transition-colors ${
                      orientacaoIds.includes(o.id)
                        ? 'border-[#DFA568] bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={orientacaoIds.includes(o.id)}
                      onChange={() => toggleOrientacao(o.id)}
                      className="mt-0.5 accent-amber-500 shrink-0"
                    />
                    <div>
                      <span className="text-sm font-medium text-[#1F2346]">{o.titulo}</span>
                      {o.tema && <span className="ml-2 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{o.tema}</span>}
                      {o.descricao && <span className="block text-xs text-gray-400 mt-0.5 line-clamp-2">{o.descricao}</span>}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 6 ── */}
        {step === 6 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold text-[#1F2346]">Revisão e salvamento</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Responsável</label>
                <select
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
                >
                  {responsaveis.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status inicial</label>
                <div className="px-3 py-2 text-sm border border-gray-200 rounded text-gray-500 bg-gray-50">
                  {STATUS_MINUTA_LABELS['rascunho']}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Observações do responsável</label>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={3}
                placeholder="Anotações sobre esta minuta, contexto, restrições..."
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568] resize-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-500">
                  Conteúdo da minuta
                  {conteudoManualmenteEditado && (
                    <span className="ml-2 text-amber-600">· editado manualmente</span>
                  )}
                </label>
                <div className="flex items-center gap-2">
                  {conteudoManualmenteEditado && (
                    <button
                      type="button"
                      onClick={regenerarConteudo}
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ↺ Regenerar
                    </button>
                  )}
                  <span className="text-xs text-amber-600 font-medium">Minuta de trabalho — não é documento oficial</span>
                </div>
              </div>
              <textarea
                value={conteudoAtual}
                onChange={(e) => handleConteudoChange(e.target.value)}
                rows={20}
                className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 text-xs text-gray-700 font-mono leading-relaxed focus:outline-none focus:border-[#DFA568] resize-y"
              />
              <p className="text-xs text-gray-400 mt-1">Você pode editar o conteúdo acima antes de salvar. Use &quot;↺ Regenerar&quot; para voltar ao conteúdo padrão.</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded px-4 py-3">
              <p className="text-xs text-amber-800">
                <strong>⚠ Aviso:</strong> Esta minuta é um documento de trabalho gerado com base na Base de Conhecimento.
                Não constitui instrumento jurídico finalizado. Requer revisão por advogado responsável antes de qualquer uso.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1) as typeof step)}
          disabled={step === 1}
          className="px-4 py-2 text-sm text-gray-500 hover:text-[#1F2346] disabled:opacity-30 transition-colors"
        >
          ← Voltar
        </button>

        <span className="text-xs text-gray-400">
          Passo {step} de {TOTAL}
        </span>

        {step < TOTAL ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(TOTAL, s + 1) as typeof step)}
            disabled={!canNext()}
            className="px-5 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            style={{ backgroundColor: '#DFA568' }}
          >
            Próximo →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || !titulo || !tipoDocumento || !responsavel}
            className="px-5 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            style={{ backgroundColor: '#DFA568' }}
          >
            {isPending ? 'Salvando…' : 'Salvar rascunho'}
          </button>
        )}
      </div>
    </div>
  )
}
