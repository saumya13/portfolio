import Lenis from 'lenis'
import { cancelFrame, frame } from 'motion/react'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const LenisContext = createContext<Lenis | null>(null)

export const useLenis = () => useContext(LenisContext)

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const instance = new Lenis({ autoRaf: false, lerp: 0.085, wheelMultiplier: 0.9 })
    const update = ({ timestamp }: { timestamp: number }) => instance.raf(timestamp)
    frame.update(update, true)
    setLenis(instance)
    return () => {
      cancelFrame(update)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
