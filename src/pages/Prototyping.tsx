import { useState, useCallback, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { ItemType, ProtoItem, ShadowState, AnimPreset, ShadowPreset } from '../prototyping/types'
import { SHADOW_PRESETS, ANIM_PRESETS, KEYFRAME_CSS, findShadowLabel, findAnimLabel } from '../prototyping/presets'
import { uid, defShadow, cssShadow, defaultItems, hexToRgb, toHex, createDefaultItem } from '../prototyping/utils'
import { ItemTypeIcon, SliderRow, SmallNote } from '../prototyping/components'
import { generateComponentCode } from '../prototyping/exportComponent'
import { getAllEntries } from '../prototyping/generated/registry'

/* ── Component ── */
function Prototyping() {
  const [items, setItems] = useState<ProtoItem[]>(defaultItems)
  const [selectedId, setSelectedId] = useState<string>(items[0].id)
  const [showGrid, setShowGrid] = useState(false)
  const [gridSize, setGridSize] = useState(20)
  const [showCss, setShowCss] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  /* drag state */
  const dragRef = useRef<{ id: string; startX: number; startY: number; itemX: number; itemY: number } | null>(null)
  /* resize state */
  const resizeRef = useRef<{ id: string; startX: number; startY: number; itemW: number; itemH: number } | null>(null)

  /* ── Selection ── */
  const sel = items.find(i => i.id === selectedId) ?? items[0]

  const select = useCallback((id: string) => {
    setSelectedId(id)
    setShowCss(false)
  }, [])

  const updateItem = useCallback((id: string, patch: Partial<ProtoItem>) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } as ProtoItem : i))
  }, [])

  const addItem = useCallback((type: ItemType) => {
    const newItem = createDefaultItem(type, items.length)
    setItems(prev => [...prev, newItem])
    setSelectedId(newItem.id)
    setShowCss(false)
  }, [items.length])

  const deleteSelected = useCallback(() => {
    if (items.length <= 1) return
    setItems(prev => {
      const next = prev.filter(i => i.id !== selectedId)
      if (next.length === 0) return prev
      return next
    })
    setSelectedId(prev => {
      const rest = items.filter(i => i.id !== prev)
      return rest.length > 0 ? rest[0].id : prev
    })
  }, [items, selectedId])

  const duplicateSelected = useCallback(() => {
    const src = items.find(i => i.id === selectedId)
    if (!src) return
    const copy: ProtoItem = { ...src, id: uid(), x: src.x + 30, y: src.y + 30 }
    setItems(prev => [...prev, copy])
    setSelectedId(copy.id)
  }, [items, selectedId])

  /* ── Drag ── */
  const onItemMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    const target = e.target as HTMLElement
    if (target.closest('.proto-resize-handle')) return
    if (target.closest('[contenteditable]')) return
    if (target.closest('input, select, textarea')) return
    e.preventDefault()
    const item = items.find(i => i.id === id)
    if (!item) return
    dragRef.current = { id, startX: e.clientX, startY: e.clientY, itemX: item.x, itemY: item.y }
  }, [items])

  const onResizeMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    const item = items.find(i => i.id === id)
    if (!item) return
    resizeRef.current = { id, startX: e.clientX, startY: e.clientY, itemW: item.w, itemH: item.h }
  }, [items])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (dragRef.current) {
        const dx = e.clientX - dragRef.current.startX
        const dy = e.clientY - dragRef.current.startY
        updateItem(dragRef.current.id, {
          x: dragRef.current.itemX + dx,
          y: dragRef.current.itemY + dy,
        })
      }
      if (resizeRef.current) {
        const dx = e.clientX - resizeRef.current.startX
        const dy = e.clientY - resizeRef.current.startY
        const newW = Math.max(60, resizeRef.current.itemW + dx)
        const newH = Math.max(40, resizeRef.current.itemH + dy)
        updateItem(resizeRef.current.id, { w: newW, h: newH })
      }
    }
    const onMouseUp = () => {
      dragRef.current = null
      resizeRef.current = null
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp) }
  }, [updateItem])

  /* ── Shadow preset for selected ── */
  const applyShadowPreset = useCallback((preset: ShadowPreset) => {
    updateItem(selectedId, { shadow: { ...preset.shadow } })
  }, [selectedId, updateItem])

  const applyAnimPreset = useCallback((preset: AnimPreset) => {
    updateItem(selectedId, { anim: preset.css })
  }, [selectedId, updateItem])

  const resetSelected = useCallback(() => {
    if (sel.type === 'block') {
      updateItem(selectedId, {
        shadow: defShadow(), borderRadius: 16, borderW: 1, borderColor: '#e5e4e7',
        opacity: 1, rotation: 0, scale: 1, anim: '', bgColor: '#f4f3ec', bgGrad: '',
      })
    } else if (sel.type === 'text') {
      updateItem(selectedId, {
        shadow: defShadow(), borderRadius: 12, borderW: 1, borderColor: '#e5e4e7',
        opacity: 1, rotation: 0, scale: 1, anim: '', bgColor: 'transparent', bgGrad: '',
        titleSize: 22, titleColor: '#08060d', descSize: 15, descColor: '#6b6375',
      })
    } else {
      updateItem(selectedId, {
        shadow: defShadow(), borderRadius: 12, borderW: 1, borderColor: '#e5e4e7',
        opacity: 1, rotation: 0, scale: 1, anim: '', bgColor: '#1f2028', bgGrad: '',
      })
    }
  }, [sel, selectedId, updateItem])

  /* ── Export state ── */
  const [exportName, setExportName] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCopyCode = useCallback(() => {
    const code = generateComponentCode(items, exportName || 'ExportedGrid')
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [items, exportName])

  const generatedEntries = getAllEntries()

  /* ── Live CSS for selected ── */
  const s = sel.shadow
  const shadowCss = cssShadow(s)
  const bgCss = sel.bgGrad || sel.bgColor
  const transformCss = `rotate(${sel.rotation}deg) scale(${sel.scale})`
  const liveCss = [
    `box-shadow: ${shadowCss};`,
    `background: ${bgCss};`,
    `border-radius: ${sel.borderRadius}px;`,
    `border: ${sel.borderW}px solid ${sel.borderColor};`,
    `opacity: ${sel.opacity};`,
    `transform: ${transformCss};`,
    sel.anim ? `animation: ${sel.anim};` : '',
  ].filter(Boolean).join('\n  ')

  return (
    <section id="prototyping-page">
      <style>{KEYFRAME_CSS}</style>

      <div className="proto-header">
        <h1>Prototyping</h1>
        <Link to="/" className="back-link">← Back to home</Link>
      </div>

      <div className="proto-layout">
        <div className="proto-preview-wrapper">
          {/* ── Preview ── */}
          <div className="proto-preview-area" ref={previewRef}>
            {showGrid && (
              <div className="proto-grid-overlay" style={{ backgroundSize: `${gridSize}px ${gridSize}px` }} />
            )}

            {/* Item list */}
            {items.map(item => (
              <div
                key={item.id}
                className={`proto-canvas-item ${item.id === selectedId ? 'proto-item-selected' : ''} ${item.type === 'image' && !item.imgSrc ? 'proto-item-placeholder' : ''}`}
                style={{
                  left: item.x, top: item.y, width: item.w, height: item.h,
                  boxShadow: cssShadow(item.shadow),
                  background: item.bgGrad || item.bgColor,
                  borderRadius: item.borderRadius,
                  border: `${item.borderW}px solid ${item.id === selectedId ? 'var(--accent)' : item.borderColor}`,
                  opacity: item.opacity,
                  transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
                  animation: item.anim,
                }}
                onMouseDown={e => { onItemMouseDown(e, item.id); select(item.id) }}
              >
                {/* Selection outline + label */}
                {item.id === selectedId && (
                  <div className="proto-item-label">{item.type}</div>
                )}

                {/* Type content */}
                {item.type === 'block' && (
                  <div className="proto-block-content">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5"/>
                      <path d="M2 12l10 5 10-5"/>
                    </svg>
                    <span>Block</span>
                  </div>
                )}

                {item.type === 'text' && (
                  <div className="proto-text-content" style={{ padding: item.borderRadius > 20 ? '16px' : '8px' }}>
                    <div
                      className="proto-text-title"
                      style={{ fontSize: item.titleSize, color: item.titleColor }}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={e => updateItem(item.id, { title: e.currentTarget.textContent ?? '' })}
                    >
                      {item.title}
                    </div>
                    <div
                      className="proto-text-desc"
                      style={{ fontSize: item.descSize, color: item.descColor }}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={e => updateItem(item.id, { description: e.currentTarget.textContent ?? '' })}
                    >
                      {item.description}
                    </div>
                  </div>
                )}

                {item.type === 'image' && (
                  <div className="proto-image-content">
                    {item.imgSrc ? (
                      <img src={item.imgSrc} alt="" draggable={false} />
                    ) : (
                      <div className="proto-image-placeholder">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <path d="M21 15l-5-5L5 21"/>
                        </svg>
                        <span>Drop image URL below</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Resize handle */}
                <div className="proto-resize-handle" onMouseDown={e => { onResizeMouseDown(e, item.id); select(item.id) }} />
              </div>
            ))}

            {/* Bottom toolbar */}
            <div className="proto-preview-toolbar">
              <label className="proto-toggle">
                <input type="checkbox" checked={showGrid} onChange={() => setShowGrid(g => !g)} />
                Grid
              </label>
              {showGrid && (
                <label className="proto-slider-label-sm">
                  <input type="range" min="8" max="60" value={gridSize} onChange={e => setGridSize(Number(e.target.value))} />
                  {gridSize}px
                </label>
              )}
              {items.map(item => (
                <button
                  key={item.id}
                  className={`proto-item-tab ${item.id === selectedId ? 'proto-item-tab--active' : ''}`}
                  onClick={() => select(item.id)}
                  title={item.type}
                >
                  <ItemTypeIcon type={item.type} />
                </button>
              ))}
              <button className="proto-btn proto-btn-sm" onClick={() => setShowCss(s => !s)}>
                {showCss ? 'Hide' : 'Show'} CSS
              </button>
            </div>
          </div>

          {/* Live CSS output (below preview area) */}
          {showCss && (
            <pre className="proto-css-output">{`/* ${sel.type} — Live CSS */\n.selector {\n  ${liveCss}\n}`}</pre>
          )}
        </div>

        {/* ── Controls ── */}
        <div className="proto-controls">
          {/* Add items */}
          <fieldset className="proto-fieldset">
            <legend>Items</legend>
            <div className="proto-item-actions">
              <button className="proto-btn" onClick={() => addItem('block')}>+ Block</button>
              <button className="proto-btn" onClick={() => addItem('text')}>+ Text</button>
              <button className="proto-btn" onClick={() => addItem('image')}>+ Image</button>
              <button className="proto-btn proto-btn-danger" onClick={deleteSelected} disabled={items.length <= 1}>🗑</button>
              <button className="proto-btn" onClick={duplicateSelected} title="Duplicate">⧉</button>
            </div>
            <p className="proto-note" style={{ marginTop: 6 }}>
              Selected: <strong>{sel.type}</strong> (id: {sel.id}) — drag to move, resize handle bottom-right
            </p>
          </fieldset>

          {/* Quick presets */}
          <fieldset className="proto-fieldset">
            <legend>Quick presets</legend>
            <div className="proto-preset-row">
              <select
                className="proto-select"
                value={findShadowLabel(sel.shadow)}
                onChange={e => {
                  const p = SHADOW_PRESETS.find(x => x.label === e.target.value)
                  if (p) applyShadowPreset(p)
                }}
              >
                {SHADOW_PRESETS.map(p => <option key={p.label}>{p.label}</option>)}
              </select>
              <select
                className="proto-select"
                value={sel.anim ? findAnimLabel(sel.anim) : 'None'}
                onChange={e => {
                  const p = ANIM_PRESETS.find(x => x.label === e.target.value)
                  if (p) applyAnimPreset(p)
                }}
              >
                {ANIM_PRESETS.map(p => <option key={p.label}>{p.label}</option>)}
              </select>
            </div>
            <button className="proto-btn proto-btn-sm proto-btn-danger" onClick={resetSelected} style={{ marginTop: 8 }}>
              Reset selected
            </button>
          </fieldset>

          {/* Box shadow (for all types) */}
          <fieldset className="proto-fieldset">
            <legend>Box shadow</legend>
            <SliderRow label="X" min={-40} max={40} value={sel.shadow.x} set={v => updateItem(selectedId, { shadow: { ...sel.shadow, x: v } })} />
            <SliderRow label="Y" min={-40} max={40} value={sel.shadow.y} set={v => updateItem(selectedId, { shadow: { ...sel.shadow, y: v } })} />
            <SliderRow label="Blur" min={0} max={80} value={sel.shadow.blur} set={v => updateItem(selectedId, { shadow: { ...sel.shadow, blur: v } })} />
            <SliderRow label="Spread" min={-20} max={40} value={sel.shadow.spread} set={v => updateItem(selectedId, { shadow: { ...sel.shadow, spread: v } })} />
            <div className="proto-slider-row">
              <label>Color</label>
              <input type="color" value={toHex(sel.shadow.color)} onChange={e => updateItem(selectedId, { shadow: { ...sel.shadow, color: `rgba(${hexToRgb(e.target.value)},0.15)` } })} className="proto-color" />
              <span className="proto-val">{sel.shadow.color}</span>
            </div>
            <label className="proto-toggle proto-toggle-inline">
              <input type="checkbox" checked={sel.shadow.inset} onChange={() => updateItem(selectedId, { shadow: { ...sel.shadow, inset: !sel.shadow.inset } })} />
              Inset
            </label>
          </fieldset>

          {/* Background (blocks & text) */}
          {(sel.type === 'block' || sel.type === 'text') && (
            <fieldset className="proto-fieldset">
              <legend>Background</legend>
              <div className="proto-slider-row">
                <label>Color</label>
                <input type="color" value={sel.bgColor} onChange={e => updateItem(selectedId, { bgColor: e.target.value })} className="proto-color" />
                <span className="proto-val">{sel.bgColor}</span>
              </div>
              <div className="proto-slider-row">
                <label>Gradient</label>
                <input type="text" className="proto-input" placeholder="linear-gradient(…)" value={sel.bgGrad} onChange={e => updateItem(selectedId, { bgGrad: e.target.value })} />
              </div>
              <SmallNote>CSS gradient overrides solid color.</SmallNote>
            </fieldset>
          )}

          {/* Image URL */}
          {sel.type === 'image' && (
            <fieldset className="proto-fieldset">
              <legend>Image</legend>
              <div className="proto-slider-row">
                <label>URL</label>
                <input type="text" className="proto-input" placeholder="https://…" value={sel.imgSrc} onChange={e => updateItem(selectedId, { imgSrc: e.target.value })} />
              </div>
              <SmallNote>Paste an image URL or leave empty for placeholder.</SmallNote>
            </fieldset>
          )}

          {/* Text content */}
          {sel.type === 'text' && (
            <fieldset className="proto-fieldset">
              <legend>Text content</legend>
              <div className="proto-slider-row">
                <label>Title</label>
                <input type="text" className="proto-input" value={sel.title ?? ''} onChange={e => updateItem(selectedId, { title: e.target.value })} />
              </div>
              <div className="proto-slider-row">
                <label>Desc</label>
                <input type="text" className="proto-input" value={sel.description ?? ''} onChange={e => updateItem(selectedId, { description: e.target.value })} />
              </div>
            </fieldset>
          )}

          {/* Text style */}
          {sel.type === 'text' && (
            <fieldset className="proto-fieldset">
              <legend>Text style</legend>
              <SliderRow label="Title sz" min={10} max={48} value={sel.titleSize ?? 22} set={v => updateItem(selectedId, { titleSize: v })} />
              <div className="proto-slider-row">
                <label>Title clr</label>
                <input type="color" value={sel.titleColor ?? '#08060d'} onChange={e => updateItem(selectedId, { titleColor: e.target.value })} className="proto-color" />
              </div>
              <SliderRow label="Desc sz" min={10} max={36} value={sel.descSize ?? 15} set={v => updateItem(selectedId, { descSize: v })} />
              <div className="proto-slider-row">
                <label>Desc clr</label>
                <input type="color" value={sel.descColor ?? '#6b6375'} onChange={e => updateItem(selectedId, { descColor: e.target.value })} className="proto-color" />
              </div>
            </fieldset>
          )}

          {/* Shape & border (all types) */}
          <fieldset className="proto-fieldset">
            <legend>Shape & border</legend>
            <SliderRow label="Radius" min={0} max={60} value={sel.borderRadius} set={v => updateItem(selectedId, { borderRadius: v })} />
            <SliderRow label="Border" min={0} max={12} value={sel.borderW} set={v => updateItem(selectedId, { borderW: v })} />
            <div className="proto-slider-row">
              <label>Bdr clr</label>
              <input type="color" value={sel.borderColor} onChange={e => updateItem(selectedId, { borderColor: e.target.value })} className="proto-color" />
              <span className="proto-val">{sel.borderColor}</span>
            </div>
          </fieldset>

          {/* Transform */}
          <fieldset className="proto-fieldset">
            <legend>Transform</legend>
            <SliderRow label="Rotation°" min={-180} max={180} value={sel.rotation} set={v => updateItem(selectedId, { rotation: v })} />
            <SliderRow label="Scale" min={0.2} max={2.5} step={0.05} value={sel.scale} set={v => updateItem(selectedId, { scale: v })} />
            <SliderRow label="Opacity" min={0} max={1} step={0.02} value={sel.opacity} set={v => updateItem(selectedId, { opacity: v })} />
          </fieldset>

          {/* Export as component */}
          <fieldset className="proto-fieldset">
            <legend>Export as component</legend>
            <div className="proto-slider-row">
              <label>Name</label>
              <input
                type="text"
                className="proto-input"
                placeholder="MyComponent"
                value={exportName}
                onChange={e => setExportName(e.target.value)}
              />
            </div>
            <SmallNote>This generates a standalone React component you can copypaste into your codebase.</SmallNote>
            <button
              className="proto-btn"
              onClick={handleCopyCode}
              style={{ marginTop: 8, width: '100%' }}
              disabled={!exportName.trim()}
            >
              {copied ? '✓ Copied!' : '📋 Copy component code'}
            </button>
          </fieldset>
        </div>
      </div>

      {/* ── Bottom: Exported components navigation ── */}
      {generatedEntries.length > 0 && (
        <div className="proto-bottom-section">
          <h2>Exported components</h2>
          <p className="proto-note">
            These components were exported from this prototyping tool. Click to view or continue editing.
          </p>
          <div className="proto-gen-nav">
            {generatedEntries.map(entry => (
              <Link
                key={entry.slug}
                to={`/prototyping/generated/${entry.slug}`}
                className="proto-gen-nav-link"
              >
                <span className="proto-gen-nav-name">{entry.name}</span>
                {entry.desc && <span className="proto-gen-nav-desc">{entry.desc}</span>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default Prototyping