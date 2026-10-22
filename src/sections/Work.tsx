import { ScriptText } from '../components/ScriptText'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef, useState, type ElementType } from 'react'
import { Link } from 'react-router-dom'
import { ScissorLine } from '../components/ScissorLine'
import { WorkArt } from '../components/WorkArt'
import { projects, work, type Project } from '../content/projects'

const ease = [0.22, 1, 0.36, 1] as const
// A pill that replaces the mouse cursor while it is over a tile. It trails the pointer with a light spring.
function CursorLabel({ x, y, visible }: { x: ReturnType<typeof useMotionValue<number>>; y: ReturnType<typeof useMotionValue<number>>; visible: boolean }) {
  const sx = useSpring(x, { stiffness: 500, damping: 38, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 38, mass: 0.4 })
  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden [@media(hover:hover)]:block"
    >
      <motion.span
        initial={false}
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6 }}
        transition={{ duration: 0.25, ease }}
        className="label -translate-x-1/2 -translate-y-1/2 block whitespace-nowrap rounded-lg border border-ink/15 bg-paper/90 px-3.5 py-2 text-ink shadow-[0_6px_20px_-8px_rgba(0,0,0,0.25)] backdrop-blur"
      >
        Open project
      </motion.span>
    </motion.div>
  )
}

// One project card: an illustration on a soft grey tray, then the title, an arrow and a short description.
function Tile({ project, index }: { project: Project; index: number }) {
  const { title, blurb, art, image, video, tint, status } = project
  const link = status === 'case-study'
  // The first project runs the full width of the grid.
  const wide = index === 0
  const Wrapper: ElementType = link ? Link : 'div'
  const shotRef = useRef<HTMLDivElement>(null)
  // On hover the shot grows by half of the padding on every side, so the gap stays equal all round.
  const zoom = (on: boolean) => {
    const el = shotRef.current
    if (!el) return
    const d = parseFloat(getComputedStyle(el.parentElement!).paddingLeft) / 2
    el.style.transform = on ? `scale(${1 + (2 * d) / el.offsetWidth}, ${1 + (2 * d) / el.offsetHeight})` : ''
  }
  
  return (
    <div className={wide ? 'md:col-span-2' : 'h-full'}>
      <motion.div
        className="h-full"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.8, ease, delay: (index % 2) * 0.1 }}
      >
      <Wrapper
        {...(link ? { to: `/work/${project.slug}`, 'aria-label': `View case study: ${title}` } : {})}
        className={`group block h-full ${link ? '[@media(hover:hover)]:cursor-none' : ''}`}
      >
        <div className="h-full rounded-[1.75rem] bg-ink/[0.04] p-2 pb-4 md:p-2.5 md:pb-5">
          <div
            className={`relative overflow-hidden rounded-[1.4rem] border border-ink/15`}
            style={{ backgroundColor: tint }}
            onMouseEnter={() => zoom(true)}
            onMouseLeave={() => zoom(false)}
          >
            <div className="p-3 md:p-4">
              {/* The framed shot zooms in on hover; the box clips it. */}
              <div ref={shotRef} className="relative w-full overflow-hidden rounded-xl max-md:aspect-[5/4] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] transition-transform duration-700 ease-out">
                {video && image ? (
                  <video
                    src={video}
                    poster={image}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="block w-full max-md:h-full max-md:object-cover max-md:object-left-top"
                    onMouseEnter={(e) => void e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause()
                      e.currentTarget.currentTime = 0
                    }}
                  />
                ) : image ? (
                  <img src={image} alt={`${title} screenshot`} loading="lazy" className="block w-full max-md:h-full max-md:object-cover max-md:object-left-top" />
                ) : (
                  <div className="aspect-[1600/878] w-full bg-paper">
                    <WorkArt art={art} />
                  </div>
                )}
              </div>
            </div>
          </div>

        <div className="relative mt-4 flex items-start justify-between gap-6 pl-7 pr-4">
          <span
            aria-hidden
            className="absolute left-2 top-1.5 size-3 scale-0 rounded-full bg-[#e8532f] transition-transform duration-300 group-hover:scale-100"
          />
          <h3 className="text-lg font-medium leading-snug tracking-[-0.01em] md:text-xl">{title}</h3>
          {link && (
            <svg viewBox="0 0 24 24" aria-hidden className="mt-0.5 size-5 shrink-0 fill-none stroke-ink/70 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 18 18 6M8 6h10v10" />
            </svg>
          )}
        </div>
        <p className={`mt-1.5 ${wide ? '' : 'max-w-lg'} pl-7 pr-4 text-sm leading-relaxed text-muted`}>{blurb}</p>
        </div>
      </Wrapper>
      </motion.div>
    </div>
  )
}

export function Work() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [over, setOver] = useState(false)
  const ref = useRef<HTMLElement>(null)

  // The heading fades in as the section scrolls into view.
  // (The pastel pink wash that used to sit behind this section is parked in components/WorkWash.tsx.)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 25%'] })
  const headOpacity = useTransform(scrollYProgress, [0.55, 1], [0, 1])

  return (
    <section
      ref={ref}
      id="work"
      className="relative z-20 overflow-x-clip px-[calc(var(--gutter)+1.25rem)] pb-16 md:pb-24"
      onPointerMove={(e) => {
        x.set(e.clientX)
        y.set(e.clientY)
        setOver(!!(e.target as HTMLElement).closest('a[href*="/work/"]'))
      }}
      onPointerLeave={() => setOver(false)}
    >
      <ScissorLine className="mt-8 md:mt-14" />

      <motion.div style={{ opacity: headOpacity }} className="relative mx-auto mt-6 max-w-2xl text-center md:mt-8">
        <p className="eyebrow text-ink/60">({work.label})</p>
        <h2 className="mt-4 font-arima text-5xl font-medium leading-none tracking-tight md:text-7xl"><ScriptText text={work.heading} swap={{ Work: 'o' }} /></h2>
      </motion.div>

      <div className="relative mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-x-6 gap-y-8 md:mt-12 md:grid-cols-2 md:gap-x-8 md:gap-y-10">
        {projects.map((p, i) => (
          <Tile key={`${p.slug}-${i}`} project={p} index={i} />
        ))}
      </div>

      <CursorLabel x={x} y={y} visible={over} />
    </section>
  )
}
