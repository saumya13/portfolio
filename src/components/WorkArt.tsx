import type { ProjectArt } from '../content/projects'

// Placeholder illustrations for the project cards, drawn with plain divs. Each fills a 4:3 frame.

function Arena() {
  const bar = 'h-2 rounded-full'
  return (
    <div className="absolute inset-0 grid place-items-center bg-[#fde6f1]">
      <div className="flex items-center gap-4">
        {[
          { name: 'Model A', w: ['78%', '64%', '90%'], tint: 'bg-pink' },
          { name: 'Model B', w: ['58%', '82%', '70%'], tint: 'bg-sky' },
        ].map((m, i) => (
          <div key={m.name} className={`w-40 rounded-2xl bg-white p-5 shadow-[0_14px_30px_-18px_rgba(0,0,0,0.4)] transition-transform duration-500 md:w-56 ${i ? 'group-hover:translate-x-1 group-hover:-rotate-2' : 'group-hover:-translate-x-1 group-hover:rotate-2'}`}>
            <p className="label mb-3 text-[#111]/60">{m.name}</p>
            <div className="space-y-2.5">
              {m.w.map((w) => (
                <div key={w} className="h-2 rounded-full bg-[#111]/8">
                  <div className={`${bar} ${m.tint}`} style={{ width: w }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <span className="label absolute rounded-full bg-[#111] px-3 py-1.5 text-white">vs</span>
    </div>
  )
}

function Cook() {
  const chips = [
    ['Tomato', 'bg-[#ffb4a2]'],
    ['Eggs', 'bg-[#ffe699]'],
    ['Basil', 'bg-[#bfe6a8]'],
    ['Pasta', 'bg-[#f4d9b0]'],
  ]
  return (
    <div className="absolute inset-0 grid place-items-center bg-[#fff1c9]">
      <div className="w-[78%] max-w-md rounded-3xl bg-white p-6 shadow-[0_14px_30px_-18px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:-translate-y-1">
        <p className="label mb-3 text-[#111]/60">In your fridge</p>
        <div className="flex flex-wrap gap-2">
          {chips.map(([name, tint]) => (
            <span key={name} className={`${tint} rounded-full px-3 py-1.5 text-xs font-medium text-[#111]`}>
              {name}
            </span>
          ))}
        </div>
        <div className="mt-5 border-t border-dashed border-[#111]/20 pt-4">
          <p className="font-display text-2xl leading-none text-[#111]">Tonight: tomato pasta</p>
          <p className="mt-1.5 text-xs text-[#111]/60">20 minutes · 4 ingredients</p>
        </div>
      </div>
    </div>
  )
}

function Dashboard() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[#dff0fb]">
      <div className="w-[82%] max-w-md space-y-3 rounded-3xl bg-white p-4 shadow-[0_14px_30px_-18px_rgba(0,0,0,0.4)]">
        <div className="grid grid-cols-3 gap-3 blur-[3px]">
          {['bg-sky', 'bg-yellow', 'bg-pink'].map((t) => (
            <div key={t} className={`${t} h-12 rounded-xl`} />
          ))}
        </div>
        <div className="flex h-24 items-end gap-2 rounded-xl bg-[#111]/5 p-3 blur-[3px]">
          {[40, 70, 52, 88, 60, 76, 46].map((h, i) => (
            <div key={i} className="flex-1 rounded-t bg-[#111]/55" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <span className="label absolute inline-flex items-center gap-2 rounded-full bg-[#111] px-4 py-2 text-white">
        <svg viewBox="0 0 24 24" className="size-3.5 fill-none stroke-current" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
        Under NDA
      </span>
    </div>
  )
}

function Soon() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-surface">
      <div className="grid size-24 place-items-center rounded-full border-2 border-dashed border-ink/30 transition-transform duration-700 group-hover:rotate-90">
        <svg viewBox="0 0 24 24" className="size-8 fill-ink/40">
          <path d="M12 2c.5 4.5 2 7 8 10-6 3-7.5 5.5-8 10-.5-4.5-2-7-8-10 6-3 7.5-5.5 8-10Z" />
        </svg>
      </div>
    </div>
  )
}

const ART: Record<ProjectArt, () => React.JSX.Element> = { arena: Arena, cook: Cook, dashboard: Dashboard, soon: Soon }

export function WorkArt({ art }: { art: ProjectArt }) {
  const Art = ART[art]
  return <Art />
}
