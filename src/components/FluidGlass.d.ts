import type { ComponentType } from 'react'

declare const FluidGlass: ComponentType<{
  text?: string
  font?: string
  fontSize?: number
  letterSpacing?: number
  lensProps?: Record<string, unknown>
  backgroundColor?: string
  textColor?: string
  active?: boolean
  overlay?: boolean
}>
export default FluidGlass
