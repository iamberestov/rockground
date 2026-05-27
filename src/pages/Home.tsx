import { Link } from 'react-router-dom'

function Home() {
  return (
    <section id="center">
      <div className="hero-personal">
        <div className="avatar">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="58" stroke="var(--accent)" strokeWidth="2" fill="var(--accent-bg)" />
            <circle cx="60" cy="45" r="18" fill="var(--accent)" opacity="0.4" />
            <ellipse cx="60" cy="82" rx="30" ry="20" fill="var(--accent)" opacity="0.2" />
          </svg>
        </div>
      </div>
      <div>
        <h1>Hi, I'm a Designer</h1>
        <p className="tagline">
          Crafting thoughtful digital experiences — from concept to pixel.
        </p>
      </div>

      <div className="action-cards">
        <Link to="/portfolio" className="action-card">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <span className="card-title">Portfolio</span>
          <span className="card-desc">View my recent work</span>
        </Link>
        <Link to="/prototyping" className="action-card">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          <span className="card-title">Prototyping</span>
          <span className="card-desc">Explore interactive prototypes</span>
        </Link>
      </div>
    </section>
  )
}

export default Home