import { siClaudecode, siDocker, siFramer, siGit, siGo, siJavascript, siNextdotjs, siNodedotjs, siPostgresql, siPython, siReact, siSupabase, siTailwindcss, siTypescript, siV0 } from 'simple-icons'

// Each tool renders as a coloured app-icon tile. `kind` picks the glyph:
// 'path' = a simple-icons SVG path, 'figma' = the multicolour Figma mark, 'letter' = a single character.
export type StackItem = {
  name: string
  bg: string
  fg?: string
  kind: 'path' | 'figma' | 'letter'
  path?: string
  letter?: string
}

export const stack: StackItem[] = [
  { name: 'TypeScript', bg: '#3178c6', fg: '#ffffff', kind: 'path', path: siTypescript.path },
  { name: 'React', bg: '#20232a', fg: '#61dafb', kind: 'path', path: siReact.path },
  { name: 'Tailwind CSS', bg: '#ffffff', fg: '#06b6d4', kind: 'path', path: siTailwindcss.path },
  { name: 'Next.js', bg: '#111111', fg: '#ffffff', kind: 'path', path: siNextdotjs.path },
  { name: 'Node.js', bg: '#339933', fg: '#ffffff', kind: 'path', path: siNodedotjs.path },
  { name: 'Go', bg: '#00add8', fg: '#ffffff', kind: 'path', path: siGo.path },
  { name: 'Claude Code', bg: '#d97757', fg: '#ffffff', kind: 'path', path: siClaudecode.path },
  { name: 'Figma', bg: '#1e1e1e', kind: 'figma' },
  { name: 'Motion', bg: '#ffe14d', fg: '#111111', kind: 'letter', letter: 'm' },
  { name: 'Docker', bg: '#2496ed', fg: '#ffffff', kind: 'path', path: siDocker.path },
  { name: 'PostgreSQL', bg: '#4169e1', fg: '#ffffff', kind: 'path', path: siPostgresql.path },
  { name: 'Supabase', bg: '#1c1c1c', fg: '#3ecf8e', kind: 'path', path: siSupabase.path },
]

// More tools, shown on the About page only (the home page's builder stack uses just `stack` above).
export const moreTools: StackItem[] = [
  { name: 'JavaScript', bg: '#f7df1e', fg: '#111111', kind: 'path', path: siJavascript.path },
  { name: 'Python', bg: '#3776ab', fg: '#ffd43b', kind: 'path', path: siPython.path },
  { name: 'Framer', bg: '#0055ff', fg: '#ffffff', kind: 'path', path: siFramer.path },
  { name: 'Git', bg: '#f05032', fg: '#ffffff', kind: 'path', path: siGit.path },
  { name: 'v0', bg: '#000000', fg: '#ffffff', kind: 'path', path: siV0.path },
  // Lovable has no icon in the icon set, so this is a heart on its signature orange-to-pink-to-violet gradient.
  {
    name: 'Lovable',
    bg: 'linear-gradient(135deg, #ff8a3d, #ff3d7f 55%, #7a5cff)',
    fg: '#ffffff',
    kind: 'path',
    path: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
  },
  { name: 'MATLAB', bg: '#e16919', fg: '#ffffff', kind: 'letter', letter: 'M' },
]

export const allTools: StackItem[] = [...stack, ...moreTools]
