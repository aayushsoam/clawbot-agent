# Clawbot Desktop ☤

<p align="center">
  <a href="https://github.com/ClawbotAgent/clawbot-agent/releases"><img src="https://img.shields.io/badge/Download-macOS%20%C2%B7%20Windows%20%C2%B7%20Linux-FFD700?style=for-the-badge" alt="Download"></a>
  <a href="https://clawbot-agent.clawbot.com/docs/"><img src="https://img.shields.io/badge/Docs-clawbot--agent.clawbot.com-FFD700?style=for-the-badge" alt="Documentation"></a>
  <a href="https://discord.gg/ClawbotAgent"><img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord"></a>
  <a href="https://github.com/ClawbotAgent/clawbot-agent/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License: MIT"></a>
</p>

**The native desktop app for [Clawbot Agent](../../README.md) — the self-improving AI agent from [Clawbot Agent](https://clawbot.com).** Same agent, same skills, same memory as the CLI and gateway, in a polished native window — chat with streaming tool output, side-by-side previews, a file browser, voice, and settings, no terminal required. Available for **macOS, Windows, and Linux**.

<table>
<tr><td><b>Chat with the full agent</b></td><td>Streaming responses, live tool activity, structured tool summaries, and the same conversation history as every other Clawbot surface.</td></tr>
<tr><td><b>Side-by-side previews</b></td><td>Render web pages, files, and tool outputs in a right-hand pane while you keep chatting.</td></tr>
<tr><td><b>File browser</b></td><td>Explore and preview the working directory without leaving the app.</td></tr>
<tr><td><b>Voice</b></td><td>Talk to Clawbot and hear it back.</td></tr>
<tr><td><b>Settings & onboarding</b></td><td>Manage providers, models, tools, and credentials from a real UI. First-run setup gets you to your first message in seconds.</td></tr>
<tr><td><b>Stays current</b></td><td>Built-in updates pull the latest agent and rebuild the app in place.</td></tr>
</table>

---

## Install

### Install with Clawbot (recommended)

Already have the Clawbot CLI? Just run:

```bash
clawbot desktop
```

It builds and launches the GUI against your existing install — same config, keys, sessions, and skills. On first launch Clawbot walks you through picking a provider and model; nothing else to configure.

### Prebuilt installers

Prebuilt installers are built and distributed via [the Clawbot Desktop website.](https://clawbot-agent.clawbot.com/desktop).

---

## Updating

The app checks for updates in the background and offers a one-click update when one is ready. You can also update any time from the CLI:

```bash
clawbot update
```

---

## Requirements

The installer handles everything for you (Python 3.11+, a portable Git, ripgrep).

---

## Development

Want to hack on the app itself? Install workspace deps from the repo root once, then run the dev server from this directory:

```bash
npm install          # from repo root — links apps/desktop, web, apps/shared
cd apps/desktop
npm run dev          # Vite renderer + Electron, which boots the Python backend
```

Point the app at a specific source checkout, or sandbox it away from your real config:

```bash
CLAWBOT_DESKTOP_CLAWBOT_ROOT=/path/to/clone npm run dev
CLAWBOT_HOME=/tmp/throwaway npm run dev
npm run dev:fake-boot   # exercise the startup overlay with deterministic delays
```

### Building installers

```bash
npm run dist:mac     # DMG + zip
npm run dist:win     # NSIS + MSI
npm run dist:linux   # AppImage + deb + rpm
npm run pack         # unpacked app under release/ (no installer)
```

Installers are built and uploaded to GitHub Releases manually. macOS/Windows signing & notarization happen automatically when the relevant credentials are present in the environment (`CSC_LINK` / `CSC_KEY_PASSWORD` / `APPLE_*` for macOS, `WIN_CSC_*` for Windows).

### How it works

The packaged app ships only the Electron shell. On first launch it installs the Clawbot Agent runtime into `CLAWBOT_HOME` (`~/.clawbot`, or `%LOCALAPPDATA%\clawbot` on Windows) — the **same layout a CLI install uses**, so the two are interchangeable. The renderer (React, in `src/`) talks to a `clawbot dashboard` backend over the standard gateway APIs and reuses the embedded TUI rather than reimplementing chat. The install, backend-resolution, and self-update logic all live in `electron/main.cjs`.

### Verification

Run before opening a PR (lint may surface pre-existing warnings but must exit cleanly):

```bash
npm run fix
npm run type-check
npm run lint
npm run test:desktop:all
```

### Troubleshooting

Boot logs land in `CLAWBOT_HOME/logs/desktop.log` (includes backend output and recent Python tracebacks) — check it first if the app reports a boot failure.

**macOS / Linux:**

```bash
# Force a clean first-launch setup
rm "$HOME/.clawbot/clawbot-agent/.clawbot-bootstrap-complete"
# Rebuild a broken Python venv
rm -rf "$HOME/.clawbot/clawbot-agent/venv"
# Reset a stuck macOS microphone prompt (macOS only)
tccutil reset Microphone com.clawbot.agent
```

**Windows (PowerShell):**

```powershell
# Force a clean first-launch setup
Remove-Item "$env:LOCALAPPDATA\clawbot\clawbot-agent\.clawbot-bootstrap-complete"
# Rebuild a broken Python venv
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\clawbot\clawbot-agent\venv"
```

> The default Clawbot home on Windows is `%LOCALAPPDATA%\clawbot`. Set the `CLAWBOT_HOME` env var if you've relocated it.

---

## Community

- 💬 [Discord](https://discord.gg/ClawbotAgent)
- 📖 [Documentation](https://clawbot-agent.clawbot.com/docs/)
- 🐛 [Issues](https://github.com/ClawbotAgent/clawbot-agent/issues)

---

## License

MIT — see [LICENSE](../../LICENSE).

Built by [Clawbot Agent](https://clawbot.com).
