'use client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import GlowBg from '@/components/GlowBg'
import Nav from '@/components/Nav'
import Btn from '@/components/Btn'
import { MODES, TWEAK_DEFAULTS } from '@/lib/constants'
import { getTweaks, getHistory, saveHistory, getAboutMe, saveAboutMe, mergeAboutMe } from '@/lib/storage'
import type { Tweaks, Summary, Message, Mode, HistoryItem } from '@/lib/types'

function SummaryContent() {
  const router = useRouter()
  const params = useSearchParams()
  const key = params.get('key') || ''

  const [tw, setTw] = useState<Tweaks>(TWEAK_DEFAULTS)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => { setTw(getTweaks()) }, [])

  useEffect(() => {
    const viewId = params.get('view')
    if (viewId) {
      const raw = sessionStorage.getItem(`zhiwo-view-${viewId}`)
      if (raw) setSummary(JSON.parse(raw))
      return
    }
    if (!key) return
    const raw = sessionStorage.getItem(key)
    if (!raw) return
    const { msgs, mode }: { msgs: Message[]; mode: Mode } = JSON.parse(raw)

    const generate = async () => {
      try {
        const res = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: msgs, mode }),
        })
        const data: Omit<Summary, 'mode' | 'date'> = await res.json()
        const modeObj = MODES.find(m => m.id === mode)
        const today = new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
        const full: Summary = { ...data, mode, date: today }
        setSummary(full)

        const history = getHistory()
        const newItem: HistoryItem = {
          id: key,
          title: data.title || '一次对话',
          date: today,
          mode: modeObj?.label || mode,
          excerpt: (data.insights || [])[0] || '',
          summary: full,
          messages: msgs,
        }
        saveHistory([newItem, ...history])

        const aboutMe = getAboutMe()
        saveAboutMe(mergeAboutMe(aboutMe, data.updates || [], data.insights || [], data.question || ''))
        sessionStorage.removeItem(key)
      } catch {
        setError(true)
        const fallback: Summary = {
          mode, date: new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }),
          title: '这次对话',
          overview: '这次聊了一些重要的事，值得慢慢回想。',
          insights: ['你愿意把想法说出来，本身就很有价值。'],
          question: '在你回想的这些事情里，哪部分还没有完全说清楚？',
          updates: ['你最近似乎在认真思考一些事。'],
        }
        setSummary(fallback)
      }
    }
    generate()
  }, [key])

  const ff = tw.useSerif ? "'Noto Serif SC', var(--font-noto-serif-sc), serif" : "'PingFang SC', sans-serif"
  const h = tw.accentHue

  if (!summary) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', fontFamily: ff, flexDirection: 'column', gap: '16px',
        background: 'oklch(98.5% .008 75)',
      }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: `oklch(72% .08 ${h})`,
              animation: `blink 1.3s ${i * 0.22}s infinite ease-in-out`,
            }} />
          ))}
        </div>
        <p style={{ fontSize: '15px', fontWeight: 300, color: 'oklch(55% .01 60)' }}>正在整理这次对话…</p>
      </div>
    )
  }

  const modeObj = MODES.find(m => m.id === summary.mode)

  const sections = [
    {
      label: '主要聊了什么',
      node: <p style={{ fontSize: '15px', fontWeight: 300, lineHeight: 1.9, color: 'oklch(24% .01 60)' }}>{summary.overview}</p>,
    },
    {
      label: '这次更清楚了',
      node: (
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(summary.insights || []).map((t, i) => (
            <li key={i} style={{ display: 'flex', gap: '14px' }}>
              <span style={{ color: `oklch(58% .12 ${h})`, flexShrink: 0, marginTop: '2px' }}>·</span>
              <span style={{ fontSize: '15px', fontWeight: 300, lineHeight: 1.8, color: 'oklch(24% .01 60)' }}>{t}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      label: '值得继续想的',
      node: (
        <p style={{
          fontSize: '18px', fontWeight: 300, lineHeight: 1.75, color: 'oklch(24% .01 60)',
          fontStyle: 'italic', borderLeft: `3px solid oklch(82% .07 ${h})`, paddingLeft: '20px',
        }}>
          {summary.question}
        </p>
      ),
    },
    {
      label: '更新到「关于我」',
      last: true,
      node: (
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(summary.updates || []).map((t, i) => (
            <li key={i} style={{ display: 'flex', gap: '14px' }}>
              <span style={{ color: `oklch(62% .08 ${h + 30})`, flexShrink: 0, fontSize: '13px', marginTop: '3px' }}>△</span>
              <span style={{ fontSize: '14px', fontWeight: 300, lineHeight: 1.8, color: 'oklch(38% .01 60)' }}>{t}</span>
            </li>
          ))}
        </ul>
      ),
    },
  ]

  return (
    <GlowBg tw={tw} style={{ fontFamily: ff }}>
      <Nav tw={tw} />
      <div className="fi" style={{ maxWidth: '660px', margin: '0 auto', padding: '120px 32px 100px' }}>
        <div style={{ marginBottom: '56px' }}>
          <div style={{ fontSize: '12px', letterSpacing: '.12em', textTransform: 'uppercase', color: 'oklch(62% .01 60)', marginBottom: '10px', fontWeight: 300 }}>
            {summary.date}  ·  {modeObj?.label || '对话'}
          </div>
          <h1 style={{ fontSize: '34px', fontWeight: 300, color: 'oklch(18% .01 60)', lineHeight: 1.35 }}>
            {summary.title}
          </h1>
        </div>

        {sections.map(({ label, node, last }) => (
          <div key={label} style={{
            marginBottom: last ? '48px' : '40px',
            paddingBottom: last ? 0 : '40px',
            borderBottom: last ? 'none' : '1px solid oklch(92% .01 75)',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 400, letterSpacing: '.12em', color: 'oklch(60% .01 60)', marginBottom: '16px', textTransform: 'uppercase' }}>
              {label}
            </div>
            {node}
          </div>
        ))}

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Btn tw={tw} onClick={() => router.push('/')}>返回首页</Btn>
          <Btn tw={tw} variant="ghost" onClick={() => router.push('/about')}>查看关于我</Btn>
          <Btn tw={tw} variant="text" onClick={() => router.push(`/chat?mode=${summary.mode}`)}>继续聊这件事 →</Btn>
        </div>
      </div>
    </GlowBg>
  )
}

export default function SummaryPage() {
  return (
    <Suspense>
      <SummaryContent />
    </Suspense>
  )
}
