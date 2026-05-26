import Link from 'next/link'
import { getProcessos, getConsultorias, getExtrajudiciais, getPrazosProximos } from '@/lib/data'
import StatusBadge from '@/components/StatusBadge'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR')
}

function diasLabel(n: number) {
  if (n === 0) return 'Hoje'
  if (n === 1) return 'Amanhã'
  return `em ${n} dias`
}

export default function Dashboard() {
  const processos = getProcessos()
  const consultorias = getConsultorias()
  const extrajudiciais = getExtrajudiciais()
  const alertas = getPrazosProximos(7)

  const processosAtivos = processos.filter((p) => p.status !== 'Encerrado').length
  const consultoriasPendentes = consultorias.filter((c) => c.status === 'Pendente entrega' || c.status === 'Inadimplente').length
  const extrajudiciaisAtivas = extrajudiciais.filter((e) => e.status !== 'Concluída' && e.status !== 'Arquivada').length

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1F2346]">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Visão geral das demandas imobiliárias</p>
      </div>

      {/* Contadores */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Link href="/processos" className="bg-white rounded border border-gray-200 p-5 hover:border-[#DFA568] transition-colors group">
          <div className="text-3xl font-bold text-[#1F2346] group-hover:text-[#DFA568] transition-colors">{processosAtivos}</div>
          <div className="text-sm text-gray-500 mt-1">Processos ativos</div>
        </Link>
        <Link href="/consultorias" className="bg-white rounded border border-gray-200 p-5 hover:border-[#DFA568] transition-colors group">
          <div className="text-3xl font-bold text-[#1F2346] group-hover:text-[#DFA568] transition-colors">{consultorias.length}</div>
          <div className="text-sm text-gray-500 mt-1">Imobiliárias em consultoria</div>
          {consultoriasPendentes > 0 && (
            <div className="text-xs text-amber-600 mt-1 font-medium">{consultoriasPendentes} com pendência</div>
          )}
        </Link>
        <Link href="/extrajudiciais" className="bg-white rounded border border-gray-200 p-5 hover:border-[#DFA568] transition-colors group">
          <div className="text-3xl font-bold text-[#1F2346] group-hover:text-[#DFA568] transition-colors">{extrajudiciaisAtivas}</div>
          <div className="text-sm text-gray-500 mt-1">Demandas extrajudiciais ativas</div>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Alertas de prazo */}
        <div className="bg-white rounded border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-[#1F2346] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
            Prazos nos próximos 7 dias
          </h2>
          {alertas.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhum prazo nos próximos 7 dias.</p>
          ) : (
            <div className="space-y-3">
              {alertas.map((a, i) => (
                <Link
                  key={i}
                  href={`/${a.tipo === 'processo' ? 'processos' : 'extrajudiciais'}/${a.id}`}
                  className="flex items-start justify-between gap-3 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#1F2346] truncate group-hover:text-[#DFA568] transition-colors">
                      {a.titulo}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{a.responsavel} · {formatDate(a.prazo)}</div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded shrink-0 ${
                    a.diasRestantes === 0 ? 'bg-red-100 text-red-700' :
                    a.diasRestantes <= 2 ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    {diasLabel(a.diasRestantes)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Últimos processos */}
        <div className="bg-white rounded border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#1F2346]">Processos recentes</h2>
            <Link href="/processos" className="text-xs text-[#DFA568] hover:underline">Ver todos</Link>
          </div>
          <div className="space-y-3">
            {processos.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                href={`/processos/${p.id}`}
                className="flex items-start justify-between gap-3 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono text-gray-400">{p.numero}</div>
                  <div className="text-sm font-medium text-[#1F2346] truncate group-hover:text-[#DFA568] transition-colors">
                    {p.tipo}
                  </div>
                  <div className="text-xs text-gray-400">{p.responsavel}</div>
                </div>
                <StatusBadge status={p.status} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
