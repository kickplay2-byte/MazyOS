import { notFound } from 'next/navigation'
import { requirePermission, getCurrentRole } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import Link from 'next/link'
import { getMinutaAssistidaById } from '@/lib/data'
import {
  atualizarStatusMinuta,
  arquivarMinutaAssistida,
  duplicarMinutaAssistida,
  atualizarConteudoMinutaAssistida,
} from '@/lib/actions'
import StatusBadge from '@/components/StatusBadge'
import DeleteButton from '@/components/ui/DeleteButton'
import CopyButton from '@/components/ui/CopyButton'
import {
  STATUS_MINUTA,
  STATUS_MINUTA_LABELS,
  TIPO_DOCUMENTO_MINUTA_LABELS,
  MINUTA_ENTITY_TYPE_LABELS,
  RESPONSAVEIS,
} from '@/lib/types'
import { formatDate, getEntityHref } from '@/lib/utils'

export default async function MinutaPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('minutas:view')
  const { id } = await params
  const m = await getMinutaAssistidaById(id)
  if (!m) notFound()

  const role = await getCurrentRole()
  const canManage = hasPermission(role, 'minutas:manage')
  const canExport = hasPermission(role, 'minutas:export')

  const atualizarComId = atualizarStatusMinuta.bind(null, id)
  const arquivarComId = arquivarMinutaAssistida.bind(null, id)
  const duplicarComId = duplicarMinutaAssistida.bind(null, id)
  const editarConteudoComId = atualizarConteudoMinutaAssistida.bind(null, id)

  const origemHref = m.entityType && m.entityId ? getEntityHref(m.entityType, m.entityId) : null

  return (
    <div className="p-8 max-w-3xl">
      {/* Nav */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/minutas" className="text-sm text-gray-400 hover:text-[#DFA568] transition-colors">
          ← Minutas
        </Link>
        <div className="flex items-center gap-3">
          {canManage && (
            <form action={duplicarComId}>
              <button
                type="submit"
                className="text-xs text-gray-500 hover:text-[#1F2346] border border-gray-200 rounded px-3 py-1.5 hover:border-gray-300 transition-colors"
              >
                Duplicar
              </button>
            </form>
          )}
          {canManage && m.status !== 'arquivada' && (
            <form action={arquivarComId}>
              <DeleteButton
                confirmMessage="Arquivar esta minuta?"
                className="text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                Arquivar
              </DeleteButton>
            </form>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-[#1F2346]">{m.titulo}</h1>
            <div className="text-sm text-gray-500 mt-1">{TIPO_DOCUMENTO_MINUTA_LABELS[m.tipoDocumento]}</div>
          </div>
          <StatusBadge status={m.status} />
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div>
            <span className="text-xs text-gray-400 block">Responsável</span>
            <span className="text-[#1F2346]">{m.responsavel}</span>
          </div>
          <div>
            <span className="text-xs text-gray-400 block">Criado em</span>
            <span className="text-[#1F2346]">{formatDate(m.createdAt)}</span>
          </div>
          {m.updatedAt !== m.createdAt && (
            <div>
              <span className="text-xs text-gray-400 block">Atualizado em</span>
              <span className="text-gray-600">{formatDate(m.updatedAt)}</span>
            </div>
          )}
          {m.entityType && (
            <div>
              <span className="text-xs text-gray-400 block">Origem</span>
              {origemHref ? (
                <Link href={origemHref} className="text-[#DFA568] hover:underline transition-colors">
                  {m.entityLabel ?? MINUTA_ENTITY_TYPE_LABELS[m.entityType]}
                  <span className="ml-1 text-xs text-gray-400">({MINUTA_ENTITY_TYPE_LABELS[m.entityType]})</span>
                </Link>
              ) : (
                <span className="text-[#1F2346]">{MINUTA_ENTITY_TYPE_LABELS[m.entityType]}</span>
              )}
            </div>
          )}
          {m.modeloTitulo && (
            <div>
              <span className="text-xs text-gray-400 block">Modelo base</span>
              <span className="text-[#1F2346]">{m.modeloTitulo}</span>
            </div>
          )}
          {m.clausulaIds.length > 0 && (
            <div>
              <span className="text-xs text-gray-400 block">Cláusulas</span>
              <span className="text-[#1F2346]">{m.clausulaIds.length} selecionada(s)</span>
            </div>
          )}
          {m.checklistTitulo && (
            <div>
              <span className="text-xs text-gray-400 block">Checklist</span>
              <span className="text-[#1F2346]">{m.checklistTitulo}</span>
            </div>
          )}
          {m.orientacaoIds.length > 0 && (
            <div>
              <span className="text-xs text-gray-400 block">Orientações</span>
              <span className="text-[#1F2346]">{m.orientacaoIds.length} selecionada(s)</span>
            </div>
          )}
          {m.duplicadaDeId && (
            <div>
              <span className="text-xs text-gray-400 block">Copiada de</span>
              <Link href={`/minutas/${m.duplicadaDeId}`} className="text-gray-500 hover:text-[#DFA568] text-sm transition-colors">
                ver original
              </Link>
            </div>
          )}
          {m.revisadoEm && (
            <div>
              <span className="text-xs text-gray-400 block">Enviado para revisão</span>
              <span className="text-gray-600">{formatDate(m.revisadoEm)}</span>
            </div>
          )}
          {m.aprovadoEm && (
            <div>
              <span className="text-xs text-gray-400 block">Aprovado em</span>
              <span className="text-green-700">{formatDate(m.aprovadoEm)}</span>
            </div>
          )}
          {m.observacoes && (
            <div className="col-span-2">
              <span className="text-xs text-gray-400 block">Observações</span>
              <span className="text-gray-600">{m.observacoes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Atualizar status */}
      {canManage && <details className="bg-white border border-gray-200 rounded p-6 mb-6 group">
        <summary className="text-sm font-medium text-[#1F2346] cursor-pointer list-none flex items-center justify-between">
          Atualizar status
          <span className="text-gray-400 text-xs group-open:rotate-180 transition-transform inline-block">▼</span>
        </summary>
        <form action={atualizarComId} className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select
                name="status"
                defaultValue={m.status}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
              >
                {STATUS_MINUTA.filter((s) => s !== 'arquivada').map((s) => (
                  <option key={s} value={s}>{STATUS_MINUTA_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Responsável</label>
              <select
                name="responsavel"
                defaultValue={m.responsavel}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
              >
                {RESPONSAVEIS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Observações</label>
              <textarea
                name="observacoes"
                defaultValue={m.observacoes}
                rows={2}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568] resize-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90"
            style={{ backgroundColor: '#DFA568' }}
          >
            Salvar
          </button>
        </form>
      </details>}

      {/* Editar conteúdo */}
      {canManage && <details className="bg-white border border-gray-200 rounded p-6 mb-6 group">
        <summary className="text-sm font-medium text-[#1F2346] cursor-pointer list-none flex items-center justify-between">
          Editar título e conteúdo
          <span className="text-gray-400 text-xs group-open:rotate-180 transition-transform inline-block">▼</span>
        </summary>
        <form action={editarConteudoComId} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Título da minuta</label>
            <input
              name="titulo"
              defaultValue={m.titulo}
              required
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#DFA568]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Conteúdo</label>
            <textarea
              name="conteudo"
              defaultValue={m.conteudo}
              rows={24}
              required
              className="w-full border border-gray-200 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#DFA568] resize-y"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium rounded text-[#1F2346] hover:opacity-90"
              style={{ backgroundColor: '#DFA568' }}
            >
              Salvar alterações
            </button>
            <span className="text-xs text-gray-400">As alterações serão salvas no banco. Não há desfazer.</span>
          </div>
        </form>
      </details>}

      {/* Conteúdo */}
      <div className="bg-white border border-gray-200 rounded p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#1F2346]">Conteúdo da minuta</h2>
          <div className="flex items-center gap-2">
            <CopyButton text={m.conteudo} />
            {canExport && (
              <a
                href={`/api/minutas/${m.id}/export/docx`}
                className="text-xs text-gray-500 hover:text-[#1F2346] transition-colors px-3 py-1 border border-gray-200 rounded hover:border-gray-300"
                title="Baixar como arquivo Word (.docx)"
              >
                Exportar DOCX
              </a>
            )}
            {canExport && (
              <a
                href={`/api/minutas/${m.id}/export/pdf`}
                className="text-xs text-gray-500 hover:text-[#1F2346] transition-colors px-3 py-1 border border-gray-200 rounded hover:border-gray-300"
                title="Baixar como PDF"
              >
                Exportar PDF
              </a>
            )}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded px-4 py-3 mb-4">
          <p className="text-xs text-amber-800">
            <strong>⚠ Minuta de trabalho.</strong> Este conteúdo é uma referência assistida para rascunho interno.
            Não constitui instrumento jurídico finalizado. Exige revisão por advogado responsável.
          </p>
        </div>

        <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 border border-gray-100 rounded px-4 py-4 overflow-x-auto">
          {m.conteudo}
        </pre>
      </div>
    </div>
  )
}
