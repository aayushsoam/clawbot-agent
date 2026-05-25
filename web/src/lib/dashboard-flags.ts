declare global {
  interface Window {
    /** Set true by the server only for `clawbot dashboard --tui` (or CLAWBOT_DASHBOARD_TUI=1). */
    __CLAWBOT_DASHBOARD_EMBEDDED_CHAT__?: boolean;
    /** @deprecated Older injected name; treated as on when true. */
    __CLAWBOT_DASHBOARD_TUI__?: boolean;
  }
}

/** True only when the dashboard was started with embedded TUI Chat (`clawbot dashboard --tui`). */
export function isDashboardEmbeddedChatEnabled(): boolean {
  if (typeof window === "undefined") return false;
  if (window.__CLAWBOT_DASHBOARD_EMBEDDED_CHAT__ === true) return true;
  return window.__CLAWBOT_DASHBOARD_TUI__ === true;
}
