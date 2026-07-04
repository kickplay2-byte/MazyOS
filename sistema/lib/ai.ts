const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export class AIKeyMissingError extends Error {
  constructor() {
    super('OPENAI_API_KEY_NOT_SET')
    this.name = 'AIKeyMissingError'
  }
}

export class AIRequestError extends Error {
  constructor(status: number) {
    super(`AI_API_ERROR:${status}`)
    this.name = 'AIRequestError'
  }
}

export async function callAI(messages: AIMessage[]): Promise<string> {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new AIKeyMissingError()

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 1400,
      temperature: 0.3,
    }),
  })

  if (!response.ok) throw new AIRequestError(response.status)

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  return data.choices?.[0]?.message?.content ?? ''
}
