'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import GlowBg from '@/components/GlowBg'
import Btn from '@/components/Btn'
import ModeCard from '@/components/ModeCard'
import { MODES } from '@/lib/constants'
import { getTweaks } from '@/lib/storage'
import type { Tweaks, Mode } from '@/lib/types'
import { TWEAK_DEFAULTS } from '@/lib/constants'

export default function ModeSelectPage() {
  const router = useRouter()
  const [tw, setTw] = useState<Tweaks>(TWEAK_DEFAULTS)
  const [sel, setSel] = useState<Mode | null>(null)
  const [intent, setIntent] = useState<string | null>(null)

  useEffect(() => { setTw(getTweaks()) }, [])

  const ff = tw.useSerif ? "'Noto Serif SC', var(--font-noto-serif-sc), serif" : "'PingFang SC', sans-serif"
  const h = tw.accentHue
  const intents = [
    { id: 'review', l: '复盘一件具体的事' },
    { id: 'pattern', l: '梳理反复出现的感受' },
  ]

  return (
    <GlowBg tw={tw} style={{ fontFamily: ff }}>
      <button
        onClick={() => router.back()}
        style={{
          position: 'fixed', top: '28px', left: '52px', zIndex: 200,
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: ff, fontSize: '14px', fontWeight: 300, color: 'oklch(55% .01 60)',
        }}
      >
        ← 返回
      </button>

      <div className="fu" style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '100vh', padding: '24px',
      }}>
        <div style={{ maxWidth: '520px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '30px', fontWeight: 300, color: 'oklch(18% .01 60)', marginBottom: '10px' }}>
              今天想聊什么？
            </h2>
            <p style={{ fontSize: '14px', fontWeight: 300, color: 'oklch(58% .01 60)' }}>
              选一个方向，帮我们找到合适的切入点
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '32px' }}>
            {MODES.map(m => (
              <ModeCard key={m.id} mode={m} tw={tw} selected={sel === m.id} onClick={() => setSel(m.id)} />
            ))}
          </div>

          <div style={{ borderTop: '1px solid oklch(91% .01 75)', paddingTop: '24px', marginBottom: '36px' }}>
            <p style={{ fontSize: '13px', fontWeight: 300, color: 'oklch(60% .01 60)', marginBottom: '12px', textAlign: 'center' }}>
              这次更想… （可选）
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {intents.map(i => {
                const active = intent === i.id
                return (
                  <button key={i.id} onClick={() => setIntent(active ? null : i.id)} style={{
                    padding: '9px 18px', borderRadius: '100px', fontSize: '13px',
                    cursor: 'pointer', fontFamily: ff, fontWeight: 300,
                    border: `1px solid ${active ? `oklch(58% .12 ${h})` : 'oklch(88% .01 75)'}`,
                    background: active ? `oklch(58% .12 ${h} / .08)` : 'transparent',
                    color: active ? `oklch(50% .12 ${h})` : 'oklch(52% .01 60)',
                    transition: 'all .2s',
                  }}>
                    {i.l}
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Btn
              tw={tw}
              disabled={!sel}
              onClick={() => sel && router.push(`/chat?mode=${sel}${intent ? `&intent=${intent}` : ''}`)}
            >
              进入对话
            </Btn>
          </div>
        </div>
      </div>
    </GlowBg>
  )
}
