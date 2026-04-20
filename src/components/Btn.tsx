'use client'
import { useState } from 'react'
import type { Tweaks } from '@/lib/types'

interface Props {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'text'
  tw: Tweaks
  style?: React.CSSProperties
  disabled?: boolean
}

export default function Btn({ children, onClick, variant = 'primary', tw, style, disabled }: Props) {
  const [hov, setHov] = useState(false)
  const h = tw.accentHue
  const ff = tw.useSerif ? "'Noto Serif SC', var(--font-noto-serif-sc), serif" : "'PingFang SC', sans-serif"

  const vs = {
    primary: {
      background: hov ? `oklch(52% .12 ${h})` : `oklch(58% .12 ${h})`,
      color: 'white', border: 'none', padding: '13px 36px', borderRadius: '100px',
      fontSize: '15px', fontWeight: 400,
      boxShadow: hov ? `0 4px 20px oklch(58% .12 ${h} / .35)` : 'none',
    },
    ghost: {
      background: hov ? 'oklch(96% .01 75)' : 'transparent',
      color: 'oklch(38% .01 60)', border: '1px solid oklch(86% .012 75)',
      padding: '11px 28px', borderRadius: '100px', fontSize: '14px', fontWeight: 300,
    },
    text: {
      background: 'transparent', border: 'none',
      color: hov ? `oklch(50% .12 ${h})` : 'oklch(52% .01 60)',
      padding: '8px 4px', fontSize: '14px', fontWeight: 300,
    },
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: ff, letterSpacing: '.04em',
        transition: 'all .22s', opacity: disabled ? 0.45 : 1,
        ...vs[variant], ...style,
      }}
    >
      {children}
    </button>
  )
}
