import { FormEvent, useMemo, useRef, useState } from 'react'

import { GatewayClient, GatewayEvent, normalizeBaseUrl } from './gateway'

type Role = 'user' | 'assistant' | 'system' | 'tool'

type ChatMessage = {
  id: string
  role: Role
  text: string
  status?: 'streaming' | 'complete' | 'error'
}

type SessionSummary = {
  id: string
  title?: string
  preview?: string
  message_count?: number
}

type SessionCreateResult = {
  session_id: string
  info?: {
    model?: string
    cwd?: string
  }
}

type SessionListResult = {
  sessions?: SessionSummary[]
}

type SessionHistoryResult = {
  messages?: Array<{ role?: Role; text?: string; name?: string; context?: string }>
}

const STORAGE_KEY = 'clawbot-mobile-settings'

const initialSettings = loadSettings()

export default function App() {
  const [baseUrl, setBaseUrl] = useState(initialSettings.baseUrl)
  const [token, setToken] = useState(initialSettings.token)
  const [status, setStatus] = useState<'idle' | 'connecting' | 'ready' | 'busy' | 'error'>('idle')
  const [statusText, setStatusText] = useState('Gateway offline')
  const [sessionId, setSessionId] = useState('')
  const [sessionInfo, setSessionInfo] = useState('')
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [showSettings, setShowSettings] = useState(!initialSettings.token)
  const [eventTrail, setEventTrail] = useState<string[]>([])
  const clientRef = useRef<GatewayClient | null>(null)

  const connectionLabel = useMemo(() => {
    if (status === 'ready') return 'Ready'
    if (status === 'busy') return 'Thinking'
    if (status === 'connecting') return 'Connecting'
    if (status === 'error') return 'Needs check'
    return 'Offline'
  }, [status])

  async function connect() {
    setStatus('connecting')
    setStatusText('Opening gateway')
    persistSettings(baseUrl, token)

    const client = new GatewayClient(handleGatewayEvent)
    clientRef.current = client

    try {
      await client.connect(baseUrl, token)
      setStatus('ready')
      setStatusText('Gateway ready')
      await refreshSessions(client)
      if (!sessionId) {
        await createSession(client)
      }
    } catch (error) {
      setStatus('error')
      setStatusText(errorMessage(error))
    }
  }

  async function createSession(client = clientRef.current) {
    if (!client) return
    setStatus('busy')
    try {
      const created = await client.request<SessionCreateResult>('session.create', { cols: 92 })
      setSessionId(created.session_id)
      setSessionInfo([created.info?.model, created.info?.cwd].filter(Boolean).join(' / '))
      setMessages([])
      setStatus('ready')
      setStatusText('New session ready')
    } catch (error) {
      setStatus('error')
      setStatusText(errorMessage(error))
    }
  }

  async function refreshSessions(client = clientRef.current) {
    if (!client) return
    try {
      const result = await client.request<SessionListResult>('session.list', { limit: 12 })
      setSessions(result.sessions || [])
    } catch {
      setSessions([])
    }
  }

  async function loadHistory() {
    const client = clientRef.current
    if (!client || !sessionId) return
    try {
      const result = await client.request<SessionHistoryResult>('session.history', { session_id: sessionId })
      setMessages(
        (result.messages || []).map((message, index) => ({
          id: `history-${index}`,
          role: message.role || 'system',
          text: message.text || message.context || message.name || '',
          status: 'complete'
        }))
      )
    } catch (error) {
      setStatusText(errorMessage(error))
    }
  }

  async function sendMessage(event: FormEvent) {
    event.preventDefault()
    const text = draft.trim()
    const client = clientRef.current
    if (!text || !client || !sessionId || status === 'busy') return

    setDraft('')
    setStatus('busy')
    setStatusText('Streaming')
    setMessages(current => [
      ...current,
      { id: `user-${Date.now()}`, role: 'user', text, status: 'complete' },
      { id: `assistant-${Date.now()}`, role: 'assistant', text: '', status: 'streaming' }
    ])

    try {
      await client.request('prompt.submit', { session_id: sessionId, text })
    } catch (error) {
      setStatus('error')
      setStatusText(errorMessage(error))
      markLastAssistant(errorMessage(error), 'error')
    }
  }

  function handleGatewayEvent(event: GatewayEvent) {
    if (event.session_id && sessionId && event.session_id !== sessionId) return
    const payload = event.payload || {}
    const text = typeof payload.text === 'string' ? payload.text : ''

    setEventTrail(current => [`${event.event}${text ? `: ${text.slice(0, 80)}` : ''}`, ...current].slice(0, 6))

    if (event.event === 'message.start') {
      ensureAssistantBubble()
      setStatus('busy')
      return
    }

    if (event.event === 'message.delta') {
      appendAssistant(text)
      return
    }

    if (event.event === 'message.complete') {
      replaceLastAssistant(text, payload.status === 'error' ? 'error' : 'complete')
      setStatus('ready')
      setStatusText(payload.status === 'error' ? 'Response failed' : 'Response complete')
      void refreshSessions()
      return
    }

    if (event.event === 'status.update') {
      setStatusText(text || String(payload.kind || 'Working'))
      return
    }

    if (event.event === 'error') {
      setStatus('error')
      setStatusText(text || 'Gateway error')
      markLastAssistant(text || 'Gateway error', 'error')
    }
  }

  function ensureAssistantBubble() {
    setMessages(current => {
      const last = current[current.length - 1]
      if (last?.role === 'assistant' && last.status === 'streaming') return current
      return [...current, { id: `assistant-${Date.now()}`, role: 'assistant', text: '', status: 'streaming' }]
    })
  }

  function appendAssistant(text: string) {
    if (!text) return
    setMessages(current => {
      const next = [...current]
      const last = next[next.length - 1]
      if (last?.role === 'assistant') {
        next[next.length - 1] = { ...last, text: last.text + text, status: 'streaming' }
      } else {
        next.push({ id: `assistant-${Date.now()}`, role: 'assistant', text, status: 'streaming' })
      }
      return next
    })
  }

  function replaceLastAssistant(text: string, nextStatus: ChatMessage['status']) {
    setMessages(current => {
      const next = [...current]
      const index = findLastAssistantIndex(next)
      if (index >= 0) {
        next[index] = { ...next[index], text: text || next[index].text, status: nextStatus }
      }
      return next
    })
  }

  function markLastAssistant(text: string, nextStatus: ChatMessage['status']) {
    setMessages(current => {
      const next = [...current]
      const index = findLastAssistantIndex(next)
      if (index >= 0) {
        next[index] = { ...next[index], text: next[index].text || text, status: nextStatus }
      }
      return next
    })
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">C</span>
          <div>
            <h1>Clawbot</h1>
            <p>{connectionLabel}</p>
          </div>
        </div>
        <button className="icon-button" type="button" onClick={() => setShowSettings(value => !value)} aria-label="Toggle settings">
          ⚙
        </button>
      </header>

      <section className="workspace">
        <aside className="session-rail">
          <div className="rail-actions">
            <button type="button" onClick={() => void createSession()} disabled={status === 'busy'}>
              New
            </button>
            <button type="button" onClick={() => void loadHistory()} disabled={!sessionId}>
              Sync
            </button>
          </div>
          <div className="session-list">
            {sessions.map(item => (
              <button
                className={item.id === sessionId ? 'session-item active' : 'session-item'}
                key={item.id}
                type="button"
                onClick={() => {
                  setSessionId(item.id)
                  setSessionInfo(item.preview || '')
                  setMessages([])
                }}
              >
                <span>{item.title || item.preview || 'Untitled'}</span>
                <small>{item.message_count || 0} msgs</small>
              </button>
            ))}
          </div>
        </aside>

        <section className="chat-panel">
          {showSettings && (
            <form className="settings-band" onSubmit={event => { event.preventDefault(); void connect() }}>
              <label>
                <span>Gateway</span>
                <input value={baseUrl} onChange={event => setBaseUrl(event.target.value)} placeholder="http://127.0.0.1:9120" />
              </label>
              <label>
                <span>Token</span>
                <input value={token} onChange={event => setToken(event.target.value)} placeholder="CLAWBOT_DASHBOARD_SESSION_TOKEN" type="password" />
              </label>
              <button type="submit" disabled={status === 'connecting'}>
                Connect
              </button>
            </form>
          )}

          <div className="session-strip">
            <div>
              <strong>{sessionId ? `Session ${sessionId}` : 'No session'}</strong>
              <span>{sessionInfo || statusText}</span>
            </div>
            <span className={`status-pill ${status}`}>{statusText}</span>
          </div>

          <div className="messages" aria-live="polite">
            {messages.length === 0 ? (
              <div className="empty-state">
                <span className="empty-logo">C</span>
                <h2>Clawbot Mobile</h2>
                <p>Ready for a fresh session.</p>
              </div>
            ) : (
              messages.map(message => (
                <article className={`message ${message.role} ${message.status || ''}`} key={message.id}>
                  <span>{message.role}</span>
                  <p>{message.text || (message.status === 'streaming' ? '...' : '')}</p>
                </article>
              ))
            )}
          </div>

          <form className="composer" onSubmit={sendMessage}>
            <textarea
              value={draft}
              onChange={event => setDraft(event.target.value)}
              placeholder="Message Clawbot"
              rows={1}
              onKeyDown={event => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  event.currentTarget.form?.requestSubmit()
                }
              }}
            />
            <button type="submit" disabled={!draft.trim() || !sessionId || status === 'busy'}>
              Send
            </button>
          </form>
        </section>

        <aside className="event-rail">
          <strong>Live</strong>
          {eventTrail.length === 0 ? <span>No events</span> : eventTrail.map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
        </aside>
      </section>
    </main>
  )
}

function loadSettings() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { baseUrl: 'http://127.0.0.1:9120', token: '' }
    const parsed = JSON.parse(raw) as { baseUrl?: string; token?: string }
    return {
      baseUrl: parsed.baseUrl || 'http://127.0.0.1:9120',
      token: parsed.token || ''
    }
  } catch {
    return { baseUrl: 'http://127.0.0.1:9120', token: '' }
  }
}

function persistSettings(baseUrl: string, token: string) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      baseUrl: normalizeBaseUrl(baseUrl),
      token
    })
  )
}

function findLastAssistantIndex(messages: ChatMessage[]) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index].role === 'assistant') return index
  }
  return -1
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
