import Link from 'next/link'
import { getProcessos } from '@/lib/data'
import StatusBadge from '@/components/StatusBadge'
import { requirePermission, getCurrentRole } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'

function formatDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR')
}

function diasParaPrazo(iso?: string): { label: string; urgent: boolean } | null {
  if (!iso) return null
  const d = new Date(iso)
  d.setHours(0, 0, 0, 0)
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const diff = Math.round((d.getTime() - hoje.getTime()) / 86400000)
  if (diff < 0) return { label: `${Math.abs(diff)}d atrás`, urgent: true }
  if (diff === 0) return { label: 'Hoje', urgent: true }
  if (diff === 1) return { label: 'Amanhã', urgent: true }
  return { label: `${diff}d`, urgent: diff <= 7 }
}

export default async function ProcessosPage() {
  await requirePermission('processos:view')
  const role = await getCurrentRole()
  const canManage = hasPermission(role, 'processos:manage')
  const processos = await getProcessos()
  const ativos = processos.filter((p) => p.status !== 'Encerrado')
  const encerrados = processos.filter((p) => p.status === 'Encerrado')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F2346]">Processos Judiciais</h1>
          <p className="text-sm text-gray-500 mt-1">{ativos.length} ativo{ativos.length !== 1 ? 's' : ''}</p>
        </div>
        {canManage && (
          <Link
            href="/processos/novo"
            className="px-4 py-2 text-sm font-medium rounded text-[#1F2346] transition-colors hover:opacity-90"
            style={{ backgroundColor: '#DFA568' }}
          >
            + Novo processo
          </Link>
        )}
      </div>

      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Número</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Tipo / Partes</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Responsável</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Próximo prazo</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {ativos.map((p) => {
              const prazo = diasParaPrazo(p.proximoPrazo)
              return (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/processos/${p.id}`} className="hover:text-[#DFA568] transition-colors">
                      <div className="font-mono text-xs text-gray-400">{p.numero}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{p.tribunal} · {p.vara}</div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/processos/${p.id}`} className="hover:text-[#DFA568] transition-colors">
                      <div className="font-medium text-[#1F2346]">{p.tipo}</div>
                      <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[220px]">
                        {p.autor} × {p.reu}
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.responsavel}</td>
                  <td className="px-4 py-3">
                    {prazo ? (
                      <span className={`text-xs font-medium ${prazo.urgent ? 'text-amber-600' : 'text-gray-500'}`}>
                        {formatDate(p.proximoPrazo)}
                        <span className={`ml-1.5 px-1.5 py-0.5 rounded text-xs ${prazo.urgent ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-500'}`}>
                          {prazo.label}
                        </span>
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              )
            })}
            {ativos.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">
                  Nenhum processo ativo.{' '}
                  <Link href="/processos/novo" className="text-[#DFA568] hover:underline">Cadastrar o primeiro</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {encerrados.length > 0 && (
        <div className="mt-6">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            Encerrados ({encerrados.length})
          </div>
          <div className="bg-white rounded border border-gray-200 overflow-hidden opacity-60">
            <table className="w-full text-sm">
              <tbody>
                {encerrados.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50">
                    <td className="px-4 py-2.5">
                      <Link href={`/processos/${p.id}`} className="hover:text-[#DFA568]">
                        <span className="font-mono text-xs text-gray-400">{p.numero}</span>
                        <span className="text-gray-500 ml-3">{p.tipo}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-gray-400 text-xs">{p.responsavel}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
