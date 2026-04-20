'use client'

export default function Dots() {
  return (
    <div style={{ display: 'flex', gap: '5px', padding: '10px 6px', marginBottom: '16px' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: 'oklch(72% .01 60)',
          animation: `blink 1.3s ${i * 0.2}s infinite ease-in-out`,
        }} />
      ))}
    </div>
  )
}
