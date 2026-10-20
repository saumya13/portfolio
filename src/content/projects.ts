// `art` picks the illustration shown on the card (see components/WorkArt.tsx) until real screenshots exist.
export type ProjectArt = 'arena' | 'cook' | 'dashboard' | 'soon'

export type Project = {
  slug: string
  title: string
  blurb: string
  art: ProjectArt
  // A real screenshot, used instead of the illustration when set.
  image?: string
  // With a tint, the image sits inset on a solid colour backdrop, like a framed product shot.
  tint?: string
  // A short loop that plays while the tile is hovered.
  video?: string
  // Projects with a case study link to /work/<slug>. NDA work and upcoming work have no page.
  status: 'case-study' | 'nda' | 'soon'
}

export const work = {
  label: 'Selected work',
  heading: 'My Work',
}

export const projects: Project[] = [
  {
    slug: 'model-arena',
    title: 'Model-Arena',
    blurb: 'Compare up to four OpenRouter models side by side on the same prompt, with live latency, token and cost stats, and trends across runs.',
    art: 'arena',
    image: '/work/model-arena/tile.jpg',
    tint: '#e4d9fb',
    status: 'case-study',
  },
  {
    slug: 'what-can-i-cook',
    title: 'ChefMate',
    blurb: 'Tell it what is in your fridge and two chained AI models turn it into a recipe you can save.',
    art: 'cook',
    image: '/work/what-can-i-cook/landing.jpg',
    video: '/work/what-can-i-cook/landing.mp4',
    tint: '#fcdcc8',
    status: 'case-study',
  },
  {
    slug: 'exploratory-testing-dashboard',
    title: 'Multiple Test Failure reporting dashboards',
    blurb: 'Built and shipped end to end at MathWorks for stress testing workflows, where millions of unexpected failures happen. The work is under NDA, so details stay private.',
    art: 'dashboard',
    tint: '#dbeafe',
    status: 'nda',
  },
]
