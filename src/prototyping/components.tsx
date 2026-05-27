import type { ItemType } from './types'

export function ItemTypeIcon({ type }: { type: ItemType }) {
  switch (type) {
    case 'block':
      return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
    case 'text':
      return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>
    case 'image':
      return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
  }
}

export function SliderRow({ label, min, max, step = 1, value, set }: {
  label: string; min: number; max: number; step?: number; value: number; set: (v: number) => void
}) {
  return (
    <div className="proto-slider-row">
      <label>{label}</label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(Number(e.target.value))} />
      <span className="proto-val">{typeof step === 'number' && step < 1 ? Number(value).toFixed(2) : value}</span>
    </div>
  )
}

export function SmallNote({ children }: { children: React.ReactNode }) {
  return <p className="proto-note">{children}</p>
}