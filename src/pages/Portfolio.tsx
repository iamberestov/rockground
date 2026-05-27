import { Link, useNavigate } from 'react-router-dom'
import portfolioData from '../data/portfolioData'

function Portfolio() {
  const navigate = useNavigate()

  return (
    <section id="portfolio-page">
      <div className="portfolio-header">
        <h1>Portfolio</h1>
        <p className="portfolio-subtitle">A curated selection of design and development projects.</p>
      </div>

      <div className="portfolio-grid">
        {portfolioData.map((item) => (
          <article
            key={item.id}
            className="portfolio-tile"
            onClick={() => navigate(`/portfolio/${item.id}`)}
          >
            <div className="tile-image">
              <img src={item.images[0]} alt={item.title} loading="lazy" />
            </div>
            <div className="tile-info">
              <h2 className="tile-title">{item.title}</h2>
              <p className="tile-desc">{item.shortDesc}</p>
            </div>
          </article>
        ))}
      </div>

      <Link to="/" className="back-link">← Back to home</Link>
    </section>
  )
}

export default Portfolio