# Portfolio: Framer-style product designer / front-end portfolio

## Context
Saumya (6 yrs full-stack) is pivoting toward product design / front-end roles. Greenfield project in `/Users/saumya/projects/portfolio` (empty). Goal: a professional-yet-artistic site with Framer-like smooth scrolling and transitions. One project to show (model-arena). No backend needed.

## Decisions (confirmed)
- Stack: **Vite + React + TypeScript**, Tailwind v4, **Motion** (`motion/react`), **Lenis** smooth scroll, **OGL** (tiny WebGL lib) for hero shader, **react-router** for the case-study route.
- Fonts: **Instrument Serif** (hero/display, tight tracking, italic accents) + **Inter** (UI, uppercase parenthesized nav labels like `(WORK)`), via Fontsource (self-hosted).
- Structure: single long-scroll page with anchor nav + `/work/model-arena` case-study page.
- Contact: `mailto:` + social links only (no form, no backend). Static deploy (Vercel/Netlify/Cloudflare Pages).
- Assets: placeholders now, all content centralized so swapping is data-only.

## Structure
```
src/
  main.tsx, App.tsx            # Router, Lenis provider
  content/                     # edit-only data: site.ts, projects.ts, experiments.ts, stack.ts
  components/
    Nav.tsx                    # name left; (Work)(Experiments)(About)(Let's connect) right; hides on scroll down
    SmoothScroll.tsx           # Lenis + sync with Motion
    ShaderBackground.tsx       # OGL fragment shader: soft grain gradient blob, mouse-reactive, reduced-motion fallback
    Marquee.tsx                # infinite logo marquee (CSS/Motion), pauses on hover
    Reveal.tsx / SplitText.tsx # scroll-triggered line/word reveals
    ProjectTile.tsx            # large tile, parallax image + scale on scroll
    Footer.tsx
  sections/
    Hero.tsx                   # "Hi, I'm Saumya / Product Designer." + shader + scroll cue
    Intro.tsx                  # about blurb with highlighted words + tech marquee (React, Motion, Next.js, Figma, Canva...)
    Philosophy.tsx             # sticky, scroll-driven word-by-word text reveal
    Work.tsx                   # big tiles, scroll-linked scale/parallax
    Experiments.tsx            # bordered grid gallery (sreedesigns-style), images/videos/live demos
    About.tsx                  # photo, bio, stats, experience
    Contact.tsx                # large mailto CTA + socials
  pages/CaseStudy.tsx          # /work/:slug, model-arena
```

## Key implementation notes
- Hero: split-text staggered entrance; italic swap on a few letters for the reference look; shader sits behind with low-contrast warm gradient; respects `prefers-reduced-motion`.
- Smooth scroll: Lenis `autoRaf` off, drive via Motion's `frame` loop; section transitions via `useScroll` + `useTransform` (scale/opacity/translate), sticky panels for hero->intro and philosophy.
- Nav anchors use `lenis.scrollTo`; route transitions with `AnimatePresence`.
- Footer: giant name text with hover/mouse-follow per-letter animation and a marquee/clock.
- Responsive: mobile-first; shader degrades to CSS gradient on low-power/mobile; images lazy-loaded.
- Copy draft supplied as placeholder (e.g. "Full-stack developer with 6 years of experience and a keen eye for detail, now designing the things I used to only build.") for refinement later.

## Build order
1. Scaffold Vite+TS, install deps, fonts, Tailwind tokens (colors, type scale), git-ignore.
2. SmoothScroll, Nav, Hero + shader.
3. Intro + marquee, Philosophy.
4. Work tiles + case-study route.
5. Experiments, About, Contact, Footer.
6. Polish: reduced-motion, mobile, meta/OG tags, favicon, Lighthouse pass.

## Verification
- `npm run dev`, then check in browser (Claude in Chrome) at desktop and mobile widths: smooth scroll, section transitions, shader rendering, nav anchors, `/work/model-arena` route and back.
- `npm run build && npm run preview`, no console errors; `tsc --noEmit` clean.
- Lighthouse: performance and accessibility sanity check; test `prefers-reduced-motion`.
