import { motion, useScroll, useTransform } from 'motion/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { ComplexSimple } from '../components/ComplexSimple'
import { IconRow } from '../components/IconRow'
import { intro } from '../content/site'

// How much extra scrolling (in screen heights) the intro text stays put for. The first part of it (DWELL in
// ComplexSimple) is just the page resting in the middle of the screen; the tangle only starts to turn into a line after
// that. On phones, and for people who ask for reduced motion, there is no pin
// at all and the line is simply shown finished.
const PIN_EXTRA = 80
const ease = [0.22, 1, 0.36, 1] as const
// Background colours for the highlighted words (chips), matching the hero.
const chipClass = { lime: 'bg-lime', sky: 'bg-sky', pink: 'bg-pink', yellow: 'bg-yellow' } as const

function usePinned() {
  const q = '(min-width: 768px) and (prefers-reduced-motion: no-preference)'
  const [pinned, setPinned] = useState(() => typeof window !== 'undefined' && matchMedia(q).matches)
  useEffect(() => {
    const m = matchMedia(q)
    const on = () => setPinned(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return pinned
}

type Seg = (typeof intro.segments)[number]

// In the supporting sentence the key words are set heavier and darker than the rest (the commas and "and" stay in the soft grey).
const strong = 'font-semibold text-[#1a1d29] dark:text-[#f2f2f1]'
const emphasise = (text: string) =>
  text.split(/(clean|intuitive|easy to use)/).map((part, k) =>
    k % 2 ? (
      <span key={k} className={strong}>
        {part}
      </span>
    ) : (
      part
    ),
  )

// All the text on this page is Inter: the big lead sentence and the supporting sentence. Marked words sit on coloured chips.
// Section headings (the bracketed labels, like "(What I do)") keep the site-wide label style, which is Bonny.
function Segments({ segments, room = false, face = 'font-inter font-normal' }: { segments: Seg[]; room?: boolean; face?: string }) {
  return (
    <>
      {segments.map((seg, i) => {
        const br = seg.breakAfter && i < segments.length - 1
        // chips are tilted a little, alternately left and right, like the highlighted words in the About heading
        const tilt = segments.slice(0, i).filter((s) => s.chip).length % 2 ? 'rotate-[1.2deg]' : '-rotate-[1.2deg]'
        const el = seg.chip ? (
          <span key={i} data-path-chip={seg.anchor ? '' : undefined} className={`inline-block whitespace-nowrap rounded-[0.22em] px-[0.3em] pb-[0.12em] italic text-[#111] ${tilt} ${face} ${chipClass[seg.chip]}`}>
            {seg.text}
          </span>
        ) : seg.mark === 'simple' ? (
          <span key={i} data-mark="simple" className={face}>
            {/* room for the tangle just before "clean,"; kept on the same line as that word */}
            <span className="whitespace-nowrap">
              <span data-tangle aria-hidden className={`inline-block ${room ? 'w-[2.3em]' : 'w-0'}`} />
              {emphasise(seg.text.split(' ')[0])}
            </span>
            {emphasise(seg.text.slice(seg.text.split(' ')[0].length))}
          </span>
        ) : seg.mark ? (
          <span key={i} data-mark={seg.mark} className={face}>
            {seg.text}
          </span>
        ) : (
          <span key={i} className={face}>
            {seg.text}
          </span>
        )
        return (
          <Fragment key={i}>
            {el}
            {br && <br />}
          </Fragment>
        )
      })}
    </>
  )
}

// A small "keep scrolling" cue. The page is pinned and the text doesn't move, so the hint fades in after a moment and stays
// for the whole pinned stretch; it fades out only as the pin lets go and the page starts to scroll on.
function ScrollHint({ pin }: { pin: React.RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({ target: pin, offset: ['start start', 'end end'] })
  const fade = useTransform(scrollYProgress, [0.88, 1], [1, 0], { clamp: true })
  return (
    <motion.div aria-hidden style={{ opacity: fade }} className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.8 }} className="flex flex-col items-center gap-3 text-ink/60">
        <span className="label tracking-[0.3em]">Keep scrolling</span>
        {/* a thin line that draws itself downwards and slips away, over and over */}
        <div className="relative h-12 w-px overflow-hidden bg-ink/15">
          <motion.div
            className="absolute inset-0 origin-top bg-ink/70"
            animate={{ scaleY: [0, 1, 1], y: ['0%', '0%', '100%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', times: [0, 0.5, 1] }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Intro() {
  const ref = useRef<HTMLElement>(null)
  // The intro text fills the first screen on its own; the stack block sits just below the fold, so the icons only
  // appear once you scroll on. Their reveal is tied to the block's own position as it travels up the screen.
  const stackRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  // On desktop the text block is pinned to the middle of the screen for an extra stretch of scrolling (PIN_EXTRA), and
  // the tangle-to-line animation is driven by how far through that stretch you are, in either direction.
  const pinRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const pinned = usePinned()
  const { scrollYProgress: stackProgress } = useScroll({ target: stackRef, offset: ['start 98%', 'start 35%'] })
  // Two sentences, two levels: the first is the lead, the second is supporting text.
  const cut = intro.segments.findIndex((s) => s.breakAfter) + 1
  const lead = intro.segments.slice(0, cut)
  const support = intro.segments.slice(cut)
  return (
    <section ref={ref} id="intro" className="relative -mt-[22svh] overflow-x-clip pb-14">
      <div ref={pinRef} data-pin className="relative" style={pinned ? { height: `${100 + PIN_EXTRA}svh` } : undefined}>
        <div
          ref={stickyRef}
          className={`mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-6 pb-20 pt-20 text-center ${pinned ? 'sticky top-0 h-[100svh]' : 'relative min-h-[100svh]'}`}
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-20%' }}
            transition={{ duration: 0.8 }}
            className="eyebrow mb-12 text-ink"
          >
            ({intro.label})
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20%' }}
            transition={{ duration: 1.1, ease }}
            className="text-balance [font-synthesis:none] text-[clamp(1.75rem,3.4vw,3.1rem)] leading-[1.3] tracking-[-0.035em] max-md:text-balance"
          >
            <Segments segments={lead} face="font-inter font-normal" />
          </motion.p>
          <motion.p
            ref={textRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20%' }}
            transition={{ duration: 1, ease, delay: 0.2 }}
            className="mt-14 max-w-[36rem] text-[clamp(1.05rem,1.65vw,1.5rem)] leading-[1.55] tracking-[-0.025em] text-[#6b7080] dark:text-[#a3a8b8] max-md:text-balance [font-synthesis:none]"
          >
            <Segments segments={support} room={pinned} />
          </motion.p>
          <ComplexSimple section={stickyRef} text={textRef} pin={pinRef} animated={pinned} />
          {pinned && <ScrollHint pin={pinRef} />}
        </div>
      </div>
      <div ref={stackRef} className="relative mt-12 flex flex-col items-center gap-10 pb-10 md:mt-16">
        <p className="eyebrow text-ink">(My Builder Stack)</p>
        <IconRow sectionProgress={stackProgress} />
      </div>
    </section>
  )
}
