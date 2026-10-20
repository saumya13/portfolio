import { lazy, Suspense, useEffect, useState, type RefObject } from 'react'
const fontUrl = '/fonts/Bonny-Medium.otf'
import { useTheme } from './theme'

// The WebGL canvas (three.js and friends) is big, so it only loads the first time the name is hovered.
const FluidGlass = lazy(() => import('./FluidGlass'))

const BOX = { w: 240, h: 96 } // size of the canvas laid over the name, in px
const VIEW_HEIGHT = 2.106 // world units the canvas shows from top to bottom at the depth the text sits at
const COLOURS = {
  light: { text: '#111111', background: '#fafafa' },
  dark: { text: '#f2f2f1', background: '#0c0c0c' },
}

// A glass lens over the name in the nav. The name is drawn again inside a transparent WebGL canvas, exactly over the
// real one, so the lens that follows the pointer can bend it. Only the lens itself is drawn; the plain HTML name stays
// visible around it.
export function NavGlass({ open, name, target, onClick }: { open: boolean; name: string; target: RefObject<HTMLElement | null>; onClick: () => void }) {
  const { theme } = useTheme()
  // Nothing is mounted (or downloaded) until the first hover; after that the canvas stays, paused while closed.
  const [seen, setSeen] = useState(false)
  const [fontPx, setFontPx] = useState(24)
  useEffect(() => {
    if (!open) return
    setSeen(true)
    if (target.current) setFontPx(parseFloat(getComputedStyle(target.current).fontSize) || 24)
  }, [open, target])

  return (
    <div
      aria-hidden
      onClick={onClick}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      style={{ width: BOX.w, height: BOX.h, pointerEvents: open ? 'auto' : 'none', opacity: open ? 1 : 0, transition: 'opacity 0.15s' }}
    >
      <Suspense fallback={null}>
        {seen && (
          <FluidGlass
            text={name}
            font={fontUrl}
            fontSize={(fontPx / BOX.h) * VIEW_HEIGHT}
            letterSpacing={0}
            textColor={COLOURS[theme].text}
            backgroundColor={COLOURS[theme].background}
            overlay
            active={open}
            lensProps={{ scale: 0.3, ior: 1.2, thickness: 4 }}
          />
        )}
      </Suspense>
    </div>
  )
}
