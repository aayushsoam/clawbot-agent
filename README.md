<p align="center">
  <img src="assets/banner.png" alt="Clawbot Agent" width="100%">
</p>

# Clawbot Agent

<p align="center">
  <a href="https://clawbot-agent.vercel.app/docs/"><img src="https://img.shields.io/badge/Docs-clawbot--agent.aayushsoam.com-FFD700?style=for-the-badge" alt="Documentation"></a>
  <a href="https://discord.gg/Aayushsoam"><img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord"></a>
  <a href="https://github.com/aayushsoam/clawbot-agent/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License: MIT"></a>
  <a href="https://github.com/aayushsoam"><img src="https://img.shields.io/badge/Built%20by-Aayush%20soam-blueviolet?style=for-the-badge" alt="Built by Aayush Soam"></a>
</p>

**Clawbot is a self-improving AI agent developed by [Aayush Soam](https://github.com/aayushsoam), combining the architecture of OpenClaw with the Hermes agent framework.** It features a built-in learning loop that generates skills from experience, refines them through use, retains knowledge proactively, searches its own conversation history, and builds a persistent model of the user over time. It can be deployed on infrastructure ranging from a $5 VPS to a GPU cluster, or on serverless environments that incur minimal cost when idle. Clawbot is not limited to local execution — it can be operated remotely, including via Telegram, while running on a cloud virtual machine.

Clawbot supports a wide range of model providers, including [Kimi/Moonshot](https://platform.moonshot.ai), [MiniMax](https://www.minimax.io), [OpenRouter](https://openrouter.ai) (200+ models), [NovitaAI](https://novita.ai), [NVIDIA NIM](https://build.nvidia.com), [Xiaomi MiMo](https://platform.xiaomimimo.com), [z.ai/GLM](https://z.ai), [Hugging Face](https://huggingface.co), OpenAI, or a custom endpoint. Providers can be switched using `clawbot model`, with no code changes or vendor lock-in required.

## Key Capabilities

| Capability | Description |
|---|---|
| **Full Terminal Interface** | A complete TUI supporting multiline editing, slash-command autocomplete, conversation history, interrupt-and-redirect, and streaming tool output. |
| **Cross-Platform Availability** | Accessible via Telegram, Discord, Slack, WhatsApp, Signal, and CLI through a unified gateway process, with voice memo transcription and conversation continuity across platforms. |
| **Closed Learning Loop** | Agent-curated memory with periodic prompts, autonomous skill creation following complex tasks, self-improving skills, FTS5 session search with LLM summarization, and [Honcho](https://github.com/plastic-labs/honcho) dialectic user modeling. Compatible with the [agentskills.io](https://agentskills.io) open standard. |
| **Scheduled Automation** | A built-in cron scheduler supporting delivery to any platform, enabling unattended execution of recurring tasks such as daily reports, nightly backups, or weekly audits, defined in natural language. |
| **Delegation and Parallelization** | Ability to spawn isolated subagents for parallel workstreams, and to write Python scripts that invoke tools via RPC, consolidating multi-step pipelines into low-overhead operations. |
| **Flexible Runtime Environments** | Seven supported terminal backends — local, Docker, SSH, Singularity, Modal, Daytona, and Vercel Sandbox — with Daytona and Modal offering serverless persistence that hibernates when idle. |
| **Research Support** | Batch trajectory generation and trajectory compression to support training of tool-calling models. |

---

## Installation

### 1. Linux, macOS, and WSL2 (Recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/Aayushsoam/clawbot-agent/main/scripts/install.sh | bash
```

### 2. Android (Termux)

Install the required build dependencies first:

```bash
pkg update && pkg upgrade -y
pkg install git python binutils clang make rust pkg-config libffi openssl ca-certificates curl ripgrep ffmpeg -y
```

Then run the Android-targeted installer:

```bash
curl -fsSL https://raw.githubusercontent.com/Aayushsoam/clawbot-agent/main/scripts/install.sh | bash -s -- --target android
```

> **Note:** The Android build uses the `.[termux]` extra and excludes Node.js, the web dashboard, browser tooling, and Playwright/Chromium downloads.

### 3. Windows (Native PowerShell — Early Beta)

```powershell
irm https://raw.githubusercontent.com/Aayushsoam/clawbot-agent/main/scripts/install.ps1 -OutFile install.ps1
.\install.ps1
```

This installer configures uv, Python 3.11, Node.js, ripgrep, ffmpeg, and an isolated Git Bash (MinGit) automatically.

### 4. Docker (All Platforms)

```bash
git clone https://github.com/aayushsoam/clawbot-agent.git
cd clawbot-agent
docker-compose up -d
```

### 5. Manual Installation from Source

```bash
git clone https://github.com/aayushsoam/clawbot-agent.git
cd clawbot-agent
./setup-clawbot.sh
```

---

Once installed, reload your shell and launch the CLI:

```bash
source ~/.bashrc    # or source ~/.zshrc on macOS
clawbot
```

---

## Getting Started

```bash
clawbot              # Launch the interactive CLI
clawbot model        # Select an LLM provider and model
clawbot tools        # Configure enabled tools
clawbot config set    # Set individual configuration values
clawbot gateway       # Start the messaging gateway (Telegram, Discord, etc.)
clawbot setup         # Run the full setup wizard
clawbot claw migrate  # Migrate from OpenClaw
clawbot update        # Update to the latest version
clawbot doctor        # Diagnose configuration issues
```

**[Full documentation →](https://clawbot-agent.vercel.app/docs/)**

## CLI vs. Messaging: Command Reference

Clawbot can be accessed via the terminal (`clawbot`) or via the gateway, which connects to Telegram, Discord, Slack, WhatsApp, Signal, or Email. Many slash commands are shared across both interfaces.

| Action | CLI | Messaging Platforms |
|---|---|---|
| Start a conversation | `clawbot` | `clawbot gateway setup` + `clawbot gateway start`, then message the bot |
| Start a new session | `/new` or `/reset` | `/new` or `/reset` |
| Change model | `/model [provider:model]` | `/model [provider:model]` |
| Set a personality | `/personality [name]` | `/personality [name]` |
| Retry or undo last turn | `/retry`, `/undo` | `/retry`, `/undo` |
| Manage context | `/compress`, `/usage`, `/insights [--days N]` | `/compress`, `/usage`, `/insights [days]` |
| Browse skills | `/skills` or `/<skill-name>` | `/<skill-name>` |
| Interrupt execution | `Ctrl+C` or new message | `/stop` or new message |
| Check platform status | `/platforms` | `/status`, `/sethome` |

For complete command references, see the [CLI Guide](https://clawbot-agent.vercel.app/docs/user-guide/cli) and [Messaging Gateway Guide](https://clawbot-agent.vercel.app/docs/user-guide/messaging).

---

## Documentation

Full documentation is available at **[clawbot-agent-Docs](https://clawbot-agent.vercel.app/docs/)**

| Section | Contents |
|---|---|
| [Quickstart](https://clawbot-agent.vercel.app/docs/getting-started/quickstart) | Installation through first conversation |
| [CLI Usage](https://clawbot-agent.vercel.app/docs/user-guide/cli) | Commands, keybindings, personalities, sessions |
| [Configuration](https://clawbot-agent.vercel.app/docs/user-guide/configuration) | Config file, providers, models, options |
| [Messaging Gateway](https://clawbot-agent.vercel.app/docs/user-guide/messaging) | Telegram, Discord, Slack, WhatsApp, Signal, Home Assistant |
| [Security](https://clawbot-agent.vercel.app/docs/user-guide/security) | Command approval, DM pairing, container isolation |
| [Tools & Toolsets](https://clawbot-agent.vercel.app/docs/user-guide/features/tools) | Tool catalog, toolset system, terminal backends |
| [Skills System](https://clawbot-agent.vercel.app/docs/user-guide/features/skills) | Procedural memory, Skills Hub, skill creation |
| [Memory](https://clawbot-agent.vercel.app/docs/user-guide/features/memory) | Persistent memory, user profiles, best practices |
| [MCP Integration](https://clawbot-agent.vercel.app/docs/user-guide/features/mcp) | Connecting MCP servers for extended capability |
| [Cron Scheduling](https://clawbot-agent.vercel.app/docs/user-guide/features/cron) | Scheduled tasks with platform delivery |
| [Context Files](https://clawbot-agent.vercel.app/docs/user-guide/features/context-files) | Project context configuration |
| [Architecture](https://clawbot-agent.vercel.app/docs/developer-guide/architecture) | Project structure, agent loop, key classes |
| [Contributing](https://clawbot-agent.vercel.app/docs/developer-guide/contributing) | Development setup, PR process, code style |
| [CLI Reference](https://clawbot-agent.vercel.app/docs/reference/cli-commands) | Complete command and flag reference |
| [Environment Variables](https://clawbot-agent.vercel.app/docs/reference/environment-variables) | Complete environment variable reference |

---

## Migrating from OpenClaw

Clawbot supports automatic migration of settings, memories, skills, and API keys from OpenClaw.

**During initial setup:** running `clawbot setup` automatically detects an existing `~/.openclaw` installation and offers migration prior to configuration.

**At any time after installation:**

```bash
clawbot claw migrate                     # Interactive migration (full preset)
clawbot claw migrate --dry-run           # Preview migration without applying changes
clawbot claw migrate --preset user-data  # Migrate without secrets
clawbot claw migrate --overwrite         # Overwrite existing conflicts
```

**Migrated data includes:**
- **SOUL.md** — persona configuration
- **Memories** — entries from MEMORY.md and USER.md
- **Skills** — user-created skills, imported to `~/.clawbot/skills/openclaw-imports/`
- **Command allowlist** — approval patterns
- **Messaging settings** — platform configuration, allowed users, working directory
- **API keys** — allowlisted credentials (Telegram, OpenRouter, OpenAI, Anthropic, ElevenLabs)
- **TTS assets** — workspace audio files
- **Workspace instructions** — AGENTS.md (via `--workspace-target`)

Run `clawbot claw migrate --help` for the full option list, or use the `openclaw-migration` skill for an interactive, agent-guided migration with dry-run previews.

---

## Contributing

Contributions are welcome. See the [Contributing Guide](https://clawbot-agent.vercel.app/docs/developer-guide/contributing) for development setup, coding standards, and the PR process.

**Quick start for contributors:**

```bash
git clone https://github.com/aayushsoam/clawbot-agent.git
cd clawbot-agent
./setup-clawbot.sh     # Installs uv, creates a virtual environment, installs .[all], and symlinks ~/.local/bin/clawbot
./clawbot              # Automatically detects the virtual environment
```

**Manual setup (equivalent to the above):**

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv venv .venv --python 3.11
source .venv/bin/activate
uv pip install -e ".[all,dev]"
scripts/run_tests.sh
```

---

## Community

- [computer-use-linux](https://github.com/avifenesh/computer-use-linux) — a Linux desktop-control MCP server for Clawbot and other MCP hosts, providing AT-SPI accessibility trees, Wayland/X11 input, screenshots, and compositor window targeting
- [Discord](https://discord.gg/Aayushsoam)
- [Skills Hub](https://agentskills.io)
- [Issues](https://github.com/aayushsoam/clawbot-agent/issues)

---

## License

Released under the MIT License. See [LICENSE](LICENSE) for details.

Developed by [Aayush Soam](https://github.com/aayushsoam).
