// Small things built to play with. Each tile in the bento grid is one experiment; `art` picks the little demo it shows.
export type ExperimentArt = 'spring' | 'palette' | 'type' | 'switch' | 'marquee' | 'dots' | 'soon'

export type Experiment = {
  id: string
  title: string
  blurb: string
  tag: string
  art: ExperimentArt
  // Tailwind grid placement on desktop (4 columns, rows 200px tall).
  span: string
}

export const experiments = {
  label: 'Playground',
  heading: 'Experiments',
  blurb: 'Small things I build to learn how interfaces should feel. Poke around.',
}

export const experimentTiles: Experiment[] = [
  { id: 'spring', title: 'Spring playground', blurb: 'Move your cursor. The ball follows with a little weight.', tag: 'Motion', art: 'spring', span: 'lg:col-span-2 lg:row-span-2' },
  { id: 'palette', title: 'Palette roulette', blurb: 'Four colours, one mood.', tag: 'Colour', art: 'palette', span: 'lg:col-span-1' },
  { id: 'type', title: 'Type specimen', blurb: 'Serif, with a slant.', tag: 'Typography', art: 'type', span: 'lg:col-span-1 lg:row-span-2' },
  { id: 'switch', title: 'Tiny switch', blurb: 'Click it. It settles.', tag: 'Micro-interaction', art: 'switch', span: 'lg:col-span-1' },
  { id: 'marquee', title: 'Make it move', blurb: 'A marquee that never gets bored.', tag: 'CSS', art: 'marquee', span: 'lg:col-span-2' },
  { id: 'dots', title: 'Ripple', blurb: 'Hover to send a wave across the dots.', tag: 'Hover', art: 'dots', span: 'lg:col-span-1' },
  { id: 'soon', title: 'More soon', blurb: 'The next experiment is cooking.', tag: 'Soon', art: 'soon', span: 'lg:col-span-1' },
]
