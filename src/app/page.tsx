'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import GlowBg from '@/components/GlowBg'
import Nav from '@/components/Nav'
import Btn from '@/components/Btn'
import ModeCard from '@/components/ModeCard'
import { MODES, TWEAK_DEFAULTS } from '@/lib/constants'
import { getTweaks } from '@/lib/storage'
import type { Tweaks, Mode } from '@/lib/types'

export default function HomePage() {
  const router = useRouter()
  const [tw, setTw] = useState<Tweaks>(TWEAK_DEFAULTS)

  useEffect(() => { setTw(getTweaks()) }, [])

  const ff = tw.useSerif ? "'Noto Serif SC', var(--font-noto-serif-sc), serif" : "'PingFang SC', sans-serif"

  const startChat = (modeId: Mode | null) => {
    if (modeId) {
      router.push(`/chat?mode=${modeId}`)
    } else {
      router.push('/mode-select')
    }
  }

  return (
    <GlowBg tw={tw} style={{ fontFamily: ff }}>
      <Nav tw={tw} />
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '100vh', padding: '120px 24px 80px',
      }}>
        <div className="fu" style={{ textAlign: 'center', marginBottom: '72px', maxWidth: '500px' }}>
          <h1 style={{
            fontSize: 'clamp(40px, 5vw, 60px)', fontWeight: 300, lineHeight: 1.25,
            color: 'oklch(18% .01 60)', marginBottom: '22px', letterSpacing: '.03em',
          }}>
            慢慢看清自己
          </h1>
          <p style={{ fontSize: '16px', fontWeight: 300, lineHeight: 1.9, color: 'oklch(52% .01 60)', marginBottom: '40px' }}>
            把混乱的想法说清楚<br />找到你真正在意的事
          </p>
          <Btn tw={tw} onClick={() => startChat(null)}>开始一次对话</Btn>
        </div>

        <div className="fu" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px',
          maxWidth: '760px', width: '100%', animationDelay: '.1s',
        }}>
          {MODES.map(m => (
            <ModeCard key={m.id} mode={m} tw={tw} onClick={() => startChat(m.id)} />
          ))}
        </div>

        <div className="fu" style={{ display: 'flex', gap: '36px', marginTop: '52px', animationDelay: '.18s' }}>
          <Btn tw={tw} variant="text" onClick={() => router.push('/about')}>关于我 →</Btn>
          <Btn tw={tw} variant="text" onClick={() => router.push('/history')}>最近记录 →</Btn>
        </div>
      </div>
    </GlowBg>
  )
}
