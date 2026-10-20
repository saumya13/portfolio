import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Frame } from './Frame'
import { Nav } from './Nav'
import { SmoothScroll, useLenis } from './SmoothScroll'

// On every route change, jump to the hash target if there is one, otherwise back to the top.
function ScrollOnNavigate() {
  const { pathname, hash } = useLocation()
  const lenis = useLenis()
  useEffect(() => {
    const el = hash ? document.querySelector(hash) : null
    const t = window.setTimeout(() => {
      if (el) {
        if (lenis) lenis.scrollTo(el as HTMLElement, { duration: 1.4 })
        else el.scrollIntoView({ behavior: 'smooth' })
      } else if (lenis) lenis.scrollTo(0, { immediate: true })
      else window.scrollTo(0, 0)
    }, 50)
    return () => clearTimeout(t)
  }, [pathname, hash, lenis])
  return null
}

export function Layout() {
  return (
    <SmoothScroll>
      <ScrollOnNavigate />
      <Frame />
      <Nav />
      <Outlet />
      <Footer />
    </SmoothScroll>
  )
}
