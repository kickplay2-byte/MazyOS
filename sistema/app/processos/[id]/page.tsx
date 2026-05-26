import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProcesso } from '@/lib/data'
import { atualizarProcesso, excluirProcesso, adicionarMovimentacao } from '@/lib/actions'
import StatusBadge from '@/components/StatusBadge'
import { RESPONSAVEIS, STATUS_PROCESSO } from '@/lib/types'

function formatDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR')
}

const TIPO_MOV_LABELS = {
  audiencia: 'Audiência',
  prazo: 'Prazo',
  despacho: 'Despacho',
  peticao: 'Petição',
  outro: 'Outro',
}

export default async function ProcessoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const p = getProcesso(id)
  if (!p) notFound()

  const atualizarComId = atualizarProcesso.bind(null, id)
  const excluirComId = excluirProcesso.bind(null, id)
  const adicionarMovComId = adicionarMovimentacao.bind(null, id)

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/processos" className="text-sm text-gray-400 hover:text-[#DFA568] transition-colors">
          ← Processos
        </Link>
        <form action={excluirComId}>
          <button
            type="submit"
            className="text-xs text-red-400 hover:text-red-600 transition-colors"
            onClick={(e) => { if (!confirm('Excluir este processo?')) e.preventDefault() }}
          >
            Excluir
          </button>
        </form>
      </div>

      {/* Header */}
      <div className="bg-white rounded border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="font-mono text-sm text-gray-400">{p.numero}</div>
            <h1 className="text-xl font-semibold text-[#1F2346] mt-1">{p.tipo}</h1>
            <div className="text-sm text-gray-500 mt-1">{p.tribunal} · {p.vara}</div>
          </div>
          <StatusBadge status={p.status} />
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm mt-4">
          <div>
            <span className="text-xs text-gray-400 block">Autor</span>
            <span className="text-[#1F2346]">{p.autor}</span>
          </div>
          <div>
            <span className="text-xs text-gray-400 block">Réu</span>
            <span className="text-[#1F2346]">{p.reu}</span>
          </div>
          <div>
            <span className="text-xs text-gray-400 block">Responsável</span>
            <span className="text-[#1F2346]">{p.responsavel}</span>
          </div>
          <div>
            <span className="text-xs text-gray-400 block">Cliente</span>
            <span className="text-[#1F2346]">{p.cliente || '—'}</span>
          </div>
          <div>
            <span className="text-xs text-gray-400 block">Próxima audiência</span>
            <span className="text-[#1F2346]">{formatDate(p.proximaAudiencia)}</span>
          </div>
          <div>
            <span className="text-xs text-gray-400 block">Próximo prazo</span>
            <span className="text-[#1F2346] font-medium">{formatDate(p.proximoPrazo)}</span>
          </div>
          <div className="col-span-2">
            <span className="text-xs text-gray-400 block">Fase atual</span>
            <span className="text-[#1F2346]">{p.faseAtual}</span>
          </div>
          {p.observacoes && (
            <div className="col-span-2">
              <span className="text-xs text-gray-400 block">Observações</span>
              <span className="text-gray-600">{p.observacoes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Editar */}
      <details className="bg-white rounded border border-gray-200 p-6 mb-6 group">
        <summary className="text-sm font-medium text-[#1F2346] cursor-pointer list-none flex items-center justify-between">
          Editar dados do processo
          <span className="text-gray-400 text-xs group-open:rotate-180 transition-transform inline-block">▼</span>
        </summary>
        <form action={atualizarComId} className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Número CNJ</label>
              <input name="numero" defaultValue={p.numero} required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Tipo de ação</label>
              <input name="tipo" defaultValue={p.tipo} required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tribunal</label>
              <input name="tribunal" defaultValue={p.tribunal} required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Vara</label>
              <input name="vara" defaultValue={p.vara} required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Autor</label>
              <input name="autor" defaultValue={p.autor} required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Réu</label>
              <input name="reu" defaultValue={p.reu} required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Responsável</label>
              <select name="responsavel" defaultValue={p.responsavel} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
                {RESPONSAVEIS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select name="status" defaultValue={p.status} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
                {STATUS_PROCESSO.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Próxima audiência</label>
              <input type="date" name="proximaAudiencia" defaultValue={p.proximaAudiencia} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Próximo prazo</label>
              <input type="date" name="proximoPrazo" defaultValue={p.proximoPrazo} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Fase atual</label>
              <input name="faseAtual" defaultValue={p.faseAtual} required className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Cliente</label>
              <input name="cliente" defaultValue={p.cliente} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Observações</label>
              <textarea name="observacoes" defaultValue={p.observacoes} rows={3} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568] resize-none" />
            </div>
          </div>
          <button type="submit" className="px-4 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90" style={{ backgroundColor: '#DFA568' }}>
            Salvar alterações
          </button>
        </form>
      </details>

      {/* Movimentações */}
      <div className="bg-white rounded border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-[#1F2346] mb-4">Movimentações</h2>

        <form action={adicionarMovComId} className="flex gap-3 mb-5 pb-5 border-b border-gray-100">
          <input type="date" name="data" required defaultValue={new Date().toISOString().split('T')[0]}
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
          <select name="tipo" className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]">
            {Object.entries(TIPO_MOV_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <input name="descricao" required placeholder="Descrição da movimentação" className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]" />
          <button type="submit" className="px-4 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90 shrink-0" style={{ backgroundColor: '#DFA568' }}>
            Registrar
          </button>
        </form>

        {p.movimentacoes.length === 0 ? (
          <p className="text-sm text-gray-400">Nenhuma movimentação registrada.</p>
        ) : (
          <div className="space-y-3">
            {p.movimentacoes.map((m) => (
              <div key={m.id} className="flex gap-4">
                <div className="shrink-0 text-right">
                  <div className="text-xs text-gray-400">{formatDate(m.data)}</div>
                  <div className="text-xs font-medium text-[#DFA568] mt-0.5">{TIPO_MOV_LABELS[m.tipo] || m.tipo}</div>
                </div>
                <div className="flex-1 border-l border-gray-100 pl-4 pb-3">
                  <p className="text-sm text-[#1F2346]">{m.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
