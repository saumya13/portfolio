import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import type { Photo } from '../content/about'

const ease = [0.22, 1, 0.36, 1] as const

// A single-photo carousel: slides crossfade with a gentle zoom, a small pill of dots sits over the bottom of the
// photo (the active one stretches), and the caption changes underneath. It advances on its own until hovered.
export function PhotoCarousel({ photos }: { photos: Photo[] }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || photos.length < 2) return
    const t = window.setInterval(() => setI((n) => (n + 1) % photos.length), 2500)
    return () => clearInterval(t)
  }, [paused, photos.length])

  const photo = photos[i]
  return (
    <figure onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} className="mx-auto w-full max-w-xl">
      <div className="relative aspect-[6/5] overflow-hidden rounded-[2rem] bg-surface">
        <AnimatePresence initial={false}>
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease }}
            className="absolute inset-0"
            style={photo.src ? undefined : { backgroundImage: photo.tint }}
          >
            {photo.src && <img src={photo.src} alt={photo.caption || `Photo ${i + 1}`} className="size-full object-cover" style={{ objectPosition: photo.position, transform: photo.zoom ? `scale(${photo.zoom})` : undefined, transformOrigin: photo.origin }} />}
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-x-0 bottom-4 flex justify-center">
          <div className="flex items-center gap-2 rounded-full bg-black/35 px-3 py-2.5 backdrop-blur-md">
            {photos.map((p, n) => (
              <button
                key={n}
                onClick={() => setI(n)}
                aria-label={`Show photo ${n + 1}${p.caption ? `: ${p.caption}` : ''}`}
                className={`h-2.5 rounded-full transition-all duration-500 ${n === i ? 'w-7 bg-white' : 'w-2.5 bg-white/55 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </div>
      </div>
      <figcaption className="mt-4 h-6 text-center text-sm text-muted">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="inline-block"
          >
            {photo.caption}
          </motion.span>
        </AnimatePresence>
      </figcaption>
    </figure>
  )
}
