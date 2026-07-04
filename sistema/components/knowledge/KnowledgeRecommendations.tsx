import Link from 'next/link'
import { getKnowledgeRecommendationsForEntity } from '@/lib/knowledge-recommendations'
import type { KnowledgeEntityType, KnowledgeRecommendation } from '@/lib/knowledge-recommendations'

interface Props {
  entityType: KnowledgeEntityType
  entityId: string
  title?: string
  compact?: boolean
}

const KIND_LABEL: Record<KnowledgeRecommendation['kind'], string> = {
  modelo: 'Modelo',
  clausula: 'Cláusula',
  checklist: 'Checklist',
  orientacao: 'Orientação',
}

const KIND_LABEL_PLURAL: Record<KnowledgeRecommendation['kind'], string> = {
  modelo: 'Modelos',
  clausula: 'Cláusulas',
  checklist: 'Checklists',
  orientacao: 'Orientações',
}

const KIND_BADGE: Record<KnowledgeRecommendation['kind'], string> = {
  modelo: 'bg-blue-50 text-blue-700',
  clausula: 'bg-amber-50 text-amber-700',
  checklist: 'bg-green-50 text-green-700',
  orientacao: 'bg-purple-50 text-purple-700',
}

export default async function KnowledgeRecommendations({ entityType, entityId, title, compact }: Props) {
  const recs = await getKnowledgeRecommendationsForEntity(entityType, entityId)

  return (
    <div className="bg-white border border-gray-200 rounded p-4">
      <div className="flex items-center gap-2 mb-3">
        <BookIcon />
        <span className="text-sm font-medium text-gray-700">{title ?? 'Base de Conhecimento'}</span>
      </div>

      {recs.total === 0 ? (
        <p className="text-xs text-gray-400">Nenhum item relacionado encontrado.</p>
      ) : (
        <div className="space-y-3">
          {(
            [
              { kind: 'modelo' as const, items: recs.modelos },
              { kind: 'clausula' as const, items: recs.clausulas },
              { kind: 'checklist' as const, items: recs.checklists },
              { kind: 'orientacao' as const, items: recs.orientacoes },
            ] as { kind: KnowledgeRecommendation['kind']; items: KnowledgeRecommendation[] }[]
          )
            .filter(({ items }) => items.length > 0)
            .map(({ kind, items }) => (
              <div key={kind}>
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">
                  {KIND_LABEL_PLURAL[kind]}
                </div>
                <ul className="space-y-1.5">
                  {items.map((rec) => (
                    <li key={rec.id}>
                      <Link
                        href={rec.href}
                        className="flex items-start gap-2 group"
                      >
                        <span
                          className={`shrink-0 mt-0.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${KIND_BADGE[kind]}`}
                        >
                          {KIND_LABEL[kind]}
                        </span>
                        <span className="text-xs text-gray-700 group-hover:text-[#1F2346] group-hover:underline leading-tight">
                          {rec.titulo}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}

      {!compact && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <Link href="/conhecimento" className="text-xs text-gray-400 hover:text-gray-600">
            Ver base completa →
          </Link>
        </div>
      )}
    </div>
  )
}

function BookIcon() {
  return (
    <svg
      className="w-4 h-4 text-gray-400 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25"
      />
    </svg>
  )
}
