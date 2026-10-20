import { motion } from "motion/react";
import type { ReactNode } from "react";
import MorphSlider from "../components/MorphSlider";
import { Glyph } from "../components/IconRow";
import { PhotoCarousel } from "../components/PhotoCarousel";
import { allTools } from "../content/stack";
import {
  aboutIntro,
  experience,
  interests,
  photos,
  toolGroups,
  tools,
  values,
} from "../content/about";

const ease = [0.22, 1, 0.36, 1] as const;
const fade = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-8% 0px" },
  transition: { duration: 0.8, ease },
};
// The space between a section heading and what follows it is the same everywhere: mt-10 md:mt-14.
const px = "px-[calc(var(--gutter)+1.25rem)]";

// A small heart that beats.
function Heart() {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 24 24"
      className="ml-2 inline-block size-[0.55em] -translate-y-[0.1em] fill-pink"
      animate={{ scale: [1, 1.25, 1, 1.18, 1] }}
      transition={{
        duration: 1.4,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.15, 0.3, 0.45, 1],
      }}
    >
      <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.8 4.5 6.5 4.5c2 0 3.6 1.1 5.5 3.2 1.9-2.1 3.5-3.2 5.5-3.2 3.7 0 5.6 3.9 4.1 7.3C19.5 16.4 12 21 12 21z" />
    </motion.svg>
  );
}

// Two columns: the story on the left, a photo carousel on the right.
function Intro() {
  return (
    <section
      className={`relative mx-auto grid max-w-7xl items-center gap-12 pb-14 pt-28 md:pt-32 lg:grid-cols-[1fr_1.15fr] lg:gap-12 ${px}`}
    >
      <div>
        <motion.p {...fade} className="eyebrow text-muted">
          ({aboutIntro.label})
        </motion.p>
        <motion.h1
          {...fade}
          className="mt-3 font-bonny text-4xl font-medium leading-[1.15] tracking-tight md:text-5xl"
        >
          <span className="inline-block -rotate-2 rounded-[0.22em] bg-yellow px-[0.3em] pb-[0.06em] text-[#111]">
            Engineer
          </span>{" "}
          by training,
          <br />
          {/* The second line starts under "by": an invisible copy of "Engineer " pushes it across (Bonny is wider than the old
              heading font, so any further and "at heart" would wrap). */}
          <span aria-hidden className="invisible">
            Engineer{" "}
          </span>
          <i className="inline-block rotate-2 rounded-[0.22em] bg-sky px-[0.3em] pb-[0.06em] text-[#111]">
            designer
          </i>{" "}
          <span className="whitespace-nowrap">
            <i>at heart</i>
            <Heart />
          </span>
        </motion.h1>
        <div className="mt-5 space-y-3 text-sm leading-relaxed text-ink/75 md:text-base">
          {aboutIntro.paragraphs.map((p, i) => (
            <motion.p
              key={i}
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 * i }}
            >
              {p}
            </motion.p>
          ))}
        </div>
        <motion.dl
          {...fade}
          className="mt-6 grid gap-3 border-t border-line pt-4 sm:grid-cols-3"
        >
          {aboutIntro.facts.map((f) => (
            <div key={f.k}>
              <dt className="label text-muted">{f.k}</dt>
              <dd className="mt-1 text-xs">{f.v}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
      <motion.div {...fade}>
        <PhotoCarousel photos={photos} />
      </motion.div>
    </section>
  );
}

// Experience as a plain list: a coloured tile, "Role @ Company", when and what kind, and a line about it.
function Experience() {
  const { stints, resume } = experience;
  return (
    <section className={`mx-auto max-w-7xl border-t border-line py-14 ${px}`}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <motion.p {...fade} className="eyebrow text-muted">
            ({experience.label})
          </motion.p>
          <div className="mt-3">
            <Heading lines={experience.heading} />
          </div>
        </div>
        <motion.a
          {...fade}
          href={resume.href}
          download
          className="label inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/30"
        >
          {resume.label}
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="size-3.5 fill-none stroke-current"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />
          </svg>
        </motion.a>
      </div>

      <ul className="mt-6 md:mt-9">
        {stints.map((s, i) => (
          <motion.li
            key={s.id}
            {...fade}
            transition={{ ...fade.transition, delay: i * 0.08 }}
            className="flex gap-3 border-b border-dashed border-line py-4 last:border-b-0 md:gap-4 md:py-5"
          >
            <span
              aria-hidden
              className="grid size-9 shrink-0 place-items-center rounded-lg font-display text-lg italic text-[#111]"
              style={{ background: s.colour }}
            >
              {s.logo ? (
                <img
                  src={s.logo}
                  alt={s.org}
                  className="size-full rounded-lg object-cover"
                />
              ) : (
                s.mark
              )}
            </span>
            <div>
              <h3 className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base md:text-lg">
                <span>{s.role}</span>
                <span className="-mr-1 text-muted">@</span>
                <span className="text-muted underline decoration-ink/15 underline-offset-4">
                  {s.org}
                </span>
                <span className="label rounded-md bg-[#f1ede6] px-2.5 py-1 text-ink/70 dark:bg-white/10">
                  {s.period}
                </span>
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                {s.text}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

// Tools as soft pills, each with its app icon, a name and what it is for.
function Tools() {
  return (
    <section className={`mx-auto max-w-7xl border-t border-line py-14 ${px}`}>
      <Heading lines={tools.heading} />
      <div className="mt-10 space-y-8 md:mt-14">
        {toolGroups.map((g) => (
          <div key={g.id}>
            <p className="label mb-4 text-muted">({g.label})</p>
            <ul className="flex flex-wrap gap-2">
              {tools.items
                .filter((t) => t.group === g.id)
                .map((t, i) => {
                  const item = allTools.find((s) => s.name === t.stack);
                  return (
                    <motion.li
                      key={t.name}
                      {...fade}
                      transition={{ ...fade.transition, delay: i * 0.06 }}
                      title={t.note}
                      className="inline-flex items-center gap-2 rounded-xl bg-surface/70 py-1.5 pl-1.5 pr-3.5 transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <span
                        className="grid size-7 shrink-0 place-items-center overflow-hidden rounded-lg [&>span]:!text-[1.3rem] shadow-sm ring-1 ring-black/5"
                        style={{ background: item?.bg }}
                      >
                        {item && <Glyph item={item} />}
                      </span>
                      <span className="text-xs">{t.name}</span>
                    </motion.li>
                  );
                })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Heading({ lines }: { lines: readonly [string, string] }) {
  return (
    <motion.h2
      {...fade}
      className="font-bonny text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl"
    >
      {lines[0]} <span className="text-ink/45">{lines[1]}</span>
    </motion.h2>
  );
}

// The photos the slider morphs between (files live in /public/photos).
const SLIDER_PHOTOS = [32, 27, 26, 22, 19, 1];

// Each value card gets its own pastel and a little line drawing: people, a heart, a sprout and a swirl.
const VALUE_TINTS = [
  "bg-yellow/45 dark:bg-yellow",
  "bg-sky/50 dark:bg-sky",
  "bg-pink/30 dark:bg-pink",
  "bg-lime/50 dark:bg-lime",
];
const VALUE_DOODLES: ReactNode[] = [
  <>
    <circle cx="14" cy="22" r="5" />
    <circle cx="32" cy="18" r="5" />
    <circle cx="50" cy="22" r="5" />
    <path d="M14 29v13M8 34l6 4 6-4M32 25v15M25 31l7 4 7-4M50 29v13M44 34l6 4 6-4M12 54l2-12M16 54l-2-12M30 54l2-14M34 54l-2-14M48 54l2-12M52 54l-2-12" />
  </>,
  <>
    <path d="M32 54C14 41 8 31 8 22a12 12 0 0 1 24-3 12 12 0 0 1 24 3c0 9-6 19-24 32z" />
    <path d="M17 17c3-3 7-4 10-2" />
  </>,
  <>
    <path d="M32 58V30M32 40c-9 0-14-6-14-14 9 0 14 5 14 14zM32 34c0-9 5-16 15-16 0 9-6 16-15 16z" />
    <path d="M22 58h20" />
  </>,
  <>
    <path d="M32 32m0 0a3 3 0 1 1 6 0 8 8 0 1 1-14 0 14 14 0 1 1 26 0 20 20 0 1 1-38 0" />
    <path d="M52 56l4-4M50 8l3 3" />
  </>,
];

// Interests as pills on the left, a morphing slider of them on the right, then the values as four soft cards.
function Into() {
  const items = SLIDER_PHOTOS.map((n) => ({
    image: `/photos/${n}.jpg`,
    caption: "",
  }));
  return (
    <section className={`mx-auto max-w-7xl border-t border-line py-14 ${px}`}>
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <Heading lines={interests.heading} />
          <ul className="mt-10 md:mt-14 flex flex-wrap gap-2">
            {interests.items.map((it, i) => (
              <motion.li
                key={it.label}
                {...fade}
                transition={{ ...fade.transition, delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-xl bg-surface/70 p-1.5 pr-4 transition-transform duration-300 hover:-translate-y-1"
              >
                <span
                  className="size-8 rounded-lg"
                  style={{ background: it.tint }}
                />
                <span className="text-sm">{it.label}</span>
              </motion.li>
            ))}
          </ul>
        </div>
        <motion.div {...fade} className="h-[18rem] md:h-[22rem]">
          <MorphSlider
            items={items}
            transition="melt"
            autoplay
            autoplayDelay={4}
            radius={24}
            overlayColor="#111111"
            showCaptions={false}
          />
        </motion.div>
      </div>

      {/* A divider like the ones between the other sections, running the full width of the section. */}
      <div
        className={`-mx-[calc(var(--gutter)+1.25rem)] mt-14 border-t border-line pt-14 ${px}`}
      >
        <Heading lines={values.heading} />
        <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2 md:gap-5">
          {values.items.map((v, i) => (
            <motion.article
              key={v.title}
              {...fade}
              transition={{ ...fade.transition, delay: (i % 2) * 0.1 }}
              className={`group relative flex min-h-[15rem] flex-col justify-between overflow-hidden rounded-[2rem] border border-black/15 p-7 text-[#111] dark:border-white/10 transition-transform duration-500 ease-out hover:-translate-y-1 md:min-h-[17rem] md:p-9 ${VALUE_TINTS[i % VALUE_TINTS.length]}`}
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-xl italic text-[#111]/55">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <svg
                  viewBox="0 0 64 64"
                  aria-hidden
                  className="size-14 fill-none stroke-[#111]/70 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 md:size-16"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {VALUE_DOODLES[i % VALUE_DOODLES.length]}
                </svg>
              </div>
              <div className="mt-10">
                <h3 className="font-bonny text-3xl font-medium leading-[1.05] tracking-tight md:text-4xl">
                  {v.title}
                </h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-[#111]/70">
                  {v.body}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <main className="relative z-10 bg-paper pb-32 md:pb-44">
      <Intro />
      <Experience />
      <Tools />
      <Into />
    </main>
  );
}
