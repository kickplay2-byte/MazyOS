import { NextRequest, NextResponse } from 'next/server'
import { getEntityAdvisorContext, buildEntityAdvisorMessages } from '@/lib/entity-advisor'
import type { EntityAdvisorType } from '@/lib/entity-advisor'
import { callAI, AIKeyMissingError } from '@/lib/ai'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { getCurrentProfile } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'

const VALID_TYPES: EntityAdvisorType[] = [
  'imobiliaria',
  'corretor',
  'cliente',
  'oportunidade',
  'proposta',
  'processo',
  'extrajudicial',
  'consultoria',
  'tarefa',
  'arquivo',
]

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  const profile = await getCurrentProfile()
  const role = profile?.role ?? 'assistente'
  if (!hasPermission(role, 'advisor:use')) {
    return NextResponse.json({ error: 'Sem permissão para usar o Advisor.' }, { status: 403 })
  }

  let body: { entityType?: string; entityId?: string; question?: string } | null = null
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Requisição inválida.' }, { status: 400 })
  }

  const entityType = body?.entityType?.trim() ?? ''
  const entityId = body?.entityId?.trim() ?? ''
  const question = body?.question?.trim() ?? ''

  if (!entityType || !VALID_TYPES.includes(entityType as EntityAdvisorType)) {
    return NextResponse.json({ error: 'Tipo de entidade inválido.' }, { status: 400 })
  }
  if (!entityId) {
    return NextResponse.json({ error: 'ID da entidade obrigatório.' }, { status: 400 })
  }
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
    const context = await getEntityAdvisorContext(entityType as EntityAdvisorType, entityId)
    if (!context) {
      return NextResponse.json({ error: 'Entidade não encontrada.' }, { status: 404 })
    }

    const messages = buildEntityAdvisorMessages(question, context)
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
      console.error('[advisor/entity/route] Error:', (err as Error).message)
    }

    return NextResponse.json(
      { error: 'Não foi possível gerar a análise agora. Tente novamente em instantes.' },
      { status: 500 }
    )
  }
}
