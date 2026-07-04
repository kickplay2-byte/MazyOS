import Link from 'next/link'
import { getArquivos, getProcessos, getExtrajudiciais, getConsultorias } from '@/lib/data'
import { formatDate, statusArquivoLabel, vinculoTipoLabel } from '@/lib/utils'
import PageHeader from '@/components/ui/PageHeader'
import { requirePermission } from '@/lib/auth'

const STATUS_CORES: Record<string, { bg: string; text: string }> = {
  pendente: { bg: '#fff7ed', text: '#c2410c' },
  entregue: { bg: '#eff6ff', text: '#3b82f6' },
  aprovado: { bg: '#f0fdf4', text: '#15803d' },
}

function vinculoHref(vinculoTipo: string, vinculoId: string): string {
  if (vinculoTipo === 'processo') return `/processos/${vinculoId}`
  if (vinculoTipo === 'extrajudicial') return `/extrajudiciais/${vinculoId}`
  if (vinculoTipo === 'consultoria') return `/consultorias/${vinculoId}`
  return '#'
}

export default async function DocumentosPage() {
  await requirePermission('documentos:view')
  const [arquivos, processos, extrajudiciais, consultorias] = await Promise.all([
    getArquivos(), getProcessos(), getExtrajudiciais(), getConsultorias(),
  ])

  const processoMap = Object.fromEntries(processos.map((p) => [p.id, `${p.numero} — ${p.tipo}`]))
  const extrajudicialMap = Object.fromEntries(extrajudiciais.map((e) => [e.id, e.titulo]))
  const consultoriaMap = Object.fromEntries(consultorias.map((c) => [c.id, c.imobiliaria]))

  function vinculoNome(vinculoTipo: string, vinculoId: string): string {
    if (vinculoTipo === 'processo') return processoMap[vinculoId] ?? vinculoId
    if (vinculoTipo === 'extrajudicial') return extrajudicialMap[vinculoId] ?? vinculoId
    if (vinculoTipo === 'consultoria') return consultoriaMap[vinculoId] ?? vinculoId
    return vinculoId
  }

  const pendentes = arquivos.filter((a) => a.status === 'pendente').length
  const entregues = arquivos.filter((a) => a.status === 'entregue').length
  const aprovados = arquivos.filter((a) => a.status === 'aprovado').length

  return (
    <div className="p-8">
      <PageHeader
        title="Documentos"
        description="Repositório de documentos por demanda"
        action={
          <Link href="/documentos/novo" className="px-4 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90" style={{ backgroundColor: '#DFA568' }}>
            + Novo documento
          </Link>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Pendentes', value: pendentes, cor: '#c2410c' },
          { label: 'Entregues', value: entregues, cor: '#3b82f6' },
          { label: 'Aprovados', value: aprovados, cor: '#15803d' },
        ].map((k) => (
          <div key={k.label} className="bg-white border border-gray-200 rounded p-4">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">{k.label}</div>
            <div className="text-2xl font-semibold" style={{ color: k.cor }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Lista */}
      {arquivos.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded p-12 text-center">
          <div className="text-sm text-gray-400 mb-3">Nenhum documento cadastrado</div>
          <Link href="/documentos/novo" className="text-sm font-medium hover:opacity-80" style={{ color: '#DFA568' }}>
            Adicionar primeiro documento →
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Documento</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Demanda</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Adicionado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {arquivos.map((a) => {
                const cores = STATUS_CORES[a.status]
                return (
                  <tr key={a.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{a.nome}</div>
                      {a.descricao && <div className="text-xs text-gray-400 mt-0.5">{a.descricao}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={vinculoHref(a.vinculoTipo, a.vinculoId)} className="text-xs text-gray-500 hover:text-[#DFA568] transition-colors">
                        <span className="text-gray-400">{vinculoTipoLabel(a.vinculoTipo)} · </span>
                        {vinculoNome(a.vinculoTipo, a.vinculoId)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium px-2.5 py-1 rounded" style={{ backgroundColor: cores.bg, color: cores.text }}>
                        {statusArquivoLabel(a.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{formatDate(a.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      {a.url && (
                        <a
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#DFA568] hover:opacity-80"
                        >
                          Abrir →
                        </a>
                      )}
                    </td>
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
