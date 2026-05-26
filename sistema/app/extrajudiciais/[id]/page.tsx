import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getExtrajudicial } from '@/lib/data'
import {
  atualizarExtrajudicial,
  excluirExtrajudicial,
  adicionarEtapa,
  toggleEtapa,
  adicionarDocumento,
  toggleDocumento,
} from '@/lib/actions'
import StatusBadge from '@/components/StatusBadge'
import { RESPONSAVEIS, STATUS_EXTRAJUDICIAL, TIPOS_EXTRAJUDICIAL } from '@/lib/types'

function formatDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR')
}

export default async function ExtrajudicialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const e = getExtrajudicial(id)
  if (!e) notFound()

  const atualizarComId = atualizarExtrajudicial.bind(null, id)
  const excluirComId = excluirExtrajudicial.bind(null, id)
  const adicionarEtapaComId = adicionarEtapa.bind(null, id)
  const adicionarDocumentoComId = adicionarDocumento.bind(null, id)

  const etapasConcluidas = e.etapas.filter((et) => et.concluida).length
  const docEntregues = e.documentos.filter((d) => d.entregue).length

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/extrajudiciais" className="text-sm text-gray-400 hover:text-[#DFA568] transition-colors">
          ← Extrajudiciais
        </Link>
        <form action={excluirComId}>
          <button type="submit" className="text-xs text-red-400 hover:text-red-600 transition-colors"
            onClick={(e) => { if (!confirm('Excluir esta demanda?')) e.preventDefault() }}>
            Excluir
          </button>
        </form>
      </div>

      {/* Header */}
      <div className="bg-white rounded border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#1F2346]/5 text-[#1F2346]">{e.tipo}</span>
              <StatusBadge status={e.status} />
            </div>
            <h1 className="text-xl font-semibold text-[#1F2346]">{e.titulo}</h1>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 text-sm mt-4">
          <div>
            <span className="text-xs text-gray-400 block">Cliente</span>
            <span>{e.cliente}</span>
          </div>
          <div>
            <span className="text-xs text-gray-400 block">Responsável</span>
            <span>{e.responsavel}</span>
          </div>
          <div>
            <span className="text-xs text-gray-400 block">Próximo prazo</span>
            <span className="font-medium text-[#1F2346]">{formatDate(e.proximoPrazo)}</span>
          </div>
        </div>
        {e.observacoes && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400 block mb-1">Observações</span>
            <p className="text-sm text-gray-600">{e.observacoes}</p>
          </div>
        )}
      </div>

      {/* Etapas */}
      <div className="bg-white rounded border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#1F2346]">
            Etapas
            {e.etapas.length > 0 && (
              <span className="ml-2 text-xs font-normal text-gray-400">{etapasConcluidas}/{e.etapas.length}</span>
            )}
          </h2>
        </div>

        {e.etapas.length > 0 && (
          <div className="space-y-2 mb-4">
            {e.etapas.map((et) => {
              const toggle = toggleEtapa.bind(null, id, et.id)
              return (
                <div key={et.id} className={`flex items-start gap-3 p-2 rounded ${et.concluida ? 'opacity-60' : ''}`}>
                  <form action={toggle} className="mt-0.5">
                    <button
                      type="submit"
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        et.concluida ? 'border-[#DFA568] bg-[#DFA568]' : 'border-gray-300 hover:border-[#DFA568]'
                      }`}
                    >
                      {et.concluida && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </form>
                  <div className="flex-1">
                    <span className={`text-sm ${et.concluida ? 'line-through text-gray-400' : 'text-[#1F2346]'}`}>
                      {et.titulo}
                    </span>
                    {et.prazo && !et.concluida && (
                      <span className="text-xs text-gray-400 ml-2">· prazo: {formatDate(et.prazo)}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <form action={adicionarEtapaComId} className="flex gap-2 mt-2">
          <input name="titulo" required placeholder="Nova etapa..." className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
          <input type="date" name="prazo" className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
          <button type="submit" className="px-3 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90 shrink-0" style={{ backgroundColor: '#DFA568' }}>
            + Adicionar
          </button>
        </form>
      </div>

      {/* Documentos */}
      <div className="bg-white rounded border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#1F2346]">
            Documentos
            {e.documentos.length > 0 && (
              <span className="ml-2 text-xs font-normal text-gray-400">{docEntregues}/{e.documentos.length} entregues</span>
            )}
          </h2>
        </div>

        {e.documentos.length > 0 && (
          <div className="space-y-2 mb-4">
            {e.documentos.map((doc) => {
              const toggle = toggleDocumento.bind(null, id, doc.id)
              return (
                <div key={doc.id} className={`flex items-center gap-3 p-2 rounded ${doc.entregue ? 'opacity-60' : ''}`}>
                  <form action={toggle}>
                    <button
                      type="submit"
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        doc.entregue ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300 hover:border-emerald-400'
                      }`}
                    >
                      {doc.entregue && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </form>
                  <span className={`text-sm flex-1 ${doc.entregue ? 'line-through text-gray-400' : 'text-[#1F2346]'}`}>
                    {doc.nome}
                  </span>
                  <span className={`text-xs ${doc.entregue ? 'text-emerald-600' : 'text-amber-500'}`}>
                    {doc.entregue ? 'Entregue' : 'Pendente'}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        <form action={adicionarDocumentoComId} className="flex gap-2 mt-2">
          <input name="nome" required placeholder="Nome do documento..." className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
          <button type="submit" className="px-3 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90 shrink-0" style={{ backgroundColor: '#DFA568' }}>
            + Adicionar
          </button>
        </form>
      </div>

      {/* Editar */}
      <details className="bg-white rounded border border-gray-200 p-6 group">
        <summary className="text-sm font-medium text-[#1F2346] cursor-pointer list-none flex items-center justify-between">
          Editar dados da demanda
          <span className="text-gray-400 text-xs group-open:rotate-180 transition-transform inline-block">▼</span>
        </summary>
        <form action={atualizarComId} className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tipo</label>
              <select name="tipo" defaultValue={e.tipo} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
                {TIPOS_EXTRAJUDICIAL.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select name="status" defaultValue={e.status} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
                {STATUS_EXTRAJUDICIAL.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Título</label>
              <input name="titulo" defaultValue={e.titulo} required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Cliente</label>
              <input name="cliente" defaultValue={e.cliente} required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Responsável</label>
              <select name="responsavel" defaultValue={e.responsavel} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
                {RESPONSAVEIS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Próximo prazo</label>
              <input type="date" name="proximoPrazo" defaultValue={e.proximoPrazo} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Observações</label>
              <textarea name="observacoes" defaultValue={e.observacoes} rows={3} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568] resize-none" />
            </div>
          </div>
          <button type="submit" className="px-4 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90" style={{ backgroundColor: '#DFA568' }}>
            Salvar
          </button>
        </form>
      </details>
    </div>
  )
}
