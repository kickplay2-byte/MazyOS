import { type NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { getMinutaAssistidaById } from '@/lib/data'
import { gerarDocxMinuta, nomeArquivoDocx } from '@/lib/export-minutas'
import { getCurrentProfile } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // ── Auth check ────────────────────────────────────────────────────────────
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  // ── Permission check ──────────────────────────────────────────────────────
  const profile = await getCurrentProfile()
  const role = profile?.role ?? 'assistente'
  if (!hasPermission(role, 'minutas:export')) {
    return NextResponse.json({ error: 'Sem permissão para exportar minutas.' }, { status: 403 })
  }

  // ── Buscar minuta ─────────────────────────────────────────────────────────
  const { id } = await params
  const minuta = await getMinutaAssistidaById(id)
  if (!minuta) {
    return NextResponse.json({ error: 'Minuta não encontrada.' }, { status: 404 })
  }

  // ── Gerar DOCX ────────────────────────────────────────────────────────────
  try {
    const buffer = await gerarDocxMinuta(minuta)
    const filename = nomeArquivoDocx(minuta)

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(buffer.length),
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('[export/docx] Erro ao gerar DOCX:', err)
    return NextResponse.json({ error: 'Erro interno ao gerar o arquivo.' }, { status: 500 })
  }
}
