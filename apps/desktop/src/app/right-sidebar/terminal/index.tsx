import '@xterm/xterm/css/xterm.css'

import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/loader'

import { cn } from '@/lib/utils'

import { addSelectionShortcutLabel } from './selection'
import { useTerminalSession } from './use-terminal-session'

interface TerminalTabProps {
  active: boolean
  cwd: string
  onAddSelectionToChat: (text: string, label?: string) => void
}

export function TerminalTab({ active, cwd, onAddSelectionToChat }: TerminalTabProps) {
  const { addSelectionToChat, hostRef, selection, selectionStyle, status } = useTerminalSession({
    cwd,
    onAddSelectionToChat
  })

  return (
    <div
      aria-hidden={!active}
      className={cn('relative min-h-0 min-w-0 flex-1 flex-col bg-black', active ? 'flex' : 'hidden')}
    >
      <div className="relative min-h-0 flex-1 bg-black p-2">
        {status === 'starting' && (
          <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
            <Loader
              className="size-8 text-(--ui-text-tertiary)"
              pathSteps={180}
              strokeScale={0.68}
              type="spiral-search"
            />
          </div>
        )}
        {selection.trim() && (
          <div className="absolute z-50 flex items-center gap-1" style={selectionStyle ?? { right: 12, top: 8 }}>
            <Button
              className="h-6 rounded-md px-2 text-[0.68rem] shadow-md backdrop-blur-md"
              onClick={event => event.preventDefault()}
              onMouseDown={event => {
                event.preventDefault()
                event.stopPropagation()
                addSelectionToChat()
              }}
              type="button"
              variant="secondary"
            >
              Add to chat
              <span className="ml-1 text-[0.6rem] text-(--ui-text-tertiary)">{addSelectionShortcutLabel()}</span>
            </Button>
          </div>
        )}
        {/* Outer div paints the dark inset; inner div is the xterm host so the
            canvas sizes to the *content* area and p-2 shows as terminal padding.
            Forcing screen/viewport bg avoids xterm's default black peeking
            through the unused pixels below the last full row. */}
        <div
          className="h-full min-h-0 overflow-hidden text-(--ui-text-secondary) [&_.xterm]:h-full [&_.xterm-screen]:bg-black! [&_.xterm-viewport]:bg-black!"
          ref={hostRef}
        />
      </div>
    </div>
  )
}
