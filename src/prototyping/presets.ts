import type { ShadowPreset, AnimPreset, ShadowState } from './types'

export const SHADOW_PRESETS: ShadowPreset[] = [
  { label: 'None',       shadow: { x:0, y:0, blur:0, spread:0, color:'rgba(0,0,0,0.15)', inset: false } },
  { label: 'Soft',       shadow: { x:0, y:4, blur:12, spread:0, color:'rgba(0,0,0,0.1)', inset: false } },
  { label: 'Medium',     shadow: { x:0, y:8, blur:24, spread:0, color:'rgba(0,0,0,0.15)', inset: false } },
  { label: 'Heavy',      shadow: { x:0, y:16, blur:48, spread:0, color:'rgba(0,0,0,0.25)', inset: false } },
  { label: 'Spread glow', shadow: { x:0, y:0, blur:20, spread:0, color:'rgba(170,59,255,0.4)', inset: false } },
  { label: 'Neon pink',  shadow: { x:0, y:0, blur:30, spread:0, color:'rgba(255,20,147,0.6)', inset: false } },
  { label: 'Inner soft', shadow: { x:0, y:2, blur:8, spread:0, color:'rgba(0,0,0,0.08)', inset: true } },
  { label: 'Double',     shadow: { x:0, y:4, blur:12, spread:0, color:'rgba(0,0,0,0.1)', inset: false } },
]

export const ANIM_PRESETS: AnimPreset[] = [
  { label: 'None', css: '' },
  { label: 'Float', css: 'float-anim 3s ease-in-out infinite' },
  { label: 'Pulse', css: 'pulse-anim 2s ease-in-out infinite' },
  { label: 'Bounce', css: 'bounce-anim 1.5s ease infinite' },
  { label: 'Shake', css: 'shake-anim 0.5s ease infinite' },
  { label: 'Glow', css: 'glow-anim 2s ease-in-out infinite' },
  { label: 'Spin slow', css: 'spin-anim 8s linear infinite' },
  { label: 'Wobble', css: 'wobble-anim 1.2s ease infinite' },
]

export const KEYFRAME_CSS = `
@keyframes float-anim { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-16px) } }
@keyframes pulse-anim { 0%,100%{ transform: scale(1); opacity:1 } 50%{ transform: scale(1.06); opacity:0.8 } }
@keyframes bounce-anim { 0%,100%{ transform: translateY(0) } 40%{ transform: translateY(-20px) } 60%{ transform: translateY(-8px) } }
@keyframes shake-anim { 0%,100%{ transform: translateX(0) } 25%{ transform: translateX(-8px) } 75%{ transform: translateX(8px) } }
@keyframes glow-anim { 0%,100%{ box-shadow:0 0 8px rgba(170,59,255,0.3) } 50%{ box-shadow:0 0 30px rgba(170,59,255,0.7) } }
@keyframes spin-anim { to{ transform: rotate(360deg) } }
@keyframes wobble-anim { 0%,100%{ transform: rotate(0) } 25%{ transform: rotate(-6deg) } 75%{ transform: rotate(6deg) } }
`

export function findShadowLabel(shadow: ShadowState): string {
  for (const p of SHADOW_PRESETS) {
    if (
      p.shadow.x === shadow.x &&
      p.shadow.y === shadow.y &&
      p.shadow.blur === shadow.blur &&
      p.shadow.spread === shadow.spread &&
      p.shadow.color === shadow.color &&
      p.shadow.inset === shadow.inset
    ) return p.label
  }
  return 'Custom'
}

export function findAnimLabel(css: string): string {
  for (const p of ANIM_PRESETS) {
    if (p.css === css) return p.label
  }
  return 'Custom'
}