import { useParams, Link } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { getEntry } from '../prototyping/generated/registry'

export default function GeneratedViewer() {
  const { slug } = useParams<{ slug: string }>()
  const entry = slug ? getEntry(slug) : undefined

  if (!entry) {
    return (
      <section id="prototyping-page">
        <div className="proto-header">
          <h1>Component not found</h1>
          <Link to="/prototyping" className="back-link">← Back to prototyping</Link>
        </div>
      </section>
    )
  }

  const Component = lazy(entry.import)

  return (
    <section id="prototyping-page">
      <div className="proto-header">
        <h1>{entry.name}</h1>
        {entry.desc && <p className="proto-subtitle">{entry.desc}</p>}
        <Link to="/prototyping" className="back-link">← Back to prototyping</Link>
      </div>

      <div className="proto-gen-preview">
        <Suspense fallback={<div className="proto-gen-loading">Loading component…</div>}>
          <Component />
        </Suspense>
      </div>
    </section>
  )
}