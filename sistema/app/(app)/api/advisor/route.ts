import { NextRequest, NextResponse } from 'next/server'
import { getAdvisorContext, buildAdvisorMessages } from '@/lib/advisor'
import { callAI, AIKeyMissingError } from '@/lib/ai'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { getCurrentProfile } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'

export async function POST(req: NextRequest) {
  // Auth check — must be authenticated to use the advisor
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  // Permission check — advisor:use required
  const profile = await getCurrentProfile()
  const role = profile?.role ?? 'assistente'
  if (!hasPermission(role, 'advisor:use')) {
    return NextResponse.json({ error: 'Sem permissão para usar o Advisor.' }, { status: 403 })
  }

  let body: { question?: string } | null = null
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Requisição inválida.' }, { status: 400 })
  }

  const question = body?.question?.trim() ?? ''
  if (!question) {
    return NextResponse.json({ error: 'Pergunta não pode ser vazia.' }, { status: 400 })
  }
  if (question.length > 500) {
    return NextResponse.json({ error: 'Pergunta muito longa. Máximo 500 caracteres.' }, { status: 400 })
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'A chave de IA ainda não foi configurada no ambiente. Adicione OPENAI_API_KEY ao .env.local.' },
      { status: 503 }
    )
  }

  try {
    const context = await getAdvisorContext()
    const messages = buildAdvisorMessages(question, context)
    const answer = await callAI(messages)

    return NextResponse.json({ answer })
  } catch (err) {
    if (err instanceof AIKeyMissingError) {
      return NextResponse.json(
        { error: 'A chave de IA ainda não foi configurada no ambiente.' },
        { status: 503 }
      )
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('[advisor/route] Error:', (err as Error).message)
    }

    return NextResponse.json(
      { error: 'Não foi possível gerar a análise agora. Tente novamente em instantes.' },
      { status: 500 }
    )
  }
}
