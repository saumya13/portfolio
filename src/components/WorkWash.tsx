import { motion, useTransform, type MotionValue } from 'motion/react'

// PARKED: the pastel pink/yellow wash that used to sit behind the "My work" section. It isn't used right now.
//
// To bring it back, in sections/Work.tsx:
//   1. import { WorkWash } from '../components/WorkWash'
//   2. get `scrollYProgress` from the section's useScroll (already there) and render, as the first child of <section>:
//        <WorkWash progress={scrollYProgress} />
//   3. the section also had `overflow-x-clip` and tiles on `bg-paper` (they are `bg-surface` now).

// Soft wavy edge: translucent layers of the page colour stacked over the pastel wash, so the colour
// seems to flow up beneath the "How I think" page.
// `flip` turns it upside down and pins it to the bottom, for the end of the section.
export function WaveEdge({ flip = false }: { flip?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 1440 160" preserveAspectRatio="none" className={`pointer-events-none absolute inset-x-0 h-24 w-full md:h-40 ${flip ? 'bottom-0 rotate-180' : 'top-0'}`}>
      <path fill="var(--paper)" fillOpacity="0.45" d="M0 70C200 150 380 110 560 80C760 45 900 30 1100 70C1260 100 1360 90 1440 50V0H0Z" />
      <path fill="var(--paper)" fillOpacity="0.55" d="M0 40C180 110 340 90 520 62C720 30 860 70 1040 92C1220 112 1340 70 1440 30V0H0Z" />
      <path fill="var(--paper)" d="M0 30C200 90 360 60 560 50C780 40 920 8 1120 36C1280 58 1370 50 1440 20V0H0Z" />
    </svg>
  )
}


// As the section scrolls in, the wash rises past its own top edge, so the colour swells up over the white space above
// it, as if engulfing the previous page. The wave rides on top of it. It stays inside the page's margin lines.
export function WorkWash({ progress }: { progress: MotionValue<number> }) {
  const rise = useTransform(progress, [0, 1], [0, -150])
  const swell = useTransform(progress, [0, 1], [1, 1.5])
  return (
    <motion.div aria-hidden style={{ top: rise, left: 'var(--gutter)', right: 'var(--gutter)' }} className="pointer-events-none absolute bottom-0">
      <div
        className="absolute inset-0 opacity-90 dark:opacity-30"
        style={{
          backgroundColor: '#f7dcea',
          backgroundImage:
            'radial-gradient(70% 60% at 0% 80%, #fdf6c4 0%, transparent 75%), radial-gradient(60% 50% at 20% 10%, #fdf3d0 0%, transparent 75%), radial-gradient(60% 55% at 85% 60%, #f6cfe3 0%, transparent 75%)',
        }}
      />
      <motion.div style={{ scaleY: swell, transformOrigin: 'top' }} className="absolute inset-x-0 top-0">
        <WaveEdge />
      </motion.div>
      <WaveEdge flip />
    </motion.div>
  )
}
