import Anthropic from '@anthropic-ai/sdk'
import { AI_SYSTEM } from '@/lib/constants'

const client = new Anthropic()

export async function POST(request: Request) {
  const { messages, mode } = await request.json()

  const anthropicMessages = messages.map((m: { role: string; content: string }) => ({
    role: m.role === 'ai' ? 'assistant' : 'user',
    content: m.content,
  }))

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    system: AI_SYSTEM + `\n当前模式：${mode}`,
    messages: anthropicMessages,
  })

  const reply = response.content[0].type === 'text' ? response.content[0].text : '出了点问题，我们继续。'
  return Response.json({ reply })
}
