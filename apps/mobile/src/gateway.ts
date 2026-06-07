export type GatewayEvent = {
  event: string
  session_id?: string
  payload?: Record<string, unknown>
  [key: string]: unknown
}

type JsonRpcResponse<T = unknown> = {
  id?: number | string
  result?: T
  error?: { code?: number; message?: string; data?: unknown }
}

type PendingRequest = {
  resolve: (value: unknown) => void
  reject: (error: Error) => void
  timeout: number
}

const REQUEST_TIMEOUT_MS = 45_000

export class GatewayClient {
  private nextId = 1
  private pending = new Map<number, PendingRequest>()
  private socket: WebSocket | null = null

  constructor(private readonly onEvent: (event: GatewayEvent) => void) {}

  get connected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN
  }

  connect(baseUrl: string, token: string): Promise<void> {
    this.close()
    const url = buildWsUrl(baseUrl, token)

    return new Promise((resolve, reject) => {
      const socket = new WebSocket(url)
      this.socket = socket

      const fail = window.setTimeout(() => {
        socket.close()
        reject(new Error('Connection timed out'))
      }, 12_000)

      socket.addEventListener('open', () => {
        window.clearTimeout(fail)
        resolve()
      })

      socket.addEventListener('message', event => this.handleMessage(event.data))
      socket.addEventListener('error', () => {
        window.clearTimeout(fail)
        reject(new Error('Gateway WebSocket failed'))
      })
      socket.addEventListener('close', event => {
        window.clearTimeout(fail)
        this.rejectAll(new Error(event.reason || `Gateway closed (${event.code})`))
      })
    })
  }

  close(): void {
    if (this.socket && this.socket.readyState < WebSocket.CLOSING) {
      this.socket.close()
    }
    this.socket = null
    this.rejectAll(new Error('Gateway disconnected'))
  }

  request<T>(method: string, params: Record<string, unknown> = {}): Promise<T> {
    if (!this.connected || !this.socket) {
      return Promise.reject(new Error('Gateway is not connected'))
    }

    const id = this.nextId++
    const payload = JSON.stringify({ jsonrpc: '2.0', id, method, params })

    return new Promise<T>((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        this.pending.delete(id)
        reject(new Error(`${method} timed out`))
      }, REQUEST_TIMEOUT_MS)

      this.pending.set(id, {
        resolve: value => resolve(value as T),
        reject,
        timeout
      })

      this.socket?.send(payload)
    })
  }

  private handleMessage(raw: string): void {
    let data: JsonRpcResponse | GatewayEvent
    try {
      data = JSON.parse(raw)
    } catch {
      this.onEvent({ event: 'log', payload: { text: raw } })
      return
    }

    if ('id' in data && data.id !== undefined) {
      const id = Number(data.id)
      const pending = this.pending.get(id)
      if (!pending) return
      window.clearTimeout(pending.timeout)
      this.pending.delete(id)

      if ('error' in data && data.error) {
        const rpcError = data.error as { message?: string }
        pending.reject(new Error(rpcError.message || `Request ${id} failed`))
      } else {
        pending.resolve(data.result)
      }
      return
    }

    const event = normalizeEvent(data)
    if (event) this.onEvent(event)
  }

  private rejectAll(error: Error): void {
    for (const pending of this.pending.values()) {
      window.clearTimeout(pending.timeout)
      pending.reject(error)
    }
    this.pending.clear()
  }
}

export function buildWsUrl(baseUrl: string, token: string): string {
  const normalized = normalizeBaseUrl(baseUrl)
  const parsed = new URL(normalized)
  parsed.protocol = parsed.protocol === 'https:' ? 'wss:' : 'ws:'
  parsed.pathname = `${parsed.pathname.replace(/\/$/, '')}/api/ws`
  parsed.search = `?token=${encodeURIComponent(token)}`
  return parsed.toString()
}

export function normalizeBaseUrl(value: string): string {
  const trimmed = value.trim() || 'http://127.0.0.1:9120'
  if (/^https?:\/\//i.test(trimmed)) return trimmed.replace(/\/$/, '')
  return `http://${trimmed}`.replace(/\/$/, '')
}

function normalizeEvent(data: JsonRpcResponse | GatewayEvent): GatewayEvent | null {
  const anyData = data as Record<string, unknown>
  if (typeof anyData.event === 'string') return anyData as GatewayEvent
  if (typeof anyData.method === 'string') {
    const params = (anyData.params || {}) as Record<string, unknown>
    return {
      event: anyData.method,
      session_id: typeof params.session_id === 'string' ? params.session_id : undefined,
      payload: params.payload && typeof params.payload === 'object' ? (params.payload as Record<string, unknown>) : params
    }
  }
  if (typeof anyData.type === 'string') {
    return {
      event: anyData.type,
      session_id: typeof anyData.session_id === 'string' ? anyData.session_id : undefined,
      payload: anyData.payload && typeof anyData.payload === 'object' ? (anyData.payload as Record<string, unknown>) : anyData
    }
  }
  return null
}
