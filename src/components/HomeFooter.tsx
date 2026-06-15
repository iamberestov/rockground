import EmailCopyText from './EmailCopyText'

function FooterArrow() {
  return (
    <svg
      className="home-footer-arrow-svg"
      width="280"
      height="280"
      viewBox="0 0 280 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M216.587 200.106V84.51H239.895V223.414L240 223.519L239.895 223.624V239.895H223.624L223.519 240L223.414 239.895H84.51V216.587H200.106L40 56.4812L56.4812 40L216.587 200.106Z"
        fill="currentColor"
      />
    </svg>
  )
}

function HomeFooter() {
  return (
    <footer className="home-footer" aria-label="Contact">
      <div className="home-footer-glow" aria-hidden="true" />
      <div className="home-footer-stage home-grid">
        <h2 className="home-footer-title">Let&apos;s do great things together</h2>
        <div className="home-footer-arrow">
          <FooterArrow />
        </div>
        <div className="home-footer-cta">
          <EmailCopyText />
        </div>
      </div>
    </footer>
  )
}

export default HomeFooter
