import { useRef } from 'react'
import { ScrollPath } from '../components/ScrollPath'
import { Hero } from '../sections/Hero'
import { Intro } from '../sections/Intro'
// import { HowIThink } from '../sections/HowIThink' // parked for now: re-add the import and the line below to bring it back
import { Work } from '../sections/Work'

export default function Home() {
  const stack = useRef<HTMLDivElement>(null)
  return (
    <main>
      <div ref={stack} className="relative z-10 bg-paper">
        <Hero />
        <Intro />
        {/* <HowIThink /> */}
        <ScrollPath container={stack} />
      </div>
      <Work />
    </main>
  )
}
