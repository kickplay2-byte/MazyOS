import Link from 'next/link'
import {
  getModelosJuridicos,
  getClausulasPadrao,
  getChecklistsJuridicos,
  getOrientacoesInternas,
} from '@/lib/data'
import { STATUS_BASE_CONHECIMENTO_LABELS } from '@/lib/types'
import { requirePermission } from '@/lib/auth'

export const metadata = { title: 'Base de Conhecimento — PIPE OS' }

export default async function ConhecimentoPage() {
  await requirePermission('conhecimento:view')
  const [modelos, clausulas, checklists, orientacoes] = await Promise.all([
    getModelosJuridicos(),
    getClausulasPadrao(),
    getChecklistsJuridicos(),
    getOrientacoesInternas(),
  ])

  const todos = [...modelos, ...clausulas, ...checklists, ...orientacoes]
  const ativos = todos.filter((i) => i.status === 'ativo').length
  const emRevisao = todos.filter((i) => i.status === 'em_revisao').length
  const desatualizados = todos.filter((i) => i.status === 'desatualizado').length

  const modelosRecentes = [...modelos]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4)

  const clausulasAtivas = clausulas.filter((c) => c.status === 'ativo').slice(0, 5)
  const checklistsAtivos = checklists.filter((c) => c.status === 'ativo').slice(0, 4)
  const orientacoesAtivas = orientacoes.filter((o) => o.status === 'ativo').slice(0, 4)

  return (
    <div className="p-8 max-w-5xl space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Base de Conhecimento</h1>
          <p className="text-sm text-gray-500 mt-1">Modelos, cláusulas, checklists e padrões internos do escritório</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/conhecimento/modelos/novo"
            className="text-xs px-3 py-1.5 rounded text-[#1F2346] font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#DFA568' }}
          >
            + Novo modelo
          </Link>
        </div>
      </div>

      {/* Contadores */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { label: 'Modelos', count: modelos.length, href: '/conhecimento/modelos', color: '#1F2346' },
          { label: 'Cláusulas', count: clausulas.length, href: '/conhecimento/clausulas', color: '#1F2346' },
          { label: 'Checklists', count: checklists.length, href: '/conhecimento/checklists', color: '#1F2346' },
          { label: 'Orientações', count: orientacoes.length, href: '/conhecimento/orientacoes', color: '#1F2346' },
          { label: 'Ativos', count: ativos, href: '#', color: '#166534' },
          { label: 'Em revisão', count: emRevisao + desatualizados, href: '#', color: '#92400e' },
        ].map(({ label, count, href, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-white border border-gray-200 rounded p-4 text-center hover:border-gray-300 transition-colors"
          >
            <div className="text-2xl font-semibold" style={{ color }}>{count}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </Link>
        ))}
      </div>

      {/* Links rápidos */}
      <div className="flex flex-wrap gap-2">
        <Link href="/conhecimento/modelos/novo" className="text-xs px-3 py-1.5 border border-gray-200 rounded text-gray-600 hover:border-[#DFA568] hover:text-[#1F2346] transition-colors">
          + Novo modelo
        </Link>
        <Link href="/conhecimento/clausulas/nova" className="text-xs px-3 py-1.5 border border-gray-200 rounded text-gray-600 hover:border-[#DFA568] hover:text-[#1F2346] transition-colors">
          + Nova cláusula
        </Link>
        <Link href="/conhecimento/checklists/novo" className="text-xs px-3 py-1.5 border border-gray-200 rounded text-gray-600 hover:border-[#DFA568] hover:text-[#1F2346] transition-colors">
          + Novo checklist
        </Link>
        <Link href="/conhecimento/orientacoes/nova" className="text-xs px-3 py-1.5 border border-gray-200 rounded text-gray-600 hover:border-[#DFA568] hover:text-[#1F2346] transition-colors">
          + Nova orientação
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Modelos recentes */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">Modelos recentes</div>
            <Link href="/conhecimento/modelos" className="text-xs text-[#DFA568] hover:underline">Ver todos →</Link>
          </div>
          <div className="bg-white border border-gray-200 rounded divide-y divide-gray-50">
            {modelosRecentes.length === 0 ? (
              <p className="p-4 text-sm text-gray-400">Nenhum modelo cadastrado</p>
            ) : (
              modelosRecentes.map((m) => (
                <Link key={m.id} href={`/conhecimento/modelos/${m.id}`} className="flex items-start justify-between p-3 hover:bg-gray-50 transition-colors group">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-gray-800 group-hover:text-[#1F2346] truncate">{m.titulo}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{m.categoria} · {m.tipoDocumento.replace(/_/g, ' ')}</div>
                  </div>
                  <StatusBadgeBc status={m.status} />
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Cláusulas */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">Cláusulas padrão</div>
            <Link href="/conhecimento/clausulas" className="text-xs text-[#DFA568] hover:underline">Ver todas →</Link>
          </div>
          <div className="bg-white border border-gray-200 rounded divide-y divide-gray-50">
            {clausulasAtivas.length === 0 ? (
              <p className="p-4 text-sm text-gray-400">Nenhuma cláusula cadastrada</p>
            ) : (
              clausulasAtivas.map((c) => (
                <Link key={c.id} href={`/conhecimento/clausulas/${c.id}`} className="flex items-start justify-between p-3 hover:bg-gray-50 transition-colors group">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-gray-800 group-hover:text-[#1F2346] truncate">{c.titulo}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{c.categoria.replace(/_/g, ' ')}</div>
                  </div>
                  <StatusBadgeBc status={c.status} />
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Checklists */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">Checklists jurídicos</div>
            <Link href="/conhecimento/checklists" className="text-xs text-[#DFA568] hover:underline">Ver todos →</Link>
          </div>
          <div className="bg-white border border-gray-200 rounded divide-y divide-gray-50">
            {checklistsAtivos.length === 0 ? (
              <p className="p-4 text-sm text-gray-400">Nenhum checklist cadastrado</p>
            ) : (
              checklistsAtivos.map((c) => (
                <Link key={c.id} href={`/conhecimento/checklists/${c.id}`} className="flex items-start justify-between p-3 hover:bg-gray-50 transition-colors group">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-gray-800 group-hover:text-[#1F2346] truncate">{c.titulo}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{c.itens.length} itens · {c.tipoDemanda.replace(/_/g, ' ')}</div>
                  </div>
                  <StatusBadgeBc status={c.status} />
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Orientações */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">Orientações internas</div>
            <Link href="/conhecimento/orientacoes" className="text-xs text-[#DFA568] hover:underline">Ver todas →</Link>
          </div>
          <div className="bg-white border border-gray-200 rounded divide-y divide-gray-50">
            {orientacoesAtivas.length === 0 ? (
              <p className="p-4 text-sm text-gray-400">Nenhuma orientação cadastrada</p>
            ) : (
              orientacoesAtivas.map((o) => (
                <Link key={o.id} href={`/conhecimento/orientacoes/${o.id}`} className="flex items-start justify-between p-3 hover:bg-gray-50 transition-colors group">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-gray-800 group-hover:text-[#1F2346] truncate">{o.titulo}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{o.tema}</div>
                  </div>
                  <StatusBadgeBc status={o.status} />
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function StatusBadgeBc({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ativo: 'bg-green-50 text-green-700',
    rascunho: 'bg-gray-100 text-gray-500',
    em_revisao: 'bg-yellow-50 text-yellow-700',
    desatualizado: 'bg-orange-50 text-orange-700',
    arquivado: 'bg-gray-100 text-gray-400',
  }
  const label = STATUS_BASE_CONHECIMENTO_LABELS[status as keyof typeof STATUS_BASE_CONHECIMENTO_LABELS] ?? status
  return (
    <span className={`ml-2 shrink-0 text-xs px-1.5 py-0.5 rounded font-medium ${colors[status] ?? 'bg-gray-100 text-gray-500'}`}>
      {label}
    </span>
  )
}
