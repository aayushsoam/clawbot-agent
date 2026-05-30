<p align="center">
  <img src="assets/banner.png" alt="Clawbot Agent" width="100%">
</p>

# Clawbot Agent ⚡

<p align="center">
  <a href="https://clawbot-agent.aayushsoam.com/docs/"><img src="https://img.shields.io/badge/Docs-clawbot--agent.aayushsoam.com-FFD700?style=for-the-badge" alt="Documentation"></a>
  <a href="https://discord.gg/Aayushsoam"><img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord"></a>
  <a href="https://github.com/aayushsoam/clawbot-agent/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License: MIT"></a>
  <a href="https://github.com/aayushsoam"><img src="https://img.shields.io/badge/Built%20by-Soam%20Research-blueviolet?style=for-the-badge" alt="Built by Aayush soam"></a>
  <a href="README.zh-CN.md"><img src="https://img.shields.io/badge/Lang-中文-red?style=for-the-badge" alt="中文"></a>
</p>

**The self-improving AI agent built by [Aayush soam](https://github.com/aayushsoam).** It's the only agent with a built-in learning loop — it creates skills from experience, improves them during use, nudges itself to persist knowledge, searches its own past conversations, and builds a deepening model of who you are across sessions. Run it on a $5 VPS, a GPU cluster, or serverless infrastructure that costs nearly nothing when idle. It's not tied to your laptop — talk to it from Telegram while it works on a cloud VM.

Use any model you want — [Soam Portal](https://portal.aayushsoam.com), [OpenRouter](https://openrouter.ai) (200+ models), [NovitaAI](https://novita.ai) (AI-native cloud for Model API, Agent Sandbox, and GPU Cloud), [NVIDIA NIM](https://build.nvidia.com) (Nemotron), [Xiaomi MiMo](https://platform.xiaomimimo.com), [z.ai/GLM](https://z.ai), [Kimi/Moonshot](https://platform.moonshot.ai), [MiniMax](https://www.minimax.io), [Hugging Face](https://huggingface.co), OpenAI, or your own endpoint. Switch with `clawbot model` — no code changes, no lock-in.

<table>
<tr><td><b>A real terminal interface</b></td><td>Full TUI with multiline editing, slash-command autocomplete, conversation history, interrupt-and-redirect, and streaming tool output.</td></tr>
<tr><td><b>Lives where you do</b></td><td>Telegram, Discord, Slack, WhatsApp, Signal, and CLI — all from a single gateway process. Voice memo transcription, cross-platform conversation continuity.</td></tr>
<tr><td><b>A closed learning loop</b></td><td>Agent-curated memory with periodic nudges. Autonomous skill creation after complex tasks. Skills self-improve during use. FTS5 session search with LLM summarization for cross-session recall. <a href="https://github.com/plastic-labs/honcho">Honcho</a> dialectic user modeling. Compatible with the <a href="https://agentskills.io">agentskills.io</a> open standard.</td></tr>
<tr><td><b>Scheduled automations</b></td><td>Built-in cron scheduler with delivery to any platform. Daily reports, nightly backups, weekly audits — all in natural language, running unattended.</td></tr>
<tr><td><b>Delegates and parallelizes</b></td><td>Spawn isolated subagents for parallel workstreams. Write Python scripts that call tools via RPC, collapsing multi-step pipelines into zero-context-cost turns.</td></tr>
<tr><td><b>Runs anywhere, not just your laptop</b></td><td>Seven terminal backends — local, Docker, SSH, Singularity, Modal, Daytona, and Vercel Sandbox. Daytona and Modal offer serverless persistence — your agent's environment hibernates when idle and wakes on demand, costing nearly nothing between sessions. Run it on a $5 VPS or a GPU cluster.</td></tr>
<tr><td><b>Research-ready</b></td><td>Batch trajectory generation, trajectory compression for training the next generation of tool-calling models.</td></tr>
</table>

---

## Quick Install & Platform Support

Choose the installation path for your Operating System:

### 1. Linux, macOS, & WSL2 (Recommended)

Run this one-liner in your terminal:
```bash
curl -fsSL https://raw.githubusercontent.com/Aayushsoam/clawbot-agent/main/scripts/install.sh | bash
```

### 2. Android (Termux)

Before installing, install required packages in Termux to build native dependencies:
```bash
pkg update && pkg upgrade -y
pkg install git python binutils clang make rust pkg-config libffi openssl ca-certificates curl ripgrep ffmpeg -y
```

Then run the Android-targeted installer:
```bash
curl -fsSL https://raw.githubusercontent.com/Aayushsoam/clawbot-agent/main/scripts/install.sh | bash -s -- --target android
```
> **Note:** The Android target uses the curated `.[termux]` extra and skips Node.js, web dashboard/browser tooling, and Playwright/Chromium downloads.

### 3. Windows (Native PowerShell) — Early Beta

Run this in PowerShell (no admin rights needed):
```powershell
# 1.   
irm https://raw.githubusercontent.com/Aayushsoam/clawbot-agent/main/scripts/install.ps1 -OutFile install.ps1

# 2. 
.\install.ps1
```
The installer handles everything: uv, Python 3.11, Node.js, ripgrep, ffmpeg, and an isolated Git Bash (MinGit).

### 4. Docker (All Platforms)

Run Clawbot in a container:
```bash
# Clone the repository
git clone https://github.com/aayushsoam/clawbot-agent.git
cd clawbot-agent

# Build and start services
docker-compose up -d
```

### 5. Developer / Manual Git Clone

To build and run from source:
```bash
# Clone the repository
git clone https://github.com/aayushsoam/clawbot-agent.git
cd clawbot-agent

# Run the setup script (creates venv, installs dependencies and links command)
./setup-clawbot.sh
```

---

After installing, reload your shell and start chatting:
```bash
source ~/.bashrc    # Or source ~/.zshrc on macOS
clawbot              # Start the interactive CLI!
```

---

## Getting Started

```bash
clawbot              # Interactive CLI — start a conversation
clawbot model        # Choose your LLM provider and model
clawbot tools        # Configure which tools are enabled
clawbot config set   # Set individual config values
clawbot gateway      # Start the messaging gateway (Telegram, Discord, etc.)
clawbot setup        # Run the full setup wizard (configures everything at once)
clawbot claw migrate # Migrate from OpenClaw (if coming from OpenClaw)
clawbot update       # Update to the latest version
clawbot doctor       # Diagnose any issues
```

📖 **[Full documentation →](https://clawbot-agent.aayushsoam.com/docs/)**

## CLI vs Messaging Quick Reference

Clawbot has two entry points: start the terminal UI with `clawbot`, or run the gateway and talk to it from Telegram, Discord, Slack, WhatsApp, Signal, or Email. Once you're in a conversation, many slash commands are shared across both interfaces.

| Action | CLI | Messaging platforms |
|---------|-----|---------------------|
| Start chatting | `clawbot` | Run `clawbot gateway setup` + `clawbot gateway start`, then send the bot a message |
| Start fresh conversation | `/new` or `/reset` | `/new` or `/reset` |
| Change model | `/model [provider:model]` | `/model [provider:model]` |
| Set a personality | `/personality [name]` | `/personality [name]` |
| Retry or undo the last turn | `/retry`, `/undo` | `/retry`, `/undo` |
| Compress context / check usage | `/compress`, `/usage`, `/insights [--days N]` | `/compress`, `/usage`, `/insights [days]` |
| Browse skills | `/skills` or `/<skill-name>` | `/<skill-name>` |
| Interrupt current work | `Ctrl+C` or send a new message | `/stop` or send a new message |
| Platform-specific status | `/platforms` | `/status`, `/sethome` |

For the full command lists, see the [CLI guide](https://clawbot-agent.aayushsoam.com/docs/user-guide/cli) and the [Messaging Gateway guide](https://clawbot-agent.aayushsoam.com/docs/user-guide/messaging).

---

## Documentation

All documentation lives at **[clawbot-agent.aayushsoam.com/docs](https://clawbot-agent.aayushsoam.com/docs/)**:

| Section | What's Covered |
|---------|---------------|
| [Quickstart](https://clawbot-agent.aayushsoam.com/docs/getting-started/quickstart) | Install → setup → first conversation in 2 minutes |
| [CLI Usage](https://clawbot-agent.aayushsoam.com/docs/user-guide/cli) | Commands, keybindings, personalities, sessions |
| [Configuration](https://clawbot-agent.aayushsoam.com/docs/user-guide/configuration) | Config file, providers, models, all options |
| [Messaging Gateway](https://clawbot-agent.aayushsoam.com/docs/user-guide/messaging) | Telegram, Discord, Slack, WhatsApp, Signal, Home Assistant |
| [Security](https://clawbot-agent.aayushsoam.com/docs/user-guide/security) | Command approval, DM pairing, container isolation |
| [Tools & Toolsets](https://clawbot-agent.aayushsoam.com/docs/user-guide/features/tools) | 40+ tools, toolset system, terminal backends |
| [Skills System](https://clawbot-agent.aayushsoam.com/docs/user-guide/features/skills) | Procedural memory, Skills Hub, creating skills |
| [Memory](https://clawbot-agent.aayushsoam.com/docs/user-guide/features/memory) | Persistent memory, user profiles, best practices |
| [MCP Integration](https://clawbot-agent.aayushsoam.com/docs/user-guide/features/mcp) | Connect any MCP server for extended capabilities |
| [Cron Scheduling](https://clawbot-agent.aayushsoam.com/docs/user-guide/features/cron) | Scheduled tasks with platform delivery |
| [Context Files](https://clawbot-agent.aayushsoam.com/docs/user-guide/features/context-files) | Project context that shapes every conversation |
| [Architecture](https://clawbot-agent.aayushsoam.com/docs/developer-guide/architecture) | Project structure, agent loop, key classes |
| [Contributing](https://clawbot-agent.aayushsoam.com/docs/developer-guide/contributing) | Development setup, PR process, code style |
| [CLI Reference](https://clawbot-agent.aayushsoam.com/docs/reference/cli-commands) | All commands and flags |
| [Environment Variables](https://clawbot-agent.aayushsoam.com/docs/reference/environment-variables) | Complete env var reference |

---

## Migrating from OpenClaw

If you're coming from OpenClaw, Clawbot can automatically import your settings, memories, skills, and API keys.

**During first-time setup:** The setup wizard (`clawbot setup`) automatically detects `~/.openclaw` and offers to migrate before configuration begins.

**Anytime after install:**

```bash
clawbot claw migrate              # Interactive migration (full preset)
clawbot claw migrate --dry-run    # Preview what would be migrated
clawbot claw migrate --preset user-data   # Migrate without secrets
clawbot claw migrate --overwrite  # Overwrite existing conflicts
```

What gets imported:
- **SOUL.md** — persona file
- **Memories** — MEMORY.md and USER.md entries
- **Skills** — user-created skills → `~/.clawbot/skills/openclaw-imports/`
- **Command allowlist** — approval patterns
- **Messaging settings** — platform configs, allowed users, working directory
- **API keys** — allowlisted secrets (Telegram, OpenRouter, OpenAI, Anthropic, ElevenLabs)
- **TTS assets** — workspace audio files
- **Workspace instructions** — AGENTS.md (with `--workspace-target`)

See `clawbot claw migrate --help` for all options, or use the `openclaw-migration` skill for an interactive agent-guided migration with dry-run previews.

---

## Contributing

We welcome contributions! See the [Contributing Guide](https://clawbot-agent.aayushsoam.com/docs/developer-guide/contributing) for development setup, code style, and PR process.

Quick start for contributors — clone and go with `setup-clawbot.sh`:

```bash
git clone https://github.com/aayushsoam/clawbot-agent.git
cd clawbot-agent
./setup-clawbot.sh     # installs uv, creates venv, installs .[all], symlinks ~/.local/bin/clawbot
./clawbot              # auto-detects the venv, no need to `source` first
```

Manual path (equivalent to the above):

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv venv .venv --python 3.11
source .venv/bin/activate
uv pip install -e ".[all,dev]"
scripts/run_tests.sh
```

---

## Community

- 💬 [Discord](https://discord.gg/Aayushsoam)
- 📚 [Skills Hub](https://agentskills.io)
- 🐛 [Issues](https://github.com/aayushsoam/clawbot-agent/issues)
- 🔌 [computer-use-linux](https://github.com/avifenesh/computer-use-linux) — Linux desktop-control MCP server for Clawbot and other MCP hosts, with AT-SPI accessibility trees, Wayland/X11 input, screenshots, and compositor window targeting.
- 🔌 [ClawbotClaw](https://github.com/aayushsoam/clawbotclaw) — Community WeChat bridge: Run Clawbot Agent and OpenClaw on the same WeChat account.

---

## License

MIT — see [LICENSE](LICENSE).

Built by [Aayush soam](https://github.com/aayushsoam).
# clawbot-agent
"# clawbot-agent" 
"# clawbot-agent" 
# clawbot-agent


# clawbot-agent
