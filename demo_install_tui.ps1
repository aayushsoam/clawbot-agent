# ============================================================================
# Clawbot Agent Install - TUI Demo (PowerShell)
# Run this to preview the new professional installer output
# ============================================================================

# Force UTF-8 for Unicode symbols
try {
    [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
} catch {}

# ── Copy of the new Write-* functions from install.ps1 ──

function Write-Banner {
    Write-Host ""
    Write-Host "    ██████╗██╗      █████╗ ██╗    ██╗██████╗  ██████╗ ████████╗" -ForegroundColor Magenta
    Write-Host "   ██╔════╝██║     ██╔══██╗██║    ██║██╔══██╗██╔═══██╗╚══██╔══╝" -ForegroundColor Magenta
    Write-Host "   ██║     ██║     ███████║██║ █╗ ██║██████╔╝██║   ██║   ██║   " -ForegroundColor Magenta
    Write-Host "   ██║     ██║     ██╔══██║██║███╗██║██╔══██╗██║   ██║   ██║   " -ForegroundColor Magenta
    Write-Host "   ╚██████╗███████╗██║  ██║╚███╔███╔╝██████╔╝╚██████╔╝   ██║   " -ForegroundColor Magenta
    Write-Host "    ╚═════╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═════╝  ╚═════╝    ╚═╝   " -ForegroundColor Magenta
    Write-Host ""
    Write-Host "  🤖 Clawbot Agent Installer" -ForegroundColor White
    Write-Host "  Built different. Built by Aayush Soam." -ForegroundColor Cyan
    Write-Host ""
}

function Write-Step {
    param([int]$Current, [int]$Total, [string]$Title)
    Write-Host ""
    Write-Host -NoNewline "[$Current/$Total]" -ForegroundColor Magenta
    Write-Host " $Title" -ForegroundColor White
}

function Write-Bar {
    Write-Host "│" -ForegroundColor DarkCyan
}

function Write-Info {
    param([string]$Message)
    Write-Host -NoNewline "│" -ForegroundColor DarkCyan
    Write-Host -NoNewline "  · " -ForegroundColor DarkGray
    Write-Host "$Message" -ForegroundColor DarkGray
}

function Write-Success {
    param([string]$Message)
    Write-Host -NoNewline "│" -ForegroundColor DarkCyan
    Write-Host -NoNewline "  ✓ " -ForegroundColor Green
    Write-Host "$Message"
}

function Write-Warn {
    param([string]$Message)
    Write-Host -NoNewline "│" -ForegroundColor DarkCyan
    Write-Host -NoNewline "  ⚠ " -ForegroundColor Yellow
    Write-Host "$Message" -ForegroundColor Yellow
}

function Write-Err {
    param([string]$Message)
    Write-Host -NoNewline "│" -ForegroundColor DarkCyan
    Write-Host -NoNewline "  ✗ " -ForegroundColor Red
    Write-Host "$Message" -ForegroundColor Red
}

function Write-Final {
    param([string]$Title, [string]$Tagline = "Your AI agent is ready. Time to build something amazing.")
    Write-Host ""
    Write-Host "  🤖 $Title" -ForegroundColor Green
    Write-Host "  $Tagline" -ForegroundColor Cyan
    Write-Host ""
}

# ═══════════════════════════════════════════════════════════════
# DEMO START
# ═══════════════════════════════════════════════════════════════

Write-Banner

Write-Host -NoNewline "✓" -ForegroundColor Green
Write-Host " Detected: windows"
Write-Host ""

Write-Host "Install plan" -ForegroundColor White
Write-Host "OS: windows" -ForegroundColor DarkGray
Write-Host "Install method: uv + pip" -ForegroundColor DarkGray
Write-Host "Requested version: latest" -ForegroundColor DarkGray

Write-Step -Current 1 -Total 3 -Title "Preparing environment"
Write-Bar
Write-Success "uv package manager found"
Write-Info "Active Python: 3.11.12 (C:\Python311\python.exe)"
Write-Info "Using uv for fast dependency resolution"
Write-Success "Python 3.11 found"
Write-Info "Active Node.js: v22.15.0"
Write-Success "Node.js v22 found"
Write-Success "ripgrep found"
Write-Success "ffmpeg found"
Write-Bar

Write-Step -Current 2 -Total 3 -Title "Installing Clawbot Agent"
Write-Bar
Write-Success "Git already installed"
Write-Info "Cloning clawbot-agent repository..."
Write-Success "Repository cloned"
Write-Info "Creating virtual environment..."
Write-Success "Virtual environment created (.venv)"
Write-Info "Installing dependencies (this may take a minute)..."
Write-Success "Dependencies installed (42 packages)"
Write-Bar

Write-Step -Current 3 -Total 3 -Title "Finalizing setup"
Write-Bar
Write-Success "clawbot command added to PATH"
Write-Info "Setting up MinGit (isolated Git Bash)..."
Write-Success "MinGit installed"
Write-Info "Setting up browser tools..."
Write-Success "Playwright + Chromium installed"
Write-Warn "Edge TTS will be lazy-installed on first use"
Write-Bar

Write-Final -Title "Clawbot Agent installed successfully (v0.14.0)!" -Tagline "Your AI agent is ready. Time to build something amazing."

Write-Host "· Starting setup" -ForegroundColor DarkGray
Write-Host ""

# ── Setup Wizard Preview ──

Write-Host "┌  ⚡ Clawbot Agent Setup Wizard" -ForegroundColor DarkCyan
Write-Host "│  Let's configure your AI agent. Press Ctrl+C to exit." -ForegroundColor DarkGray
Write-Host "│" -ForegroundColor DarkCyan
Write-Host ""

# Security Note
Write-Host "◇  Security Disclaimer ────────────────────────────────────────╮" -ForegroundColor Cyan
Write-Host "│                                                               │" -ForegroundColor DarkCyan
Write-Host "│  Clawbot is a personal AI agent built by Aayush Soam.         │" -ForegroundColor DarkCyan
Write-Host "│  By default, it runs as a single-user agent.                  │" -ForegroundColor DarkCyan
Write-Host "│  Be careful with tool access and keep secrets safe.           │" -ForegroundColor DarkCyan
Write-Host "│                                                               │" -ForegroundColor DarkCyan
Write-Host "│  Recommended baseline:                                        │" -ForegroundColor DarkCyan
Write-Host "│  - Use pairing/allowlists for messaging platforms             │" -ForegroundColor DarkCyan
Write-Host "│  - Keep secrets out of the agent's reachable filesystem       │" -ForegroundColor DarkCyan
Write-Host "│  - Use the strongest model for tool-enabled bots              │" -ForegroundColor DarkCyan
Write-Host "│                                                               │" -ForegroundColor DarkCyan
Write-Host "├───────────────────────────────────────────────────────────────╯" -ForegroundColor DarkCyan
Write-Host "│" -ForegroundColor DarkCyan

# Setup Mode
Write-Host ""
Write-Host "◆  Setup mode" -ForegroundColor Magenta
Write-Host "│  ● QuickStart (recommended)" -ForegroundColor Green
Write-Host "│  ○ Manual setup" -ForegroundColor DarkGray
Write-Host "│" -ForegroundColor DarkCyan

# Provider
Write-Host ""
Write-Host "◆  Model/auth provider" -ForegroundColor Magenta
Write-Host "│  ○ OpenAI" -ForegroundColor DarkGray
Write-Host "│  ○ Anthropic" -ForegroundColor DarkGray
Write-Host "│  ○ Google" -ForegroundColor DarkGray
Write-Host "│  ● OpenRouter" -ForegroundColor Green
Write-Host "│  ○ Soam Portal" -ForegroundColor DarkGray
Write-Host "│  ○ Custom Provider" -ForegroundColor DarkGray
Write-Host "│" -ForegroundColor DarkCyan

# API Key
Write-Host ""
Write-Host "◆  Enter your API key:" -ForegroundColor Magenta
Write-Host "│  sk-or-v1-****...****" -ForegroundColor DarkGray
Write-Host "│" -ForegroundColor DarkCyan

# Model
Write-Host ""
Write-Host "◆  Select model:" -ForegroundColor Magenta
Write-Host "│  ○ claude-opus-4.6" -ForegroundColor DarkGray
Write-Host "│  ● claude-sonnet-4.6" -ForegroundColor Green
Write-Host "│  ○ gpt-5.4" -ForegroundColor DarkGray
Write-Host "│  ○ gemini-3-pro-preview" -ForegroundColor DarkGray
Write-Host "│" -ForegroundColor DarkCyan

Write-Success "Provider: OpenRouter"
Write-Success "Model: claude-sonnet-4.6"
Write-Success "Config saved to ~/.clawbot/config.yaml"

Write-Host ""
Write-Host "│" -ForegroundColor DarkCyan
Write-Host "└  Setup complete! Run 'clawbot' to start chatting. 🤖" -ForegroundColor Green
Write-Host ""
