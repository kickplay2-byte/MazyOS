import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { requireUser, getCurrentProfile } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()
  const profile = await getCurrentProfile()

  // Usuário com conta desativada não deve ter acesso ao app
  if (profile?.status === 'inativo') redirect('/acesso-negado')

  // Fallback para menor privilégio se profile não existir no banco
  const userRole = profile?.role ?? 'assistente'

  return (
    <div className="flex min-h-screen h-full">
      <Sidebar userEmail={user.email} userRole={userRole} />
      <main className="flex-1 overflow-auto bg-[#f5f4f1]">
        {children}
      </main>
    </div>
  )
}
