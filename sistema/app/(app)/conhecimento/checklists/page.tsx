import Link from 'next/link'
import { requirePermission, getCurrentRole } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { getChecklistsJuridicos } from '@/lib/data'
import { STATUS_BASE_CONHECIMENTO_LABELS } from '@/lib/types'

export const metadata = { title: 'Checklists Jurídicos — PIPE OS' }

export default async function ChecklistsPage() {
  await requirePermission('conhecimento:view')
  const role = await getCurrentRole()
  const canManage = hasPermission(role, 'conhecimento:manage')
  const checklists = await getChecklistsJuridicos()
  const ativos = checklists.filter((c) => c.status !== 'arquivado')

  return (
    <div className="p-8 max-w-5xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/conhecimento" className="text-sm text-gray-400 hover:text-[#DFA568] transition-colors">← Base de Conhecimento</Link>
          <h1 className="text-xl font-semibold text-gray-900 mt-2">Checklists Jurídicos</h1>
          <p className="text-sm text-gray-500 mt-1">{ativos.length} checklists · listas de verificação por tipo de demanda</p>
        </div>
        {canManage && (
          <Link
            href="/conhecimento/checklists/novo"
            className="text-xs px-3 py-1.5 rounded text-[#1F2346] font-medium hover:opacity-90"
            style={{ backgroundColor: '#DFA568' }}
          >
            + Novo checklist
          </Link>
        )}
      </div>

      {ativos.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded p-10 text-center">
          <p className="text-sm text-gray-400">Nenhum checklist cadastrado</p>
          <Link href="/conhecimento/checklists/novo" className="mt-3 inline-block text-sm text-[#DFA568] hover:underline">
            Cadastrar primeiro checklist →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ativos.map((c) => {
            const obrigatorios = c.itens.filter((i) => i.obrigatorio).length
            return (
              <Link
                key={c.id}
                href={`/conhecimento/checklists/${c.id}`}
                className="bg-white border border-gray-200 rounded p-4 hover:border-[#DFA568]/40 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-[#1F2346]">{c.titulo}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{c.tipoDemanda.replace(/_/g, ' ')} · {c.area}</div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                {c.descricao && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{c.descricao}</p>
                )}
                <div className="mt-3 text-xs text-gray-400">
                  {c.itens.length} itens ({obrigatorios} obrigatórios)
                  {c.ultimaRevisao && ` · revisado em ${c.ultimaRevisao}`}
                </div>
              </Link>
            )
          })}
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
  return <span className={`shrink-0 text-xs px-2 py-0.5 rounded font-medium ${colors[status] ?? 'bg-gray-100 text-gray-500'}`}>{label}</span>
}
