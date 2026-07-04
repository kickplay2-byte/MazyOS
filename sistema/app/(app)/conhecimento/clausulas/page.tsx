import Link from 'next/link'
import { requirePermission, getCurrentRole } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { getClausulasPadrao } from '@/lib/data'
import { CATEGORIA_CLAUSULA_LABELS, STATUS_BASE_CONHECIMENTO_LABELS } from '@/lib/types'

export const metadata = { title: 'Cláusulas Padrão — PIPE OS' }

export default async function ClausulasPage() {
  await requirePermission('conhecimento:view')
  const role = await getCurrentRole()
  const canManage = hasPermission(role, 'conhecimento:manage')
  const clausulas = await getClausulasPadrao()
  const ativas = clausulas.filter((c) => c.status !== 'arquivado')

  return (
    <div className="p-8 max-w-5xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/conhecimento" className="text-sm text-gray-400 hover:text-[#DFA568] transition-colors">← Base de Conhecimento</Link>
          <h1 className="text-xl font-semibold text-gray-900 mt-2">Cláusulas Padrão</h1>
          <p className="text-sm text-gray-500 mt-1">{ativas.length} cláusulas · texto pronto para uso em contratos</p>
        </div>
        {canManage && (
          <Link
            href="/conhecimento/clausulas/nova"
            className="text-xs px-3 py-1.5 rounded text-[#1F2346] font-medium hover:opacity-90"
            style={{ backgroundColor: '#DFA568' }}
          >
            + Nova cláusula
          </Link>
        )}
      </div>

      {ativas.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded p-10 text-center">
          <p className="text-sm text-gray-400">Nenhuma cláusula cadastrada</p>
          <Link href="/conhecimento/clausulas/nova" className="mt-3 inline-block text-sm text-[#DFA568] hover:underline">
            Cadastrar primeira cláusula →
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Título</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Categoria</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Aplicação</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ativas.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/conhecimento/clausulas/${c.id}`} className="text-gray-900 hover:text-[#DFA568] font-medium">
                      {c.titulo}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{CATEGORIA_CLAUSULA_LABELS[c.categoria] ?? c.categoria}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">{c.aplicacao}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
