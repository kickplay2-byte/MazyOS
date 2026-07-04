'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
          <h2>Algo deu errado</h2>
          <button onClick={reset} style={{ marginRight: '1rem' }}>Tentar novamente</button>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" style={{ color: '#1F2346' }}>Voltar ao início</a>
        </div>
      </body>
    </html>
  )
}
