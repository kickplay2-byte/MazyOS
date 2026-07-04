import Link from 'next/link'
import { requirePermission } from '@/lib/auth'
import {
  getModelosJuridicos,
  getClausulasPadrao,
  getChecklistsJuridicos,
  getOrientacoesInternas,
  getProcessos,
  getExtrajudiciais,
  getConsultorias,
  getOportunidades,
  getPropostas,
} from '@/lib/data'
import { RESPONSAVEIS } from '@/lib/types'
import type { MinutaEntityType } from '@/lib/types'
import MinutaNovaWizard from './MinutaNovaWizard'

export default async function MinutaNovaPage({
  searchParams,
}: {
  searchParams: Promise<{ entityType?: string; entityId?: string }>
}) {
  await requirePermission('minutas:manage')
  const params = await searchParams

  const [
    modelos,
    clausulas,
    checklists,
    orientacoes,
    processos,
    extrajudiciais,
    consultorias,
    oportunidades,
    propostas,
  ] = await Promise.all([
    getModelosJuridicos(),
    getClausulasPadrao(),
    getChecklistsJuridicos(),
    getOrientacoesInternas(),
    getProcessos(),
    getExtrajudiciais(),
    getConsultorias(),
    getOportunidades(),
    getPropostas(),
  ])

  const entidades: Record<MinutaEntityType, { id: string; label: string }[]> = {
    processo: processos.map((p) => ({ id: p.id, label: `${p.numero} — ${p.tipo}` })),
    extrajudicial: extrajudiciais.map((e) => ({ id: e.id, label: e.titulo })),
    consultoria: consultorias.map((c) => ({ id: c.id, label: c.imobiliaria })),
    oportunidade: oportunidades.map((o) => ({ id: o.id, label: o.titulo })),
    proposta: propostas.map((p) => ({ id: p.id, label: p.titulo })),
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/minutas" className="text-sm text-gray-400 hover:text-[#DFA568] transition-colors">
          ← Minutas
        </Link>
        <h1 className="text-xl font-semibold text-[#1F2346]">Nova minuta assistida</h1>
      </div>

      <MinutaNovaWizard
        modelos={modelos}
        clausulas={clausulas}
        checklists={checklists}
        orientacoes={orientacoes}
        responsaveis={RESPONSAVEIS}
        entidades={entidades}
        initialEntityType={params.entityType}
        initialEntityId={params.entityId}
      />
    </div>
  )
}
