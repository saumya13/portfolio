import { ScriptText } from './ScriptText'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { footer, site, socials } from '../content/site'
import { Garden } from './Garden'
import { useLenis } from './SmoothScroll'

// The footer's soft pink, lighter than the site's pink accent.
const LIGHT_PINK = '#fbdcec'

// Thin outline icons, drawn on a 24px grid with a 1.5 stroke.
const ICONS: Record<string, ReactNode> = {
  LinkedIn: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8 11v5M8 8h.01M12 16v-5M12 13.2a2.2 2.2 0 0 1 4.4 0V16" />
    </>
  ),
  GitHub: (
    <>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </>
  ),
  Email: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="3.5" />
      <path d="m21 7-8.1 5.2a1.8 1.8 0 0 1-1.8 0L3 7" />
    </>
  ),
}

// The look shared by the round-cornered icon chips: a thin outline, a hard offset shadow, and a press-in on click.
const CHIP =
  'grid size-12 place-items-center rounded-2xl border-[1.5px] border-[#111] bg-white/50 text-[#111] shadow-[3px_3px_0_#111] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#111] hover:text-[#fbdcec] hover:shadow-[5px_5px_0_#111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'

// A sticky reveal footer: it stays fixed underneath the page, and as the last section scrolls away it
// fades and scales into view. The wrapper takes up the footer's space in the page and clips the fixed
// footer, so the footer only shows while the wrapper is on screen.
export function Footer() {
  const lenis = useLenis()
  const wrap = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start end', 'end end'] })
  // The garden's flowers start growing once the footer is mostly uncovered.
  const [bloom, setBloom] = useState(false)
  const [copied, setCopied] = useState(false)
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
    } catch {
      // clipboard blocked: fall back to opening the mail app, so the click still does something
      window.location.href = `mailto:${site.email}`
      return
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }
  useMotionValueEvent(scrollYProgress, 'change', (v) => v > 0.55 && setBloom(true))
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.2, 1])
  const y = useTransform(scrollYProgress, [0, 1], [60, 0])
  const blur = useTransform(scrollYProgress, [0, 0.85], [12, 0], { clamp: true })
  const filter = useTransform(blur, (b) => `blur(${b}px)`)

  const toTop = () => (lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: 'smooth' }))

  return (
    <footer ref={wrap} id="contact" className="relative z-30 h-[max(46svh,21rem)] max-[370px]:h-[max(46svh,24rem)]" style={{ clipPath: 'inset(-80px 0 0 0)' }}>
      <motion.div
        style={{ opacity, y, backgroundColor: LIGHT_PINK }}
        className="fixed bottom-0 left-0 h-[max(46svh,21rem)] max-[370px]:h-[max(46svh,24rem)] w-full text-[#111]"
      >
        {/* A soft wave along the top edge, so the footer rises out of the page with a curvy boundary. */}
        <svg aria-hidden viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-x-0 bottom-[calc(100%-1px)] block h-12 w-full md:h-20" style={{ fill: LIGHT_PINK }}>
          <path d="M0 80V34C180 6 360 2 560 24S980 70 1200 44C1320 30 1390 18 1440 26V80Z" />
        </svg>
        <motion.div
          style={{ filter }}
          className="flex h-full flex-col justify-between gap-6 px-6 pb-5 pt-8 md:px-[calc(var(--gutter)+2.5rem)]"
        >
        <div>
          <div>
            <p className="eyebrow mb-2 text-[#111]/70">(Contact)</p>
            <h2 className="font-arima text-[clamp(2.25rem,5.5vw,4.75rem)] font-medium leading-[0.9] tracking-[-0.02em]">
              <ScriptText text={footer.heading.replace('.', '')} swap={{ Talk: 'T' }} />
              <span className="italic">.</span>
            </h2>
            <p className="mt-3 max-w-[52ch] text-sm leading-snug text-[#111]/75">{footer.blurb}</p>
            {/* One row: the profiles and the email as icon chips, then About. The email chip copies the address. */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} title={s.label} target="_blank" rel="noreferrer" className={CHIP}>
                  <svg viewBox="0 0 24 24" aria-hidden className="size-6 fill-none stroke-current" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    {ICONS[s.label]}
                  </svg>
                </a>
              ))}
              <div className="relative">
                <button type="button" onClick={copyEmail} aria-label="Copy my email" title="Copy my email" className={CHIP}>
                  <svg viewBox="0 0 24 24" aria-hidden className="size-6 fill-none stroke-current" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    {copied ? <path d="m5 12.5 4.5 4.5L19 7.5" /> : ICONS.Email}
                  </svg>
                </button>
                {/* a small bubble confirms the copy (also announced to screen readers) */}
                <span
                  role="status"
                  className={`pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111] px-3 py-1 text-xs font-medium text-[#fbdcec] transition-all duration-200 ${copied ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'}`}
                >
                  {copied ? 'Email copied' : ''}
                </span>
              </div>
              <Link
                to="/about"
                className="group flex h-12 items-center gap-2 rounded-2xl border-[1.5px] border-[#111] bg-[#111] px-5 text-sm font-medium text-[#fbdcec] shadow-[3px_3px_0_#111] sm:ml-2 transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-white/50 hover:text-[#111] hover:shadow-[5px_5px_0_#111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                About me <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-between border-t border-[#111]/25 pt-3">
          {/* The garden stands on this line: its soil sits right on top of it. */}
          <div className="pointer-events-none absolute bottom-full left-[48%] right-0 hidden md:block">
            <Garden play={bloom} />
          </div>
          <p className="label text-[#111]/70">© {new Date().getFullYear()} {site.name}</p>
          <button onClick={toTop} className="label rounded-lg border border-[#111]/40 px-3 py-2 transition-colors hover:bg-[#111] hover:text-pink">
            Back to top ↑
          </button>
        </div>
        </motion.div>
      </motion.div>
    </footer>
  )
}
