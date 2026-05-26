import type { ThemeColors } from './theme.js'

const RICH_RE = /\[(?:bold\s+)?(?:dim\s+)?(#(?:[0-9a-fA-F]{3,8}))\]([\s\S]*?)(\[\/\])/g

export function parseRichMarkup(markup: string): Line[] {
  const lines: Line[] = []

  for (const raw of markup.split('\n')) {
    const trimmed = raw.trimEnd()

    if (!trimmed) {
      lines.push(['', ' '])

      continue
    }

    const matches = [...trimmed.matchAll(RICH_RE)]

    if (!matches.length) {
      lines.push(['', trimmed])

      continue
    }

    let cursor = 0

    for (const m of matches) {
      const before = trimmed.slice(cursor, m.index)

      if (before) {
        lines.push(['', before])
      }

      lines.push([m[1]!, m[2]!])
      cursor = m.index! + m[0].length
    }

    if (cursor < trimmed.length) {
      lines.push(['', trimmed.slice(cursor)])
    }
  }

  return lines
}

const LOGO_MARKUP = `[bold #FF6600] ██████╗██╗      █████╗ ██╗    ██╗██████╗  ██████╗ ████████╗       █████╗  ██████╗ ███████╗███╗   ██╗████████╗[/]
[bold #FF6600]██╔════╝██║     ██╔══██╗██║    ██║██╔══██╗██╔═══██╗╚══██╔══╝      ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝[/]
[#FF8C00]██║     ██║     ███████║██║ █╗ ██║██████╔╝██║   ██║   ██║        ███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║[/]
[#FF8C00]██║     ██║     ██╔══██║██║███╗██║██╔══██╗██║   ██║   ██║        ██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║[/]
[#FF4500]╚██████╗███████╗██║  ██║╚███╔███╔╝██████╔╝╚██████╔╝   ██║        ██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║[/]
[#FF4500] ╚═════╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═════╝  ╚═════╝    ╚═╝        ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝[/]`

const CADUCEUS_MARKUP = `[#FF4500]⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣤⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀[/]
[#FF6600]⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⣿⣿⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀[/]
[#FF6600]⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⣿⣿⣿⣿⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀[/]
[#FF8C00]⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀[/]
[#FF8C00]⠀⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀[/]
[#FF8C00]⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀[/]
[#FF8C00]⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀[/]
[#FF4500]⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀[/]
[#FF4500]⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃⠀[/]
[#FF6600]⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀⠀⠀[/]
[#FF6600]⠀⠀⠀⠀⠉⠻⢿⣿⣿⣿⣿⣿⡿⠟⠉⠀⠀⠀⠀⠀[/]
[#FF8C00]⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀[/]`

export const LOGO_WIDTH = 114
export const CADUCEUS_WIDTH = 30

export const logo = (c: ThemeColors, customLogo?: string): Line[] =>
  customLogo ? parseRichMarkup(customLogo) : parseRichMarkup(LOGO_MARKUP)

export const caduceus = (c: ThemeColors, customHero?: string): Line[] =>
  customHero ? parseRichMarkup(customHero) : parseRichMarkup(CADUCEUS_MARKUP)

export const artWidth = (lines: Line[]) => lines.reduce((m, [, t]) => Math.max(m, t.length), 0)

type Line = [string, string]
