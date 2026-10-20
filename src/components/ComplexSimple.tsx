import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useEffect, useMemo, useState, type RefObject } from 'react'

const INK = '#e0509e' // the thread's colour: pink (deep enough to hold its own on the page)
type Pt = [number, number]

// A tangle of wire: one continuous line that goes once round each of four long, thin ovals, easing from one into the
// next. The ovals are tilted about 45 degrees apart and sit a little off-centre, so the line crosses itself like a bent
// piece of wire and nothing reads as a circle. Unit size (about 2 across); scaled to the text when drawn.
type LoopShape = [cx: number, cy: number, rx: number, ry: number, tilt: number]
const LOOPS: LoopShape[] = [
  [-0.1, 0.06, 0.98, 0.34, 0.15],
  [0.12, -0.08, 0.86, 0.3, 0.95],
  [-0.06, 0.1, 0.94, 0.32, 1.75],
  [0.1, 0.02, 0.82, 0.3, 2.55],
  [-0.04, 0.0, 0.92, 0.32, 3.35],
]
// The tangle's route as a list of points (unit size scaled by r), ending in a short loose end.
const tanglePoints = (r: number): Pt[] => {
  const smooth = (u: number) => u * u * (3 - 2 * u)
  const pts: Pt[] = []
  let last: Pt = [0, 0]
  const per = 48
  for (let k = 0; k < LOOPS.length - 1; k++) {
    for (let i = 0; i <= per; i++) {
      if (k > 0 && i === 0) continue
      const u = i / per
      const e = smooth(u)
      const [cx, cy, rx, ry, tilt] = LOOPS[k].map((v, j) => v + (LOOPS[k + 1][j] - v) * e) as LoopShape
      const a = (k + u) * Math.PI * 2
      const x = rx * Math.cos(a)
      const y = ry * Math.sin(a)
      last = [cx + x * Math.cos(tilt) - y * Math.sin(tilt), cy + x * Math.sin(tilt) + y * Math.cos(tilt)]
      pts.push([last[0] * r, last[1] * r])
    }
  }
  // a short loose end trails off to the lower left, like the tail of a scribble
  for (const [dx, dy] of [[-0.5, 0.12], [-0.95, 0.1], [-1.35, -0.05]]) pts.push([(last[0] + dx) * r, (last[1] + dy) * r])
  return pts
}
// The points turned by `deg` degrees and scaled by `k` about the tangle's centre.
const spin = (pts: Pt[], deg: number, k: number): Pt[] => {
  const c = Math.cos((deg * Math.PI) / 180)
  const s = Math.sin((deg * Math.PI) / 180)
  return pts.map(([x, y]) => [(x * c - y * s) * k, (x * s + y * c) * k])
}
const pathOf = (pts: Pt[]) => 'M' + pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(' L')
// Where the tangle's line has been drawn to, when a fraction `t` of it is showing (this is where the thread leaves it).
const pointAt = (pts: Pt[], t: number): Pt => {
  const segs = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]))
  let want = segs.reduce((a, b) => a + b, 0) * Math.min(Math.max(t, 0), 1)
  for (let i = 0; i < segs.length; i++) {
    if (want <= segs[i] || i === segs.length - 1) {
      const f = segs[i] ? Math.min(want / segs[i], 1) : 0
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]
    }
    want -= segs[i]
  }
  return pts[0]
}

// Share of the pinned scroll spent resting before the tangle starts to unwind.
export const DWELL = 0.3
const WAVE = 5.5 // px, height of the wave while the thread is still curvy
const WAVELENGTH = 52

// A polyline turned into a hand-drawn thread: it is sampled every few px and nudged sideways by a sine wave whose
// height is `amp` (1 = full wave, 0 = perfectly straight) and which fades out at both ends.
function thread(pts: Pt[], amp: number, seed: number, lead: number) {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]))
  const total = seg.reduce((a, b) => a + b, 0) || 1
  const n = Math.max(2, Math.ceil(total / 5))
  const out: string[] = []
  for (let k = 0; k <= n; k++) {
    const s = (k / n) * total
    let i = 0
    let acc = 0
    while (i < seg.length - 1 && acc + seg[i] < s) acc += seg[i++]
    const f = seg[i] ? (s - acc) / seg[i] : 0
    const [x0, y0] = pts[i]
    const [x1, y1] = pts[i + 1]
    const dx = (x1 - x0) / (seg[i] || 1)
    const dy = (y1 - y0) / (seg[i] || 1)
    // liveliest where the thread leaves the tangle, flattening out towards its far end
    const env = Math.pow(1 - k / n, 1.2)
    // the underline itself eases in from flat (so its left end doesn't hook once the lead-in has wound back)
    const ramp = Math.min(Math.max((s - lead) / 36, 0), 1)
    const off = amp * WAVE * env * (s < lead ? 1 : ramp) * Math.sin((s / WAVELENGTH) * Math.PI * 2 + seed)
    out.push(`${(x0 + (x1 - x0) * f - dy * off).toFixed(1)} ${(y0 + (y1 - y0) * f + dx * off).toFixed(1)}`)
  }
  return 'M' + out.join(' L')
}

const length = (pts: Pt[]) => pts.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0)

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

// `pts` is the thread's route, starting at the tangle (or at the line's left end); `lead` is how much of it is the
// connecting stretch from the tangle to the underline, which is wound back in at the end so only the underline stays.
type Strand = { pts: Pt[]; lead: number; window: [number, number] }
type Geo = { w: number; h: number; tx: number; ty: number; r: number; strands: Strand[] }

// "Complex becomes simple": a tangle of thread sits just before the word "clean". While the text is pinned in the middle
// of the screen, scrolling unwinds the tangle into a single thread that runs out under "clean, intuitive, and easy to use".
// It starts out curvy and then pulls straight, and the lead-in from the tangle winds back in, leaving one calm straight
// underline. Scrolling back up winds it back into a tangle.
export function ComplexSimple({ section, text, pin, animated }: { section: RefObject<HTMLElement | null>; text: RefObject<HTMLElement | null>; pin: RefObject<HTMLElement | null>; animated: boolean }) {
  const [geo, setGeo] = useState<Geo | null>(null)
  // Driven by scroll through the pinned stretch: 0 where the text first sticks, 1 where it lets go; scrubs both ways.
  // When it isn't animated (phones, reduced motion) the line is simply shown finished.
  const { scrollYProgress } = useScroll({ target: pin, offset: ['start start', 'end end'] })
  const finished = useMotionValue(1)
  // The first DWELL of the pinned stretch is a rest: the page sits in the middle of the screen with the tangle as it is,
  // and the unwinding only starts once you have scrolled a little more.
  const unwind = useTransform(scrollYProgress, [DWELL, 1], [0, 1], { clamp: true })
  const progress = animated ? unwind : finished

  useEffect(() => {
    const root = section.current
    const p = text.current
    if (!root || !p) return
    const measure = () => {
      const simple = p.querySelector<HTMLElement>('[data-mark=simple]')
      if (!simple) return
      // Everything is measured against the paragraph's own box, so its entrance animation (it slides up) can't skew it.
      const pr = p.getBoundingClientRect()
      const o = offsetWithin(p, root)
      const rel = (r: DOMRect) => ({ l: o.x + r.left - pr.left, r: o.x + r.right - pr.left, t: o.y + r.top - pr.top, b: o.y + r.bottom - pr.top })
      const range = document.createRange()
      range.selectNodeContents(simple)
      // the tangle's own room (a blank inline box before the first word) is left out of the measured line
      const room = simple.querySelector<HTMLElement>('[data-tangle]')
      if (room) range.setStartAfter(room)
      // one box per line the phrase wraps onto (merge the per-word boxes that share a line)
      const lines: { l: number; r: number; b: number }[] = []
      for (const raw of Array.from(range.getClientRects())) {
        const r = rel(raw)
        const hit = lines.find((ln) => Math.abs(ln.b - r.b) < 4)
        if (hit) {
          hit.l = Math.min(hit.l, r.l)
          hit.r = Math.max(hit.r, r.r)
        } else lines.push({ l: r.l, r: r.r, b: r.b })
      }
      if (!lines.length) return
      // (some browsers still include the blank room's own box in the range: make sure the line starts after it)
      if (room) {
        const rm = rel(room.getBoundingClientRect())
        if (Math.abs(lines[0].b - rm.b) < 12) lines[0].l = Math.max(lines[0].l, rm.r)
      }
      const gap = 5
      // the tangle sits just left of "clean", level with the line that will run under the phrase
      const fs = parseFloat(getComputedStyle(p).fontSize) || 24
      const r = fs * 0.8
      // inline with "clean": centred on its x-height, in the room kept free before it
      const rr = room?.getBoundingClientRect()
      const T: Pt = rr
        ? [o.x + rr.right - pr.left - fs * 0.12 - r * 0.95, o.y + rr.bottom - pr.top - fs * 0.28]
        : [lines[0].l - r * 0.95, lines[0].b + gap + r * 0.5]
      const strands: Strand[] = []
      // one thread: out of the tangle and along each line of the phrase, one line after another
      const total = lines.reduce((a, ln) => a + (ln.r - ln.l), 0) || 1
      let acc = 0
      lines.forEach((ln, i) => {
        const y = ln.b + gap
        const from = 0.08 + 0.52 * (acc / total)
        acc += ln.r - ln.l
        const to = 0.08 + 0.52 * (acc / total)
        const pts: Pt[] = i === 0 ? [T, [ln.l - 2, y], [ln.r, y]] : [[ln.l, y], [ln.r, y]]
        strands.push({ pts, lead: i === 0 ? length(pts.slice(0, 2)) : 0, window: [from, to] })
      })
      setGeo({ w: root.clientWidth, h: root.clientHeight, tx: T[0], ty: T[1], r, strands })
    }
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    measure()
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [section, text, animated])

  if (!geo) return null
  return <Drawing geo={geo} progress={progress} />
}

// useTransform over several motion values of different types, with the result typed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useMix = <T,>(inputs: MotionValue<any>[], fn: (v: any[]) => T) => useTransform(inputs as any, fn as any) as unknown as MotionValue<T>

function Drawing({ geo, progress }: { geo: Geo; progress: MotionValue<number> }) {
  // The tangle winds down over the first part...
  const tangle = useTransform(progress, [0.06, 0.58], [1, 0])
  const tangleOpacity = useTransform(progress, [0, 0.5, 0.64], [1, 1, 0])
  const turn = useTransform(progress, [0, 0.6], [0, -220])
  const squash = useTransform(progress, [0.06, 0.6], [1, 0.5])
  // ...the threads pull straight (full wave until about halfway, none by the end)...
  const amp = useTransform(progress, [0.45, 0.82], [1, 0])
  // The tangle is turned and shrunk in code (not with a CSS transform) so the point where the thread leaves it is known.
  const base = useMemo(() => tanglePoints(geo.r), [geo.r])
  const shape = useMix([turn, squash], ([a, k]) => spin(base, a, k))
  const tangleD = useTransform(shape, pathOf)
  const head = useMix([shape, tangle], ([pts, t]) => {
    const h = pointAt(pts, t)
    return [geo.tx + h[0], geo.ty + h[1]] as Pt
  })
  return (
    <svg aria-hidden width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} fill="none" className="pointer-events-none absolute inset-0 z-10">
      <g transform={`translate(${geo.tx} ${geo.ty})`}>
        <motion.g style={{ opacity: tangleOpacity }}>
          <motion.path d={tangleD} stroke={INK} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" strokeOpacity={0.9} style={{ pathLength: tangle }} />
        </motion.g>
      </g>
      {geo.strands.map((s, i) => (
        <Strand key={i} strand={s} seed={i * 2.1} progress={progress} amp={amp} head={i === 0 ? head : undefined} />
      ))}
    </svg>
  )
}

// A thread along the phrase. The first one starts at `head`, the point where the tangle is unwinding, and so stays
// attached to the ball as it turns and shrinks; the others start where they are.
function Strand({ strand, seed, progress, amp, head }: { strand: Strand; seed: number; progress: MotionValue<number>; amp: MotionValue<number>; head?: MotionValue<Pt> }) {
  const fixed = useMotionValue<Pt>(strand.pts[0])
  const from = head ?? fixed
  const built = useMix([amp, from], ([a, h]) => {
    const pts: Pt[] = [h, ...strand.pts.slice(1)]
    const lead = head ? length(pts.slice(0, 2)) : 0
    return { d: thread(pts, a, seed, lead), lead, total: length(pts) || 1 }
  })
  const d = useTransform(built, (b) => b.d)
  // drawn out of the tangle...
  const drawn = useTransform(progress, [strand.window[0], strand.window[1]], [0, 1], { clamp: true })
  // ...then the lead-in is wound back, so only the underline is left
  const wound = useMix([progress, built], ([p, b]) => Math.min(Math.max((p - 0.62) / 0.3, 0), 1) * (b.lead / b.total))
  const pathLength = useMix([drawn, wound], ([a, b]) => Math.max(a - b, 0))
  return <motion.path d={d} stroke={INK} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" strokeOpacity={0.9} style={{ pathLength, pathOffset: wound }} />
}
