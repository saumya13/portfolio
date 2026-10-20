import { motion, useMotionValue, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef } from 'react'
import { HeroStars } from '../components/HeroStars'
import { site, type Segment } from '../content/site'

const ease = [0.22, 1, 0.36, 1] as const
// Text-generate effect: every word starts blurred and invisible, then sharpens into place, one word after another.
const WORD_START = 0.15
const WORD_STAGGER = 0.09
const GREETING_PAUSE = 1.08 // the greeting finishes, the flower pops in beside it, then the rest of the headline begins
const wordVariants = {
  hidden: { opacity: 0, filter: 'blur(12px)' },
  show: (i: number) => ({ opacity: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease, delay: i } }),
}
// A chip's colour fades in together with its first word.
const chipVariants = {
  hidden: { opacity: 0 },
  show: (i: number) => ({ opacity: 1, transition: { duration: 0.8, ease, delay: i } }),
}
// Seconds until the word at `index` (counting from the start of the headline) appears; lines after the first wait a beat.
const wordDelay = (index: number, line: number) => WORD_START + index * WORD_STAGGER + (line > 0 ? GREETING_PAUSE : 0)
const chipClass = { lime: 'bg-lime', sky: 'bg-sky', pink: 'bg-pink', yellow: 'bg-yellow' } as const

// Sets the letters listed in `seg.italic` in the italic cut, with tight tracking so they tuck into their neighbours.
function letters(seg: Segment) {
  const { text, italic, italicWord } = seg
  if (italicWord && text.includes(italicWord)) {
    const [before, after] = text.split(italicWord)
    return (
      <>
        {before}
        <i>{italicWord}</i>
        {after}
      </>
    )
  }
  if (!italic) return text
  const set = italic.toLowerCase()
  return (
    <span className="tracking-[-0.045em]">
      {[...text].map((ch, k) =>
        set.includes(ch.toLowerCase()) ? (
          <i key={k} className="-mx-[0.02em]">
            {ch}
          </i>
        ) : (
          ch
        ),
      )}
    </span>
  )
}

export function Hero() {
  let count = 0
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0])

  // Pointer position inside the hero (far away when it is outside) and the hero's size, for the flowers.
  const mx = useMotionValue(-9999)
  const my = useMotionValue(-9999)
  const w = useMotionValue(1)
  const h = useMotionValue(1)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      w.set(el.clientWidth)
      h.set(el.clientHeight)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [w, h])

  return (
    <section
      ref={ref}
      id="top"
      className="relative h-[100svh] overflow-hidden"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set(e.clientX - r.left)
        my.set(e.clientY - r.top)
      }}
      onPointerLeave={() => {
        mx.set(-9999)
        my.set(-9999)
      }}
    >
      <motion.div aria-hidden style={{ opacity }} className="pointer-events-none absolute inset-0">
        <HeroStars mx={mx} my={my} w={w} h={h} />
      </motion.div>
      <motion.div style={{ scale, opacity }} className="relative flex h-full flex-col items-center justify-center px-6">
        <motion.h1 initial="hidden" animate="show" className="text-center font-bonny [font-synthesis:none] text-[clamp(2rem,4vw,4.25rem)] leading-[1.38] tracking-[-0.02em]">
          {site.hero.lines.map((line, i) => (
            <span key={i} className={`flex flex-wrap items-center justify-center gap-x-[0.28em] py-[0.04em]`}>
              {line.map((seg, j) => {
                const words = seg.text.split(' ').filter(Boolean)
                const first = count
                const inner = words.map((word, k) => (
                  <motion.span key={k} className="inline-block" variants={wordVariants} custom={wordDelay(first + k, i)}>
                    {letters({ ...seg, text: word })}
                  </motion.span>
                ))
                count += words.length
                return seg.chip ? (
                  <motion.span
                    key={j}
                    variants={chipVariants}
                    custom={wordDelay(first, i)}
                    className={`inline-flex gap-x-[0.28em] rounded-[0.22em] px-[0.3em] pb-[0.06em] font-medium text-[#111] ${chipClass[seg.chip]} ${seg.big ? 'text-[1.5em]' : ''}`}
                  >
                    {inner}
                  </motion.span>
                ) : (
                  <span key={j} data-flower-anchor={seg.anchor ? '' : undefined} className={`inline-flex gap-x-[0.28em] ${seg.anchor ? 'font-medium' : ''}`}>
                    {inner}
                  </span>
                )
              })}
            </span>
          ))}
        </motion.h1>
      </motion.div>
      {/* The cue fades away as soon as you start scrolling. */}
      <motion.div style={{ opacity: cueOpacity }} className="pointer-events-none absolute inset-x-0 bottom-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.0, duration: 0.8 }}
          className="label text-center text-ink/70"
        >
          ({site.hero.cue})
        </motion.p>
      </motion.div>
    </section>
  )
}
