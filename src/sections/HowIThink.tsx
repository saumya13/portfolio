import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { BlobBackground } from '../components/BlobBackground'
import { crayonStyle, type CrayonColour } from '../components/crayon'
import { Scribble } from '../components/Scribble'
import { howIThink } from '../content/site'

const ease = [0.22, 1, 0.36, 1] as const
// Hover wash for each column, in order: yellow, blue, pink (matching the heading highlights). The wash is
// painted as watercolour (see the `watercolour` filter below), so it is a translucent pigment.
const WASHES = ['bg-yellow/25', 'bg-sky/18', 'bg-pink/14']

// A hand-drawn line: a gently wandering path (a few slow sine waves with a per-line seed) drawn twice, slightly
// apart, then roughened by the `sketchy` filter so the edges look like pencil.
function wander(seed: number, vertical: boolean) {
  const N = 28
  const pts = Array.from({ length: N + 1 }, (_, i) => {
    const t = i / N
    const w =
      Math.sin(t * 5.1 + seed * 1.7) * 2.6 +
      Math.sin(t * 13 + seed * 3.1) * 1.1 +
      Math.sin(t * 31 + seed * 5.3) * 0.45 +
      (t - 0.5) * (seed % 2 ? 3 : -3)
    const a = t * 1000
    const b = 8 + w
    return vertical ? `${b.toFixed(2)} ${a.toFixed(1)}` : `${a.toFixed(1)} ${b.toFixed(2)}`
  })
  return 'M' + pts.join(' L')
}

function Sketch({ seed, vertical }: { seed: number; vertical: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox={vertical ? '0 0 16 1000' : '0 0 1000 16'}
      preserveAspectRatio="none"
      className="absolute inset-0 size-full overflow-visible"
      style={{ filter: 'url(#sketchy)' }}
    >
      <path d={wander(seed, vertical)} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d={wander(seed + 7, vertical)} fill="none" stroke="currentColor" strokeOpacity={0.45} strokeWidth={1.2} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

// One dotted grid line that gets "drawn" as the section scrolls: a clip-path reveal travels along it,
// so the dots keep their spacing instead of stretching.
type Dir = 'down' | 'right' | 'left'
function Line({
  progress,
  range,
  dir,
  className,
  left,
  seed,
}: {
  progress: MotionValue<number>
  range: [number, number]
  dir: Dir
  className: string
  left?: string
  seed: number
}) {
  const hidden = useTransform(progress, range, [100, 0])
  const clipPath = useTransform(hidden, (v) =>
    dir === 'down' ? `inset(0 0 ${v}% 0)` : dir === 'right' ? `inset(0 ${v}% 0 0)` : `inset(0 0 0 ${v}%)`,
  )
  return (
    <motion.div style={{ clipPath, left }} className={className}>
      <Sketch seed={seed} vertical={dir === 'down'} />
    </motion.div>
  )
}

export function HowIThink() {
  const ref = useRef<HTMLElement>(null)
  // The grid is drawn as the section scrolls up to the top of the screen.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] })

  return (
    <section ref={ref} id="how-i-think" className="cursor-pencil relative flex min-h-[100svh] flex-col justify-between gap-24 overflow-hidden pb-14 pt-28 md:gap-32">
      {/* The watercolour wash used for the hover fill: wobbly, bleeding edges; gently uneven pigment (no gaps); and a
          darker rim where the pigment pools at the edge. */}
      <svg aria-hidden width="0" height="0" className="absolute">
        <filter id="sketchy" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="watercolour" x="-12%" y="-12%" width="124%" height="124%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="5" result="bleed" />
          <feDisplacementMap in="SourceGraphic" in2="bleed" scale="34" xChannelSelector="R" yChannelSelector="G" result="wobbly" />
          <feGaussianBlur in="wobbly" stdDeviation="2.4" result="soft" />
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.03" numOctaves="4" seed="11" result="mottle" />
          <feColorMatrix in="mottle" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.4 0 0 0 0.78" result="mottleAlpha" />
          <feComposite in="soft" in2="mottleAlpha" operator="in" result="washed" />
          <feMorphology in="soft" operator="erode" radius="7" result="inner" />
          <feGaussianBlur in="inner" stdDeviation="6" result="innerSoft" />
          <feComposite in="soft" in2="innerSoft" operator="out" result="rim" />
          <feMerge>
            <feMergeNode in="washed" />
            <feMergeNode in="rim" />
          </feMerge>
        </filter>
      </svg>
      <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 text-center">
        {/* A faint lime tint, centred on the headline. It lives inside the headline block and fades out
            towards its edges, so it can't spill down into the grid. */}
        <div
          aria-hidden
          className="absolute inset-y-0 -inset-x-10 opacity-30 dark:opacity-20"
          style={{ maskImage: 'radial-gradient(ellipse 44% 48% at 50% 50%, #000 0%, transparent 100%)' }}
        >
          <BlobBackground className="absolute inset-0 scale-[2.4]" />
        </div>
        <p className="eyebrow relative mb-8 text-ink/60">({howIThink.label})</p>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1, ease }}
          className="relative font-display text-[clamp(1.75rem,3.4vw,3.25rem)] leading-[1.4] tracking-[-0.015em]"
        >
          {howIThink.segments.map((seg, i) => (seg.wave ? <Scribble key={i}>{seg.text}</Scribble> : <span key={i}>{seg.text}</span>))}
        </motion.p>
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6">
        {/* The grid: dotted lines only. Three equal cells, one per point, with room left on either side.
            The lines are drawn one after another as you scroll: the top line left to right, the vertical
            lines top to bottom, and the bottom line right to left. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-6 inset-y-0 hidden text-ink/45 md:block">
          <Line progress={scrollYProgress} range={[0.3, 0.6]} dir="right" seed={1} className="absolute -inset-x-4 -top-[30px] h-4" />
          {['-8px', 'calc(33.333% - 8px)', 'calc(66.667% - 8px)', 'calc(100% - 8px)'].map((left, i) => (
            <Line
              key={left}
              progress={scrollYProgress}
              range={[0.4 + i * 0.07, 0.72 + i * 0.07]}
              dir="down"
              left={left}
              seed={i + 2}
              className="absolute -bottom-10 -top-10 w-4"
            />
          ))}
          <Line progress={scrollYProgress} range={[0.6, 1]} dir="left" seed={4} className="absolute -inset-x-4 -bottom-[18px] h-4" />
        </div>

        <ol className="cursor-pencil relative grid md:grid-cols-3">
          {howIThink.steps.map((step, i) => (
            <motion.li
              key={step.title}
              data-path-end={i === 1 ? '' : undefined}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.9, ease, delay: 0.15 + i * 0.12 }}
              className="group relative py-8 md:px-8 md:py-12"
            >
              {/* Washes the whole grid cell with watercolour on hover: the pigment spreads out from the middle. */}
              <span
                aria-hidden
                className={`pointer-events-none absolute inset-x-0 -bottom-6 -top-6 opacity-0 transition-[clip-path,opacity] duration-700 ease-out [clip-path:circle(0%_at_50%_50%)] group-hover:opacity-100 group-hover:[clip-path:circle(85%_at_50%_50%)] ${WASHES[i]}`}
                style={{ filter: 'url(#watercolour)' }}
              />
              <div className="relative">
                {/* Hierarchy: a small number as the index, a big heading as the focus, readable body text below. */}
                <p className="font-display text-xl italic leading-none tabular-nums text-ink/45">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 font-display text-[clamp(1.9rem,2.7vw,2.6rem)] leading-[1.08] tracking-[-0.015em] text-ink md:min-h-[2.3em]">
                  <span className="px-[0.2em] py-[0.05em]" style={crayonStyle(step.color as CrayonColour)}>
                    {step.title}
                  </span>
                </h3>
                <p className="mt-4 max-w-[32ch] text-[0.95rem] leading-relaxed text-ink/75">{step.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
