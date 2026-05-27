import React from 'react'

export default function ExampleComponent() {
  return (
    <div style={{
      position: 'relative' as const,
      width: '715px',
      height: '480px',
      margin: '0 auto',
    }}>
<div
  className="grid-item"
  style={{
    position: 'absolute',
    left: '60px',
    top: '50px',
    width: 180,
    height: 180,
    boxShadow: '0px 8px 24px 0px rgba(0,0,0,0.15)',
    background: '#f4f3ec',
    borderRadius: 16,
    border: '1px solid #e5e4e7',
    opacity: 1,
    transform: 'rotate(0deg) scale(1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  }}>
      {/* Block item — add your content here */}
</div>

<div
  className="grid-item"
  style={{
    position: 'absolute',
    left: '300px',
    top: '60px',
    width: 375,
    height: 185,
    boxShadow: '0px 0px 20px 0px rgba(170,59,255,0.4)',
    background: 'transparent',
    borderRadius: 12,
    border: '1px solid #e5e4e7',
    opacity: 1,
    transform: 'rotate(0deg) scale(1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  }}>
      <div style={{
        width: '100%', height: '100%',
        boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', gap: '4px',
        textAlign: 'left', overflow: 'hidden',
        padding: '8px',
      }}>
        <div style={{
          fontWeight: 600, lineHeight: '125%', wordBreak: 'break-word',
          fontSize: 22,
          color: '#08060d',
        }}>Hello World123</div>
        <div style={{
          lineHeight: '140%', wordBreak: 'break-word',
          fontSize: 15,
          color: '#6b6375',
        }}>This is a text block with editable styling.32131</div>
      </div>
</div>

<div
  className="grid-item"
  style={{
    position: 'absolute',
    left: '80px',
    top: '280px',
    width: 200,
    height: 160,
    boxShadow: '0px 0px 30px 0px rgba(255,20,147,0.6)',
    background: '#1f2028',
    borderRadius: 12,
    border: '1px solid #e5e4e7',
    opacity: 1,
    transform: 'rotate(0deg) scale(1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  }}>
      <img src="https://imgs.search.brave.com/UszzEkcE-A0fs0U5dgAoFXYDCJf-BDGvhSV7cfWLoNs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/ZnJvbnQuZnJlZXBp/ay5jb20vaG9tZS9h/bm9uLXJ2bXAvY3Jl/YXRpdmUtc3VpdGUv/YXVkaW8tY3JlYXRp/b24vdmlzdWFscy1z/b25ncy53ZWJw" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
</div>
    </div>
  )
}