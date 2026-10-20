import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getArticleStudy } from '../content/articleStudies'
import { caseStudies, getCaseStudy, type Card, type Shot } from '../content/caseStudies'
import ArticleCaseStudy from './ArticleCaseStudy'

const ease = [0.22, 1, 0.36, 1] as const
const fade = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-8% 0px' },
  transition: { duration: 0.8, ease },
}
const px = 'px-[calc(var(--gutter)+1.25rem)]'

// A screenshot on the same soft tray the work cards use, with a caption underneath.
function Figure({ shot, className = '' }: { shot: Shot; className?: string }) {
  return (
    <motion.figure {...fade} className={className}>
      <div className="rounded-[1.75rem] bg-ink/[0.04] p-2 md:p-2.5">
        <img src={shot.src} alt={shot.alt} loading="lazy" className="w-full rounded-[1.4rem] border border-ink/15 bg-paper" />
      </div>
      <figcaption className="mt-3 pl-1 text-sm text-muted">{shot.caption}</figcaption>
    </motion.figure>
  )
}

// A section: a small label on the left, the content on the right, a hairline above, like the About page.
function Block({ index, label, children }: { index: string; label: string; children: ReactNode }) {
  return (
    <section className={`mx-auto max-w-7xl border-t border-line py-14 md:py-20 ${px}`}>
      <div className="grid gap-8 lg:grid-cols-[14rem_1fr] lg:gap-16">
        <motion.p {...fade} className="eyebrow text-muted lg:sticky lg:top-28 lg:self-start">
          ({index}) {label}
        </motion.p>
        <div>{children}</div>
      </div>
    </section>
  )
}

const H2 = ({ children }: { children: ReactNode }) => (
  <motion.h2 {...fade} className="max-w-3xl font-display text-3xl leading-[1.1] tracking-tight md:text-5xl">
    {children}
  </motion.h2>
)

function Cards({ items, numbered = false }: { items: Card[]; numbered?: boolean }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-5">
      {items.map((c, i) => (
        <motion.article
          key={c.title}
          {...fade}
          transition={{ ...fade.transition, delay: (i % 2) * 0.08 }}
          className="rounded-[1.75rem] bg-surface p-6 md:p-7"
        >
          {numbered && <span className="font-display text-xl italic text-ink/40">{String(i + 1).padStart(2, '0')}</span>}
          <h3 className={`text-lg font-semibold tracking-tight ${numbered ? 'mt-3' : ''}`}>{c.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/70 md:text-base">{c.body}</p>
        </motion.article>
      ))}
    </div>
  )
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4 shrink-0 fill-none stroke-current" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

export default function CaseStudy() {
  const { slug } = useParams()
  // Projects written as an article (single reading column) use their own layout.
  const article = getArticleStudy(slug)
  if (article) return <ArticleCaseStudy study={article} />
  const c = getCaseStudy(slug)

  if (!c) {
    return (
      <main className={`relative z-10 bg-paper pb-32 pt-40 text-center ${px}`}>
        <h1 className="font-display text-5xl">Project not found</h1>
        <Link to="/#work" className="mt-6 inline-block underline underline-offset-4">
          Back to my work
        </Link>
      </main>
    )
  }
  const next = getCaseStudy(c.nextProject) ?? caseStudies[0]

  return (
    <main className="relative z-10 bg-paper pb-24 md:pb-36">
      {/* Title */}
      <section className={`mx-auto max-w-7xl pb-14 pt-28 md:pt-36 ${px}`}>
        <motion.div {...fade}>
          <Link to="/#work" className="label inline-flex items-center gap-2 text-muted transition-colors hover:text-ink">
            <span aria-hidden>←</span> All work
          </Link>
        </motion.div>
        <motion.p {...fade} className="label mt-10 text-muted">
          (Case study · {c.year})
        </motion.p>
        <motion.h1 {...fade} className="mt-3 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-6xl">
          {c.title}
        </motion.h1>
        <motion.p {...fade} className="mt-5 max-w-2xl font-display text-2xl leading-snug text-ink/80 md:text-3xl">
          {c.tagline}
        </motion.p>
        <motion.p {...fade} className="mt-6 max-w-2xl text-base leading-relaxed text-ink/70 md:text-lg">
          {c.summary}
        </motion.p>

        <motion.dl {...fade} className="mt-10 grid gap-6 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="label text-muted">Role</dt>
            <dd className="mt-1.5 text-sm">{c.role}</dd>
          </div>
          <div>
            <dt className="label text-muted">Type</dt>
            <dd className="mt-1.5 text-sm">{c.type}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="label text-muted">Built with</dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {c.stack.map((s) => (
                <span key={s} className="rounded-lg bg-surface px-2.5 py-1 text-xs">
                  {s}
                </span>
              ))}
            </dd>
          </div>
        </motion.dl>

        <motion.div {...fade} className="mt-8 flex flex-wrap gap-3">
          {c.links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-transform duration-200 hover:-translate-y-0.5 ${
                i === 0 ? 'bg-ink text-paper' : 'border border-ink/25 hover:border-ink'
              }`}
            >
              {l.label}
              <Arrow />
            </a>
          ))}
        </motion.div>
      </section>

      <div className={`mx-auto max-w-7xl ${px}`}>
        <Figure shot={c.cover} />
      </div>

      {/* At a glance */}
      <section className={`mx-auto max-w-7xl py-14 md:py-20 ${px}`}>
        <dl className="grid gap-px overflow-hidden rounded-[1.75rem] bg-line sm:grid-cols-2 lg:grid-cols-4">
          {c.glance.map((g, i) => (
            <motion.div key={g.label} {...fade} transition={{ ...fade.transition, delay: i * 0.06 }} className="bg-paper p-6 md:p-8">
              <dt className="font-display text-5xl leading-none tracking-tight md:text-6xl">{g.value}</dt>
              <dd className="mt-3 text-sm leading-snug text-ink/65">{g.label}</dd>
            </motion.div>
          ))}
        </dl>
      </section>

      <Block index="01" label="The need">
        <H2>{c.need.heading}</H2>
        <div className="mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-ink/75 md:text-lg">
          {c.need.paragraphs.map((p) => (
            <motion.p key={p} {...fade}>
              {p}
            </motion.p>
          ))}
        </div>
        <p className="label mb-4 mt-12 text-muted">What I wanted out of it</p>
        <Cards items={c.goals} />
      </Block>

      <Block index="02" label="Design process">
        <H2>{c.process.heading}</H2>
        <motion.p {...fade} className="mt-5 max-w-2xl text-base leading-relaxed text-ink/75 md:text-lg">
          {c.process.intro}
        </motion.p>
        <div className="mt-10">
          <Cards items={c.process.steps} numbered />
        </div>
        <div className="mt-14 grid gap-10">
          {c.gallery.map((shot) => (
            <Figure key={shot.src} shot={shot} />
          ))}
        </div>
      </Block>

      <Block index="03" label="How it works">
        <H2>{c.build.heading}</H2>
        <motion.p {...fade} className="mt-5 max-w-2xl text-base leading-relaxed text-ink/75 md:text-lg">
          {c.build.intro}
        </motion.p>

        {/* What talks to what */}
        <motion.ol {...fade} className="mt-10 flex flex-wrap items-stretch gap-2 md:gap-3">
          {c.build.flow.map((step, i) => (
            <li key={step} className="flex items-center gap-2 md:gap-3">
              <span className="rounded-2xl border border-ink/20 bg-paper px-4 py-3 text-sm font-medium">{step}</span>
              {i < c.build.flow.length - 1 && (
                <svg viewBox="0 0 24 24" aria-hidden className="size-5 fill-none stroke-ink/40" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12h16m-5-5 5 5-5 5" />
                </svg>
              )}
            </li>
          ))}
        </motion.ol>

        <motion.div {...fade} className="mt-10 rounded-[1.75rem] bg-pink/20 p-6 md:p-9">
          <h3 className="font-display text-2xl tracking-tight md:text-3xl">{c.build.openrouter.heading}</h3>
          {c.build.openrouter.paragraphs.map((p) => (
            <p key={p} className="mt-3 max-w-2xl text-base leading-relaxed text-ink/75">
              {p}
            </p>
          ))}
          <ul className="mt-5 grid gap-3 text-sm leading-relaxed text-ink/75 md:grid-cols-2 md:text-base">
            {c.build.openrouter.bullets.map((b) => (
              <li key={b} className="flex gap-3">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-ink/50" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </Block>

      <Block index="04" label="Problems solved">
        <H2>Where it got interesting</H2>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {c.challenges.map((ch, i) => (
            <motion.div
              key={ch.problem}
              {...fade}
              transition={{ ...fade.transition, delay: (i % 2) * 0.05 }}
              className="grid gap-3 py-6 md:grid-cols-[1fr_1.3fr] md:gap-12 md:py-8"
            >
              <h3 className="text-base font-semibold tracking-tight md:text-lg">{ch.problem}</h3>
              <p className="text-sm leading-relaxed text-ink/70 md:text-base">{ch.solution}</p>
            </motion.div>
          ))}
        </div>
      </Block>

      <Block index="05" label="Takeaway">
        <motion.blockquote {...fade} className="max-w-3xl font-display text-3xl leading-[1.2] tracking-tight md:text-4xl">
          “{c.takeaway.quote}”
        </motion.blockquote>
        <motion.p {...fade} className="mt-6 max-w-2xl text-base leading-relaxed text-ink/75 md:text-lg">
          {c.takeaway.body}
        </motion.p>
        <p className="label mb-4 mt-12 text-muted">If I kept going</p>
        <ul className="flex flex-wrap gap-2">
          {c.next.map((n) => (
            <li key={n} className="rounded-xl bg-surface px-4 py-2.5 text-sm">
              {n}
            </li>
          ))}
        </ul>
      </Block>

      {/* On to the next project */}
      <section className={`mx-auto max-w-7xl border-t border-line pt-14 md:pt-20 ${px}`}>
        <p className="eyebrow text-muted">(Next project)</p>
        <Link to={`/work/${next.slug}`} className="group mt-4 flex items-end justify-between gap-6">
          <span>
            <span className="block text-4xl font-semibold leading-[1.05] tracking-[-0.035em] transition-transform duration-500 group-hover:translate-x-2 md:text-6xl">{next.title}</span>
            <span className="mt-3 block max-w-xl text-base text-ink/65">{next.tagline}</span>
          </span>
          <svg viewBox="0 0 24 24" aria-hidden className="size-10 shrink-0 fill-none stroke-ink transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 md:size-14" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 18 18 6M8 6h10v10" />
          </svg>
        </Link>
      </section>
    </main>
  )
}
