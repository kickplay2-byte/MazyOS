import Link from 'next/link'
import { getImobiliarias, getCorretores, getClientes, getPropostasAbertas, getPropostasAceitas, getPropostasVencidas, getValorPropostasAbertas, getValorPropostasAceitas, getTaxaConversaoPropostas } from '@/lib/data'
import { formatCurrency, nivelRelacionamentoLabel, formatDate } from '@/lib/utils'
import PageHeader from '@/components/ui/PageHeader'

export default function ComercialPage() {
  const imobiliarias = getImobiliarias()
  const corretores = getCorretores()
  const clientes = getClientes()

  const propostasAbertas = getPropostasAbertas()
  const propostasAceitas = getPropostasAceitas()
  const propostasVencidas = getPropostasVencidas()
  const valorAbertas = getValorPropostasAbertas()
  const valorAceitas = getValorPropostasAceitas()
  const taxaConversao = getTaxaConversaoPropostas()

  const ativas = imobiliarias.filter((i) => i.status === 'ativa')
  const receitaMensal = ativas.reduce((sum, i) => sum + i.valorMensal, 0)
  const corretoresAtivos = corretores.filter((c) => c.status === 'ativo')
  const totalIndicacoes = corretores.reduce((sum, c) => sum + c.quantidadeIndicacoes, 0)

  const nivelColors: Record<string, string> = {
    estrategico: '#DFA568',
    ativo: '#16a34a',
    neutro: '#6b7280',
    em_risco: '#dc2626',
  }

  const proximasAcoes = [
    ...imobiliarias
      .filter((i) => i.proximaAcao && i.proximaAcaoData)
      .map((i) => ({
        tipo: 'Imobiliária' as const,
        nome: i.nome,
        acao: i.proximaAcao!,
        data: i.proximaAcaoData!,
        href: `/comercial/imobiliarias/${i.id}`,
      })),
    ...corretores
      .filter((c) => c.proximaAcao && c.proximaAcaoData)
      .map((c) => ({
        tipo: 'Corretor' as const,
        nome: c.nome,
        acao: c.proximaAcao!,
        data: c.proximaAcaoData!,
        href: `/comercial/corretores/${c.id}`,
      })),
  ]
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 6)

  return (
    <div className="p-8">
      <PageHeader
        title="Visão Comercial"
        description="Pipeline de imobiliárias, corretores e clientes"
      />

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Imobiliárias ativas', value: ativas.length, total: imobiliarias.length, href: '/comercial/imobiliarias' },
          { label: 'Receita mensal', value: formatCurrency(receitaMensal), href: '/comercial/imobiliarias' },
          { label: 'Corretores ativos', value: corretoresAtivos.length, total: corretores.length, href: '/comercial/corretores' },
          { label: 'Total de clientes', value: clientes.length, sub: `${totalIndicacoes} indicações`, href: '/comercial/clientes' },
        ].map((kpi) => (
          <Link
            key={kpi.label}
            href={kpi.href}
            className="bg-white border border-gray-200 rounded p-5 hover:border-gray-300 transition-colors block"
          >
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">{kpi.label}</div>
            <div className="text-2xl font-semibold text-gray-900">
              {kpi.value}
              {kpi.total !== undefined && (
                <span className="text-sm font-normal text-gray-400"> / {kpi.total}</span>
              )}
            </div>
            {kpi.sub && <div className="text-xs text-gray-400 mt-1">{kpi.sub}</div>}
          </Link>
        ))}
      </div>

      {/* Propostas e Honorários */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Propostas e Honorários</h2>
          <Link href="/comercial/propostas" className="text-xs text-gray-400 hover:text-gray-600">
            Ver todas →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Link
            href="/comercial/propostas?status=rascunho"
            className="bg-white border border-gray-200 rounded p-4 hover:border-gray-300 transition-colors block"
          >
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Em aberto</div>
            <div className="text-2xl font-semibold text-gray-900">{propostasAbertas.length}</div>
            <div className="text-xs text-gray-400 mt-1">{formatCurrency(valorAbertas)}</div>
          </Link>
          <Link
            href="/comercial/propostas?status=aceita"
            className="bg-white border border-gray-200 rounded p-4 hover:border-gray-300 transition-colors block"
          >
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Aceitas</div>
            <div className="text-2xl font-semibold" style={{ color: '#15803d' }}>{propostasAceitas.length}</div>
            <div className="text-xs text-gray-400 mt-1">{formatCurrency(valorAceitas)}</div>
          </Link>
          <Link
            href="/comercial/propostas"
            className="bg-white border border-gray-200 rounded p-4 hover:border-gray-300 transition-colors block"
          >
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Taxa de conversão</div>
            <div className="text-2xl font-semibold text-gray-900">{taxaConversao}%</div>
            <div className="text-xs text-gray-400 mt-1">
              {propostasVencidas.length > 0 && (
                <span className="text-amber-600">{propostasVencidas.length} vencida{propostasVencidas.length !== 1 ? 's' : ''}</span>
              )}
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Imobiliárias por relacionamento */}
        <div className="bg-white border border-gray-200 rounded p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-700">Imobiliárias</h2>
            <Link href="/comercial/imobiliarias" className="text-xs text-gray-400 hover:text-gray-600">
              Ver todas →
            </Link>
          </div>
          <div className="space-y-2">
            {imobiliarias.slice(0, 5).map((im) => (
              <Link
                key={im.id}
                href={`/comercial/imobiliarias/${im.id}`}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: nivelColors[im.nivelRelacionamento] ?? '#6b7280' }}
                  />
                  <div>
                    <div className="text-sm text-gray-800">{im.nome}</div>
                    <div className="text-xs text-gray-400">{nivelRelacionamentoLabel(im.nivelRelacionamento)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">{formatCurrency(im.valorMensal)}</div>
                  <div className="text-xs text-gray-400">/mês</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Próximas ações */}
        <div className="bg-white border border-gray-200 rounded p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-700">Próximas ações</h2>
          </div>
          {proximasAcoes.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">Nenhuma ação agendada</p>
          ) : (
            <div className="space-y-2">
              {proximasAcoes.map((a, i) => (
                <Link
                  key={i}
                  href={a.href}
                  className="flex items-start justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
                >
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">
                      <span className="inline-block px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 mr-1.5">
                        {a.tipo}
                      </span>
                      {a.nome}
                    </div>
                    <div className="text-sm text-gray-700">{a.acao}</div>
                  </div>
                  <div className="text-xs text-gray-400 shrink-0 ml-3">{formatDate(a.data)}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
