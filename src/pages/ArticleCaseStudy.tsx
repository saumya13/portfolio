import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { getCaseStudy } from '../content/caseStudies'
import type { ArticleShot, ArticleStudy } from '../content/articleStudies'

// No scroll animations on this page: it is a plain read.
const fade = {}

// Narrow reading column; screenshots break out to a wider one.
const COLUMN = 'mx-auto w-full max-w-[40rem] px-6'
const WIDE = 'mx-auto w-full max-w-[60rem] px-4 md:px-6'

const ICONS = {
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </>
  ),
  cursor: <path d="m5 4 14 6-6 2-2 6z" />,
  eye: (
    <>
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  chart: <path d="M4 20V4m0 16h16M8 16v-5m4 5V8m4 8v-3" />,
  code: <path d="m9 7-5 5 5 5m6-10 5 5-5 5" />,
  plug: <path d="M9 3v5m6-5v5M6 8h12v3a6 6 0 0 1-12 0zm6 9v4" />,
  pen: <path d="M4 20h4L18 10l-4-4L4 16zM13 7l4 4" />,
  layers: <path d="m12 3 9 5-9 5-9-5zM3 13l9 5 9-5" />,
} as const

function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-[1.05rem] shrink-0 fill-none stroke-ink/60" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </svg>
  )
}

function Shots({ shots }: { shots: ArticleShot[] }) {
  return (
    <div className={`${WIDE} mt-10 space-y-8`}>
      {shots.map((s, i) => (
        <motion.figure key={s.src + i} {...fade}>
          {s.video ? (
            // A short screen recording: loops silently, like a GIF. `src` is the poster shown while it loads.
            <video
              src={s.video}
              poster={s.src}
              aria-label={s.alt}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full rounded-xl border border-ink/12 bg-paper"
            />
          ) : (
            <img src={s.src} alt={s.alt} loading="lazy" className="w-full rounded-xl border border-ink/12 bg-paper" />
          )}
          <figcaption className="mt-3 flex gap-3 text-xs text-muted">
            <span className="tabular-nums">
              {String(i + 1).padStart(2, '0')} / {String(shots.length).padStart(2, '0')}
            </span>
            <span>{s.caption}</span>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  )
}

const H3 = ({ children }: { children: ReactNode }) => (
  <motion.h2 {...fade} className="text-3xl font-medium tracking-[-0.03em] md:text-4xl">
    {children}
  </motion.h2>
)

export default function ArticleCaseStudy({ study: s }: { study: ArticleStudy }) {
  const next = getCaseStudy(s.nextProject)

  return (
    <main className="relative z-10 bg-paper pb-24 pt-24 text-[15px] text-ink/80 md:pb-36 md:pt-28 md:text-base">
      {/* Header */}
      <header className={COLUMN}>
        <motion.div {...fade} className="flex items-center gap-3">
          <img src="/favicon.svg" alt="" className="size-8 rounded-full bg-surface p-1" />
          <span className="text-sm font-medium text-ink">Saumya</span>
        </motion.div>

        <motion.nav {...fade} aria-label="Breadcrumb" className="mt-8 flex items-center gap-2.5 text-sm">
          <Link to="/#work" className="inline-flex items-center gap-2 text-muted transition-colors hover:text-ink">
            <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-none stroke-current" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            Work
          </Link>
          <span className="text-muted">/</span>
          <span className="text-ink">{s.title}</span>
        </motion.nav>

        <motion.h1 {...fade} className="mt-8 text-4xl font-medium leading-[1.05] tracking-[-0.04em] text-ink md:text-6xl">
          {s.headline}
        </motion.h1>
        <motion.p {...fade} className="mt-7 leading-relaxed">
          {s.intro}
        </motion.p>

        <motion.dl {...fade} className="mt-9 divide-y divide-line border-y border-line">
          {s.spec.map((row) => (
            <div key={row.label} className="grid grid-cols-[6.5rem_1fr] gap-4 py-3.5">
              <dt className="text-muted">{row.label}</dt>
              <dd className="text-ink">{row.value}</dd>
            </div>
          ))}
          <div className="grid grid-cols-[6.5rem_1fr] gap-4 py-3.5">
            <dt className="text-muted">Built using</dt>
            <dd className="flex flex-wrap gap-1.5">
              {s.built.map((b) => (
                <span key={b} className="rounded-md bg-surface px-2 py-0.5 text-[13px] text-ink">
                  {b}
                </span>
              ))}
            </dd>
          </div>
        </motion.dl>

        <motion.div {...fade} className="mt-6 flex flex-wrap gap-3">
          {s.links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-transform duration-200 hover:-translate-y-0.5 ${
                i === 0 ? 'bg-ink text-paper' : 'border border-ink/25 text-ink hover:border-ink'
              }`}
            >
              {l.label}
              <svg viewBox="0 0 24 24" aria-hidden className="size-3.5 fill-none stroke-current" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </a>
          ))}
        </motion.div>
      </header>

      <Shots shots={s.hero} />

      {/* Problems and opportunities */}
      <section className={`${COLUMN} mt-20 md:mt-28`}>
        <H3>{s.problems.heading}</H3>
        <ul className="mt-7 space-y-5">
          {s.problems.points.map((p) => (
            <motion.li key={p} {...fade} className="flex gap-3 leading-relaxed">
              <span aria-hidden className="mt-[0.6rem] size-1 shrink-0 rounded-full bg-ink/70" />
              <span>{p}</span>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* What I did */}
      <section className={`${COLUMN} mt-20 md:mt-28`}>
        <H3>What I did</H3>
        <div className="mt-8 grid border-t border-line sm:grid-cols-2">
          {s.did.map((d, i) => (
            <motion.div
              key={d.title}
              {...fade}
              className={`border-b border-line py-6 sm:min-h-[8.5rem] ${i % 2 === 0 ? 'sm:border-r sm:pr-6' : 'sm:pl-6'}`}
            >
              <div className="flex items-center gap-2.5 font-medium text-ink">
                <Icon name={d.icon} />
                {d.title}
              </div>
              <p className="mt-2.5 text-sm leading-relaxed">{d.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The solution */}
      <section className={`${COLUMN} mt-20 md:mt-28`}>
        <H3>The solution</H3>
        <motion.p {...fade} className="mt-6 leading-relaxed">
          {s.solution.intro}
        </motion.p>
        <ul className="mt-6 space-y-4">
          {s.solution.principles.map((p) => (
            <motion.li key={p} {...fade} className="flex gap-3 leading-relaxed">
              <span aria-hidden className="mt-[0.6rem] size-1 shrink-0 rounded-full bg-ink/70" />
              <span>{p}</span>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* Product flows */}
      {s.flows.map((f, i) => (
        <section key={f.title} className="mt-20 md:mt-28">
          <div className={COLUMN}>
            <motion.p {...fade} className="text-sm text-muted">
              Product flow / {String(i + 1).padStart(2, '0')}
            </motion.p>
            <motion.h3 {...fade} className="mt-1.5 text-2xl font-medium tracking-[-0.025em] text-ink md:text-3xl">
              {f.title}
            </motion.h3>

            <motion.div {...fade} className="mt-6 grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr]">
              <div className="rounded-xl bg-yellow/45 p-4 text-[#111] dark:bg-yellow">
                <p className="label text-[#111]/60">Problem</p>
                <p className="mt-1.5 text-sm font-medium leading-snug">{f.problem}</p>
              </div>
              <svg viewBox="0 0 24 24" aria-hidden className="size-5 shrink-0 self-center justify-self-center fill-none stroke-ink/50 max-md:rotate-90" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12h16m-5-5 5 5-5 5" />
              </svg>
              <div className="rounded-xl bg-lime/40 p-4 text-[#111] dark:bg-lime">
                <p className="label text-[#111]/60">Solution</p>
                <p className="mt-1.5 text-sm font-medium leading-snug">{f.solution}</p>
              </div>
            </motion.div>

            <motion.p {...fade} className="mt-6 leading-relaxed">
              {f.body}
            </motion.p>
          </div>
          {f.shots.length > 0 && <Shots shots={f.shots} />}
        </section>
      ))}

      {/* Impact */}
      <section className={`${COLUMN} mt-20 md:mt-28`}>
        <H3>{s.impact.heading}</H3>
        <ul className="mt-7 space-y-5">
          {s.impact.points.map((p) => (
            <motion.li key={p.lead} {...fade} className="flex gap-3 leading-relaxed">
              <span aria-hidden className="mt-[0.6rem] size-1 shrink-0 rounded-full bg-ink/70" />
              <span>
                <strong className="font-semibold text-ink">{p.lead}</strong> {p.body}
              </span>
            </motion.li>
          ))}
        </ul>
        <motion.p {...fade} className="mt-7 leading-relaxed">
          {s.impact.closing}
        </motion.p>

      </section>

      {/* Next project */}
      {next && (
        <section className={`${COLUMN} mt-20 border-t border-line pt-10 md:mt-28`}>
          <p className="text-sm text-muted">Next project</p>
          <Link to={`/work/${next.slug}`} className="group mt-2 flex items-end justify-between gap-6">
            <span>
              <span className="block text-3xl font-medium tracking-[-0.03em] text-ink transition-transform duration-500 group-hover:translate-x-1.5 md:text-4xl">{next.title}</span>
              <span className="mt-2 block text-sm text-muted">{next.tagline}</span>
            </span>
            <svg viewBox="0 0 24 24" aria-hidden className="size-9 shrink-0 fill-none stroke-ink transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 18 18 6M8 6h10v10" />
            </svg>
          </Link>
        </section>
      )}
    </main>
  )
}
