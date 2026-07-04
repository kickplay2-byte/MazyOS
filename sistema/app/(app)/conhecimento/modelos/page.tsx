import Link from 'next/link'
import { requirePermission, getCurrentRole } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { getModelosJuridicos } from '@/lib/data'
import { CATEGORIA_MODELO_LABELS, TIPO_DOCUMENTO_LABELS, STATUS_BASE_CONHECIMENTO_LABELS } from '@/lib/types'

export const metadata = { title: 'Modelos Jurídicos — PIPE OS' }

export default async function ModelosPage() {
  await requirePermission('conhecimento:view')
  const role = await getCurrentRole()
  const canManage = hasPermission(role, 'conhecimento:manage')
  const modelos = await getModelosJuridicos()
  const ativos = modelos.filter((m) => m.status !== 'arquivado')

  return (
    <div className="p-8 max-w-5xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/conhecimento" className="text-sm text-gray-400 hover:text-[#DFA568] transition-colors">← Base de Conhecimento</Link>
          <h1 className="text-xl font-semibold text-gray-900 mt-2">Modelos Jurídicos</h1>
          <p className="text-sm text-gray-500 mt-1">{ativos.length} modelos · contratos, notificações, pareceres e mais</p>
        </div>
        {canManage && (
          <Link
            href="/conhecimento/modelos/novo"
            className="text-xs px-3 py-1.5 rounded text-[#1F2346] font-medium hover:opacity-90"
            style={{ backgroundColor: '#DFA568' }}
          >
            + Novo modelo
          </Link>
        )}
      </div>

      {ativos.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded p-10 text-center">
          <p className="text-sm text-gray-400">Nenhum modelo jurídico cadastrado</p>
          <Link href="/conhecimento/modelos/novo" className="mt-3 inline-block text-sm text-[#DFA568] hover:underline">
            Cadastrar primeiro modelo →
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Título</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Categoria</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Tipo</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Versão</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ativos.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/conhecimento/modelos/${m.id}`} className="text-gray-900 hover:text-[#DFA568] font-medium">
                      {m.titulo}
                    </Link>
                    {m.descricao && (
                      <div className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{m.descricao}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{CATEGORIA_MODELO_LABELS[m.categoria] ?? m.categoria}</td>
                  <td className="px-4 py-3 text-gray-600">{TIPO_DOCUMENTO_LABELS[m.tipoDocumento] ?? m.tipoDocumento}</td>
                  <td className="px-4 py-3 text-gray-500">v{m.versao}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={m.status} />
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
