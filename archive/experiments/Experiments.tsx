import { motion, useMotionValue, useSpring } from 'motion/react'
import { useState, type PointerEvent, type ReactNode } from 'react'
import { experiments, experimentTiles, type ExperimentArt } from '../content/experiments'

const ease = [0.22, 1, 0.36, 1] as const

// Each tile's little demo.
function SpringArt() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const big = { x: useSpring(x, { stiffness: 120, damping: 14, mass: 0.8 }), y: useSpring(y, { stiffness: 120, damping: 14, mass: 0.8 }) }
  const small = { x: useSpring(x, { stiffness: 50, damping: 12, mass: 1 }), y: useSpring(y, { stiffness: 50, damping: 12, mass: 1 }) }
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - r.left - r.width / 2)
    y.set(e.clientY - r.top - r.height / 2)
  }
  return (
    <div
      onPointerMove={move}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
      className="absolute inset-0 grid place-items-center"
    >
      <motion.span style={big} className="absolute size-20 rounded-full bg-[#111]" />
      <motion.span style={small} className="absolute size-10 rounded-full bg-pink" />
    </div>
  )
}

function PaletteArt() {
  const colours = ['bg-pink', 'bg-yellow', 'bg-sky', 'bg-lime']
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-2">
      {colours.map((c, i) => (
        <span
          key={c}
          className={`${c} size-9 rounded-xl transition-transform duration-300 ease-out group-hover:-translate-y-2`}
          style={{ transitionDelay: `${i * 50}ms`, rotate: `${(i - 1.5) * 6}deg` }}
        />
      ))}
    </div>
  )
}

function TypeArt() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <span className="font-display text-[8rem] leading-none transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
        A<i>a</i>
      </span>
    </div>
  )
}

function SwitchArt() {
  const [on, setOn] = useState(false)
  return (
    <div className="absolute inset-0 grid place-items-center">
      <button
        aria-pressed={on}
        aria-label="Toggle the tiny switch"
        onClick={() => setOn((v) => !v)}
        className={`flex h-10 w-[4.5rem] items-center rounded-full p-1 transition-colors duration-300 ${on ? 'bg-[#111]' : 'bg-[#111]/20'}`}
      >
        <motion.span animate={{ x: on ? 32 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 22 }} className="size-8 rounded-full bg-white shadow" />
      </button>
    </div>
  )
}

function MarqueeArt() {
  const text = 'make it move · make it feel · make it yours · '
  return (
    <div className="absolute inset-x-0 top-[36%] -translate-y-1/2 overflow-hidden">
      <div className="marquee flex w-max whitespace-nowrap font-display text-4xl italic">
        {[0, 1].map((n) => (
          <span key={n} className="pr-2">
            {text.repeat(2)}
          </span>
        ))}
      </div>
    </div>
  )
}

function DotsArt() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 16 }, (_, i) => (
          <span
            key={i}
            className="size-3 rounded-full bg-[#111] transition-transform duration-500 ease-out group-hover:scale-[1.9]"
            style={{ transitionDelay: `${((i % 4) + Math.floor(i / 4)) * 70}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

const ART: Record<ExperimentArt, () => ReactNode> = {
  spring: SpringArt,
  palette: PaletteArt,
  type: TypeArt,
  switch: SwitchArt,
  marquee: MarqueeArt,
  dots: DotsArt,
  soon: () => null,
}

// Background and text colour for each tile.
const SKIN: Record<ExperimentArt, string> = {
  spring: 'bg-pink text-[#111]',
  palette: 'bg-surface text-ink',
  type: 'bg-ink text-paper',
  switch: 'bg-sky text-[#111]',
  marquee: 'bg-lime text-[#111]',
  dots: 'bg-yellow text-[#111]',
  soon: 'bg-ink/[0.04] text-ink/60',
}

export function Experiments() {
  return (
    <section id="experiments" className="relative z-10 overflow-hidden bg-paper px-[calc(var(--gutter)+1.25rem)] pb-24 pt-8 md:pb-32 md:pt-10">
      {/* A quiet dot grid behind the whole section, kept inside the page's margin lines and fading out towards the top and bottom. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 text-ink/25"
        style={{
          left: 'var(--gutter)',
          right: 'var(--gutter)',
          backgroundImage: 'radial-gradient(circle at center, currentColor 1.2px, transparent 1.6px)',
          backgroundSize: '28px 28px',
          maskImage: 'linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%)',
        }}
      />
      <div className="relative">
        <div className="text-center">
          <p className="label mx-auto w-fit text-muted">({experiments.label})</p>
          <h2 className="mx-auto mt-4 w-fit font-display text-5xl leading-none tracking-tight md:text-7xl">{experiments.heading}</h2>
          <p className="mx-auto mt-4 w-fit max-w-md text-sm text-muted">{experiments.blurb}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:mt-20 md:grid-cols-2 md:gap-10 lg:auto-rows-[210px] lg:grid-cols-4 lg:gap-14">
          {experimentTiles.map((t, i) => {
            const Art = ART[t.art]
            return (
              <motion.article
                key={t.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8% 0px' }}
                transition={{ duration: 0.8, ease, delay: (i % 3) * 0.08 }}
                className={`group relative min-h-[220px] overflow-hidden rounded-[1.75rem] p-6 transition-transform duration-500 ease-out hover:-translate-y-1 ${SKIN[t.art]} ${t.span}`}
              >
                <Art />
                <div className="pointer-events-none relative flex h-full flex-col justify-between">
                  <span className="label opacity-60">{t.tag}</span>
                  <div>
                    <h3 className="font-display text-3xl leading-none tracking-tight">{t.title}</h3>
                    <p className="mt-2 max-w-[28ch] text-xs opacity-70">{t.blurb}</p>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>

    </section>
  )
}
