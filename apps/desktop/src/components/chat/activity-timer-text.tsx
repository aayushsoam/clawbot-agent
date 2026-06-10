import { cn } from '@/lib/utils'

import { formatElapsed } from './activity-timer'

interface ActivityTimerTextProps {
  seconds: number
  className?: string
}

export function ActivityTimerText({ seconds, className }: ActivityTimerTextProps) {
  return (
    <span
      className={cn(
        // Tinted with --dt-midground so the timer reads as a live status cue
        // instead of neutral chrome.
        'shrink-0 font-mono text-[0.56rem] leading-none tracking-[0.02em] text-midground/55 tabular-nums',
        className
      )}
    >
      {formatElapsed(seconds)}
    </span>
  )
}
