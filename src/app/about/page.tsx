'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import GlowBg from '@/components/GlowBg'
import Nav from '@/components/Nav'
import Btn from '@/components/Btn'
import { TWEAK_DEFAULTS } from '@/lib/constants'
import { getTweaks, getAboutMe } from '@/lib/storage'
import type { Tweaks, AboutMe } from '@/lib/types'

export default function AboutMePage() {
  const router = useRouter()
  const [tw, setTw] = useState<Tweaks>(TWEAK_DEFAULTS)
  const [aboutMe, setAboutMe] = useState<AboutMe | null>(null)

  useEffect(() => {
    setTw(getTweaks())
    setAboutMe(getAboutMe())
  }, [])

  const ff = tw.useSerif ? "'Noto Serif SC', var(--font-noto-serif-sc), serif" : "'PingFang SC', sans-serif"
  const h = tw.accentHue

  const sections = [
    { k: 'topics' as const,     l: '最近在意的事' },
    { k: 'patterns' as const,   l: '反复出现的情绪模式' },
    { k: 'triggers' as const,   l: '容易被触发的点' },
    { k: 'boundaries' as const, l: '边界和 red flags' },
    { k: 'decisions' as const,  l: '做决定时最容易受什么影响' },
    { k: 'unclear' as const,    l: '还没有想清楚的部分' },
  ]

  const isEmpty = !aboutMe || Object.values(aboutMe).every(v => !v || v.length === 0)

  return (
    <GlowBg tw={tw} style={{ fontFamily: ff }}>
      <Nav tw={tw} />
      <div className="fi" style={{ maxWidth: '660px', margin: '0 auto', padding: '120px 32px 100px' }}>
        <div style={{ marginBottom: '52px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 300, color: 'oklch(18% .01 60)', marginBottom: '14px' }}>关于我</h1>
          <p style={{ fontSize: '14px', fontWeight: 300, color: 'oklch(58% .01 60)', lineHeight: 1.8 }}>
            这里记录的不是结论，而是从每次对话中慢慢观察到的。
          </p>
        </div>

        {isEmpty ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <p style={{ fontSize: '14px', fontWeight: 300, color: 'oklch(58% .01 60)', lineHeight: 1.8, marginBottom: '28px' }}>
              完成一次对话后，<br />这里会开始积累属于你的观察。
            </p>
            <Btn tw={tw} onClick={() => router.push('/')}>开始第一次对话</Btn>
          </div>
        ) : (
          sections.map(({ k, l }, idx) => {
            const items = aboutMe?.[k]
            if (!items || items.length === 0) return null
            const last = idx === sections.length - 1
            return (
              <div key={k} style={{
                marginBottom: last ? 0 : '40px',
                paddingBottom: last ? 0 : '40px',
                borderBottom: last ? 'none' : '1px solid oklch(92% .01 75)',
              }}>
                <div style={{ fontSize: '11px', fontWeight: 400, letterSpacing: '.12em', color: 'oklch(60% .01 60)', marginBottom: '16px', textTransform: 'uppercase' }}>
                  {l}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {items.map((item, i) => (
                    <li key={i} style={{
                      fontSize: '15px', fontWeight: 300, color: 'oklch(24% .01 60)',
                      lineHeight: 1.8, paddingLeft: '18px',
                      borderLeft: `2px solid oklch(82% .07 ${h})`,
                    }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })
        )}
      </div>
    </GlowBg>
  )
}
