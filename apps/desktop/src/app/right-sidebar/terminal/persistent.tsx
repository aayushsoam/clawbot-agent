import { useStore } from '@nanostores/react'
import { atom } from 'nanostores'
import { type CSSProperties, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Codicon } from '@/components/ui/codicon'
import { Tip } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import { setTerminalTakeover } from '../store'
import { TERMINAL_BG } from './selection'

import { TerminalTab } from './index'

/**
 * One xterm Terminal mounted at the layout root and CSS-overlayed onto
 * whichever `<TerminalSlot />` is active. Moving the host DOM detaches xterm's
 * WebGL renderer (it observes its own attachment) and resets the screen, so
 * the host stays put and we chase the slot's bounding rect with position:fixed.
 */

const $slot = atom<HTMLElement | null>(null)

const SLOT_CLASS = 'relative flex min-h-0 min-w-0 flex-1 flex-col'

export function TerminalSlot({ className = SLOT_CLASS }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current

    if (!el) {
      return
    }

    $slot.set(el)

    return () => {
      if ($slot.get() === el) {
        $slot.set(null)
      }
    }
  }, [])

  return <div className={className} ref={ref} />
}

interface PersistentTerminalProps {
  cwd: string
  onAddSelectionToChat: (text: string, label?: string) => void
}

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

const sameRect = (a: Rect | null, b: Rect) =>
  !!a && a.top === b.top && a.left === b.left && a.width === b.width && a.height === b.height

interface TerminalTabState {
  cwd: string
  id: number
  label: string
}

const terminalLabel = (cwd: string, index: number) => cwd?.trim() || `Terminal ${index}`

export function PersistentTerminal({ cwd, onAddSelectionToChat }: PersistentTerminalProps) {
  const slot = useStore($slot)
  const [rect, setRect] = useState<Rect | null>(null)
  const [ready, setReady] = useState(false)
  const nextTabIdRef = useRef(2)
  const [tabs, setTabs] = useState<TerminalTabState[]>(() => [{ cwd, id: 1, label: terminalLabel(cwd, 1) }])
  const [activeTabId, setActiveTabId] = useState(1)

  useLayoutEffect(() => {
    if (!slot) {
      setRect(null)

      return
    }

    let prev: Rect | null = null
    let frame = 0

    const tick = () => {
      const r = slot.getBoundingClientRect()
      // floor top/left + ceil right/bottom: overlay always covers the slot's
      // full pixel footprint, so half-pixel rects can't leak page bg through.
      const top = Math.floor(r.top)
      const left = Math.floor(r.left)
      const next: Rect = { top, left, width: Math.ceil(r.right) - left, height: Math.ceil(r.bottom) - top }

      if (!sameRect(prev, next)) {
        prev = next
        setRect(next)

        if (next.width > 0 && next.height > 0) {
          setReady(true)
        }
      }

      frame = requestAnimationFrame(tick)
    }

    tick()

    return () => cancelAnimationFrame(frame)
  }, [slot])

  const visible = Boolean(rect && rect.width > 0 && rect.height > 0)

  const style: CSSProperties = {
    position: 'fixed',
    top: rect?.top ?? 0,
    left: rect?.left ?? 0,
    width: rect?.width ?? 0,
    height: rect?.height ?? 0,
    display: 'flex',
    flexDirection: 'column',
    visibility: visible ? 'visible' : 'hidden',
    pointerEvents: visible ? 'auto' : 'none',
    zIndex: 45,
    backgroundColor: TERMINAL_BG,
    contain: 'layout size paint'
  }

  // Defer mount until real dims — booting xterm at 0×0 starts the shell at
  // 80×24, then the first ResizeObserver SIGWINCH redraws the prompt on a
  // new line. After first measurement we keep it mounted forever.
  const addTerminal = () => {
    const id = nextTabIdRef.current
    nextTabIdRef.current += 1

    setTabs(current => [...current, { cwd, id, label: terminalLabel(cwd, current.length + 1) }])
    setActiveTabId(id)
  }

  const closeTerminal = (tabId: number) => {
    if (tabs.length <= 1) {
      setTerminalTakeover(false)

      return
    }

    setTabs(current => {
      const index = current.findIndex(tab => tab.id === tabId)
      const next = current.filter(tab => tab.id !== tabId)
      const fallback = next[Math.max(0, Math.min(index, next.length - 1))]

      if (fallback && tabId === activeTabId) {
        setActiveTabId(fallback.id)
      }

      return next
    })
  }

  return (
    <div aria-hidden={!visible} style={style}>
      {ready && (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-black">
          <div className="flex h-9 shrink-0 items-center gap-1 border-b border-white/10 bg-[#111] px-2">
            <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto overflow-y-hidden">
              {tabs.map(tab => {
                const active = tab.id === activeTabId

                return (
                  <button
                    aria-pressed={active}
                    className={cn(
                      'group/terminal-tab flex h-7 min-w-0 max-w-56 shrink-0 items-center gap-2 rounded-lg px-2.5 text-left text-xs text-white/60 transition-colors hover:bg-white/8 hover:text-white',
                      active && 'bg-white/10 text-white'
                    )}
                    key={tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    title={tab.label}
                    type="button"
                  >
                    <span className="relative grid size-4 shrink-0 place-items-center">
                      <Codicon
                        className="absolute opacity-100 transition-opacity group-hover/terminal-tab:opacity-0 group-focus-visible/terminal-tab:opacity-0"
                        name="terminal"
                        size="0.8rem"
                      />
                      <span
                        aria-label={`Close ${tab.label}`}
                        className="absolute grid size-4 place-items-center rounded-sm opacity-0 transition-opacity hover:bg-white/12 group-hover/terminal-tab:opacity-100 group-focus-visible/terminal-tab:opacity-100"
                        onClick={event => {
                          event.preventDefault()
                          event.stopPropagation()
                          closeTerminal(tab.id)
                        }}
                        role="button"
                        tabIndex={-1}
                        title={`Close ${tab.label}`}
                      >
                        <Codicon name="close" size="0.75rem" />
                      </span>
                    </span>
                    <span className="truncate">{tab.label}</span>
                  </button>
                )
              })}
              <Tip label="New terminal">
                <Button
                  aria-label="New terminal"
                  className="size-7 shrink-0 rounded-lg text-white/70 hover:text-white"
                  onClick={addTerminal}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <Codicon name="add" size="0.875rem" />
                </Button>
              </Tip>
            </div>
            <Tip label={tabs.length > 1 ? 'Close terminal tab' : 'Close terminal'}>
              <Button
                aria-label={tabs.length > 1 ? 'Close terminal tab' : 'Close terminal'}
                className="size-7 shrink-0 rounded-lg text-white/70 hover:text-white"
                onClick={() => closeTerminal(activeTabId)}
                size="icon"
                type="button"
                variant="ghost"
              >
                <Codicon name="close" size="0.875rem" />
              </Button>
            </Tip>
          </div>
          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
            {tabs.map(tab => (
              <TerminalTab
                active={tab.id === activeTabId}
                cwd={tab.cwd}
                key={tab.id}
                onAddSelectionToChat={onAddSelectionToChat}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
