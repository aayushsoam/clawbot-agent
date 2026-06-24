import type { DashboardTheme, ThemeTypography, ThemeLayout } from "./types";

/**
 * Built-in dashboard themes.
 *
 * Each theme defines its own palette, typography, and layout so switching
 * themes produces visible changes beyond just color — fonts, density, and
 * corner-radius all shift to match the theme's personality.
 *
 * Theme names must stay in sync with the backend's
 * `_BUILTIN_DASHBOARD_THEMES` list in `clawbot_cli/web_server.py`.
 */

// ---------------------------------------------------------------------------
// Shared typography / layout presets
// ---------------------------------------------------------------------------

/** Default system stack — neutral, safe fallback for every platform. */
const SYSTEM_SANS =
  'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const SYSTEM_MONO =
  'ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace';

const DEFAULT_TYPOGRAPHY: ThemeTypography = {
  fontSans: SYSTEM_SANS,
  fontMono: SYSTEM_MONO,
  baseSize: "15px",
  lineHeight: "1.55",
  letterSpacing: "0",
};

const DEFAULT_LAYOUT: ThemeLayout = {
  radius: "0.5rem",
  density: "comfortable",
};

// ---------------------------------------------------------------------------
// Themes
// ---------------------------------------------------------------------------

export const defaultTheme: DashboardTheme = {
  name: "default",
  label: "Clawbot Teal",
  description: "Black background with vibrant teal accents",
  palette: {
    background: { hex: "#000000", alpha: 1 },
    midground: { hex: "#ffffff", alpha: 1 },
    foreground: { hex: "#ffffff", alpha: 1 },
    warmGlow: "rgba(0, 210, 196, 0.18)",
    noiseOpacity: 0.7,
  },
  colorOverrides: {
    primary: "#00d2c4",
    primaryForeground: "#000000",
    accent: "rgba(0, 210, 196, 0.15)",
    accentForeground: "#00d2c4",
    border: "rgba(0, 210, 196, 0.2)",
    ring: "#00d2c4",
  },
  typography: DEFAULT_TYPOGRAPHY,
  layout: DEFAULT_LAYOUT,
};

export const clawbotWhiteTheme: DashboardTheme = {
  name: "clawbot-white",
  label: "Clawbot Light",
  description: "Clean light mode layout",
  palette: {
    background: { hex: "#f1f5f9", alpha: 1 },
    midground: { hex: "#0f172a", alpha: 1 },
    foreground: { hex: "#000000", alpha: 1 },
    warmGlow: "rgba(15, 23, 42, 0.05)",
    noiseOpacity: 0.1,
  },
  colorOverrides: {
    card: "#ffffff",
    cardForeground: "#0f172a",
    popover: "#ffffff",
    popoverForeground: "#0f172a",
    border: "#cbd5e1",
  },
  componentStyles: {
    sidebar: {
      background: "#ffffff",
    },
    backdrop: {
      blendMode: "normal",
      fillerOpacity: "0",
      glowOpacity: "0",
    },
  },
  typography: DEFAULT_TYPOGRAPHY,
  layout: DEFAULT_LAYOUT,
};

export const BUILTIN_THEMES: Record<string, DashboardTheme> = {
  default: defaultTheme,
  "clawbot-white": clawbotWhiteTheme,
};

