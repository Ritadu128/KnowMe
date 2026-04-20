'use client'
import { useState } from 'react'
import type { ModeConfig, Tweaks } from '@/lib/types'

interface Props {
  mode: ModeConfig
  tw: Tweaks
  onClick: () => void
  selected?: boolean
}

export default function ModeCard({ mode, tw, onClick, selected = false }: Props) {
  const [hov, setHov] = useState(false)
  const h = tw.accentHue
  const ff = tw.useSerif ? "'Noto Serif SC', var(--font-noto-serif-sc), serif" : "'PingFang SC', sans-serif"

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: selected ? `oklch(58% .12 ${h} / .07)` : hov ? 'oklch(97% .01 75)' : 'oklch(99.2% .004 75)',
        border: `1px solid ${selected ? `oklch(58% .12 ${h} / .4)` : hov ? 'oklch(84% .015 75)' : 'oklch(91% .012 75)'}`,
        borderRadius: '18px', padding: '22px 20px', cursor: 'pointer', textAlign: 'left', fontFamily: ff,
        transform: hov && !selected ? 'translateY(-2px)' : 'none',
        boxShadow: hov ? '0 6px 20px oklch(0% 0 0 / .06)' : 'none',
        transition: 'all .22s',
      }}
    >
      <div style={{ fontSize: '17px', fontWeight: 400, color: selected ? `oklch(50% .12 ${h})` : 'oklch(20% .01 60)', marginBottom: '7px' }}>
        {mode.label}
      </div>
      <div style={{ fontSize: '12px', fontWeight: 300, color: 'oklch(62% .01 60)', letterSpacing: '.02em' }}>
        {mode.sub}
      </div>
    </button>
  )
}
