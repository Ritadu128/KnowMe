export type Mode = 'relationship' | 'work' | 'self' | 'free'

export interface ModeConfig {
  id: Mode
  label: string
  sub: string
}

export interface Message {
  role: 'user' | 'ai'
  content: string
}

export interface Summary {
  title: string
  overview: string
  insights: string[]
  question: string
  updates: string[]
  mode: Mode
  date: string
}

export interface AboutMe {
  topics: string[]
  patterns: string[]
  triggers: string[]
  boundaries: string[]
  decisions: string[]
  unclear: string[]
}

export interface HistoryItem {
  id: string
  title: string
  date: string
  mode: string
  excerpt: string
  summary: Summary
  messages: Message[]
}

export interface Tweaks {
  accentHue: number
  glowOpacity: number
  useSerif: boolean
}
