import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

// A hand-cut line: a gently wandering path (a few slow sine waves) so it is never perfectly straight.
const W = 1000
const LINE = 'M' + Array.from({ length: 81 }, (_, i) => {
  const t = i / 80
  const y = 16 + Math.sin(t * 9.1 + 1.3) * 5 + Math.sin(t * 23 + 0.4) * 2.4 + Math.sin(t * 57) * 0.9
  return `${(t * W).toFixed(1)} ${y.toFixed(2)}`
}).join(' L')
// Dashes of uneven length with wide, uneven gaps (screen pixels: dash, gap, dash, gap, ...).
const DASHES = '10 16 5 14 14 18 7 15 10 20 4 14'

// A dashed "cut here" line with a pair of scissors. As it scrolls into view the scissors travel along the line from
// left to right and the dashes appear behind them, as if they were cutting the page.
export function ScissorLine({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 95%', 'start 55%'] })
  const left = useTransform(scrollYProgress, (v) => `${v * 100}%`)
  const clipPath = useTransform(scrollYProgress, (v) => `inset(0 ${100 - v * 100}% 0 0)`)

  return (
    <div ref={ref} aria-hidden className={`relative h-8 ${className}`}>
      <motion.svg
        style={{ clipPath }}
        viewBox={`0 0 ${W} 32`}
        preserveAspectRatio="none"
        className="absolute inset-0 size-full overflow-visible text-ink/45"
      >
        <path d={LINE} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASHES} vectorEffect="non-scaling-stroke" />
      </motion.svg>
      <motion.span style={{ left }} className="absolute top-1/2 -translate-x-full -translate-y-1/2 bg-paper pl-2 text-ink">
        <svg viewBox="0 0 24 24" className="size-6 fill-none stroke-current" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12" />
        </svg>
      </motion.span>
    </div>
  )
}
