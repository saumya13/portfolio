import { easeInOut, motion, useMotionValue, type MotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState, type RefObject } from 'react'
import { Flower } from './Flower'

// The flower's route as you scroll, kept deliberately simple: ONE smooth, curvy line from beside "Saumya" in the
// headline down to just left of "A full-stack developer" in the intro, where the flower rests. The route itself is invisible;
// the flower leaves a sparse trail of small pink, yellow and blue sparkles behind it.
//
//  - Easing: scroll position is eased (slow start, quicker middle, soft landing) so the flower moves like something
//    with weight rather than at a constant, mechanical speed.
//  - Rotation follows the direction of travel: each sparkle points along the route, and the flower rolls in step with
//    its horizontal movement (clockwise going right, counter-clockwise going left), so its spin always matches where
//    it is heading and slows to a stop as it lands.
//  - Timing is even: every sparkle takes the same stretch of route (POP px) to pop in, however long the route is.
const FALLBACK_START: [number, number] = [0.62, 0.39]
const STEP = 46 // px of route between sparkles
const POP = 36 // px of route over which a sparkle pops in
const COLOURS = ['#f09bcf', '#ffe14d', '#8ccbf2']
const SPARKLE = 'M0 -1 C0.1 -0.32 0.32 -0.1 1 0 C0.32 0.1 0.1 0.32 0 1 C-0.1 0.32 -0.32 0.1 -1 0 C-0.32 -0.1 -0.1 -0.32 0 -1Z'
const ROLL = 0.5 // how much of a true roll the flower's spin is (1 = no slipping)
const FLOWER_RADIUS = 42
type Mark = { x: number; y: number; at: number; size: number; colour: string; turn: number }

// The flower fades in once the headline has landed.
const FLOWER_DELAY = 1.0

type Layout = { w: number; h: number; sx: number; sy: number; stopX: number; stopY: number; bowX: number; at: number; hold: number; u: number; top: number; vh: number }

// The route, hand-drawn then smoothed: it sets off to the right of "Saumya", bows out round the right-hand side of the
// headline (clear of the text), then sweeps back across the page in one long, low arc to the left of the intro's first
// line. The points are in screenshot pixels (a 2000px-wide window); they are stretched so the first lands on the real
// start and the last on the real stop, whatever the screen size.
const SKETCH: [number, number][] = [
  [1372, 145], [1600, 150], [1760, 215], [1805, 330], [1790, 470], [1720, 580], [1580, 665], [1250, 735], [850, 765], [560, 825], [400, 920], [310, 1048],
]

// A smooth curve through the points, written as cubic beziers. Each point's tangent follows the line between its
// neighbours and each handle is a third of the segment, so there are no kinks.
const unit = (x: number, y: number): [number, number] => {
  const l = Math.hypot(x, y) || 1
  return [x / l, y / l]
}
const smooth = (p: [number, number][]) => {
  const t = p.map((_, i) => {
    const a = p[Math.max(i - 1, 0)]
    const b = p[Math.min(i + 1, p.length - 1)]
    return unit(b[0] - a[0], b[1] - a[1])
  })
  let d = `M${p[0][0]} ${p[0][1]}`
  for (let i = 0; i < p.length - 1; i++) {
    const len = Math.hypot(p[i + 1][0] - p[i][0], p[i + 1][1] - p[i][1]) / 3
    d += ` C${p[i][0] + t[i][0] * len} ${p[i][1] + t[i][1] * len} ${p[i + 1][0] - t[i + 1][0] * len} ${p[i + 1][1] - t[i + 1][1] * len} ${p[i + 1][0]} ${p[i + 1][1]}`
  }
  return d
}

const build = ({ sx, sy, stopX, stopY, bowX }: Layout) => {
  const [x0, y0] = SKETCH[0]
  const [x1, y1] = SKETCH[SKETCH.length - 1]
  const xMax = Math.max(...SKETCH.map((p) => p[0]))
  return smooth(
    SKETCH.map(([x, y]): [number, number] => [
      // right of the start: stretched so the widest point of the bow is exactly bowX; left of it: down to the stop.
      x >= x0 ? sx + ((x - x0) / (xMax - x0)) * (bowX - sx) : sx + ((x - x0) / (x1 - x0)) * (stopX - sx),
      sy + ((y - y0) / (y1 - y0)) * (stopY - sy),
    ]),
  )
}

// Position of an element relative to `root`, ignoring transforms (so scroll-driven scaling doesn't skew it).
const offsetWithin = (el: HTMLElement, root: HTMLElement) => {
  let x = 0
  let y = 0
  let n: HTMLElement | null = el
  while (n && n !== root) {
    x += n.offsetLeft
    y += n.offsetTop
    n = n.offsetParent as HTMLElement | null
  }
  return { x, y }
}

// One sparkle of the trail: pops in as the flower passes it and stays.
function TrailMark({ m, draw, span, reduced }: { m: Mark; draw: MotionValue<number>; span: number; reduced: boolean }) {
  const t = useTransform(draw, [m.at, m.at + span], [0, 1], { clamp: true })
  const scale = useTransform(t, [0, 0.7, 1], [0, 1.2, 1])
  return (
    <g transform={`translate(${m.x} ${m.y}) rotate(${m.turn})`}>
      <motion.g style={{ scale: reduced ? 1 : scale, opacity: reduced ? 1 : t }}>
        <path d={SPARKLE} transform={`scale(${m.size})`} fill={m.colour} />
      </motion.g>
    </g>
  )
}

export function ScrollPath({ container }: { container: RefObject<HTMLElement | null> }) {
  const reduced = useReducedMotion()
  const pathRef = useRef<SVGPathElement>(null)
  const [layout, setLayout] = useState<Layout>({ w: 0, h: 0, sx: 0, sy: 0, stopX: 0, stopY: 0, bowX: 0, at: 0, hold: 0, u: 0, top: 0, vh: 1 })
  const layoutRef = useRef(layout)
  layoutRef.current = layout
  const [marks, setMarks] = useState<Mark[]>([])
  const [span, setSpan] = useState(0.03)

  const { scrollY } = useScroll()
  // Scroll position -> how far along the route (0 to 1), reaching 1 just as the intro fills the screen. Then eased.
  const travelled = useTransform(scrollY, (sy) => {
    const { top, u, vh, at } = layoutRef.current
    const start = 0.03 * Math.max(2 * u - vh, 1)
    return Math.min(Math.max((sy - top - start) / Math.max(at - start, 1), 0), 1)
  })
  const draw = useTransform(travelled, (v) => easeInOut(v))
  // How far the pinned stretch has scrolled; the whole route rides down by that much so it stays level with the text.
  const pinShift = useTransform(scrollY, (sy) => {
    const { top, at, hold } = layoutRef.current
    return Math.min(Math.max(sy - top - at, 0), hold)
  })
  // Once it is riding, anything that was already above the top of the screen at that point stays hidden.
  // Once the flower has landed the trail fades away completely, so the finished composition is calm: just the flower and
  // the text.
  const trailOpacity = useTransform(draw, [0.85, 1], [1, 0])
  const clipY = useTransform(pinShift, (v) => (v > 0 ? layoutRef.current.at : 0))
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  // Rolling: spin follows horizontal travel, so it turns the way it moves and stops when it stops.
  const spin = useTransform(x, (v) => (reduced ? 0 : ((v - layoutRef.current.sx) / FLOWER_RADIUS) * (180 / Math.PI) * ROLL))

  useEffect(() => {
    const el = container.current
    if (!el) return
    const measure = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      const u = el.querySelector<HTMLElement>('#top')?.offsetHeight ?? h / 3
      let sx = FALLBACK_START[0] * w
      let sy = FALLBACK_START[1] * u
      // The flower starts right beside "Saumya" in the headline.
      const anchor = el.querySelector<HTMLElement>('[data-flower-anchor]')
      if (anchor) {
        const o = offsetWithin(anchor, el)
        sx = o.x + anchor.offsetWidth + 64
        sy = o.y + anchor.offsetHeight * 0.55
      }
      // The route bows out clear of the right-hand end of "at the intersection of".
      let bowX = Math.min(sx + 0.3 * w, w - 90)
      const heading = el.querySelector<HTMLElement>('#top h1')
      if (heading) {
        const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT)
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          if ((n.textContent ?? '').trim() !== 'of') continue
          const range = document.createRange()
          range.selectNodeContents(n)
          bowX = Math.min(range.getBoundingClientRect().right - el.getBoundingClientRect().left + 110, w - 60)
          break
        }
      }
      // It rests just left of "A", the first word of the intro's first line ("A full-stack developer").
      let stopX = 0.13 * w
      let stopY = 1.48 * u
      const chip = el.querySelector<HTMLElement>('[data-path-chip]')
      if (chip?.parentElement) {
        const walker = document.createTreeWalker(chip.parentElement, NodeFilter.SHOW_TEXT)
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          const i = (n.textContent ?? '').indexOf('A ')
          if (i < 0) continue
          const range = document.createRange()
          range.setStart(n, i)
          range.setEnd(n, i + 1)
          const r = range.getBoundingClientRect()
          const c = chip.getBoundingClientRect()
          const o = offsetWithin(chip, el)
          stopX = Math.max(o.x + (r.left - c.left) - 52, 24)
          // centred on the x-height of the line, so the (smaller) flower reads as part of it
          stopY = o.y + (r.top - c.top) + r.height * 0.56
          break
        }
      }
      const at = el.querySelector<HTMLElement>('#intro')?.offsetTop ?? u
      // While the intro text is pinned (it sticks to the middle of the screen for `hold` px of scrolling), everything on
      // the route is held with it, so the flower stays beside "A" instead of scrolling away.
      const pin = el.querySelector<HTMLElement>('[data-pin]')
      const hold = pin ? Math.max(pin.offsetHeight - innerHeight, 0) : 0
      // (the browser's own scroll position, not the motion value, which can lag behind it)
      const top = el.getBoundingClientRect().top + window.scrollY
      // If this measurement happens while the text is pinned, its position already includes the scroll it has ridden
      // down; take that back out so the stop is where the text sits when the pin begins.
      const ridden = Math.min(Math.max(window.scrollY - top - at, 0), hold)
      const next: Layout = { w, h, sx, sy, stopX, stopY: stopY - ridden, bowX, at, hold, u, top, vh: innerHeight }
      // Only replace the layout when something moved, so re-measuring often costs nothing.
      setLayout((prev) => ((Object.keys(next) as (keyof Layout)[]).every((k) => Math.abs(prev[k] - next[k]) < 0.5) ? prev : next))
    }
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    // The route is measured from the text, so it is measured again whenever that could have moved: when the intro or its
    // pinned block changes size, when the window changes or finishes loading, and once scrolling settles (a measurement
    // taken mid-scroll, or before the browser restored the scroll position, can be a little stale).
    for (const sel of ['#intro', '[data-pin]']) {
      const n = el.querySelector(sel)
      if (n) ro.observe(n)
    }
    measure()
    document.fonts?.ready.then(measure)
    let idle = 0
    const later = () => {
      window.clearTimeout(idle)
      idle = window.setTimeout(measure, 150)
    }
    const stopScroll = scrollY.on('change', later)
    window.addEventListener('resize', later)
    window.addEventListener('load', later)
    window.addEventListener('pageshow', later)
    return () => {
      ro.disconnect()
      stopScroll()
      window.clearTimeout(idle)
      window.removeEventListener('resize', later)
      window.removeEventListener('load', later)
      window.removeEventListener('pageshow', later)
    }
  }, [container, scrollY])

  const place = (v: number) => {
    const p = pathRef.current
    if (!p) return
    const point = p.getPointAtLength(p.getTotalLength() * v)
    x.set(point.x)
    y.set(point.y)
  }
  useMotionValueEvent(draw, 'change', place)

  useEffect(() => {
    if (!layout.w) return
    const p = pathRef.current
    if (p) {
      const total = p.getTotalLength()
      setSpan(POP / total)
      // Sparkles every STEP px, each lined up with the direction of the route at that point.
      const n = Math.max(Math.floor(total / STEP) - 1, 0)
      setMarks(
        Array.from({ length: n }, (_, i) => {
          const at = (i + 1) / (n + 1)
          const q = p.getPointAtLength(total * at)
          const r = p.getPointAtLength(Math.min(total * at + 2, total))
          return {
            x: q.x,
            y: q.y,
            at,
            size: i % 3 === 0 ? 7 : 5,
            colour: COLOURS[i % COLOURS.length],
            turn: (Math.atan2(r.y - q.y, r.x - q.x) * 180) / Math.PI,
          }
        }),
      )
    }
    place(reduced ? 1 : draw.get())
  }, [layout, reduced]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!layout.w) return null
  return (
    <svg
      aria-hidden
      width={layout.w}
      height={layout.h}
      viewBox={`0 0 ${layout.w} ${layout.h}`}
      fill="none"
      className="pointer-events-none absolute inset-0 z-10 hidden text-ink md:block"
    >
      <defs>
        <clipPath id="routeClip">
          <motion.rect x={0} y={clipY} width={layout.w} height={layout.h} />
        </clipPath>
      </defs>
      <motion.g style={{ y: pinShift }}>
        <g clipPath="url(#routeClip)">
          {/* The route itself: never drawn, only used to place the flower and the sparkles. */}
          <path ref={pathRef} d={build(layout)} stroke="none" />
          <motion.g style={{ opacity: trailOpacity }}>
            {marks.map((m, i) => (
              <TrailMark key={i} m={m} draw={draw} span={span} reduced={!!reduced} />
            ))}
          </motion.g>
          <Flower x={x} y={y} spin={spin} delay={FLOWER_DELAY} reduced={!!reduced} />
        </g>
      </motion.g>
    </svg>
  )
}
