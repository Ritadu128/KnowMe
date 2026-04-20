'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import GlowBg from '@/components/GlowBg'
import Nav from '@/components/Nav'
import Btn from '@/components/Btn'
import { TWEAK_DEFAULTS } from '@/lib/constants'
import { getTweaks, getHistory } from '@/lib/storage'
import type { Tweaks, HistoryItem } from '@/lib/types'

function HistoryCard({ item, tw, onClick }: { item: HistoryItem; tw: Tweaks; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  const h = tw.accentHue
  const ff = tw.useSerif ? "'Noto Serif SC', var(--font-noto-serif-sc), serif" : "'PingFang SC', sans-serif"
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'oklch(97% .01 75)' : 'oklch(99.2% .004 75)',
        border: `1px solid ${hov ? 'oklch(84% .015 75)' : 'oklch(91% .012 75)'}`,
        borderRadius: '18px', padding: '24px 28px', cursor: 'pointer',
        transition: 'all .22s', fontFamily: ff,
        transform: hov ? 'translateY(-2px)' : 'none',
        boxShadow: hov ? '0 6px 20px oklch(0% 0 0 / .05)' : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '11px', fontWeight: 400, letterSpacing: '.08em', color: `oklch(58% .1 ${h})`, textTransform: 'uppercase' }}>
          {item.mode}
        </span>
        <span style={{ fontSize: '12px', fontWeight: 300, color: 'oklch(65% .01 60)' }}>{item.date}</span>
      </div>
      <h3 style={{ fontSize: '17px', fontWeight: 400, color: 'oklch(20% .01 60)', marginBottom: '8px', lineHeight: 1.4 }}>
        {item.title}
      </h3>
      <p style={{ fontSize: '13px', fontWeight: 300, color: 'oklch(56% .01 60)', lineHeight: 1.7 }}>
        {item.excerpt}
      </p>
    </div>
  )
}

export default function HistoryPage() {
  const router = useRouter()
  const [tw, setTw] = useState<Tweaks>(TWEAK_DEFAULTS)
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    setTw(getTweaks())
    setHistory(getHistory())
  }, [])

  const ff = tw.useSerif ? "'Noto Serif SC', var(--font-noto-serif-sc), serif" : "'PingFang SC', sans-serif"

  return (
    <GlowBg tw={tw} style={{ fontFamily: ff }}>
      <Nav tw={tw} />
      <div className="fi" style={{ maxWidth: '660px', margin: '0 auto', padding: '120px 32px 100px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 300, color: 'oklch(18% .01 60)', marginBottom: '52px' }}>历史记录</h1>

        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <p style={{ fontSize: '14px', fontWeight: 300, color: 'oklch(58% .01 60)', lineHeight: 1.8, marginBottom: '28px' }}>
              每次对话结束后，<br />记录会保存在这里。
            </p>
            <Btn tw={tw} onClick={() => router.push('/')}>开始第一次对话</Btn>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {history.map((item, i) => (
              <HistoryCard
                key={item.id || i}
                item={item}
                tw={tw}
                onClick={() => {
                  sessionStorage.setItem(`zhiwo-view-${item.id}`, JSON.stringify(item.summary))
                  router.push(`/summary?view=${item.id}`)
                }}
              />
            ))}
          </div>
        )}
      </div>
    </GlowBg>
  )
}
