import { getSystemHealth } from '@/lib/settings'
import {
  getImobiliarias,
  getCorretores,
  getClientes,
  getOportunidades,
  getPropostas,
  getProcessos,
  getExtrajudiciais,
  getConsultorias,
  getTarefas,
  getResumoBaseConhecimento,
  getResumoMinutasAssistidas,
} from '@/lib/data'
import { USER_ROLE_LABELS, USER_ROLES } from '@/lib/types'
import { getCurrentProfile } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { atualizarProfileRoleStatus } from '@/lib/actions'

export const metadata = { title: 'Configurações — PIPE OS' }

export default async function ConfiguracoesPage() {
  const [health, imobiliarias, corretores, clientes, oportunidades, propostas, processos, extrajudiciais, consultorias, tarefas, resumoBaseConhecimento, resumoMinutas, currentProfile] =
    await Promise.all([
      getSystemHealth(),
      getImobiliarias(),
      getCorretores(),
      getClientes(),
      getOportunidades(),
      getPropostas(),
      getProcessos(),
      getExtrajudiciais(),
      getConsultorias(),
      getTarefas(),
      getResumoBaseConhecimento(),
      getResumoMinutasAssistidas(),
      getCurrentProfile(),
    ])

  const canManageUsers = hasPermission(currentProfile?.role ?? 'assistente', 'users:manage')

  const { office, integrations, security, users } = health

  return (
    <div className="max-w-4xl p-8 space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Configurações</h1>
        <p className="text-sm text-gray-500 mt-1">Estado operacional e administrativo do sistema</p>
      </div>

      {/* A. Escritório */}
      <section>
        <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
          A. Escritório
        </div>
        <div className="bg-white border border-gray-200 rounded p-5">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Sistema</dt>
              <dd className="text-gray-900 font-medium">{office.systemName}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Escritório</dt>
              <dd className="text-gray-900 font-medium">{office.officeName}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Área principal</dt>
              <dd className="text-gray-900">{office.mainArea}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Cidade</dt>
              <dd className="text-gray-900">{office.city}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Versão</dt>
              <dd className="text-gray-900">{office.version}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Ambiente</dt>
              <dd className="text-gray-900">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  office.environment === 'production'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-yellow-50 text-yellow-700'
                }`}>
                  {office.environment}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* B. Usuários e Perfis */}
      <section>
        <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
          B. Usuários e Perfis
        </div>
        <div className="bg-white border border-gray-200 rounded p-5 space-y-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-gray-50 rounded p-3">
              <div className="text-2xl font-semibold text-gray-900">{users.resumo.total}</div>
              <div className="text-xs text-gray-500 mt-0.5">Total</div>
            </div>
            <div className="bg-gray-50 rounded p-3">
              <div className="text-2xl font-semibold text-gray-900">{users.resumo.ativos}</div>
              <div className="text-xs text-gray-500 mt-0.5">Ativos</div>
            </div>
            <div className="bg-gray-50 rounded p-3">
              <div className="text-2xl font-semibold text-gray-900">{users.resumo.inativos}</div>
              <div className="text-xs text-gray-500 mt-0.5">Inativos</div>
            </div>
            <div className="bg-gray-50 rounded p-3">
              <div className="text-2xl font-semibold text-gray-900">{users.resumo.porRole.admin}</div>
              <div className="text-xs text-gray-500 mt-0.5">Admins</div>
            </div>
          </div>

          {users.profiles.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Nenhum perfil cadastrado</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide pb-2">Nome</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide pb-2">Email</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide pb-2">Papel</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide pb-2">Status</th>
                  {canManageUsers && (
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide pb-2">Ações</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.profiles.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 text-gray-900">{p.nome}</td>
                    <td className="py-2 text-gray-500">{p.email}</td>
                    <td className="py-2 text-gray-700">{USER_ROLE_LABELS[p.role]}</td>
                    <td className="py-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        p.status === 'ativo'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    {canManageUsers && (
                      <td className="py-2">
                        <form action={atualizarProfileRoleStatus} className="flex items-center gap-2">
                          <input type="hidden" name="profileId" value={p.id} />
                          <input type="hidden" name="nome" value={p.nome} />
                          <select
                            name="role"
                            defaultValue={p.role}
                            className="text-xs border border-gray-200 rounded px-1.5 py-1 text-gray-700 bg-white"
                          >
                            {USER_ROLES.map((r) => (
                              <option key={r} value={r}>{USER_ROLE_LABELS[r]}</option>
                            ))}
                          </select>
                          <select
                            name="status"
                            defaultValue={p.status}
                            className="text-xs border border-gray-200 rounded px-1.5 py-1 text-gray-700 bg-white"
                          >
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                          </select>
                          <button
                            type="submit"
                            className="text-xs px-2.5 py-1 rounded text-white transition-colors"
                            style={{ backgroundColor: '#1F2346' }}
                          >
                            Salvar
                          </button>
                        </form>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="pt-2 border-t border-gray-100 text-xs text-gray-400">
            Novos usuários devem ser criados pelo{' '}
            <span className="font-medium text-gray-600">Supabase Dashboard</span>{' '}
            (Authentication → Users) e receberão perfil automaticamente via trigger.
            {canManageUsers && (
              <span className="ml-1 text-amber-600">Você tem permissão de administrador para editar papéis e status.</span>
            )}
          </div>
        </div>
      </section>

      {/* C. Integrações */}
      <section>
        <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
          C. Integrações
        </div>
        <div className="bg-white border border-gray-200 rounded p-5 space-y-3">
          <IntegrationRow
            label="Supabase URL"
            ok={integrations.supabase.urlConfigured}
            okText="Configurada"
            failText="NEXT_PUBLIC_SUPABASE_URL ausente"
          />
          <IntegrationRow
            label="Supabase Anon Key"
            ok={integrations.supabase.anonKeyConfigured}
            okText="Configurada"
            failText="NEXT_PUBLIC_SUPABASE_ANON_KEY ausente"
          />
          <IntegrationRow
            label="Supabase (geral)"
            ok={integrations.supabase.configured}
            okText="Operacional"
            failText="Incompleto"
          />
          <IntegrationRow
            label="OpenAI API Key"
            ok={integrations.openai.configured}
            okText="Configurada (server-side)"
            failText="OPENAI_API_KEY ausente — Advisor retorna 503"
          />
          <IntegrationRow
            label="Advisor Global (/advisor)"
            ok={integrations.advisor.globalEnabled}
            okText="Habilitado"
            failText="Desabilitado (sem OpenAI Key)"
          />
          <IntegrationRow
            label="Advisor por Entidade"
            ok={integrations.advisor.entityEnabled}
            okText="Habilitado"
            failText="Desabilitado (sem OpenAI Key)"
          />
        </div>
      </section>

      {/* D. Segurança */}
      <section>
        <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
          D. Segurança
        </div>
        <div className="bg-white border border-gray-200 rounded p-5 space-y-3">
          <SecurityRow label="Autenticação ativa (proxy.ts)" ok={security.authActive} />
          <SecurityRow label="Proxy protegendo todas as rotas" ok={security.proxyActive} />
          <SecurityRow label="/advisor protegido por sessão" ok={security.advisorProtected} />
          <SecurityRow label="Advisor por entidade protegido" ok={security.entityAdvisorProtected} />
          <SecurityRow label="Service role NÃO exposta" ok={!security.serviceRoleExposed} />
          <SecurityRow label="Sem chaves sensíveis em variáveis client" ok={!security.sensibleKeysInClient} />
          <SecurityRow label="Registro público desabilitado" ok={!security.publicRegistration} />

          <div className="pt-3 border-t border-gray-100 space-y-2">
            <div className="text-xs font-medium text-gray-500">Verificação de RLS no Supabase</div>
            <p className="text-xs text-gray-400">
              Execute a query abaixo no SQL Editor do Supabase. Todas as tabelas devem ter{' '}
              <code className="bg-gray-100 px-1 rounded">rowsecurity = true</code>.
            </p>
            <pre className="bg-gray-50 border border-gray-200 rounded p-3 text-xs text-gray-700 overflow-x-auto">
{`SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;`}
            </pre>
          </div>
        </div>
      </section>

      {/* E. Sistema */}
      <section>
        <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
          E. Sistema
        </div>
        <div className="bg-white border border-gray-200 rounded p-5 space-y-5">
          <div>
            <div className="text-xs font-medium text-gray-500 mb-2">Registros por módulo</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Imobiliárias', count: imobiliarias.length, href: '/comercial/imobiliarias' },
                { label: 'Corretores', count: corretores.length, href: '/comercial/corretores' },
                { label: 'Clientes', count: clientes.length, href: '/comercial/clientes' },
                { label: 'Oportunidades', count: oportunidades.length, href: '/comercial/oportunidades' },
                { label: 'Propostas', count: propostas.length, href: '/comercial/propostas' },
                { label: 'Processos', count: processos.length, href: '/processos' },
                { label: 'Extrajudiciais', count: extrajudiciais.length, href: '/extrajudiciais' },
                { label: 'Consultorias', count: consultorias.length, href: '/consultorias' },
                { label: 'Tarefas', count: tarefas.length, href: '/tarefas' },
              ].map(({ label, count, href }) => (
                <a
                  key={href}
                  href={href}
                  className="bg-gray-50 rounded p-3 hover:bg-gray-100 transition-colors group"
                >
                  <div className="text-xl font-semibold text-gray-900">{count}</div>
                  <div className="text-xs text-gray-500 mt-0.5 group-hover:text-gray-700">{label}</div>
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="text-xs font-medium text-gray-500 mb-2">Base de Conhecimento</div>
            <div className="grid grid-cols-4 gap-3 mb-3">
              {[
                { label: 'Modelos', count: resumoBaseConhecimento.totalModelos, href: '/conhecimento/modelos' },
                { label: 'Cláusulas', count: resumoBaseConhecimento.totalClausulas, href: '/conhecimento/clausulas' },
                { label: 'Checklists', count: resumoBaseConhecimento.totalChecklists, href: '/conhecimento/checklists' },
                { label: 'Orientações', count: resumoBaseConhecimento.totalOrientacoes, href: '/conhecimento/orientacoes' },
              ].map(({ label, count, href }) => (
                <a key={href} href={href} className="bg-gray-50 rounded p-3 hover:bg-gray-100 transition-colors group text-center">
                  <div className="text-xl font-semibold text-gray-900">{count}</div>
                  <div className="text-xs text-gray-500 mt-0.5 group-hover:text-gray-700">{label}</div>
                </a>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">Status da Base de Conhecimento</span>
              <span className="text-xs font-medium text-green-700">✓ Ativa</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="text-xs font-medium text-gray-500 mb-2">Montador de Minutas</div>
            <div className="grid grid-cols-5 gap-3 mb-3">
              {[
                { label: 'Total ativas', count: resumoMinutas.total, href: '/minutas' },
                { label: 'Rascunhos', count: resumoMinutas.rascunhos, href: '/minutas' },
                { label: 'Em revisão', count: resumoMinutas.emRevisao, href: '/minutas?status=em_revisao' },
                { label: 'Aprovadas', count: resumoMinutas.aprovadas, href: '/minutas?status=aprovada' },
                { label: 'Arquivadas', count: resumoMinutas.arquivadas, href: '/minutas?status=arquivada' },
              ].map(({ label, count, href }) => (
                <a key={label} href={href} className="bg-gray-50 rounded p-3 hover:bg-gray-100 transition-colors group text-center">
                  <div className="text-xl font-semibold text-gray-900">{count}</div>
                  <div className="text-xs text-gray-500 mt-0.5 group-hover:text-gray-700">{label}</div>
                </a>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-700">Status do Montador de Minutas</span>
              <span className="text-xs font-medium text-green-700">✓ Ativo</span>
            </div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-700">Exportação DOCX</span>
              <span className="text-xs font-medium text-green-700">✓ Ativa</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">Exportação PDF</span>
              <span className="text-xs font-medium text-green-700">✓ Ativa</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="text-xs font-medium text-gray-500 mb-2">Build</div>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div>
                <dt className="text-gray-500 text-xs">Última validação</dt>
                <dd className="text-gray-900">26/05/2026</dd>
              </div>
              <div>
                <dt className="text-gray-500 text-xs">tsc --noEmit</dt>
                <dd className="text-green-700 font-medium">0 erros</dd>
              </div>
              <div>
                <dt className="text-gray-500 text-xs">eslint</dt>
                <dd className="text-green-700 font-medium">0 warnings</dd>
              </div>
              <div>
                <dt className="text-gray-500 text-xs">next build</dt>
                <dd className="text-green-700 font-medium">49 rotas — OK</dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="text-xs font-medium text-gray-500 mb-2">Links rápidos</div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Dashboard', href: '/' },
                { label: 'Advisor', href: '/advisor' },
                { label: 'Visão Comercial', href: '/comercial' },
                { label: 'Processos', href: '/processos' },
                { label: 'Tarefas', href: '/tarefas' },
              ].map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="text-xs px-3 py-1.5 border border-gray-200 rounded text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function IntegrationRow({
  label,
  ok,
  okText,
  failText,
}: {
  label: string
  ok: boolean
  okText: string
  failText: string
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-700">{label}</span>
      <span className={`text-xs font-medium ${ok ? 'text-green-700' : 'text-red-600'}`}>
        {ok ? okText : failText}
      </span>
    </div>
  )
}

function SecurityRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-700">{label}</span>
      <span className={`text-xs font-medium ${ok ? 'text-green-700' : 'text-red-600'}`}>
        {ok ? '✓ OK' : '✗ Atenção'}
      </span>
    </div>
  )
}
