import { motion, useReducedMotion, useTransform, type MotionValue } from 'motion/react'
import { stack, type StackItem } from '../content/stack'

export function Glyph({ item }: { item: StackItem }) {
  if (item.kind === 'figma') {
    return (
      <svg viewBox="0 0 38 57" aria-hidden className="h-[54%]">
        <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1abcfe" />
        <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0acf83" />
        <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#ff7262" />
        <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#f24e1e" />
        <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#a259ff" />
      </svg>
    )
  }
  if (item.kind === 'letter') {
    return (
      <span className="font-display text-[2.6rem] italic leading-none" style={{ color: item.fg }}>
        {item.letter}
      </span>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-[52%]" fill={item.fg}>
      <path d={item.path} />
    </svg>
  )
}

// Imitates skiper31's third demo: the icons start fanned out from the centre of the row (pushed sideways,
// spun, scaled down, the outer ones lifted into an arc) and converge into a straight, upright row as you scroll.
function Tile({ item, index, count, progress }: { item: StackItem; index: number; count: number; progress: MotionValue<number> }) {
  const dist = index - Math.floor(count / 2)
  const range = [0, 0.9]
  const x = useTransform(progress, range, [dist * 90, 0])
  const rotate = useTransform(progress, range, [dist * 50, 0])
  const y = useTransform(progress, range, [-Math.abs(dist) * 20, 0])
  const scale = useTransform(progress, range, [0.75, 1])

  return (
    <motion.li data-stack-first={index === 0 ? '' : undefined} style={{ x, y, rotate, scale, transformOrigin: 'center' }} className="group relative">
      {/* Once the row has landed, each icon bobs gently on its own rhythm. */}
      <div className="icon-float" style={{ animationDelay: `${-index * 0.45}s` }}>
      <div
        title={item.name}
        className="grid size-16 place-items-center rounded-[22%] shadow-[0_6px_18px_-6px_rgba(0,0,0,0.35)] ring-1 ring-black/5 transition-transform duration-300 group-hover:-translate-y-3 group-hover:scale-125 group-hover:rotate-6 md:size-[4.5rem]"
        style={{ background: item.bg }}
      >
        <Glyph item={item} />
      </div>
      </div>
      <span style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }} className="label pointer-events-none absolute left-1/2 top-full mt-2 w-[5.25rem] -translate-x-1/2 text-center !text-[0.7rem] leading-tight text-ink/70 transition-colors group-hover:text-ink">
        {item.name}
      </span>
    </motion.li>
  )
}

// `sectionProgress` runs 0 -> 1 as the row scrolls up the screen (see Intro.tsx), so it is assembled once it is in view.
export function IconRow({ sectionProgress }: { sectionProgress: MotionValue<number> }) {
  const reduced = useReducedMotion()
  const progress = useTransform(sectionProgress, (v) => (reduced ? 1 : Math.min(Math.max(v, 0), 1)))

  return (
    <ul
      aria-label="My Builder Stack"
      className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-4 gap-y-12 px-6 pb-12 pt-10 md:flex-nowrap md:gap-4 md:pb-9"
      style={{ perspective: 500 }}
    >
      {stack.map((item, i) => (
        <Tile key={item.name} item={item} index={i} count={stack.length} progress={progress} />
      ))}
    </ul>
  )
}
