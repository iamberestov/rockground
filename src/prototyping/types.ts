export type ItemType = 'block' | 'text' | 'image'

export interface ShadowState {
  x: number; y: number; blur: number; spread: number; color: string; inset: boolean
}

export interface ProtoItem {
  id: string
  type: ItemType
  x: number
  y: number
  w: number
  h: number
  shadow: ShadowState
  borderRadius: number
  borderW: number
  borderColor: string
  opacity: number
  rotation: number
  scale: number
  anim: string
  bgColor: string
  bgGrad: string
  /* text */
  title?: string
  description?: string
  titleSize?: number
  titleColor?: string
  descSize?: number
  descColor?: string
  /* image */
  imgSrc?: string
}

export type ShadowPreset = { label: string; shadow: ShadowState }
export type AnimPreset = { label: string; css: string }