import { motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const

// A hand-drawn crayon scribble in lime under a phrase: a thin tapered tail, a quick zig-zag, then a long bold
// stroke that tapers to a point. The edges are roughened and grain punches small gaps into the colour, so it
// reads as wax crayon. It wipes in from the left when the phrase scrolls into view.
export function Scribble({ children }: { children: string }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      {children}
      <motion.span
        aria-hidden
        className="absolute -bottom-[0.45em] left-[-3%] block h-[0.65em] w-[106%]"
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1.1, ease, delay: 0.5 }}
      >
        <svg viewBox="0 0 400 44" preserveAspectRatio="none" className="size-full overflow-visible">
          <defs>
            <filter id="scribbleCrayon" x="-4%" y="-40%" width="108%" height="180%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="6" result="warp" />
              <feDisplacementMap in="SourceGraphic" in2="warp" scale="5" xChannelSelector="R" yChannelSelector="G" result="rough" />
              <feTurbulence type="fractalNoise" baseFrequency="1.1 0.6" numOctaves="3" seed="12" result="grain" />
              <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.8 0 0 0 -0.55" result="speckle" />
              <feComposite in="rough" in2="speckle" operator="in" />
            </filter>
          </defs>
          <g fill="#c9f25a" filter="url(#scribbleCrayon)">
            {/* thin tapered tail */}
            <path d="M0 37 C40 29 100 23 168 21 L168 24 C100 26 42 32 0 37Z" />
            {/* zig-zag: top stroke, then back down-left */}
            <path d="M104 20 L226 14 L227 18 L110 23Z" />
            <path d="M226 14 L142 29 L146 33 L230 18Z" />
            {/* long bold stroke, tapering at the right */}
            <path d="M142 30 C214 27 320 18 398 11 C398 14 397 15 395 16 C320 24 214 33 146 36Z" />
          </g>
        </svg>
      </motion.span>
    </span>
  )
}
