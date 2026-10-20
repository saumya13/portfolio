// The crayon scribble used to highlight headings: three overlapping diagonal strokes, roughened and grained by an
// SVG filter. It is returned as a CSS `background-image` (an inline SVG), so it still works when a heading wraps
// onto two lines. Use with `backgroundSize: '100% 62%'`, `backgroundPosition: 'left bottom'`,
// `backgroundRepeat: 'no-repeat'` and `boxDecorationBreak: 'clone'`.
export const CRAYON_COLOURS = { yellow: '#ffe14d', sky: '#b8e2fb', pink: '#f09bcf', lime: '#e8ff8b' } as const
export type CrayonColour = keyof typeof CRAYON_COLOURS

export const crayonHighlight = (name: CrayonColour) => {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 40' preserveAspectRatio='none'>` +
    `<defs><filter id='f' x='-5%' y='-25%' width='110%' height='150%' color-interpolation-filters='sRGB'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='0.06' numOctaves='2' seed='4' result='w'/>` +
    `<feDisplacementMap in='SourceGraphic' in2='w' scale='5' xChannelSelector='R' yChannelSelector='G' result='r'/>` +
    `<feTurbulence type='fractalNoise' baseFrequency='1.2 0.5' numOctaves='3' seed='9' result='g'/>` +
    `<feColorMatrix in='g' type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.6 0 0 0 -0.5' result='s'/>` +
    `<feComposite in='r' in2='s' operator='in'/></filter></defs>` +
    `<g filter='url(#f)' fill='none' stroke='${CRAYON_COLOURS[name]}' stroke-width='11' stroke-linecap='round'>` +
    `<path d='M6 28 L192 12'/><path d='M10 34 L196 20'/><path d='M8 16 L188 31'/></g></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

export const crayonStyle = (name: CrayonColour) => ({
  backgroundImage: crayonHighlight(name),
  backgroundSize: '100% 62%',
  backgroundPosition: 'left bottom',
  backgroundRepeat: 'no-repeat',
  boxDecorationBreak: 'clone' as const,
  WebkitBoxDecorationBreak: 'clone' as const,
})
