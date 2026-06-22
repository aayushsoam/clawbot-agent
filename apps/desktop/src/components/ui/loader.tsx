import type { CSSProperties, ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export const LOADER_TYPES = [
  'original-thinking',
  'thinking-five',
  'thinking-nine',
  'rose-orbit',
  'rose-curve',
  'rose-two',
  'rose-three',
  'rose-four',
  'lissajous-drift',
  'lemniscate-bloom',
  'hypotrochoid-loop',
  'three-petal-spiral',
  'four-petal-spiral',
  'five-petal-spiral',
  'six-petal-spiral',
  'butterfly-phase',
  'cardioid-glow',
  'cardioid-heart',
  'heart-wave',
  'spiral-search',
  'fourier-flow'
] as const

export type LoaderType = (typeof LOADER_TYPES)[number]

interface LoaderProps extends Omit<ComponentProps<'div'>, 'children'> {
  label?: string
  pathSteps?: number
  strokeScale?: number
  type?: LoaderType
  size?: number
}

export function Loader({
  className,
  size = 28,
  label = 'Loading',
  pathSteps,
  strokeScale,
  type,
  ...props
}: LoaderProps) {
  return (
    <div
      {...props}
      aria-label={props['aria-label'] ?? label}
      className={cn('inline-grid place-items-center', className)}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 42 42"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        style={{ '--on': 'currentColor', '--off': 'rgba(128, 128, 128, 0.2)', '--dur': '2.100s' } as CSSProperties}
      >
        <title>{label}</title>
        <style>{`
          circle { fill: var(--off); }
          circle.on { fill: var(--on); }
          @media (prefers-reduced-motion: reduce) { circle { animation: none !important; } }
          @keyframes f01111101101110 { 0% { opacity: 0; } 7.13% { opacity: 0; } 7.14% { opacity: 1; } 42.85% { opacity: 1; } 42.86% { opacity: 0; } 49.99% { opacity: 0; } 50.00% { opacity: 1; } 64.28% { opacity: 1; } 64.29% { opacity: 0; } 71.42% { opacity: 0; } 71.43% { opacity: 1; } 92.85% { opacity: 1; } 92.86% { opacity: 0; } 100% { opacity: 0; } }
          @keyframes f00111101101110 { 0% { opacity: 0; } 14.28% { opacity: 0; } 14.29% { opacity: 1; } 42.85% { opacity: 1; } 42.86% { opacity: 0; } 49.99% { opacity: 0; } 50.00% { opacity: 1; } 64.28% { opacity: 1; } 64.29% { opacity: 0; } 71.42% { opacity: 0; } 71.43% { opacity: 1; } 92.85% { opacity: 1; } 92.86% { opacity: 0; } 100% { opacity: 0; } }
          @keyframes f00011101101110 { 0% { opacity: 0; } 21.42% { opacity: 0; } 21.43% { opacity: 1; } 42.85% { opacity: 1; } 42.86% { opacity: 0; } 49.99% { opacity: 0; } 50.00% { opacity: 1; } 64.28% { opacity: 1; } 64.29% { opacity: 0; } 71.42% { opacity: 0; } 71.43% { opacity: 1; } 92.85% { opacity: 1; } 92.86% { opacity: 0; } 100% { opacity: 0; } }
          @keyframes f00001101101110 { 0% { opacity: 0; } 28.56% { opacity: 0; } 28.57% { opacity: 1; } 42.85% { opacity: 1; } 42.86% { opacity: 0; } 49.99% { opacity: 0; } 50.00% { opacity: 1; } 64.28% { opacity: 1; } 64.29% { opacity: 0; } 71.42% { opacity: 0; } 71.43% { opacity: 1; } 92.85% { opacity: 1; } 92.86% { opacity: 0; } 100% { opacity: 0; } }
          @keyframes f00000101101110 { 0% { opacity: 0; } 35.70% { opacity: 0; } 35.71% { opacity: 1; } 42.85% { opacity: 1; } 42.86% { opacity: 0; } 49.99% { opacity: 0; } 50.00% { opacity: 1; } 64.28% { opacity: 1; } 64.29% { opacity: 0; } 71.42% { opacity: 0; } 71.43% { opacity: 1; } 92.85% { opacity: 1; } 92.86% { opacity: 0; } 100% { opacity: 0; } }
        `}</style>
        <circle cx="3" cy="3" r="2" />
        <circle cx="9" cy="3" r="2" />
        <circle cx="15" cy="3" r="2" />
        <circle cx="21" cy="3" r="2" />
        <circle cx="27" cy="3" r="2" />
        <circle className="on" cx="27" cy="3" r="2" opacity={0} style={{ animation: 'f01111101101110 var(--dur) linear infinite' }} />
        <circle cx="33" cy="3" r="2" />
        <circle cx="39" cy="3" r="2" />
        <circle cx="3" cy="9" r="2" />
        <circle cx="9" cy="9" r="2" />
        <circle cx="15" cy="9" r="2" />
        <circle cx="21" cy="9" r="2" />
        <circle className="on" cx="21" cy="9" r="2" opacity={0} style={{ animation: 'f01111101101110 var(--dur) linear infinite' }} />
        <circle cx="27" cy="9" r="2" />
        <circle cx="33" cy="9" r="2" />
        <circle cx="39" cy="9" r="2" />
        <circle cx="3" cy="15" r="2" />
        <circle cx="9" cy="15" r="2" />
        <circle cx="15" cy="15" r="2" />
        <circle className="on" cx="15" cy="15" r="2" opacity={0} style={{ animation: 'f00111101101110 var(--dur) linear infinite' }} />
        <circle cx="21" cy="15" r="2" />
        <circle className="on" cx="21" cy="15" r="2" opacity={0} style={{ animation: 'f00111101101110 var(--dur) linear infinite' }} />
        <circle cx="27" cy="15" r="2" />
        <circle cx="33" cy="15" r="2" />
        <circle cx="39" cy="15" r="2" />
        <circle cx="3" cy="21" r="2" />
        <circle cx="9" cy="21" r="2" />
        <circle className="on" cx="9" cy="21" r="2" opacity={0} style={{ animation: 'f00011101101110 var(--dur) linear infinite' }} />
        <circle cx="15" cy="21" r="2" />
        <circle className="on" cx="15" cy="21" r="2" opacity={0} style={{ animation: 'f00011101101110 var(--dur) linear infinite' }} />
        <circle cx="21" cy="21" r="2" />
        <circle className="on" cx="21" cy="21" r="2" opacity={0} style={{ animation: 'f00011101101110 var(--dur) linear infinite' }} />
        <circle cx="27" cy="21" r="2" />
        <circle className="on" cx="27" cy="21" r="2" opacity={0} style={{ animation: 'f00011101101110 var(--dur) linear infinite' }} />
        <circle cx="33" cy="21" r="2" />
        <circle className="on" cx="33" cy="21" r="2" opacity={0} style={{ animation: 'f00011101101110 var(--dur) linear infinite' }} />
        <circle cx="39" cy="21" r="2" />
        <circle cx="3" cy="27" r="2" />
        <circle cx="9" cy="27" r="2" />
        <circle cx="15" cy="27" r="2" />
        <circle cx="21" cy="27" r="2" />
        <circle className="on" cx="21" cy="27" r="2" opacity={0} style={{ animation: 'f00001101101110 var(--dur) linear infinite' }} />
        <circle cx="27" cy="27" r="2" />
        <circle className="on" cx="27" cy="27" r="2" opacity={0} style={{ animation: 'f00001101101110 var(--dur) linear infinite' }} />
        <circle cx="33" cy="27" r="2" />
        <circle cx="39" cy="27" r="2" />
        <circle cx="3" cy="33" r="2" />
        <circle cx="9" cy="33" r="2" />
        <circle cx="15" cy="33" r="2" />
        <circle cx="21" cy="33" r="2" />
        <circle className="on" cx="21" cy="33" r="2" opacity={0} style={{ animation: 'f00000101101110 var(--dur) linear infinite' }} />
        <circle cx="27" cy="33" r="2" />
        <circle cx="33" cy="33" r="2" />
        <circle cx="39" cy="33" r="2" />
        <circle cx="3" cy="39" r="2" />
        <circle cx="9" cy="39" r="2" />
        <circle cx="15" cy="39" r="2" />
        <circle className="on" cx="15" cy="39" r="2" opacity={0} style={{ animation: 'f00000101101110 var(--dur) linear infinite' }} />
        <circle cx="21" cy="39" r="2" />
        <circle cx="27" cy="39" r="2" />
        <circle cx="33" cy="39" r="2" />
        <circle cx="39" cy="39" r="2" />
      </svg>
    </div>
  )
}
