import Link from 'next/link'
import { getConsultorias } from '@/lib/data'
import StatusBadge from '@/components/StatusBadge'

function formatCurrency(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function ConsultoriasPage() {
  const consultorias = getConsultorias()
  const ativas = consultorias.filter((c) => c.status !== 'Inativa')
  const inativas = consultorias.filter((c) => c.status === 'Inativa')

  const totalMensal = ativas.reduce((sum, c) => sum + c.valorMensal, 0)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F2346]">Consultoria Mensal</h1>
          <p className="text-sm text-gray-500 mt-1">
            {ativas.length} imobiliária{ativas.length !== 1 ? 's' : ''} ·{' '}
            <span className="font-medium text-[#1F2346]">{formatCurrency(totalMensal)}/mês</span>
          </p>
        </div>
        <Link
          href="/consultorias/nova"
          className="px-4 py-2 text-sm font-medium rounded text-[#1F2346] transition-colors hover:opacity-90"
          style={{ backgroundColor: '#DFA568' }}
        >
          + Nova imobiliária
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {ativas.map((c) => {
          const mesAtual = new Date().toISOString().slice(0, 7)
          const entregaMes = c.historico.find((h) => h.mes === mesAtual)
          return (
            <Link
              key={c.id}
              href={`/consultorias/${c.id}`}
              className="bg-white rounded border border-gray-200 p-5 hover:border-[#DFA568] transition-colors flex items-center justify-between gap-6"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-[#1F2346]">{c.imobiliaria}</span>
                  <StatusBadge status={c.status} />
                </div>
                <div className="text-xs text-gray-400 mt-1">{c.responsavel} · {formatCurrency(c.valorMensal)}/mês</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-gray-400 mb-1">Mês atual</div>
                {entregaMes ? (
                  <StatusBadge status={entregaMes.status} />
                ) : (
                  <span className="text-xs text-gray-300">Sem registro</span>
                )}
              </div>
            </Link>
          )
        })}
        {ativas.length === 0 && (
          <div className="bg-white rounded border border-gray-200 p-8 text-center text-sm text-gray-400">
            Nenhuma imobiliária cadastrada.{' '}
            <Link href="/consultorias/nova" className="text-[#DFA568] hover:underline">Cadastrar a primeira</Link>
          </div>
        )}
      </div>

      {inativas.length > 0 && (
        <div className="mt-6 opacity-60">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Inativas ({inativas.length})</div>
          <div className="space-y-2">
            {inativas.map((c) => (
              <Link key={c.id} href={`/consultorias/${c.id}`} className="bg-white rounded border border-gray-200 p-4 flex items-center justify-between hover:border-gray-300 transition-colors">
                <span className="text-sm text-gray-500">{c.imobiliaria}</span>
                <StatusBadge status={c.status} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
