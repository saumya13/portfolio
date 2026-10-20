import { Blob, Shader } from 'shaders/react'
import { useState } from 'react'

// A slow, soft blob from the shaders library, lime only, small and diffused.
// If the browser can't run the shader, a blurred CSS gradient stands in for it.
export function BlobBackground({ className = '' }: { className?: string }) {
  const [unavailable, setUnavailable] = useState(false)

  return (
    <div aria-hidden className={`${className} pointer-events-none`}>
      {unavailable ? (
        <div className="absolute left-1/2 top-1/2 size-[34vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#f6ffd1,var(--lime)_55%,#cdf55f)] opacity-70 blur-3xl" />
      ) : (
        <Shader className="size-full" colorSpace="srgb" disableTelemetry onUnavailable={() => setUnavailable(true)}>
          <Blob
            colorA="#e8ff8b"
            colorB="#cdf55f"
            highlightColor="#f6ffd1"
            size={0.45}
            deformation={0.9}
            softness={1}
            highlightIntensity={0.1}
            speed={0.3}
          />
        </Shader>
      )}
    </div>
  )
}
