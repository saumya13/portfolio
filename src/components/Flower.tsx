import { animate, motion, useMotionValue, type MotionValue } from 'motion/react'
import { useEffect } from 'react'

// The flower that rides the scroll route, drawn from the supplied SVG: six soft petals with a
// pink gradient and a warm yellow-orange centre. Petal geometry is in the original 400-unit
// artwork's coordinates and scaled down to ~85px wide.
const ANGLES = [0, 60, 120, 180, 240, 300]
const PETAL = 'M0 0 C-70 -30 -75 -140 0 -150 C75 -140 70 -30 0 0Z'
const SIZE = 0.2

export function Flower({
  x,
  y,
  spin,
  delay,
  reduced,
}: {
  x: MotionValue<number>
  y: MotionValue<number>
  spin: MotionValue<number>
  delay: number
  reduced: boolean
}) {
  // Fades and scales in after the headline has landed.
  const appear = useMotionValue(reduced ? 1 : 0)
  useEffect(() => {
    if (reduced) return
    const a = animate(appear, 1, { delay, duration: 0.9, ease: [0.34, 1.4, 0.64, 1] })
    return () => a.stop()
  }, [delay, reduced, appear])

  return (
    <>
      <defs>
        <radialGradient id="flowerPetal" cx="50%" cy="90%" r="95%">
          <stop offset="0%" stopColor="#f48fb1" />
          <stop offset="55%" stopColor="#f8bbd0" />
          <stop offset="100%" stopColor="#fff0f5" />
        </radialGradient>
        <radialGradient id="flowerCentre" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fff59d" />
          <stop offset="60%" stopColor="#fbc02d" />
          <stop offset="100%" stopColor="#e65100" />
        </radialGradient>
      </defs>
      <motion.g style={{ x, y }}>
        <motion.g style={{ rotate: spin, scale: appear, opacity: appear, originX: 0.5, originY: 0.5 }}>
          <g transform={`scale(${SIZE})`}>
            <g fill="url(#flowerPetal)" stroke="#f48fb1" strokeWidth={3} strokeOpacity={0.4}>
              {ANGLES.map((a) => (
                <path key={a} d={PETAL} transform={`rotate(${a})`} />
              ))}
            </g>
            <circle r={32} fill="url(#flowerCentre)" />
          </g>
        </motion.g>
      </motion.g>
    </>
  )
}
