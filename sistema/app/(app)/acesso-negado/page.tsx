import Link from 'next/link'

export const metadata = { title: 'Acesso negado — PIPE OS' }

export default function AcessoNegadoPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="max-w-md text-center space-y-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2"
          style={{ backgroundColor: 'rgba(223,165,104,0.12)' }}
        >
          <svg className="w-7 h-7" fill="none" stroke="#DFA568" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>

        <h1 className="text-xl font-semibold text-gray-900">Acesso negado</h1>
        <p className="text-sm text-gray-500">
          Você não possui permissão para acessar esta área.
          <br />
          Se acredita que isso é um erro, entre em contato com o administrador.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-2 px-4 py-2 text-sm font-medium rounded transition-colors text-white"
          style={{ backgroundColor: '#1F2346' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar ao Dashboard
        </Link>
      </div>
    </div>
  )
}
