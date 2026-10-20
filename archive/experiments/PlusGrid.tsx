import { useEffect, useRef } from 'react'

const CELL = 36 // distance between plus signs, in px
const REACH = 90 // how far from the pointer plus signs light up, in px
const FADE = 0.93 // how much of the colour is left after each frame
const COLOURS: [number, number, number][] = [
  [240, 155, 207], // pink
  [96, 180, 235], // sky
  [242, 194, 0], // yellow
  [150, 200, 40], // lime
]
const GREY = { light: [196, 196, 195], dark: [62, 62, 62] } as const

// A field of small grey plus signs. Under the pointer they swell and take a colour, then fade back to grey once it
// moves on. It listens on the enclosing section (so tiles above it don't block the pointer) and only animates while
// something is lit.
export function PlusGrid({ className = '' }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = canvas.current
    const host = el?.parentElement
    // Pointer events are taken from the whole section, so tiles and text above the grid don't block them.
    const listener = el?.closest('section') ?? host
    const ctx = el?.getContext('2d')
    if (!el || !host || !listener || !ctx) return

    let cols = 0
    let rows = 0
    let glow = new Float32Array(0)
    let tint = new Uint8Array(0)
    let raf = 0
    let running = false
    let dpr = 1

    // Anything in the section marked data-no-grid (headings, copy) keeps the plus signs off the area it covers.
    const keepClear = Array.from(listener.querySelectorAll<HTMLElement>('[data-no-grid]'))
    const PAD = 12
    const draw = () => {
      const box = el.getBoundingClientRect()
      const clear = keepClear.map((k) => {
        const r = k.getBoundingClientRect()
        return { l: r.left - box.left - PAD, t: r.top - box.top - PAD, r: r.right - box.left + PAD, b: r.bottom - box.top + PAD }
      })
      const dark = document.documentElement.dataset.theme === 'dark'
      const grey = dark ? GREY.dark : GREY.light
      ctx.clearRect(0, 0, cols * CELL, rows * CELL)
      ctx.lineWidth = 1.4
      ctx.lineCap = 'round'
      let lit = false
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c
          const g = glow[i]
          if (g > 0.01) {
            lit = true
            glow[i] = g * FADE
          } else glow[i] = 0
          const x = c * CELL + CELL / 2
          const y = r * CELL + CELL / 2
          if (clear.some((k) => x > k.l && x < k.r && y > k.t && y < k.b)) {
            glow[i] = 0
            continue
          }
          const col = COLOURS[tint[i]]
          const mix = (k: number) => Math.round(grey[k] + (col[k] - grey[k]) * g)
          ctx.strokeStyle = `rgb(${mix(0)} ${mix(1)} ${mix(2)})`
          const s = 4 + g * 4
          ctx.beginPath()
          ctx.moveTo(x - s, y)
          ctx.lineTo(x + s, y)
          ctx.moveTo(x, y - s)
          ctx.lineTo(x, y + s)
          ctx.stroke()
        }
      }
      if (lit) raf = requestAnimationFrame(draw)
      else running = false
    }
    const start = () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(draw)
    }

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2)
      const w = host.clientWidth
      const h = host.clientHeight
      cols = Math.ceil(w / CELL)
      rows = Math.ceil(h / CELL)
      el.width = cols * CELL * dpr
      el.height = rows * CELL * dpr
      el.style.width = `${cols * CELL}px`
      el.style.height = `${rows * CELL}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      glow = new Float32Array(cols * rows)
      tint = new Uint8Array(cols * rows)
      running = false
      cancelAnimationFrame(raf)
      draw()
    }

    const onMove = (e: PointerEvent) => {
      const box = el.getBoundingClientRect()
      const px = e.clientX - box.left
      const py = e.clientY - box.top
      const c0 = Math.max(0, Math.floor((px - REACH) / CELL))
      const c1 = Math.min(cols - 1, Math.ceil((px + REACH) / CELL))
      const r0 = Math.max(0, Math.floor((py - REACH) / CELL))
      const r1 = Math.min(rows - 1, Math.ceil((py + REACH) / CELL))
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const d = Math.hypot(c * CELL + CELL / 2 - px, r * CELL + CELL / 2 - py)
          if (d > REACH) continue
          const i = r * cols + c
          const g = 1 - d / REACH
          if (glow[i] < 0.05) tint[i] = Math.floor(Math.random() * COLOURS.length)
          if (g > glow[i]) glow[i] = g
        }
      }
      start()
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)
    keepClear.forEach((k) => ro.observe(k))
    listener.addEventListener('pointermove', onMove)
    // Repaint when the theme changes so the grey follows it.
    const mo = new MutationObserver(() => draw())
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
      listener.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvas}
      aria-hidden
      className={`pointer-events-none absolute left-0 top-0 ${className}`}
      style={{ maskImage: 'linear-gradient(to bottom, transparent, #000 90px, #000 calc(100% - 90px), transparent)' }}
    />
  )
}
