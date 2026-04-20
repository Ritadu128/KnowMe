import OpenAI from 'openai'
import { SUMMARY_PROMPT, MODES } from '@/lib/constants'

const client = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
})

export async function POST(request: Request) {
  const { messages, mode } = await request.json()
  const modeObj = MODES.find((m) => m.id === mode)

  const convo = messages
    .map((m: { role: string; content: string }) => `${m.role === 'user' ? '用户' : '知我'}: ${m.content}`)
    .join('\n\n')

  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    max_tokens: 800,
    messages: [
      { role: 'user', content: SUMMARY_PROMPT + `模式：${modeObj?.label || mode}\n\n` + convo },
    ],
  })

  const text = response.choices[0].message.content || ''
  const match = text.match(/\{[\s\S]*\}/)

  if (!match) {
    return Response.json({
      title: '这次对话',
      overview: '这次聊了一些重要的事，值得慢慢回想。',
      insights: ['你愿意把想法说出来，本身就很有价值。'],
      question: '在你回想的这些事情里，哪部分还没有完全说清楚？',
      updates: ['你最近似乎在认真思考一些事。'],
    })
  }

  return Response.json(JSON.parse(match[0]))
}
