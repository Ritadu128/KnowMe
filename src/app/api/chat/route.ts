import OpenAI from 'openai'
import { AI_SYSTEM } from '@/lib/constants'

const client = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
})

export async function POST(request: Request) {
  const { messages, mode } = await request.json()

  const formatted = messages.map((m: { role: string; content: string }) => ({
    role: m.role === 'ai' ? 'assistant' : 'user',
    content: m.content,
  }))

  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    max_tokens: 300,
    messages: [
      { role: 'system', content: AI_SYSTEM + `\n当前模式：${mode}` },
      ...formatted,
    ],
  })

  const reply = response.choices[0].message.content || '出了点问题，我们继续。'
  return Response.json({ reply })
}
