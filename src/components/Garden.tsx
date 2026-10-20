import { motion, useMotionValue, useSpring } from 'motion/react'
import type { PointerEvent, ReactNode } from 'react'
import { crayonStyle } from './crayon'

const ease = [0.22, 1, 0.36, 1] as const
const STEM = '#8fba8f'
const LEAF = '#5d8c5f'

type Kind = 'daisy' | 'tulip' | 'pompom' | 'clover' | 'bell' | 'cluster'

// Every flower is drawn on a 100 x 260 canvas with its stem running down the middle and its bloom near the top.
function Head({ kind, c }: { kind: Kind; c: string }) {
  switch (kind) {
    case 'daisy':
      return (
        <>
          {Array.from({ length: 8 }, (_, i) => (
            <ellipse key={i} cx="50" cy="48" rx="9" ry="20" fill={c} transform={`rotate(${i * 45} 50 70)`} />
          ))}
          <circle cx="50" cy="70" r="8" fill="#fff" />
        </>
      )
    case 'tulip':
      return <path d="M28 40 L28 72 Q28 100 50 100 Q72 100 72 72 L72 40 L66 36 L60 54 L50 30 L40 54 L34 36 Z" fill={c} />
    case 'pompom':
      return (
        <>
          <circle cx="50" cy="68" r="27" fill={c} />
          {[[40, 58], [58, 56], [50, 72], [37, 76], [62, 74], [49, 54]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3.2" fill="#fff" fillOpacity=".75" />
          ))}
        </>
      )
    case 'clover':
      return (
        <>
          {[[50, 54], [50, 84], [35, 69], [65, 69]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="16" fill={c} />
          ))}
          <circle cx="50" cy="69" r="8" fill="#fff" />
          <circle cx="50" cy="69" r="4" fill="#e57bb8" />
        </>
      )
    case 'bell':
      return (
        <>
          <path d="M50 140 Q48 64 82 66" fill="none" stroke={STEM} strokeWidth="5" strokeLinecap="round" />
          {[[66, 74], [58, 92], [74, 96]].map(([x, y], i) => (
            <path key={i} d={`M${x - 8} ${y + 8} Q${x - 8} ${y - 6} ${x} ${y - 6} Q${x + 8} ${y - 6} ${x + 8} ${y + 8} Z`} fill={c} />
          ))}
        </>
      )
    case 'cluster':
      return (
        <>
          {[[44, 22, 10], [64, 40, 11], [38, 54, 11], [66, 72, 12], [46, 86, 10]].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={c} fillOpacity={0.7 + i * 0.07} />
          ))}
        </>
      )
  }
}

function Flower({ kind, c, h, i, leaf = 'both' }: { kind: Kind; c: string; h: number; i: number; leaf?: 'both' | 'left' | 'right' }) {
  const top = kind === 'bell' ? 140 : 100
  const leaves: ReactNode = (
    <>
      {leaf !== 'right' && <path d="M50 214 Q22 196 6 214 Q26 232 50 214Z" fill={LEAF} />}
      {leaf !== 'left' && <path d="M50 188 Q76 166 96 182 Q76 204 50 188Z" fill={LEAF} fillOpacity=".85" />}
    </>
  )
  // Pushing the pointer across a flower swings it the way the pointer is going; when the pointer leaves, a loose
  // spring lets it wobble back upright.
  const swing = useMotionValue(0)
  const rotate = useSpring(swing, { stiffness: 140, damping: 5, mass: 0.8 })
  const push = (e: PointerEvent) => swing.set(Math.max(-22, Math.min(22, swing.get() + e.movementX * 0.9)))
  return (
    <motion.div
      variants={{ hidden: { scaleY: 0, opacity: 0 }, show: { scaleY: 1, opacity: 1, transition: { duration: 1.1, ease } } }}
      style={{ transformOrigin: '50% 100%', height: h, rotate }}
      onPointerMove={push}
      onPointerLeave={() => swing.set(0)}
      className="pointer-events-auto shrink-0"
    >
      <motion.svg
        viewBox="0 0 100 260"
        aria-hidden
        className="h-full w-auto overflow-visible"
        style={{ transformOrigin: '50% 100%' }}
        animate={{ rotate: [-1.8, 1.8, -1.8] }}
        transition={{ duration: 4 + (i % 4) * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
      >
        <line x1="50" y1={top} x2="50" y2="262" stroke={STEM} strokeWidth="5" strokeLinecap="round" />
        {leaves}
        <Head kind={kind} c={c} />
      </motion.svg>
    </motion.div>
  )
}

// Pink, yellow and blue, each in a couple of shades so the row has some depth.
const PINK = '#f09bcf'
const ROSE = '#e57bb8'
const BLUSH = '#f6b6da'
const YELLOW = '#ffe14d'
const GOLD = '#ffcf3d'
const BLUE = '#8ccbf2'
const SKY = '#6fb6ee'

const FLOWERS: { kind: Kind; c: string; h: number; leaf?: 'both' | 'left' | 'right' }[] = [
  { kind: 'daisy', c: PINK, h: 78 },
  { kind: 'tulip', c: YELLOW, h: 98 },
  { kind: 'pompom', c: BLUE, h: 84 },
  { kind: 'clover', c: ROSE, h: 90, leaf: 'left' },
  { kind: 'bell', c: GOLD, h: 80, leaf: 'right' },
  { kind: 'tulip', c: SKY, h: 94 },
  { kind: 'cluster', c: BLUE, h: 112 },
  { kind: 'tulip', c: BLUSH, h: 96, leaf: 'right' },
  { kind: 'clover', c: YELLOW, h: 86 },
  { kind: 'daisy', c: SKY, h: 74, leaf: 'left' },
  { kind: 'pompom', c: ROSE, h: 90 },
]

// A bee that wanders around the word "garden".
function Bee() {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-full -ml-4 mt-0.5 block"
      animate={{ x: [0, 34, 8, -26, 0], y: [0, -6, 12, 2, 0], rotate: [0, 8, -6, 4, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 44 30" className="w-9">
        <motion.g animate={{ scaleY: [1, 0.55, 1] }} transition={{ duration: 0.16, repeat: Infinity }} style={{ transformOrigin: '22px 10px' }}>
          <ellipse cx="19" cy="7" rx="7" ry="5" fill="#fff" fillOpacity=".8" stroke="#d6dde6" strokeWidth=".6" />
          <ellipse cx="27" cy="7" rx="6" ry="4.5" fill="#fff" fillOpacity=".7" stroke="#d6dde6" strokeWidth=".6" />
        </motion.g>
        <ellipse cx="24" cy="18" rx="13" ry="8" fill="#ffd84d" />
        <path d="M20 10.5v15M27 10.5v15" stroke="#1b1b1f" strokeWidth="3.2" />
        <circle cx="9" cy="17.5" r="5.5" fill="#1b1b1f" />
        <circle cx="7.5" cy="16" r="1.2" fill="#fff" />
        <path d="M37 18.5l4 .8-4 1.2z" fill="#1b1b1f" />
        <path d="M6 12.5q-1-4 -4-4.5M9 12q0-4.5 -1-6" stroke="#1b1b1f" strokeWidth=".9" fill="none" strokeLinecap="round" />
      </svg>
    </motion.span>
  )
}

// A strip of soil with a speckle of pebbles.
function Soil() {
  const dots = Array.from({ length: 70 }, (_, i) => ({
    x: (i * 211) % 1440,
    y: 12 + ((i * 37) % 24),
    r: 0.8 + ((i * 7) % 5) * 0.35,
    d: i % 3 === 0,
  }))
  return (
    <svg aria-hidden viewBox="0 0 1440 48" preserveAspectRatio="none" className="relative -mt-1.5 -mb-px block h-6 w-full">
      <path d="M0 14C120 6 240 16 380 10S640 4 820 12 1140 18 1290 9 1400 8 1440 12V48H0Z" fill="#f3c4dc" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.d ? '#c0799f' : '#e6a8c8'} fillOpacity={d.d ? 0.7 : 0.9} />
      ))}
    </svg>
  )
}

// The footer's garden: a tagline, a row of flowers that grow when `play` turns true, and a strip of soil.
export function Garden({ play }: { play: boolean }) {
  return (
    <div className="flex h-full w-full flex-col justify-end">
      <p className="mb-5 text-center text-sm text-[#111]/80 md:text-base">
        Welcome to my{' '}
        <span className="relative inline-block font-bonny text-[1.2em] font-medium">
          <span className="px-[0.2em]" style={crayonStyle('yellow')}>garden</span>
          <Bee />
        </span>
        , where most of my ideas start.
      </p>
      <motion.div
        initial="hidden"
        animate={play ? 'show' : 'hidden'}
        transition={{ staggerChildren: 0.09 }}
        className="flex items-end justify-between px-1"
      >
        {FLOWERS.map((f, i) => (
          <Flower key={i} i={i} {...f} />
        ))}
      </motion.div>
      <Soil />
    </div>
  )
}
