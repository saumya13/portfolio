import { useEffect, useId, useRef, useState, type CSSProperties, type MouseEvent, type RefObject } from 'react'

/**
 * CatAvatar (rose): a small nav-bar avatar.
 * - Pupils follow the pointer when it comes within `trackRadius` px (mouse/trackpad only).
 * - Click (or Enter/Space) makes the cat happy for `happyMs` ms.
 * - Blinks now and then while idle. Respects prefers-reduced-motion.
 */

// How far the pupils can travel inside the eye (SVG units, viewBox is 100×100).
const PUPIL_MAX_X = 3.2
const PUPIL_MAX_Y = 1.6

// Almond, half-lidded eye. m = 1 for the left eye, -1 mirrors it for the right.
const eyePath = (m: number) =>
  `M ${-8 * m} -1.6 Q ${-1 * m} -4.4 ${8 * m} 0.6 Q ${6.6 * m} 5 0 5.4 Q ${-7 * m} 5 ${-8 * m} -1.6 Z`

const HEAD =
  'M50 88 C30 88 15 78 15 60 C15 48 18 40 23 34 L25.5 15.5 C26 13 28.5 12.4 30.4 13.8 L41 23.5 C44 22.7 47 22.4 50 22.4 C53 22.4 56 22.7 59 23.5 L69.6 13.8 C71.5 12.4 74 13 74.5 15.5 L77 34 C82 40 85 48 85 60 C85 78 70 88 50 88 Z'

const EYES = [
  { x: 36, y: 61, m: 1 },
  { x: 64, y: 61, m: -1 },
]

// Rose colorway: black cat, yellow eyes, deep pink circle.
const T = {
  bg: '#eaa3b3',
  fur: ['#3d3a42', '#1e1b21', '#0d0b0f'],
  rim: ['#ffd9e1', '#ffc2cf', '#ffc2cf', '#ffd9e1'],
  glow: 0.5,
  line: 0.4,
  shadow: 0.3,
  blush: '#ff9db2',
}

type Props = {
  /** Whether clicking the cat gives it happy eyes (default). Turn off for a cat that should keep a straight face. */
  happyOnClick?: boolean
  /** Just the cat, with no disc behind it (for placing it in a scene). */
  bare?: boolean
  /** An element for the cat to keep an eye on whenever the pointer isn't near (e.g. a bee flying about). */
  watch?: RefObject<HTMLElement | null>
  /** Bump this number to make the cat happy from outside (e.g. when the name next to it is clicked). */
  pet?: number
  /** The colourway. There is one for now: black cat, yellow eyes, deep pink circle. */
  theme?: 'rose'
  size?: number
  label?: string
  happyMs?: number
  trackRadius?: number
  background?: string
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  /** Called on a right-click / long-press on the cat. */
  onContextMenu?: (e: MouseEvent<HTMLButtonElement>) => void
  className?: string
}

export function CatAvatar({
  pet = 0,
  happyOnClick = true,
  bare = false,
  watch,
  size = 36,
  label = 'Pet the cat',
  happyMs = 1600,
  trackRadius = 220,
  background = T.bg,
  onClick,
  onContextMenu,
  className = '',
}: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const id = (name: string) => `cat-${uid}-${name}`

  const rootRef = useRef<HTMLButtonElement>(null)
  const pupilRefs = useRef<(SVGEllipseElement | null)[]>([])
  const happyTimer = useRef(0)
  const [happy, setHappy] = useState(false)
  const [blinking, setBlinking] = useState(false)

  // Pointer tracking: writes transforms straight to the pupils, no re-renders. With `watch`, the cat looks at that element
  // whenever the pointer isn't close.
  useEffect(() => {
    const root = rootRef.current
    if (!root || typeof window === 'undefined') return
    const fine = window.matchMedia('(pointer: fine)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine && !(watch && !calm)) return

    let frame = 0
    let pointer: { x: number; y: number } | null = null

    const setPupils = (value: string) => pupilRefs.current.forEach((p) => p && (p.style.transform = value))

    const update = () => {
      frame = 0
      const r = root.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height * 0.61 // eye line
      let target: { x: number; y: number } | null = null
      let watching = false
      if (pointer && Math.hypot(pointer.x - cx, pointer.y - cy) <= trackRadius) target = pointer
      else if (watch?.current && !calm) {
        const w = watch.current.getBoundingClientRect()
        target = { x: w.left + w.width / 2, y: w.top + w.height / 2 }
        watching = true
      }
      if (target) {
        const dx = target.x - cx
        const dy = target.y - cy
        const dist = Math.hypot(dx, dy)
        const reach = Math.min(dist / Math.max(r.width * 1.5, 1), 1)
        const angle = Math.atan2(dy, dx)
        const tx = Math.cos(angle) * PUPIL_MAX_X * reach
        const ty = Math.sin(angle) * PUPIL_MAX_Y * reach
        const widen = watching ? 1 : 1 + (1 - dist / trackRadius) * 0.9 // pupils dilate as you get close
        setPupils(`translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scaleX(${widen.toFixed(2)})`)
      } else setPupils('')
      // keep following a moving thing (the bee) frame by frame
      if (watch && !calm) frame = requestAnimationFrame(update)
    }

    const onMove = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY }
      if (!frame) frame = requestAnimationFrame(update)
    }
    const onLeave = () => {
      pointer = null
      if (!frame) frame = requestAnimationFrame(update)
    }

    if (fine) {
      window.addEventListener('pointermove', onMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onLeave)
    }
    if (watch && !calm) frame = requestAnimationFrame(update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [trackRadius, watch])

  // Idle blinking at random intervals.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let t1 = 0
    let t2 = 0
    const schedule = () => {
      t1 = window.setTimeout(() => {
        setBlinking(true)
        t2 = window.setTimeout(() => {
          setBlinking(false)
          schedule()
        }, 140)
      }, 2800 + Math.random() * 4200)
    }
    schedule()
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  useEffect(() => () => clearTimeout(happyTimer.current), [])

  const makeHappy = () => {
    clearTimeout(happyTimer.current)
    setHappy(true)
    happyTimer.current = window.setTimeout(() => setHappy(false), happyMs)
  }
  // Happy when `pet` changes (not on the first render).
  const firstPet = useRef(true)
  useEffect(() => {
    if (firstPet.current) {
      firstPet.current = false
      return
    }
    makeHappy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet])

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (happyOnClick) makeHappy()
    onClick?.(e)
  }

  const state = happy ? 'happy' : blinking ? 'blink' : 'idle'

  return (
    <button
      ref={rootRef}
      type="button"
      className={`cat-avatar ${className}`}
      data-state={state}
      aria-label={label}
      onClick={handleClick}
      onContextMenu={onContextMenu}
      style={{ width: size, height: size, '--cat-bg': bare ? 'transparent' : background, ...(bare ? { borderRadius: 0, overflow: 'visible' } : null) } as CSSProperties}
    >
      <style>{CSS}</style>
      <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={id('rim')} x1="0" y1="0" x2="1" y2="0.2">
            {T.rim.map((c, i) => (
              <stop key={i} offset={[0, 0.45, 0.62, 1][i]} stopColor={c} />
            ))}
          </linearGradient>
          <radialGradient id={id('fur')} cx="0.5" cy="0.28" r="0.8">
            <stop offset="0" stopColor={T.fur[0]} />
            <stop offset="0.55" stopColor={T.fur[1]} />
            <stop offset="1" stopColor={T.fur[2]} />
          </radialGradient>
          <radialGradient id={id('iris')} cx="0.5" cy="0.6" r="0.7">
            <stop offset="0" stopColor="#fff2ad" />
            <stop offset="0.5" stopColor="#ffc53d" />
            <stop offset="1" stopColor="#e5850f" />
          </radialGradient>
          <filter id={id('soft')} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
          <filter id={id('glow')} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
          {EYES.map((e, i) => (
            <clipPath id={id(`eye${i}`)} key={i}>
              <path d={eyePath(e.m)} />
            </clipPath>
          ))}
        </defs>

        <g className="cat-head">
          {/* soft drop shadow (light backgrounds) */}
          <path d={HEAD} fill="#2a1a12" opacity={T.shadow} transform="translate(0 3.5)" filter={`url(#${id('soft')})`} />
          {/* rim glow */}
          <path d={HEAD} fill="none" stroke={`url(#${id('rim')})`} strokeWidth="4" opacity={T.glow} filter={`url(#${id('soft')})`} />
          <path d={HEAD} fill={`url(#${id('fur')})`} />
          <path d={HEAD} fill="none" stroke={`url(#${id('rim')})`} strokeWidth="1" opacity={T.line} />

          {/* open eyes */}
          <g className="cat-eyes-open">
            {EYES.map((e, i) => (
              <g key={i} transform={`translate(${e.x} ${e.y}) scale(1.3)`}>
                <g className="cat-eye">
                  <path d={eyePath(e.m)} fill="#ffb02e" opacity="0.55" filter={`url(#${id('glow')})`} />
                  <path d={eyePath(e.m)} fill={`url(#${id('iris')})`} />
                  <g clipPath={`url(#${id(`eye${i}`)})`}>
                    <ellipse
                      ref={(el) => {
                        pupilRefs.current[i] = el
                      }}
                      className="cat-pupil"
                      cx="0"
                      cy="0.6"
                      rx="1.25"
                      ry="4.6"
                      fill="#1b1206"
                    />
                  </g>
                </g>
              </g>
            ))}
          </g>

          {/* happy eyes */}
          <g className="cat-eyes-happy">
            {EYES.map((e, i) => (
              <g key={i} transform={`translate(${e.x} ${e.y}) scale(1.3)`}>
                <path d="M -6.5 2.6 Q 0 -5 6.5 2.6" fill="none" stroke="#ffb02e" strokeWidth="3.4" strokeLinecap="round" opacity="0.6" filter={`url(#${id('glow')})`} />
                <path d="M -6.5 2.6 Q 0 -5 6.5 2.6" fill="none" stroke="#ffc847" strokeWidth="2.6" strokeLinecap="round" />
              </g>
            ))}
            <ellipse cx="25.5" cy="70" rx="5" ry="2.4" fill={T.blush} opacity="0.45" />
            <ellipse cx="74.5" cy="70" rx="5" ry="2.4" fill={T.blush} opacity="0.45" />
          </g>
        </g>
      </svg>
    </button>
  )
}

const CSS = `
.cat-avatar{appearance:none;border:0;padding:0;margin:0;display:inline-grid;place-items:center;
  border-radius:50%;background:var(--cat-bg);overflow:hidden;cursor:pointer;flex:none;
  -webkit-tap-highlight-color:transparent;transition:transform .15s ease}
.cat-avatar svg{width:100%;height:100%;display:block}
.cat-avatar:active{transform:scale(.94)}
.cat-avatar:focus-visible{outline:2px solid #ffc53d;outline-offset:2px}
.cat-avatar .cat-head{transform-box:fill-box;transform-origin:50% 100%}
.cat-avatar .cat-eye,.cat-avatar .cat-eyes-open,.cat-avatar .cat-eyes-happy{transform-box:fill-box;transform-origin:center}
.cat-avatar .cat-pupil{transform-box:fill-box;transform-origin:center;transition:transform .14s ease-out}
.cat-avatar .cat-eye{transition:transform .09s ease-in-out}
.cat-avatar .cat-eyes-open{transition:transform .18s ease,opacity .12s ease}
.cat-avatar .cat-eyes-happy{opacity:0;transform:scale(.6) translateY(2px);transition:transform .25s cubic-bezier(.3,1.6,.5,1),opacity .15s ease}
.cat-avatar[data-state="blink"] .cat-eye{transform:scaleY(.08)}
.cat-avatar[data-state="happy"] .cat-eyes-open{opacity:0;transform:scaleY(0)}
.cat-avatar[data-state="happy"] .cat-eyes-happy{opacity:1;transform:none}
.cat-avatar[data-state="happy"] .cat-head{animation:cat-hop .5s cubic-bezier(.3,1.4,.5,1)}
@keyframes cat-hop{0%{transform:none}35%{transform:translateY(-5%) scale(1.03,.97)}100%{transform:none}}
@media (prefers-reduced-motion:reduce){
  .cat-avatar *{transition:none!important;animation:none!important}
}
`
