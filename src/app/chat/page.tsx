'use client'
import { useEffect, useState, useRef, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Btn from '@/components/Btn'
import Dots from '@/components/Dots'
import { MODES, OPENERS, TWEAK_DEFAULTS } from '@/lib/constants'
import { getTweaks } from '@/lib/storage'
import type { Tweaks, Mode, Message } from '@/lib/types'

function ChatContent() {
  const router = useRouter()
  const params = useSearchParams()
  const mode = (params.get('mode') || 'free') as Mode
  const modeObj = MODES.find(m => m.id === mode) || MODES[3]

  const [tw, setTw] = useState<Tweaks>(TWEAK_DEFAULTS)
  const [msgs, setMsgs] = useState<Message[]>([{ role: 'ai', content: OPENERS[mode] }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { setTw(getTweaks()) }, [])
  useEffect(() => {
    if (endRef.current) {
      endRef.current.parentElement?.scrollTo({ top: endRef.current.parentElement.scrollHeight, behavior: 'smooth' })
    }
  }, [msgs, loading])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    if (taRef.current) taRef.current.style.height = 'auto'
    const next: Message[] = [...msgs, { role: 'user', content: text }]
    setMsgs(next)
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, mode: modeObj.label }),
      })
      const data = await res.json()
      setMsgs(p => [...p, { role: 'ai', content: data.reply }])
    } catch {
      setMsgs(p => [...p, { role: 'ai', content: '出了点小问题，我们可以继续。' }])
    }
    setLoading(false)
  }, [input, loading, msgs, modeObj])

  const finish = async () => {
    const key = `zhiwo-chat-${Date.now()}`
    sessionStorage.setItem(key, JSON.stringify({ msgs, mode }))
    router.push(`/summary?key=${key}`)
  }

  const ff = tw.useSerif ? "'Noto Serif SC', var(--font-noto-serif-sc), serif" : "'PingFang SC', sans-serif"
  const h = tw.accentHue

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'oklch(98.8% .006 75)', fontFamily: ff }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 52px', borderBottom: '1px solid oklch(92% .008 75)',
        background: 'oklch(99% .005 75 / .92)', backdropFilter: 'blur(14px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button onClick={() => router.push('/')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: ff, fontSize: '14px', fontWeight: 300, color: 'oklch(58% .01 60)',
          }}>←</button>
          <span style={{ fontSize: '15px', fontWeight: 400, color: 'oklch(30% .01 60)', letterSpacing: '.04em' }}>
            {modeObj.label}
          </span>
        </div>
        <Btn tw={tw} variant="ghost" disabled={msgs.length < 3} onClick={finish}>
          结束并整理
        </Btn>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 0 20px' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto', padding: '0 32px' }}>
          {msgs.map((msg, i) => {
            const isU = msg.role === 'user'
            return (
              <div key={i} className="fu" style={{ display: 'flex', justifyContent: isU ? 'flex-end' : 'flex-start', marginBottom: '22px' }}>
                <div style={{
                  maxWidth: '78%',
                  background: isU ? `oklch(58% .12 ${h} / .09)` : 'transparent',
                  border: isU ? `1px solid oklch(72% .08 ${h} / .25)` : 'none',
                  borderRadius: isU ? '20px 20px 4px 20px' : '0',
                  padding: isU ? '13px 18px' : '4px 6px',
                  fontSize: '15px', fontWeight: 300, lineHeight: 1.82,
                  color: 'oklch(22% .01 60)', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                  {msg.content}
                </div>
              </div>
            )
          })}
          {loading && <Dots />}
          <div ref={endRef} />
        </div>
      </div>

      {/* Input */}
      <div style={{
        padding: '16px 52px 28px', borderTop: '1px solid oklch(92% .008 75)',
        background: 'oklch(99% .005 75 / .95)', backdropFilter: 'blur(14px)',
      }}>
        <div style={{ maxWidth: '620px', margin: '0 auto', display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <textarea
            ref={taRef}
            value={input}
            onChange={e => {
              setInput(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px'
            }}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="说说你现在的状态…"
            rows={1}
            style={{
              flex: 1, resize: 'none', outline: 'none',
              border: `1px solid oklch(88% .012 75)`, borderRadius: '18px',
              padding: '14px 20px', fontSize: '15px', fontWeight: 300,
              color: 'oklch(20% .01 60)', lineHeight: 1.65,
              background: 'oklch(99.5% .003 75)', minHeight: '52px', maxHeight: '140px',
              transition: 'border-color .2s',
            }}
            onFocus={e => { e.target.style.borderColor = `oklch(72% .08 ${h})` }}
            onBlur={e => { e.target.style.borderColor = 'oklch(88% .012 75)' }}
          />
          <SendBtn onClick={send} active={!!input.trim() && !loading} h={h} />
        </div>
      </div>
    </div>
  )
}

function SendBtn({ onClick, active, h }: { onClick: () => void; active: boolean; h: number }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={!active}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '50px', height: '50px', borderRadius: '50%', border: 'none', flexShrink: 0,
        cursor: active ? 'pointer' : 'not-allowed',
        background: active ? (hov ? `oklch(52% .12 ${h})` : `oklch(58% .12 ${h})`) : 'oklch(89% .01 75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .2s',
        boxShadow: active && hov ? `0 4px 16px oklch(58% .12 ${h} / .4)` : 'none',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke={active ? 'white' : 'oklch(70% .01 60)'} strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    </button>
  )
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatContent />
    </Suspense>
  )
}
