'use client'
import type { AboutMe, HistoryItem, Tweaks } from './types'
import { TWEAK_DEFAULTS } from './constants'

export function getHistory(): HistoryItem[] {
  try {
    const s = localStorage.getItem('zhiwo-history')
    return s ? JSON.parse(s) : []
  } catch { return [] }
}

export function saveHistory(items: HistoryItem[]) {
  localStorage.setItem('zhiwo-history', JSON.stringify(items.slice(0, 20)))
}

export function getAboutMe(): AboutMe | null {
  try {
    const s = localStorage.getItem('zhiwo-about')
    return s ? JSON.parse(s) : null
  } catch { return null }
}

export function saveAboutMe(data: AboutMe) {
  localStorage.setItem('zhiwo-about', JSON.stringify(data))
}

export function getTweaks(): Tweaks {
  try {
    const s = localStorage.getItem('zhiwo-tweaks')
    return s ? JSON.parse(s) : TWEAK_DEFAULTS
  } catch { return TWEAK_DEFAULTS }
}

export function saveTweaks(tw: Tweaks) {
  localStorage.setItem('zhiwo-tweaks', JSON.stringify(tw))
}

export function mergeAboutMe(cur: AboutMe | null, updates: string[], insights: string[], question: string): AboutMe {
  const base: AboutMe = cur || { topics: [], patterns: [], triggers: [], boundaries: [], decisions: [], unclear: [] }
  const merge = (ex: string[], inc: string[]) =>
    [...inc, ...ex].filter((v, i, a) => a.findIndex(x => x.slice(0, 10) === v.slice(0, 10)) === i).slice(0, 6)
  return {
    ...base,
    topics:   merge(base.topics,   updates),
    patterns: merge(base.patterns, insights.slice(0, 2)),
    unclear:  merge(base.unclear,  [question].filter(Boolean)),
  }
}
