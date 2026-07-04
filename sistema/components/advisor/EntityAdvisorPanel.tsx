'use client'

import { useState } from 'react'

export type EntityAdvisorType =
  | 'imobiliaria'
  | 'corretor'
  | 'cliente'
  | 'oportunidade'
  | 'proposta'
  | 'processo'
  | 'extrajudicial'
  | 'consultoria'
  | 'tarefa'
  | 'arquivo'

interface EntityAdvisorPanelProps {
  entityType: EntityAdvisorType
  entityId: string
}

const ENTITY_ADVISOR_ACTIONS: Record<EntityAdvisorType, string[]> = {
  imobiliaria: [
    'Análise do relacionamento',
    'Oportunidades e pipeline',
    'Riscos e alertas',
    'Próximas ações',
  ],
  corretor: [
    'Análise do corretor',
    'Histórico de indicações',
    'Como fortalecer o relacionamento',
    'Próximas ações',
  ],
  cliente: [
    'Análise do cliente',
    'Oportunidades vinculadas',
    'Como expandir o relacionamento',
  ],
  oportunidade: [
    'Análise da oportunidade',
    'Probabilidade de fechamento',
    'Próximos passos',
    'Riscos e bloqueios',
  ],
  proposta: [
    'Análise da proposta',
    'Como aumentar a conversão',
    'Próximos passos',
  ],
  processo: [
    'Análise do processo',
    'Pontos de atenção',
    'Próximos passos processuais',
  ],
  extrajudicial: [
    'Análise da demanda',
    'Gargalos e pendências',
    'Próximos passos',
  ],
  consultoria: [
    'Análise da consultoria',
    'Histórico de entregas',
    'Oportunidades de expansão',
  ],
  tarefa: ['Análise da tarefa', 'Próximos passos'],
  arquivo: ['Análise do documento'],
}

// Inline markdown renderer — handles ## headers, - bullets, **bold**, numbered lists
function renderLine(line: string, key: number) {
  if (line.startsWith('### ')) {
    return (
      <div key={key} className="font-semibold text-[#1F2346] text-sm mt-3 mb-1">
        {renderInline(line.slice(4))}
      </div>
    )
  }
  if (line.startsWith('## ')) {
    return (
      <div key={key} className="font-semibold text-[#1F2346] mt-3 mb-1">
        {renderInline(line.slice(3))}
      </div>
    )
  }
  if (line.startsWith('# ')) {
    return (
      <div key={key} className="font-semibold text-[#1F2346] text-base mt-3 mb-1.5">
        {renderInline(line.slice(2))}
      </div>
    )
  }
  if (line.startsWith('- ') || line.startsWith('• ')) {
    return (
      <div key={key} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
        <span className="text-[#DFA568] shrink-0 mt-0.5">•</span>
        <span>{renderInline(line.slice(2))}</span>
      </div>
    )
  }
  const numberedMatch = line.match(/^(\d+)\.\s(.*)$/)
  if (numberedMatch) {
    return (
      <div key={key} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
        <span className="text-[#DFA568] font-medium shrink-0 min-w-5">{numberedMatch[1]}.</span>
        <span>{renderInline(numberedMatch[2])}</span>
      </div>
    )
  }
  if (!line.trim()) {
    return <div key={key} className="h-1.5" />
  }
  return (
    <p key={key} className="text-sm text-gray-700 leading-relaxed">
      {renderInline(line)}
    </p>
  )
}

function renderInline(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-[#1F2346]">
        {part}
      </strong>
    ) : (
      part
    )
  )
}

export default function EntityAdvisorPanel({ entityType, entityId }: EntityAdvisorPanelProps) {
  const [input, setInput] = useState('')
  const [activeQuestion, setActiveQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const actions = ENTITY_ADVISOR_ACTIONS[entityType] ?? []

  async function submit(question: string) {
    const q = question.trim()
    if (!q || loading) return

    setActiveQuestion(q)
    setInput('')
    setLoading(true)
    setError('')
    setAnswer('')

    try {
      const res = await fetch('/api/advisor/entity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType, entityId, question: q }),
      })
      const data = (await res.json()) as { answer?: string; error?: string }

      if (!res.ok || data.error) {
        setError(data.error ?? 'Erro desconhecido. Tente novamente.')
      } else {
        setAnswer(data.answer ?? '')
      }
    } catch {
      setError('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        <div
          className="w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{ backgroundColor: '#DFA568' }}
        >
          A
        </div>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Advisor</span>
      </div>

      {/* Ações rápidas */}
      {actions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {actions.map((action) => (
            <button
              key={action}
              onClick={() => submit(action)}
              disabled={loading}
              className="px-2.5 py-1 text-xs border border-gray-200 rounded text-gray-600 hover:border-[#DFA568] hover:text-[#DFA568] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {action}
            </button>
          ))}
        </div>
      )}

      {/* Campo de pergunta livre */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit(input)
            }
          }}
          placeholder="Pergunte sobre este registro…"
          maxLength={500}
          className="flex-1 border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#DFA568] transition-colors min-w-0"
          disabled={loading}
        />
        <button
          onClick={() => submit(input)}
          disabled={loading || !input.trim()}
          className="px-3 py-1.5 rounded text-xs font-medium text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          style={{ backgroundColor: '#DFA568' }}
        >
          {loading ? (
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            'Analisar'
          )}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 py-1">
          <svg className="w-3.5 h-3.5 animate-spin text-[#DFA568]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-xs text-gray-400">Analisando…</span>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="border border-red-200 bg-red-50 rounded px-3 py-2 text-xs text-red-700 flex items-start gap-1.5">
          <span className="shrink-0">✕</span>
          <span>{error}</span>
        </div>
      )}

      {/* Resposta */}
      {answer && !loading && (
        <div className="pt-1 border-t border-gray-100 space-y-0.5">
          <div className="text-xs text-gray-400 mb-2 truncate">{activeQuestion}</div>
          <div className="space-y-0.5">
            {answer.split('\n').map((line, i) => renderLine(line, i))}
          </div>
        </div>
      )}
    </div>
  )
}
