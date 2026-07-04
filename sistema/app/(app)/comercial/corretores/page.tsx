import Link from 'next/link'
import { requirePermission, getCurrentRole } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { getCorretores, getImobiliarias } from '@/lib/data'
import { formatCurrency, nivelRelacionamentoLabel } from '@/lib/utils'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'

const nivelDot: Record<string, string> = {
  estrategico: '#DFA568',
  ativo: '#16a34a',
  neutro: '#9ca3af',
  em_risco: '#dc2626',
}

export default async function CorretoresPage() {
  await requirePermission('brokers:view')
  const role = await getCurrentRole()
  const canManage = hasPermission(role, 'brokers:manage')
  const [corretores, imobiliarias] = await Promise.all([getCorretores(), getImobiliarias()])
  const imobMap = Object.fromEntries(imobiliarias.map((i) => [i.id, i.nome]))

  const ativos = corretores.filter((c) => c.status === 'ativo')
  const totalFaturamento = corretores.reduce((s, c) => s + c.faturamentoGerado, 0)
  const totalIndicacoes = corretores.reduce((s, c) => s + c.quantidadeIndicacoes, 0)

  return (
    <div className="p-8">
      <PageHeader
        title="Corretores"
        description={`${ativos.length} ativos · ${totalIndicacoes} indicações · ${formatCurrency(totalFaturamento)} gerado`}
        action={canManage ? (
          <Link
            href="/comercial/corretores/novo"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-medium text-white"
            style={{ backgroundColor: '#1F2346' }}
          >
            + Novo corretor
          </Link>
        ) : undefined}
      />

      {corretores.length === 0 ? (
        <EmptyState
          title="Nenhum corretor cadastrado"
          description="Cadastre corretores para rastrear indicações e faturamento."
          action={
            <Link
              href="/comercial/corretores/novo"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-medium text-white"
              style={{ backgroundColor: '#1F2346' }}
            >
              + Novo corretor
            </Link>
          }
        />
      ) : (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Corretor</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Imobiliária</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Relacionamento</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Indicações</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Faturamento</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {corretores.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <Link href={`/comercial/corretores/${c.id}`} className="flex items-center gap-2.5 group">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: nivelDot[c.nivelRelacionamento] ?? '#9ca3af' }}
                      />
                      <div>
                        <div className="font-medium text-gray-900 group-hover:underline">{c.nome}</div>
                        {c.creci && <div className="text-xs text-gray-400">{c.creci}</div>}
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 text-xs">
                    {imobMap[c.imobiliariaId] ? (
                      <Link href={`/comercial/imobiliarias/${c.imobiliariaId}`} className="hover:underline">
                        {imobMap[c.imobiliariaId]}
                      </Link>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 text-xs">
                    {nivelRelacionamentoLabel(c.nivelRelacionamento)}
                  </td>
                  <td className="px-4 py-3.5 text-gray-800 font-medium">{c.quantidadeIndicacoes}</td>
                  <td className="px-4 py-3.5 text-gray-800 font-medium">
                    {formatCurrency(c.faturamentoGerado)}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      c.status === 'ativo' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {c.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
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
