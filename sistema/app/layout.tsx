import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'VSADV — Sistema de Demandas',
  description: 'Vieira da Silva Advocacia — Gestão de demandas imobiliárias',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="flex min-h-screen h-full">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-[#f5f4f1]">
          {children}
        </main>
      </body>
    </html>
  )
}
