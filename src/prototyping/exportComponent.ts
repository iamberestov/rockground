import type { ProtoItem } from './types'
import { cssShadow } from './utils'
import { KEYFRAME_CSS } from './presets'

function sanitizeName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9_ -]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/^[0-9]/, '_$&') || 'ExportedGrid'
}

function toPascalCase(name: string): string {
  return name
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join('')
}

function renderItem(item: ProtoItem): string {
  const style: Record<string, string | number | undefined> = {
    position: 'absolute',
    left: `${item.x}px`,
    top: `${item.y}px`,
    width: item.w,
    height: item.h,
    boxShadow: cssShadow(item.shadow),
    background: item.bgGrad || item.bgColor,
    borderRadius: item.borderRadius,
    border: `${item.borderW}px solid ${item.borderColor}`,
    opacity: item.opacity,
    transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
    animation: item.anim || undefined,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  }

  // Render each style property as a React inline-style entry
  // Strings go in quotes, numbers go bare, pixel values use numbers
  const entries = Object.entries(style)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => {
      // camelCase key stays as-is for JSX inline styles
      if (typeof v === 'number') {
        return `    ${k}: ${v},`
      }
      return `    ${k}: '${v}',`
    })

  let children = ''

  if (item.type === 'block') {
    children = `      {/* Block item — add your content here */}`
  } else if (item.type === 'text') {
    const pad = item.borderRadius > 20 ? '16px' : '8px'
    children = `      <div style={{
        width: '100%', height: '100%',
        boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', gap: '4px',
        textAlign: 'left', overflow: 'hidden',
        padding: '${pad}',
      }}>
        <div style={{
          fontWeight: 600, lineHeight: '125%', wordBreak: 'break-word',
          fontSize: ${item.titleSize ?? 22},
          color: '${item.titleColor ?? '#08060d'}',
        }}>${item.title ?? ''}</div>
        <div style={{
          lineHeight: '140%', wordBreak: 'break-word',
          fontSize: ${item.descSize ?? 15},
          color: '${item.descColor ?? '#6b6375'}',
        }}>${item.description ?? ''}</div>
      </div>`
  } else if (item.type === 'image') {
    if (item.imgSrc) {
      children = `      <img src="${item.imgSrc}" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />`
    } else {
      children = `      {/* Image placeholder — set imgSrc prop or replace with an <img> */}`
    }
  }

  return `<div
  className="grid-item"
  style={{${entries.length ? '\n' + entries.join('\n') + '\n  ' : ''}}}>
${children}
</div>`
}

export function generateComponentCode(items: ProtoItem[], componentName: string): string {
  const name = toPascalCase(sanitizeName(componentName) || 'ExportedGrid')
  const slug = name
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
  const gridW = Math.max(...items.map(i => i.x + i.w)) + 40
  const gridH = Math.max(...items.map(i => i.y + i.h)) + 40

  const hasAnim = items.some(i => i.anim)

  const itemCodes = items.map(renderItem).join('\n\n')

  return [
    `import React from 'react'`,
    hasAnim ? `\nconst KEYFRAMES = \`${KEYFRAME_CSS}\`` : '',
    `\nexport default function ${name}() {`,
    `  return (`,
    `    <div style={{`,
    `      position: 'relative' as const,`,
    `      width: '${gridW}px',`,
    `      height: '${gridH}px',`,
    `      margin: '0 auto',`,
    `    }}>`,
    hasAnim ? `      <style>{KEYFRAMES}</style>` : '',
    itemCodes,
    `    </div>`,
    `  )`,
    `}`,
    `\n// Paste the line below into src/prototyping/generated/registry.ts:`,
    `// registry.push({ slug: '${slug}', name: '${name}', import: () => import('./${name}') })`,
    '',
  ].filter(Boolean).join('\n')
}

export function generateReusableComponent(items: ProtoItem[], componentName: string): string {
  const name = toPascalCase(sanitizeName(componentName) || 'ExportedGrid')
  const slug = name
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
  const gridW = Math.max(...items.map(i => i.x + i.w)) + 40
  const gridH = Math.max(...items.map(i => i.y + i.h)) + 40

  const hasAnim = items.some(i => i.anim)

  const itemCodes = items.map(renderItem).join('\n\n')

  return [
    `import React from 'react'`,
    hasAnim ? `\nconst KEYFRAMES = \`${KEYFRAME_CSS}\`` : '',
    `\nexport default function ${name}() {`,
    `  return (`,
    `    <div style={{`,
    `      position: 'relative' as const,`,
    `      width: '100%' as const,`,
    `      maxWidth: '${gridW}px',`,
    `      height: '${gridH}px',`,
    `      margin: '0 auto' as const,`,
    `    }}>`,
    hasAnim ? `      <style>{KEYFRAMES}</style>` : '',
    itemCodes,
    `    </div>`,
    `  )`,
    `}`,
    `\n// Paste the line below into src/prototyping/generated/registry.ts:`,
    `// registry.push({ slug: '${slug}', name: '${name}', import: () => import('./${name}') })`,
    '',
  ].filter(Boolean).join('\n')
}
