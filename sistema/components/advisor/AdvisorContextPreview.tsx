'use client'

import { useState } from 'react'

interface AdvisorContextPreviewProps {
  comercial: { imobiliariasAtivas: number; oportunidadesAbertas: number; propostasAbertas: number }
  juridico: { processosAtivos: number; extrajudiciaisEmAndamento: number; consultoriasAtivas: number }
  gestao: { tarefasTotal: number; documentosPendentes: number }
}

export default function AdvisorContextPreview({ comercial, juridico, gestao }: AdvisorContextPreviewProps) {
  const [open, setOpen] = useState(false)

  const categories = [
    {
      label: 'Comercial',
      detail: `${comercial.imobiliariasAtivas} imobiliárias · ${comercial.oportunidadesAbertas} oportunidades · ${comercial.propostasAbertas} propostas`,
    },
    {
      label: 'Jurídico',
      detail: `${juridico.processosAtivos} processos · ${juridico.extrajudiciaisEmAndamento} extrajudiciais · ${juridico.consultoriasAtivas} consultorias`,
    },
    {
      label: 'Gestão',
      detail: `${gestao.tarefasTotal} tarefas · ${gestao.documentosPendentes} documentos pendentes`,
    },
    { label: 'Alertas executivos', detail: 'todos os alertas ativos' },
    { label: 'Rankings', detail: 'top 5 imobiliárias e corretores' },
    { label: 'Próximas ações', detail: 'até 10 ações nos próximos 14 dias' },
  ]

  return (
    <div className="border border-gray-100 rounded">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        <span className="uppercase tracking-widest font-medium">Contexto considerado pelo Advisor</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-4 pb-4 grid grid-cols-2 gap-2">
          {categories.map((c) => (
            <div key={c.label} className="flex items-start gap-2">
              <span className="mt-0.5 text-[#DFA568] text-xs">✓</span>
              <div>
                <span className="text-xs font-medium text-gray-600">{c.label}</span>
                <span className="text-xs text-gray-400 ml-1.5">{c.detail}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
