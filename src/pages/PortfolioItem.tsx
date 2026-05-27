import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import portfolioData from '../data/portfolioData'

function PortfolioItem() {
  const { id } = useParams<{ id: string }>()
  const item = portfolioData.find((p) => p.id === id)

  const [currentIndex, setCurrentIndex] = useState(0)

  if (!item) {
    return (
      <section id="center">
        <div>
          <h1>Project not found</h1>
          <p>The project you're looking for doesn't exist.</p>
          <Link to="/portfolio" className="back-link">← Back to portfolio</Link>
        </div>
      </section>
    )
  }

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? item.images.length - 1 : prev - 1))
  }

  const goNext = () => {
    setCurrentIndex((prev) => (prev === item.images.length - 1 ? 0 : prev + 1))
  }

  const goTo = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <section id="portfolio-item-page">
      <div className="portfolio-item-container">
        <Link to="/portfolio" className="back-link">← Back to portfolio</Link>

        <h1 className="item-title">{item.title}</h1>

        <div className="carousel">
          <div className="carousel-viewport">
            <img
              src={item.images[currentIndex]}
              alt={`${item.title} — image ${currentIndex + 1}`}
              className="carousel-image"
            />
          </div>

          {item.images.length > 1 && (
            <>
              <button className="carousel-btn carousel-btn--prev" onClick={goPrev} aria-label="Previous image">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button className="carousel-btn carousel-btn--next" onClick={goNext} aria-label="Next image">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

              <div className="carousel-dots">
                {item.images.map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-dot${index === currentIndex ? ' carousel-dot--active' : ''}`}
                    onClick={() => goTo(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="item-description">
          <p>{item.description}</p>
        </div>
      </div>
    </section>
  )
}

export default PortfolioItem