export type MorphItem = { image: string; caption?: string }

type Props = {
  items?: MorphItem[]
  transition?: 'melt' | 'ripple' | 'shear' | 'swirl'
  autoplay?: boolean
  autoplayDelay?: number
  radius?: number
  overlayColor?: string
  showCaptions?: boolean
  showControls?: boolean
  showIndicators?: boolean
  className?: string
  [key: string]: unknown
}

declare function MorphSlider(props: Props): JSX.Element
export default MorphSlider
