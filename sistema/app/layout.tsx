import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VSADV — Sistema de Demandas',
  description: 'Vieira da Silva Advocacia — Gestão de demandas imobiliárias',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="h-full">
        {children}
      </body>
    </html>
  )
}
