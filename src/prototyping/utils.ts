import type { ShadowState, ProtoItem, ItemType } from './types'

let _nextId = 1
export function uid() { return `item-${_nextId++}` }

export function defShadow(): ShadowState {
  return { x: 0, y: 8, blur: 24, spread: 0, color: 'rgba(0,0,0,0.15)', inset: false }
}

export function cssShadow(s: ShadowState): string {
  if (!s.x && !s.y && !s.blur && !s.spread) return 'none'
  return `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color || 'rgba(0,0,0,0.15)'}`
}

export function defaultItems(): ProtoItem[] {
  return [
    {
      id: uid(), type: 'block', x: 60, y: 50, w: 180, h: 180,
      shadow: defShadow(), borderRadius: 16, borderW: 1, borderColor: '#e5e4e7',
      opacity: 1, rotation: 0, scale: 1, anim: '', bgColor: '#f4f3ec', bgGrad: '',
    },
    {
      id: uid(), type: 'text', x: 300, y: 60, w: 240, h: 140,
      shadow: defShadow(), borderRadius: 12, borderW: 1, borderColor: '#e5e4e7',
      opacity: 1, rotation: 0, scale: 1, anim: '', bgColor: 'transparent', bgGrad: '',
      title: 'Hello World', description: 'This is a text block with editable styling.',
      titleSize: 22, titleColor: '#08060d', descSize: 15, descColor: '#6b6375',
    },
    {
      id: uid(), type: 'image', x: 80, y: 280, w: 200, h: 160,
      shadow: defShadow(), borderRadius: 12, borderW: 1, borderColor: '#e5e4e7',
      opacity: 1, rotation: 0, scale: 1, anim: '', bgColor: '#1f2028', bgGrad: '',
      imgSrc: '',
    },
  ]
}

export function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

export function toHex(rgba: string): string {
  const m = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!m) return '#aa3bff'
  const r = Number(m[1]).toString(16).padStart(2, '0')
  const g = Number(m[2]).toString(16).padStart(2, '0')
  const b = Number(m[3]).toString(16).padStart(2, '0')
  return `#${r}${g}${b}`
}

export function createDefaultItem(type: ItemType, itemsCount: number): ProtoItem {
  const baseX = 40 + (itemsCount % 3) * 30
  const baseY = 40 + Math.floor(itemsCount / 3) * 40
  switch (type) {
    case 'block':
      return {
        id: uid(), type: 'block', x: baseX, y: baseY, w: 180, h: 180,
        shadow: defShadow(), borderRadius: 16, borderW: 1, borderColor: '#e5e4e7',
        opacity: 1, rotation: 0, scale: 1, anim: '', bgColor: '#f4f3ec', bgGrad: '',
      }
    case 'text':
      return {
        id: uid(), type: 'text', x: baseX, y: baseY, w: 240, h: 130,
        shadow: defShadow(), borderRadius: 12, borderW: 1, borderColor: '#e5e4e7',
        opacity: 1, rotation: 0, scale: 1, anim: '', bgColor: 'transparent', bgGrad: '',
        title: 'New Title', description: 'Description goes here.',
        titleSize: 22, titleColor: '#08060d', descSize: 15, descColor: '#6b6375',
      }
    case 'image':
      return {
        id: uid(), type: 'image', x: baseX, y: baseY, w: 200, h: 160,
        shadow: defShadow(), borderRadius: 12, borderW: 1, borderColor: '#e5e4e7',
        opacity: 1, rotation: 0, scale: 1, anim: '', bgColor: '#1f2028', bgGrad: '',
        imgSrc: '',
      }
  }
}