'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Tweaks } from '@/lib/types'

interface Props {
  tw: Tweaks
}

export default function Nav({ tw }: Props) {
  const ff = tw.useSerif ? "'Noto Serif SC', var(--font-noto-serif-sc), serif" : "'PingFang SC', sans-serif"
  const cur = usePathname()

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '22px 52px',
    }}>
      <Link href="/" style={{
        fontFamily: ff, fontSize: '18px', fontWeight: 500,
        color: 'oklch(20% 0.01 60)', letterSpacing: '.08em',
        background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none',
      }}>
        知我
      </Link>
      <div style={{ display: 'flex', gap: '36px' }}>
        {[{ l: '关于我', p: '/about' }, { l: '历史记录', p: '/history' }].map(({ l, p }) => (
          <Link key={p} href={p} style={{
            fontFamily: ff, fontSize: '14px', fontWeight: 300, letterSpacing: '.03em',
            color: cur === p ? 'oklch(20% 0.01 60)' : 'oklch(55% 0.01 60)',
            borderBottom: cur === p ? '1px solid oklch(20% 0.01 60)' : '1px solid transparent',
            paddingBottom: '1px', transition: 'color .2s', textDecoration: 'none',
          }}>
            {l}
          </Link>
        ))}
      </div>
    </nav>
  )
}
