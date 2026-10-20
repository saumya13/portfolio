import { useEffect, useState } from 'react'

// Faint vertical margin lines that frame the page, like a layout grid. They fade out as soon as the footer starts
// to show, so the footer runs edge to edge without them. (Plain scroll maths, because the footer's wrapper is
// clipped and fixed content under it makes IntersectionObserver unreliable.)
export function Frame() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const update = () => {
      const footer = document.getElementById('contact')
      if (footer) setHidden(footer.getBoundingClientRect().top < innerHeight - 8)
    }
    update()
    addEventListener('scroll', update, { passive: true })
    addEventListener('resize', update)
    return () => {
      removeEventListener('scroll', update)
      removeEventListener('resize', update)
    }
  }, [])

  return (
    <div aria-hidden className={`pointer-events-none fixed inset-0 z-[60] transition-opacity duration-500 ${hidden ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-y-0 w-px bg-line" style={{ left: 'var(--gutter)' }} />
      <div className="absolute inset-y-0 w-px bg-line" style={{ right: 'var(--gutter)' }} />
    </div>
  )
}
