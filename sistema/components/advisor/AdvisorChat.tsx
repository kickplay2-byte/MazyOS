'use client'

import { useState, useRef, useEffect } from 'react'
import AdvisorPromptCard from './AdvisorPromptCard'
import AdvisorContextPreview from './AdvisorContextPreview'

const QUICK_PROMPTS = [
  'Resumo executivo de hoje',
  'Prioridades do dia',
  'Oportunidades paradas',
  'Propostas que precisam de follow-up',
  'Dinheiro parado no pipeline',
  'Corretores estratégicos',
  'Imobiliárias que merecem atenção',
  'Tarefas e documentos críticos',
  'Plano de ação da semana',
  'Gargalos do escritório',
]

interface AdvisorChatProps {
  contextStats: {
    comercial: { imobiliariasAtivas: number; oportunidadesAbertas: number; propostasAbertas: number }
    juridico: { processosAtivos: number; extrajudiciaisEmAndamento: number; consultoriasAtivas: number }
    gestao: { tarefasTotal: number; documentosPendentes: number }
  }
  hasApiKey: boolean
}

// Inline markdown renderer — handles ## headers, - bullets, **bold**, numbered lists
function renderLine(line: string, key: number) {
  if (line.startsWith('### ')) {
    return (
      <div key={key} className="font-semibold text-[#1F2346] text-sm mt-4 mb-1">
        {renderInline(line.slice(4))}
      </div>
    )
  }
  if (line.startsWith('## ')) {
    return (
      <div key={key} className="font-semibold text-[#1F2346] mt-4 mb-1.5">
        {renderInline(line.slice(3))}
      </div>
    )
  }
  if (line.startsWith('# ')) {
    return (
      <div key={key} className="font-semibold text-[#1F2346] text-base mt-4 mb-2">
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
    return <div key={key} className="h-2" />
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

export default function AdvisorChat({ contextStats, hasApiKey }: AdvisorChatProps) {
  const [input, setInput] = useState('')
  const [activeQuestion, setActiveQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const answerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (answer && answerRef.current) {
      answerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [answer])

  async function submit(question: string) {
    const q = question.trim()
    if (!q || loading) return

    setActiveQuestion(q)
    setInput('')
    setLoading(true)
    setError('')
    setAnswer('')

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
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
    <div className="space-y-6">

      {/* Aviso se chave não configurada */}
      {!hasApiKey && (
        <div className="border border-amber-200 bg-amber-50 rounded px-4 py-3 flex items-start gap-3">
          <span className="text-amber-500 text-base mt-0.5">⚠</span>
          <div className="text-sm text-amber-800">
            <span className="font-medium">OPENAI_API_KEY não configurada.</span>{' '}
            Adicione a chave ao arquivo <code className="bg-amber-100 px-1 rounded text-xs">.env.local</code> para ativar o Advisor. Os cards e contexto estão disponíveis para visualização.
          </div>
        </div>
      )}

      {/* Prompt cards rápidos */}
      <div>
        <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
          Perguntas rápidas
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((p) => (
            <AdvisorPromptCard
              key={p}
              label={p}
              onClick={() => submit(p)}
              disabled={loading}
            />
          ))}
        </div>
      </div>

      {/* Campo de pergunta livre */}
      <div className="bg-white border border-gray-200 rounded p-5">
        <label className="text-sm font-medium text-[#1F2346] block mb-3">
          Pergunte ao Advisor sobre o escritório
        </label>
        <div className="flex gap-3">
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
            placeholder="Ex: O que preciso priorizar hoje?"
            maxLength={500}
            className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#DFA568] transition-colors"
            disabled={loading}
          />
          <button
            onClick={() => submit(input)}
            disabled={loading || !input.trim()}
            className="px-5 py-2 rounded text-sm font-medium text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            style={{ backgroundColor: '#DFA568' }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Analisando…
              </span>
            ) : (
              'Analisar'
            )}
          </button>
        </div>
      </div>

      {/* Estado de loading */}
      {loading && (
        <div className="bg-white border border-gray-100 rounded p-5 flex items-center gap-3">
          <svg className="w-4 h-4 animate-spin text-[#DFA568]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-sm text-gray-400">
            Analisando os dados do escritório…
          </span>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="border border-red-200 bg-red-50 rounded px-4 py-3 text-sm text-red-700 flex items-start gap-2">
          <span className="mt-0.5 shrink-0">✕</span>
          <span>{error}</span>
        </div>
      )}

      {/* Resposta da IA */}
      {answer && !loading && (
        <div ref={answerRef} className="bg-white border border-gray-200 rounded p-6 space-y-1">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: '#DFA568' }}
              >
                A
              </div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Advisor</span>
            </div>
            <span className="text-xs text-gray-300 truncate max-w-xs">{activeQuestion}</span>
          </div>
          <div className="space-y-0.5">
            {answer.split('\n').map((line, i) => renderLine(line, i))}
          </div>
        </div>
      )}

      {/* Preview do contexto */}
      <AdvisorContextPreview
        comercial={contextStats.comercial}
        juridico={contextStats.juridico}
        gestao={contextStats.gestao}
      />

    </div>
  )
}
