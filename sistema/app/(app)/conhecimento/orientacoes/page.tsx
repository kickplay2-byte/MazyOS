import Link from 'next/link'
import { requirePermission, getCurrentRole } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { getOrientacoesInternas } from '@/lib/data'
import { STATUS_BASE_CONHECIMENTO_LABELS } from '@/lib/types'

export const metadata = { title: 'Orientações Internas — PIPE OS' }

export default async function OrientacoesPage() {
  await requirePermission('conhecimento:view')
  const role = await getCurrentRole()
  const canManage = hasPermission(role, 'conhecimento:manage')
  const orientacoes = await getOrientacoesInternas()
  const ativas = orientacoes.filter((o) => o.status !== 'arquivado')

  return (
    <div className="p-8 max-w-5xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/conhecimento" className="text-sm text-gray-400 hover:text-[#DFA568] transition-colors">← Base de Conhecimento</Link>
          <h1 className="text-xl font-semibold text-gray-900 mt-2">Orientações Internas</h1>
          <p className="text-sm text-gray-500 mt-1">{ativas.length} orientações · procedimentos e posicionamentos do escritório</p>
        </div>
        {canManage && (
          <Link
            href="/conhecimento/orientacoes/nova"
            className="text-xs px-3 py-1.5 rounded text-[#1F2346] font-medium hover:opacity-90"
            style={{ backgroundColor: '#DFA568' }}
          >
            + Nova orientação
          </Link>
        )}
      </div>

      {ativas.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded p-10 text-center">
          <p className="text-sm text-gray-400">Nenhuma orientação cadastrada</p>
          <Link href="/conhecimento/orientacoes/nova" className="mt-3 inline-block text-sm text-[#DFA568] hover:underline">
            Cadastrar primeira orientação →
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded divide-y divide-gray-50">
          {ativas.map((o) => (
            <Link
              key={o.id}
              href={`/conhecimento/orientacoes/${o.id}`}
              className="flex items-start justify-between p-4 hover:bg-gray-50 transition-colors group"
            >
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900 group-hover:text-[#1F2346]">{o.titulo}</div>
                <div className="text-xs text-gray-400 mt-0.5">{o.tema} · {o.area}</div>
                {o.descricao && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{o.descricao}</p>
                )}
              </div>
              <div className="ml-4 shrink-0 flex items-center gap-2">
                {o.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">{tag}</span>
                ))}
                <StatusBadge status={o.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ativo: 'bg-green-50 text-green-700',
    rascunho: 'bg-gray-100 text-gray-500',
    em_revisao: 'bg-yellow-50 text-yellow-700',
    desatualizado: 'bg-orange-50 text-orange-700',
    arquivado: 'bg-gray-100 text-gray-400',
  }
  const label = STATUS_BASE_CONHECIMENTO_LABELS[status as keyof typeof STATUS_BASE_CONHECIMENTO_LABELS] ?? status
  return <span className={`text-xs px-2 py-0.5 rounded font-medium ${colors[status] ?? 'bg-gray-100 text-gray-500'}`}>{label}</span>
}
