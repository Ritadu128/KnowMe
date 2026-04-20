import type { ModeConfig, Mode } from './types'

export const MODES: ModeConfig[] = [
  { id: 'relationship', label: '感情',        sub: '爱情 · 友情 · 家人' },
  { id: 'work',         label: '工作 / 学业', sub: '职业 · 压力 · 选择' },
  { id: 'self',         label: '自我探索',    sub: '身份 · 价值观 · 成长' },
  { id: 'free',         label: '自由聊聊',    sub: '说不清，但想说' },
]

export const OPENERS: Record<Mode, string> = {
  relationship: '这里很安全，可以慢慢说。\n\n最近有什么让你想聊聊的？',
  work:         '工作和学业上的压力，有时候说出来就会清晰一些。\n\n发生什么了？',
  self:         '自我探索不需要答案，也没有标准结果。\n\n你现在脑子里转得最多的是什么？',
  free:         '不用想太多，先说说你现在的状态。',
}

export const AI_SYSTEM = `你是"知我"——一个帮助用户进行自我探索的对话伙伴。
目标：帮用户完成 事件→情绪→含义→核心在意点→初步方向 这条路径。
做法：承接情绪、引导深入、克制地提出追问，每次最多问一个问题，每次只推进一点。
语气：自然温和、不说教、不鸡汤、不AI味，回复简短到中等，不超过120字。
禁止：诊断、医疗建议、过度定义用户。`

export const SUMMARY_PROMPT = `根据以下对话，用中文生成自我探索总结，只返回JSON，格式如下：
{"title":"对话标题(8字内)","overview":"1到2段观察性文字，总结主题和核心矛盾","insights":["insight1","insight2","insight3"],"question":"一个开放式问题","updates":["以'你最近似乎…'或'一个可能的模式是…'开头的观察"]}
对话：\n`

export const TWEAK_DEFAULTS = {
  accentHue: 30,
  glowOpacity: 0.5,
  useSerif: true,
}
