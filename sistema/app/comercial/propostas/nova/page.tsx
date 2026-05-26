import { criarProposta } from '@/lib/actions'
import { getOportunidades, getClientes, getCorretores, getImobiliarias, getOportunidade } from '@/lib/data'
import { RESPONSAVEIS, TIPOS_EXTRAJUDICIAL, FORMAS_PAGAMENTO, STATUS_PROPOSTA } from '@/lib/types'
import PageHeader from '@/components/ui/PageHeader'

export default async function NovaPropostaPage({
  searchParams,
}: {
  searchParams: Promise<{ oportunidadeId?: string }>
}) {
  const params = await searchParams
  const oportunidades = getOportunidades()
  const clientes = getClientes()
  const corretores = getCorretores()
  const imobiliarias = getImobiliarias()

  // Pré-preencher a partir de oportunidade, se fornecida via query param
  const oportunidadePre = params.oportunidadeId ? getOportunidade(params.oportunidadeId) : undefined

  const clientePre = oportunidadePre?.clienteId ?? ''
  const corretorPre = oportunidadePre?.corretorId ?? ''
  const imobiliariaPre = oportunidadePre?.imobiliariaId ?? ''
  const tipoServicoPre = oportunidadePre?.tipoServico ?? ''
  const valorPre = oportunidadePre?.valorEstimado ?? ''

  return (
    <div className="p-8 max-w-2xl">
      <PageHeader
        title="Nova proposta"
        breadcrumbs={[
          { label: 'Comercial', href: '/comercial' },
          { label: 'Propostas', href: '/comercial/propostas' },
          { label: 'Nova' },
        ]}
      />

      <form action={criarProposta} className="bg-white border border-gray-200 rounded p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">

          {/* Oportunidade vinculada */}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Oportunidade vinculada</label>
            <select
              name="oportunidadeId"
              defaultValue={params.oportunidadeId ?? ''}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            >
              <option value="">Nenhuma</option>
              {oportunidades.map((o) => (
                <option key={o.id} value={o.id}>{o.titulo}</option>
              ))}
            </select>
          </div>

          {/* Cliente */}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Cliente *</label>
            <select
              name="clienteId"
              required
              defaultValue={clientePre}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            >
              <option value="">Selecione...</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          {/* Corretor */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Corretor indicador</label>
            <select
              name="corretorId"
              defaultValue={corretorPre}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            >
              <option value="">Nenhum</option>
              {corretores.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          {/* Imobiliária */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Imobiliária</label>
            <select
              name="imobiliariaId"
              defaultValue={imobiliariaPre}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            >
              <option value="">Nenhuma</option>
              {imobiliarias.map((i) => (
                <option key={i.id} value={i.id}>{i.nome}</option>
              ))}
            </select>
          </div>

          {/* Título */}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Título da proposta *</label>
            <input
              name="titulo"
              required
              placeholder="Ex: Proposta — Inventário Extrajudicial — Maria Silva"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Tipo de serviço */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tipo de serviço *</label>
            <select
              name="tipoServico"
              required
              defaultValue={tipoServicoPre}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            >
              <option value="">Selecione...</option>
              {TIPOS_EXTRAJUDICIAL.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status inicial *</label>
            <select
              name="status"
              required
              defaultValue="rascunho"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            >
              <option value="rascunho">Rascunho</option>
              <option value="enviada">Enviada</option>
              <option value="em_negociacao">Em negociação</option>
            </select>
          </div>

          {/* Escopo */}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Escopo dos serviços * <span className="font-normal text-gray-400">(um item por linha)</span>
            </label>
            <textarea
              name="escopo"
              required
              rows={4}
              placeholder={"Análise do contrato\nElaboração de notificação\nAcompanhamento da negociação"}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400 resize-none"
            />
          </div>

          {/* Valor total */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Valor total (R$) *</label>
            <input
              name="valorTotal"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={valorPre || ''}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Forma de pagamento */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Forma de pagamento</label>
            <select
              name="formaPagamento"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            >
              <option value="">Selecione...</option>
              <option value="a_vista">À vista</option>
              <option value="entrada_mais_parcelas">Entrada + parcelas</option>
              <option value="parcelado">Parcelado</option>
              <option value="exito">Êxito</option>
              <option value="mensal">Mensal</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          {/* Valor de entrada */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Valor de entrada (R$)</label>
            <input
              name="valorEntrada"
              type="number"
              step="0.01"
              min="0"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Parcelas */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nº de parcelas</label>
            <input
              name="quantidadeParcelas"
              type="number"
              min="0"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Valor da parcela */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Valor por parcela (R$)</label>
            <input
              name="valorParcela"
              type="number"
              step="0.01"
              min="0"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Validade */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Validade da proposta *</label>
            <input
              name="validade"
              type="date"
              required
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Data de envio */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Data de envio</label>
            <input
              name="dataEnvio"
              type="date"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Responsável */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Responsável *</label>
            <select
              name="responsavel"
              required
              defaultValue="Giovanni"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            >
              {RESPONSAVEIS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Observações */}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Observações</label>
            <textarea
              name="observacoes"
              rows={2}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2 rounded text-sm font-medium text-white"
            style={{ backgroundColor: '#1F2346' }}
          >
            Criar proposta
          </button>
          <a
            href="/comercial/propostas"
            className="px-5 py-2 rounded text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}
