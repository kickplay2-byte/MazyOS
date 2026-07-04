import Link from 'next/link'
import { getExtrajudiciais } from '@/lib/data'
import StatusBadge from '@/components/StatusBadge'
import { requirePermission, getCurrentRole } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'

function formatDate(iso?: string) {
  if (!iso) return null
  const d = new Date(iso)
  d.setHours(0, 0, 0, 0)
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const diff = Math.round((d.getTime() - hoje.getTime()) / 86400000)
  const label = d.toLocaleDateString('pt-BR')
  return { label, urgent: diff <= 7 && diff >= 0 }
}

export default async function ExtrajudiciaisPage() {
  await requirePermission('extrajudiciais:view')
  const role = await getCurrentRole()
  const canManage = hasPermission(role, 'extrajudiciais:manage')
  const all = await getExtrajudiciais()
  const ativas = all.filter((e) => e.status !== 'Concluída' && e.status !== 'Arquivada')
  const concluidas = all.filter((e) => e.status === 'Concluída' || e.status === 'Arquivada')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F2346]">Demandas Extrajudiciais</h1>
          <p className="text-sm text-gray-500 mt-1">{ativas.length} ativa{ativas.length !== 1 ? 's' : ''}</p>
        </div>
        {canManage && <Link
          href="/extrajudiciais/nova"
          className="px-4 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90"
          style={{ backgroundColor: '#DFA568' }}
        >
          + Nova demanda
        </Link>}
      </div>

      <div className="space-y-3">
        {ativas.map((e) => {
          const etapasConcluidas = e.etapas.filter((et) => et.concluida).length
          const prazo = formatDate(e.proximoPrazo)
          return (
            <Link
              key={e.id}
              href={`/extrajudiciais/${e.id}`}
              className="bg-white rounded border border-gray-200 p-5 hover:border-[#DFA568] transition-colors flex items-center gap-6"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#1F2346]/5 text-[#1F2346]">{e.tipo}</span>
                  <StatusBadge status={e.status} />
                </div>
                <div className="font-medium text-[#1F2346] truncate">{e.titulo}</div>
                <div className="text-xs text-gray-400 mt-1">{e.cliente} · {e.responsavel}</div>
              </div>
              <div className="shrink-0 text-right">
                {e.etapas.length > 0 && (
                  <div className="text-xs text-gray-400 mb-1">
                    {etapasConcluidas}/{e.etapas.length} etapas
                  </div>
                )}
                {prazo && (
                  <div className={`text-xs font-medium ${prazo.urgent ? 'text-amber-600' : 'text-gray-500'}`}>
                    {prazo.label}
                  </div>
                )}
              </div>
            </Link>
          )
        })}
        {ativas.length === 0 && (
          <div className="bg-white rounded border border-gray-200 p-8 text-center text-sm text-gray-400">
            Nenhuma demanda extrajudicial ativa.{' '}
            <Link href="/extrajudiciais/nova" className="text-[#DFA568] hover:underline">Cadastrar a primeira</Link>
          </div>
        )}
      </div>

      {concluidas.length > 0 && (
        <div className="mt-6 opacity-60">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            Concluídas / Arquivadas ({concluidas.length})
          </div>
          <div className="space-y-2">
            {concluidas.map((e) => (
              <Link key={e.id} href={`/extrajudiciais/${e.id}`} className="bg-white rounded border border-gray-200 p-4 flex items-center justify-between hover:border-gray-300 transition-colors">
                <div>
                  <span className="text-sm text-gray-500">{e.titulo}</span>
                  <span className="text-xs text-gray-400 ml-3">{e.cliente}</span>
                </div>
                <StatusBadge status={e.status} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
