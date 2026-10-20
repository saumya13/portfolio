import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useRef, useState, type MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { site } from '../content/site'
import { NavGlass } from './NavGlass'
import { useLenis } from './SmoothScroll'
import { useTheme } from './theme'

export function Nav() {
  const lenis = useLenis()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { theme, toggle } = useTheme()
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  // Hovering the name opens the glass panel under it; it closes shortly after the pointer leaves.
  const [glass, setGlass] = useState(false)
  const nameRef = useRef<HTMLAnchorElement>(null)
  const closeTimer = useRef<number>(0)
  const openGlass = () => {
    clearTimeout(closeTimer.current)
    setGlass(true)
  }
  const closeGlass = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setGlass(false), 150)
  }

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 120)
  })

  const toTop = (e?: MouseEvent) => {
    e?.preventDefault()
    if (pathname !== '/') navigate('/')
    else if (lenis) lenis.scrollTo(0, { duration: 1.4 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Links are either a page ('/about'), a section on the home page ('/#work') or a section on this page ('#contact').
  const go = (e: MouseEvent, href: string) => {
    e.preventDefault()
    if (href.startsWith('/') && !href.startsWith('/#')) return navigate(href)
    if (href.startsWith('/#') && pathname !== '/') return navigate(href)
    const el = document.querySelector(href.replace(/^\//, ''))
    if (!el) return
    if (lenis) lenis.scrollTo(el as HTMLElement, { duration: 1.4 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.header
      animate={{ y: hidden ? '-100%' : 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 font-bonny font-medium [font-synthesis:none] flex items-center justify-between border-b border-line bg-paper/80 py-4 backdrop-blur-md px-[calc(var(--gutter)+1.25rem)]"
    >
      <div className="relative" onPointerEnter={openGlass} onPointerLeave={closeGlass}>
        <a
          ref={nameRef}
          href="#top"
          onClick={toTop}
          className="block font-bonny text-lg leading-none md:text-xl"
        >
          {site.name}
        </a>
        <NavGlass open={glass} name={site.name} target={nameRef} onClick={toTop} />
      </div>
      <nav className="flex items-center gap-5 md:gap-8">
        {site.nav.map((item) =>
          item.cta ? (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => go(e, item.href)}
              className="label !text-[1rem] leading-none rounded-lg bg-pink px-4 py-2 text-[#111] transition-transform duration-200 hover:-translate-y-0.5"
            >
              {item.label}
            </a>
          ) : (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => go(e, item.href)}
              className="label hidden !text-[1rem] leading-none text-ink transition-opacity hover:opacity-50 sm:inline"
            >
              ({item.label})
            </a>
          ),
        )}
        <button
          onClick={toggle}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="relative grid size-8 place-items-center rounded-full border border-ink/25 transition-colors hover:bg-ink hover:text-paper"
        >
          <motion.svg
            viewBox="0 0 24 24"
            aria-hidden
            className="absolute size-[18px] fill-none stroke-current"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ opacity: theme === 'light' ? 1 : 0, rotate: theme === 'light' ? 0 : 90, scale: theme === 'light' ? 1 : 0.4 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </motion.svg>
          <motion.svg
            viewBox="0 0 24 24"
            aria-hidden
            className="absolute size-[18px] fill-none stroke-current"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ opacity: theme === 'dark' ? 1 : 0, rotate: theme === 'dark' ? 0 : -90, scale: theme === 'dark' ? 1 : 0.4 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
          </motion.svg>
        </button>
      </nav>
    </motion.header>
  )
}
