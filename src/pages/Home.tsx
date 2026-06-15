import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import workSections, { type WorkSection } from '../data/workSections'
import { smoothScrollElementsToTop } from '../lib/gsapScroll'
import EmailCopyLink from '../components/EmailCopyLink'
import HomeFooter from '../components/HomeFooter'
import WorkMedia from '../components/WorkMedia'

const HERO_ID = 'hero-intro'
const STAGGER_HIDE_MS = 200

const tags = [
  'B2B SAAS',
  'AI DESIGN',
  'AI AGENTS',
  '0→1',
  'CRAFT',
  'USER FIRST',
  'END→END',
  'PRODUCT STRATEGY',
]

function Home() {
  const mainScrollRef = useRef<HTMLDivElement>(null)
  const sidebarScrollRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const sidebarStaggerRef = useRef<HTMLDivElement>(null)
  const workActiveStaggerRef = useRef<HTMLDivElement>(null)
  const displayedSectionIdRef = useRef<string | null>(null)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [displayedSection, setDisplayedSection] = useState<WorkSection | undefined>(undefined)
  const [mainScrollRoot, setMainScrollRoot] = useState<HTMLDivElement | null>(null)

  const setMainScrollElement = (node: HTMLDivElement | null) => {
    mainScrollRef.current = node
    setMainScrollRoot(node)
  }

  const scrollToIntro = () => {
    setActiveSectionId(null)
    smoothScrollElementsToTop([mainScrollRef.current])
  }

  useEffect(() => {
    const root = mainScrollRef.current
    if (!root) return

    const resolveActiveSectionId = (): string | null => {
      const hero = heroRef.current
      const rootRect = root.getBoundingClientRect()
      const triggerY = rootRect.top + rootRect.height * 0.25

      if (hero) {
        const heroRect = hero.getBoundingClientRect()
        if (heroRect.bottom > triggerY) return null
      }

      const nearBottom = root.scrollHeight - root.scrollTop - root.clientHeight < 32
      if (nearBottom) {
        return workSections[workSections.length - 1]?.id ?? null
      }

      let activeId: string | null = null
      let activeTop = -Infinity

      for (const { id } of workSections) {
        const node = sectionRefs.current[id]
        if (!node) continue

        const top = node.getBoundingClientRect().top
        if (top <= triggerY && top > activeTop) {
          activeTop = top
          activeId = id
        }
      }

      return activeId
    }

    const updateActiveSection = () => {
      setActiveSectionId(resolveActiveSectionId())
    }

    const observer = new IntersectionObserver(updateActiveSection, {
      root,
      threshold: [0, 0.2, 0.45, 0.7],
      rootMargin: '-15% 0px -35% 0px',
    })

    const hero = heroRef.current
    if (hero) observer.observe(hero)

    workSections.forEach(({ id }) => {
      const node = sectionRefs.current[id]
      if (node) observer.observe(node)
    })

    root.addEventListener('scroll', updateActiveSection, { passive: true })
    updateActiveSection()

    return () => {
      observer.disconnect()
      root.removeEventListener('scroll', updateActiveSection)
    }
  }, [])

  useEffect(() => {
    const main = mainScrollRef.current
    const sidebar = sidebarScrollRef.current
    if (!main || !sidebar) return

    const linkedScrollQuery = window.matchMedia('(max-width: 900px)')

    const onWheel = (event: WheelEvent) => {
      if (linkedScrollQuery.matches) return

      const sidebarMax = sidebar.scrollHeight - sidebar.clientHeight
      const scrollingUp = event.deltaY < 0
      const scrollingDown = event.deltaY > 0
      const atTop = sidebar.scrollTop <= 0
      const atBottom = sidebar.scrollTop >= sidebarMax - 1

      if (sidebarMax <= 0 || (scrollingUp && atTop) || (scrollingDown && atBottom)) {
        main.scrollTop += event.deltaY
        event.preventDefault()
      }
    }

    sidebar.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      sidebar.removeEventListener('wheel', onWheel)
    }
  }, [])

  const activeSection = activeSectionId
    ? workSections.find((section) => section.id === activeSectionId)
    : undefined

  useLayoutEffect(() => {
    if (!activeSection || !activeSectionId) {
      displayedSectionIdRef.current = null
      setDisplayedSection(undefined)
      return
    }

    const workActiveBlock = workActiveStaggerRef.current
    const sidebarBlock = sidebarStaggerRef.current
    const previousId = displayedSectionIdRef.current
    const isContentSwitch = previousId !== null && previousId !== activeSectionId
    const previousSection = previousId
      ? workSections.find((section) => section.id === previousId)
      : undefined
    const isProjectSwitch =
      !previousSection ||
      previousSection.projectTitle !== activeSection.projectTitle ||
      previousSection.projectMeta !== activeSection.projectMeta

    const revealBlock = (block: HTMLDivElement) => {
      block.classList.remove('is-hiding', 'is-shown')
      void block.offsetHeight
      block.classList.add('is-shown')
    }

    const hideBlock = (block: HTMLDivElement) => {
      block.classList.add('is-hiding')
      block.classList.remove('is-shown')
    }

    if (!workActiveBlock && !sidebarBlock) {
      setDisplayedSection(activeSection)
      displayedSectionIdRef.current = activeSectionId
      return
    }

    if (!isContentSwitch) {
      setDisplayedSection(activeSection)
      displayedSectionIdRef.current = activeSectionId
      if (workActiveBlock) revealBlock(workActiveBlock)
      if (sidebarBlock) revealBlock(sidebarBlock)
      return
    }

    const blocksToAnimate = [
      ...(sidebarBlock ? [sidebarBlock] : []),
      ...(workActiveBlock && isProjectSwitch ? [workActiveBlock] : []),
    ]

    if (workActiveBlock && !isProjectSwitch) {
      workActiveBlock.classList.remove('is-hiding')
      workActiveBlock.classList.add('is-shown')
    }

    if (!blocksToAnimate.length) {
      setDisplayedSection(activeSection)
      displayedSectionIdRef.current = activeSectionId
      return
    }

    blocksToAnimate.forEach(hideBlock)

    const timeout = window.setTimeout(() => {
      blocksToAnimate.forEach((block) => block.classList.remove('is-hiding'))
      setDisplayedSection(activeSection)
      displayedSectionIdRef.current = activeSectionId
      blocksToAnimate.forEach(revealBlock)
    }, STAGGER_HIDE_MS)

    return () => window.clearTimeout(timeout)
  }, [activeSection, activeSectionId])

  const visibleSidebarSection = displayedSection ?? activeSection

  return (
    <main className="home-page">
      <header className="home-header home-grid">
        <button
          type="button"
          className="home-avatar home-grid-avatar"
          onClick={scrollToIntro}
          aria-label="Back to intro"
        >
          <img src="/avatar.png" alt="" width={72} height={72} />
        </button>

        <nav className="home-nav home-grid-nav" aria-label="Primary">
          <EmailCopyLink />
          <a
            href="https://www.linkedin.com/in/igor-berestov/"
            className="home-nav-link"
            target="_blank"
            rel="noreferrer"
          >
            <span className="home-nav-icon home-nav-icon--arrow" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.5851 4.41394L19.6661 15.6678L17.6661 15.6825L17.6085 7.80457L5.39172 20.0223L3.97766 18.6083L16.1954 6.38953L8.31848 6.33484L8.33215 4.33484L19.5851 4.41394Z" fill="currentColor" />
              </svg>
            </span>
            LinkedIn
          </a>
          <Link to="/about" className="home-nav-link">
            <span className="home-nav-icon home-nav-icon--about" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.0001 1.99622C17.525 1.9963 22.004 6.47526 22.004 12.0001C22.0039 17.5249 17.5249 22.0039 12.0001 22.004C6.47526 22.004 1.9963 17.525 1.99622 12.0001C1.99622 6.4752 6.4752 1.99622 12.0001 1.99622ZM12.0001 3.99622C7.57977 3.99622 3.99622 7.57977 3.99622 12.0001C3.9963 16.4204 7.57982 20.004 12.0001 20.004C16.4203 20.0039 20.0039 16.4203 20.004 12.0001C20.004 7.57982 16.4204 3.9963 12.0001 3.99622ZM14.1075 14.049C14.3557 13.5578 14.9547 13.3593 15.4474 13.6056C15.9413 13.8526 16.1416 14.4535 15.8947 14.9474L15.0001 14.5001C15.8944 14.9473 15.8948 14.948 15.8947 14.9484H15.8937L15.8907 14.9542C15.8893 14.9571 15.8878 14.9612 15.8859 14.965C15.882 14.9725 15.8771 14.9822 15.8712 14.9933C15.8591 15.016 15.8421 15.046 15.8214 15.0822C15.7801 15.1545 15.7212 15.2524 15.6447 15.3673C15.4926 15.5955 15.2643 15.9 14.9572 16.2072C14.3482 16.8161 13.3588 17.5001 12.0001 17.5001C10.6415 17.5001 9.6521 16.8161 9.04309 16.2072C8.73595 15.9 8.50769 15.5954 8.35559 15.3673C8.27903 15.2525 8.22016 15.1545 8.17883 15.0822C8.15818 15.046 8.14117 15.016 8.12903 14.9933C8.12311 14.9822 8.11829 14.9725 8.11438 14.965C8.11244 14.9612 8.11092 14.9571 8.1095 14.9542L8.10657 14.9484H8.10559C8.10541 14.948 8.10571 14.9473 9.00012 14.5001L8.10559 14.9474C7.8586 14.4534 8.05889 13.8526 8.55286 13.6056C9.04618 13.3589 9.64608 13.5583 9.89368 14.0509L9.89465 14.0519C9.89817 14.0585 9.90476 14.0718 9.91516 14.09C9.93634 14.127 9.97134 14.1855 10.0197 14.2579C10.1176 14.4048 10.2644 14.6004 10.4572 14.7931C10.8481 15.184 11.3589 15.5001 12.0001 15.5001C12.6413 15.5001 13.1521 15.1841 13.5431 14.7931C13.7358 14.6003 13.8827 14.4048 13.9806 14.2579C14.0289 14.1854 14.0639 14.127 14.0851 14.09C14.0955 14.0717 14.1021 14.0585 14.1056 14.0519L14.1075 14.049ZM8.53625 8.22961C9.08846 8.22961 9.53612 8.67744 9.53625 9.22961V11.3077C9.53611 11.8599 9.08845 12.3077 8.53625 12.3077C7.98415 12.3076 7.5364 11.8598 7.53625 11.3077V9.22961C7.53639 8.67751 7.98415 8.22973 8.53625 8.22961ZM15.463 8.22961C16.0152 8.22961 16.4629 8.67744 16.463 9.22961V11.3077C16.4629 11.8599 16.0152 12.3077 15.463 12.3077C14.911 12.3075 14.4632 11.8598 14.463 11.3077V9.22961C14.4631 8.67759 14.911 8.22986 15.463 8.22961Z" fill="currentColor" />
              </svg>
            </span>
            About me
          </Link>
        </nav>
      </header>

      <div className="home-scroll" ref={setMainScrollElement}>
        <div className="home-columns home-grid">
        <aside className="home-sidebar home-grid-sidebar" aria-label="Profile">
          <div className="home-sidebar-scroll" ref={sidebarScrollRef}>
            {activeSection ? (
              <>
                <div
                  ref={workActiveStaggerRef}
                  className="home-work-active t-stagger"
                  aria-live="polite"
                >
                  {visibleSidebarSection ? (
                    <>
                      <p className="home-work-active-title t-stagger-line t-stagger-line--1">
                        {visibleSidebarSection.projectTitle}
                      </p>
                      <p className="home-work-active-meta t-stagger-line t-stagger-line--2">
                        {visibleSidebarSection.projectMeta}
                      </p>
                    </>
                  ) : null}
                </div>

                <div className="home-sidebar-center">
                  <div
                    ref={sidebarStaggerRef}
                    className="home-sidebar-content t-stagger"
                    aria-live="polite"
                  >
                    {visibleSidebarSection ? (
                      <p className="home-sidebar-body t-stagger-line t-stagger-line--1">
                        {visibleSidebarSection.sidebarBody}
                      </p>
                    ) : null}
                  </div>
                </div>
              </>
            ) : (
              <div className="home-sidebar-center">
                <div className="home-sidebar-intro" aria-live="polite">
                  <h1>Hey, I&apos;m Igor B.</h1>
                  <p className="home-role">Staff Product Designer</p>
                </div>
              </div>
            )}

            <div className="home-tags" aria-label="Focus areas">
              {tags.map((tag) => (
                <span key={tag} className="home-tag">{tag}</span>
              ))}
            </div>
          </div>
        </aside>

        <div className="home-main home-grid-main">
          <div className="home-main-body">
            <div className="home-hero-copy" id={HERO_ID} ref={heroRef}>
              <p className="home-bio">
                I bridge AI-native product thinking, product strategy, and design execution to turn
                complex technology into intuitive user experiences.
              </p>
              <p className="home-bio-secondary">
                Currently shaping AI experiences at{' '}
                <a href="https://clickup.com" target="_blank" rel="noreferrer">ClickUp</a>. Also worked with{' '}
                <a href="https://www.wrike.com" target="_blank" rel="noreferrer">Wrike</a> and{' '}
                <a href="https://www.sberbank.com" target="_blank" rel="noreferrer">Sberbank</a>.
              </p>
            </div>

            <div className="home-work-feed" aria-label="Selected work">
              {workSections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  ref={(node) => {
                    sectionRefs.current[section.id] = node
                  }}
                  className={`home-work-section${section.media ? ' home-work-section--media' : ''}`}
                  style={section.media ? undefined : { minHeight: `${section.height}px` }}
                >
                  {section.media ? (
                    <WorkMedia media={section.media} scrollRoot={mainScrollRoot} />
                  ) : (
                    <div className="home-work-placeholder">
                      <span className="home-work-placeholder-label">Content placeholder</span>
                      <span className="home-work-placeholder-title">{section.title}</span>
                      <span className="home-work-placeholder-meta">{section.meta}</span>
                    </div>
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
        </div>

        <HomeFooter />
      </div>
    </main>
  )
}

export default Home
