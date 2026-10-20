import { useCallback, useEffect, useState, type MouseEvent } from 'react'

export type Theme = 'light' | 'dark'

const read = (): Theme =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(read)

  useEffect(() => {
    const obs = new MutationObserver(() => setTheme(read()))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    const mq = matchMedia('(prefers-color-scheme: dark)')
    const onSystem = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem('theme')) return
      } catch {}
      document.documentElement.dataset.theme = e.matches ? 'dark' : 'light'
    }
    mq.addEventListener('change', onSystem)
    return () => {
      obs.disconnect()
      mq.removeEventListener('change', onSystem)
    }
  }, [])

  // The new theme is revealed as a circle growing out of the button that was clicked (the top right of the page),
  // using the View Transitions API. Browsers without it, or visitors who prefer reduced motion, just switch.
  const toggle = useCallback((e?: MouseEvent<HTMLElement>) => {
    const next: Theme = read() === 'dark' ? 'light' : 'dark'
    const apply = () => {
      document.documentElement.dataset.theme = next
      try {
        localStorage.setItem('theme', next)
      } catch {}
    }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduced) return apply()

    const box = e?.currentTarget.getBoundingClientRect()
    const x = box ? box.left + box.width / 2 : innerWidth
    const y = box ? box.top + box.height / 2 : 0
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    // The circle is the transition, so the body's own colour fade is switched off while it runs.
    const root = document.documentElement
    root.classList.add('theme-switching')
    const transition = document.startViewTransition(apply)
    transition.finished.finally(() => root.classList.remove('theme-switching'))
    transition.ready
      .then(() =>
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 900, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
        ),
      )
      .catch(() => {})
  }, [])

  return { theme, toggle }
}
