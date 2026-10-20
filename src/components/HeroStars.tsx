import { motion, useSpring, useTransform, type MotionValue } from 'motion/react'

type Colour = 'pink' | 'yellow' | 'sky'

// Star fill, and a deeper shade for the outline.
const PALETTE: Record<Colour, { fill: string; edge: string }> = {
  pink: { fill: '#f09bcf', edge: '#d4529a' },
  yellow: { fill: '#ffe45c', edge: '#d9a400' },
  sky: { fill: '#9fd6f7', edge: '#4f9fd6' },
}

// Where each flower rests, as a percentage of the hero, with its size in px. They ring the headline and leave the
// middle clear.
const FLOWERS: { x: number; y: number; size: number; colour: Colour; turn: number }[] = [
  { x: 9, y: 25, size: 46, colour: 'pink', turn: 12 },
  { x: 24, y: 16, size: 32, colour: 'sky', turn: 40 },
  { x: 66, y: 14, size: 28, colour: 'yellow', turn: 20 },
  { x: 83, y: 18, size: 44, colour: 'sky', turn: 8 },
  { x: 94, y: 39, size: 32, colour: 'pink', turn: 33 },
  { x: 14, y: 53, size: 38, colour: 'yellow', turn: 25 },
  { x: 4, y: 77, size: 30, colour: 'sky', turn: 5 },
  { x: 27, y: 82, size: 46, colour: 'yellow', turn: 18 },
  { x: 38, y: 89, size: 28, colour: 'pink', turn: 45 },
  { x: 63, y: 87, size: 36, colour: 'sky', turn: 15 },
  { x: 78, y: 79, size: 40, colour: 'pink', turn: 28 },
  { x: 91, y: 66, size: 44, colour: 'yellow', turn: 10 },
]

const NAV = 72 // height of the fixed nav bar, in px: flowers are never pushed up under it
const RADIUS = 150 // how close the pointer must be to push a flower, in px
const PUSH = 0.25 // how far a flower is pushed, as a share of how deep into the radius the pointer is

// A four-point sparkle: long thin rays with curved sides.
const STAR = 'M0 -64 C4 -20 20 -4 64 0 C20 4 4 20 0 64 C-4 20 -20 4 -64 0 C-20 -4 -4 -20 0 -64Z'

function Star({
  spec,
  index,
  mx,
  my,
  w,
  h,
}: {
  spec: (typeof FLOWERS)[number]
  index: number
  mx: MotionValue<number>
  my: MotionValue<number>
  w: MotionValue<number>
  h: MotionValue<number>
}) {
  const { x: px, y: py, size, colour, turn } = spec
  const c = PALETTE[colour]

  // Push away from the pointer along the line between them; zero once the pointer is out of range, and the spring
  // brings the flower home.
  const push = (axis: 0 | 1) => (): number => {
    const cx = (px / 100) * w.get()
    const cy = (py / 100) * h.get()
    const dx = cx - mx.get()
    const dy = cy - my.get()
    const d = Math.hypot(dx, dy)
    if (d >= RADIUS || d === 0) return 0
    const amount = (RADIUS - d) * PUSH
    const move = ((axis === 0 ? dx : dy) / d) * amount
    // Keep the flower fully on screen and clear of the nav bar, wherever it is pushed.
    const half = size / 2 + 8
    const [lo, hi] = axis === 0 ? [half, w.get() - half] : [NAV + half, h.get() - half]
    const home = axis === 0 ? cx : cy
    return Math.min(Math.max(home + move, Math.min(lo, home)), Math.max(hi, home)) - home
  }
  const x = useSpring(useTransform([mx, my, w, h], push(0)), { stiffness: 25, damping: 14, mass: 1 })
  const y = useSpring(useTransform([mx, my, w, h], push(1)), { stiffness: 25, damping: 14, mass: 1 })

  return (
    <div aria-hidden className="pointer-events-none absolute" style={{ left: `${px}%`, top: `${py}%` }}>
      <motion.div style={{ x, y }}>
        <motion.svg
          viewBox="-70 -70 140 140"
          width={size}
          height={size}
          className="-translate-x-1/2 -translate-y-1/2 overflow-visible"
          initial={{ opacity: 0, scale: 0, rotate: turn - 90 }}
          animate={{ opacity: 1, scale: 1, rotate: turn }}
          transition={{ delay: 3.0 + index * 0.06, duration: 0.9, ease: [0.34, 1.4, 0.64, 1] }}
        >
          {/* Each star twinkles on its own rhythm: it dims and shrinks, then flashes back. */}
          <motion.g
            style={{ originX: 0.5, originY: 0.5 }}
            animate={{ scale: [1, 0.55, 1.12, 1], opacity: [1, 0.45, 1, 1] }}
            transition={{ duration: 2.4 + (index % 4) * 0.5, repeat: Infinity, ease: 'easeInOut', delay: 4.1 + index * 0.37 }}
          >
            <path d={STAR} fill={c.fill} stroke={c.edge} strokeWidth={3} strokeOpacity={0.6} strokeLinejoin="round" />
            <circle r={7} fill="#fff" fillOpacity={0.85} />
          </motion.g>
        </motion.svg>
      </motion.div>
    </div>
  )
}

// Small sparkling stars scattered around the headline. They twinkle, shy away from the pointer and drift back when it leaves.
export function HeroStars({ mx, my, w, h }: { mx: MotionValue<number>; my: MotionValue<number>; w: MotionValue<number>; h: MotionValue<number> }) {
  return (
    <>
      {FLOWERS.map((f, i) => (
        <Star key={i} spec={f} index={i} mx={mx} my={my} w={w} h={h} />
      ))}
    </>
  )
}
