import { useStore } from '@nanostores/react'
import { useEffect, useRef, useState } from 'react'
import clawbotLogoUrl from '@/assets/clawbot-logo.png'

import { cn } from '@/lib/utils'
import { $desktopBoot } from '@/store/boot'
import { $gatewayState } from '@/store/session'

// Exit choreography (ms): content fades down + out, hold, then the overlay fades.
const CONTENT_OUT_MS = 360
const POST_CONTENT_HOLD_MS = 300
const OVERLAY_OUT_MS = 520
// Preview-only: how long to "connect" for, and the pause before replaying.
const PREVIEW_CONNECT_MS = 2600
const PREVIEW_REPLAY_MS = 1100

type Phase = 'live' | 'content-out' | 'overlay-out' | 'gone'

// Dev affordance: a warm Cmd+R reconnects almost instantly, so the overlay
// only flashes. Load with `?connecting=1` to force a looping preview.
function forcedPreview(): boolean {
  if (!import.meta.env.DEV || typeof window === 'undefined') {
    return false
  }

  try {
    return new URLSearchParams(window.location.search).get('connecting') === '1'
  } catch {
    return false
  }
}

export function GatewayConnectingOverlay() {
  const gatewayState = useStore($gatewayState)
  const boot = useStore($desktopBoot)
  const [previewing] = useState(forcedPreview)
  const [phase, setPhase] = useState<Phase>('live')

  const connecting = gatewayState !== 'open' && !boot.error
  // Latches once we've actually shown the overlay, so the brief frame where
  // gatewayState flips to "open" (connecting -> false) before the exit phase
  // kicks in doesn't unmount us and cause a flash.
  const shownRef = useRef(false)

  if (previewing || connecting) {
    shownRef.current = true
  }

  // Kick off the exit when connected: real connect, or a faked timer in preview.
  useEffect(() => {
    if (phase !== 'live') {
      return
    }

    if (previewing) {
      const id = window.setTimeout(() => setPhase('content-out'), PREVIEW_CONNECT_MS)

      return () => window.clearTimeout(id)
    }

    if (gatewayState === 'open' && shownRef.current) {
      setPhase('content-out')
    }
  }, [phase, previewing, gatewayState])

  // Advance the exit choreography: content-out -> overlay-out -> gone.
  useEffect(() => {
    if (phase === 'content-out') {
      const id = window.setTimeout(() => setPhase('overlay-out'), CONTENT_OUT_MS + POST_CONTENT_HOLD_MS)

      return () => window.clearTimeout(id)
    }

    if (phase === 'overlay-out') {
      const id = window.setTimeout(() => setPhase('gone'), OVERLAY_OUT_MS)

      return () => window.clearTimeout(id)
    }

    // Preview replays so we can keep watching the transition.
    if (phase === 'gone' && previewing) {
      const id = window.setTimeout(() => {
        setPhase('live')
      }, PREVIEW_REPLAY_MS)

      return () => window.clearTimeout(id)
    }
  }, [phase, previewing])

  // Boot failed — BootFailureOverlay owns the screen; don't linger behind it.
  if (boot.error && !previewing) {
    return null
  }

  // Real connect: once the fade finishes, get out of the way for good.
  if (phase === 'gone' && !previewing) {
    return null
  }

  // Never showed (e.g. gateway already up on a warm reload) — stay out.
  if (!previewing && !connecting && !shownRef.current) {
    return null
  }

  const leaving = phase !== 'live'
  const overlayHidden = phase === 'overlay-out' || phase === 'gone'

  return (
    <div
      className={cn(
        'fixed inset-0 z-[1200] grid place-items-center bg-(--ui-chat-surface-background) transition-opacity duration-500 ease-out',
        overlayHidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      )}
    >
      <style>{'@keyframes gco-ring-spin { to { transform: rotate(360deg) } }'}</style>
      <div
        className={cn(
          'relative grid place-items-center transition-all duration-300 ease-out',
          leaving ? 'scale-95 opacity-0 saturate-0' : 'scale-100 opacity-100 saturate-100'
        )}
      >
        <div
          className="absolute inset-0 rounded-full border border-white/10 border-t-white/85"
          style={{ animation: 'gco-ring-spin 1.15s linear infinite' }}
          aria-hidden="true"
        />
        <div className="absolute inset-3 rounded-full border border-white/5" aria-hidden="true" />
        <div className="relative grid h-20 w-20 place-items-center rounded-full bg-black/70 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm">
          <img
            src={clawbotLogoUrl}
            alt="Clawbot"
            className="h-18 w-18 select-none object-contain"
            draggable={false}
          />
        </div>
      </div>
    </div>
  )
}
