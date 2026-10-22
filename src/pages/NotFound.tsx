import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CatAvatar } from '../components/CatAvatar'

const ease = [0.22, 1, 0.36, 1] as const

// Shown for any address that doesn't exist: the site's cat, searching, with a message and a way home.
export default function NotFound() {
  const { pathname } = useLocation()
  // Clicking the cat (left or right) makes it meow ("Meooowww?"): a speech bubble pops up for a moment, then goes away. Nothing shows until then.
  const [meow, setMeow] = useState<string | null>(null)
  const timer = useRef(0)
  const doMeow = (text: string) => {
    clearTimeout(timer.current)
    setMeow(text)
    timer.current = window.setTimeout(() => setMeow(null), 1800)
  }
  useEffect(() => () => clearTimeout(timer.current), [])
  return (
    <main className="relative z-10 bg-paper px-[calc(var(--gutter)+1.25rem)] pb-32 md:pb-44">
      <div className="mx-auto flex min-h-[100svh] max-w-2xl flex-col items-center justify-center pt-24 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="relative">
          {/* a little speech bubble that only appears when the cat is clicked */}
          <AnimatePresence>
            {meow && (
              <motion.span
                key={meow}
                initial={{ opacity: 0, scale: 0.6, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                transition={{ duration: 0.3, ease: [0.34, 1.4, 0.64, 1] }}
                className="label absolute -right-24 -top-3 whitespace-nowrap rounded-2xl rounded-bl-sm border border-ink/15 bg-surface px-3 py-1.5 text-ink"
              >
                {meow}
              </motion.span>
            )}
          </AnimatePresence>
          {/* the cat keeps its eyes on your pointer wherever it is on the page, and keeps a straight face when clicked (it meows instead) */}
          <CatAvatar bare size={170} trackRadius={2000} happyOnClick={false} onClick={() => doMeow('Meooowww?')} onContextMenu={(e) => { e.preventDefault(); doMeow('Meooowww?') }} />
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="eyebrow mt-8 text-ink">
          (404)
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.9, ease }}
          className="mt-3 font-arima text-4xl font-medium leading-[1.1] tracking-tight md:text-6xl"
        >
          This page wandered off.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease }}
          className="mt-5 max-w-md text-base leading-relaxed text-ink/70 md:text-lg"
        >
          The cat has looked everywhere for{' '}
          <span className="break-all rounded bg-surface px-1.5 py-0.5 font-medium text-ink">{pathname}</span> and found nothing. Maybe the link is old, or
          mistyped.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.9, ease }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Link to="/" className="label !text-[1rem] rounded-lg bg-pink px-5 py-3 leading-none text-[#111] transition-transform duration-200 hover:-translate-y-0.5">
            Take me home
          </Link>
          <Link to="/#work" className="label !text-[1rem] rounded-lg border border-ink/20 px-5 py-3 leading-none text-ink transition-colors duration-200 hover:bg-ink hover:text-paper">
            See my work
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
