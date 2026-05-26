import Link from 'next/link'
import { getImobiliarias } from '@/lib/data'
import { formatCurrency, nivelRelacionamentoLabel, formatDate } from '@/lib/utils'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'

const nivelDot: Record<string, string> = {
  estrategico: '#DFA568',
  ativo: '#16a34a',
  neutro: '#9ca3af',
  em_risco: '#dc2626',
}

const statusBadge: Record<string, { label: string; className: string }> = {
  ativa: { label: 'Ativa', className: 'bg-green-50 text-green-700' },
  inativa: { label: 'Inativa', className: 'bg-gray-100 text-gray-500' },
  prospect: { label: 'Prospect', className: 'bg-blue-50 text-blue-700' },
}

export default function ImobiliariasPage() {
  const imobiliarias = getImobiliarias()

  const ativas = imobiliarias.filter((i) => i.status === 'ativa')
  const receitaTotal = ativas.reduce((s, i) => s + i.valorMensal, 0)

  return (
    <div className="p-8">
      <PageHeader
        title="Imobiliárias"
        description={`${ativas.length} ativas · ${formatCurrency(receitaTotal)}/mês`}
        action={
          <Link
            href="/comercial/imobiliarias/nova"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-medium text-white"
            style={{ backgroundColor: '#1F2346' }}
          >
            + Nova imobiliária
          </Link>
        }
      />

      {imobiliarias.length === 0 ? (
        <EmptyState
          title="Nenhuma imobiliária cadastrada"
          description="Cadastre sua primeira imobiliária parceira para começar."
          action={
            <Link
              href="/comercial/imobiliarias/nova"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-medium text-white"
              style={{ backgroundColor: '#1F2346' }}
            >
              + Nova imobiliária
            </Link>
          }
        />
      ) : (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Imobiliária</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Relacionamento</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Valor mensal</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Próxima ação</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Responsável</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {imobiliarias.map((im) => {
                const badge = statusBadge[im.status] ?? { label: im.status, className: 'bg-gray-100 text-gray-500' }
                return (
                  <tr key={im.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link href={`/comercial/imobiliarias/${im.id}`} className="flex items-center gap-2.5 group">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: nivelDot[im.nivelRelacionamento] ?? '#9ca3af' }}
                        />
                        <div>
                          <div className="font-medium text-gray-900 group-hover:underline">{im.nome}</div>
                          {im.cidade && <div className="text-xs text-gray-400">{im.cidade}</div>}
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 text-xs">
                      {nivelRelacionamentoLabel(im.nivelRelacionamento)}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-gray-800">
                      {im.valorMensal > 0 ? formatCurrency(im.valorMensal) : '—'}
                    </td>
                    <td className="px-4 py-3.5">
                      {im.proximaAcao ? (
                        <div>
                          <div className="text-gray-700 text-xs leading-snug">{im.proximaAcao}</div>
                          {im.proximaAcaoData && (
                            <div className="text-gray-400 text-xs">{formatDate(im.proximaAcaoData)}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 text-xs">{im.responsavel}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
