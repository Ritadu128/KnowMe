'use client'
import type { Tweaks } from '@/lib/types'

interface Props {
  tw: Tweaks
  children: React.ReactNode
  style?: React.CSSProperties
}

export default function GlowBg({ tw, children, style }: Props) {
  const h = tw.accentHue
  const op = tw.glowOpacity
  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: 'oklch(98.5% .008 75)', ...style }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', width: '62%', height: '52%', top: '-14%', left: '19%',
          borderRadius: '50%',
          background: `oklch(89% .08 ${h + 28})`,
          filter: 'blur(90px)', opacity: op,
          animation: 'blob1 11s ease-in-out infinite, hueShift 16s ease-in-out infinite',
          willChange: 'transform',
        }} />
        <div style={{
          position: 'absolute', width: '42%', height: '38%', top: '38%', left: '-8%',
          borderRadius: '50%',
          background: `oklch(91% .06 ${h - 20})`,
          filter: 'blur(75px)', opacity: op * 0.65,
          animation: 'blob2 15s ease-in-out infinite, hueShift2 20s ease-in-out infinite',
          willChange: 'transform',
        }} />
        <div style={{
          position: 'absolute', width: '38%', height: '32%', top: '52%', right: '-6%',
          borderRadius: '50%',
          background: `oklch(90% .07 ${h + 10})`,
          filter: 'blur(82px)', opacity: op * 0.55,
          animation: 'blob3 19s ease-in-out infinite, hueShift3 13s ease-in-out infinite',
          willChange: 'transform',
        }} />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  )
}
