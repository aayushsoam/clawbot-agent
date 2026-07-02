"""Demo script — shows the @clack/prompts-style TUI output."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from clawbot_cli.clack_ui import (
    intro, outro, note, step, log_info, log_success, log_warn, log_error,
    separator, banner, detected, final_message, confirm, text_input, select,
    INSTALL_TAGLINES, random_tagline,
)

# ── Install-style demo ──
banner("🤖 Clawbot Agent Installer", random_tagline(INSTALL_TAGLINES))

detected("Detected", "Windows 11 (PowerShell)")

print("Install plan")
print(f"OS: windows")
print(f"Install method: uv + pip")
print(f"Requested version: latest")
print()

step(1, 3, "Preparing environment")
separator()
log_success("Python 3.11.12 found")
log_info("Active Python: 3.11.12 (C:\\Python311\\python.exe)")
log_info("Using uv package manager")
separator()

step(2, 3, "Installing Clawbot Agent")
separator()
log_success("Git already installed")
log_info("Cloning clawbot-agent repository...")
log_success("Repository cloned")
log_info("Creating virtual environment...")
log_success("Virtual environment created")
log_info("Installing dependencies...")
log_success("Dependencies installed (42 packages)")
separator()

step(3, 3, "Finalizing setup")
separator()
log_success("clawbot command linked to PATH")
log_info("Setting up browser tools...")
log_success("Playwright installed")
log_warn("Edge TTS will be installed on first use")
separator()

final_message("Clawbot Agent installed successfully (v0.14.0)!",
              "Your AI agent is ready. Time to build something amazing.")

print("· Starting setup")
print()

# ── Setup wizard-style demo ──
intro("Clawbot Agent Setup", "Let's configure your AI agent. Press Ctrl+C to exit.")

note("Security Disclaimer", 
     "Clawbot is a personal AI agent built by Aayush Soam.\n"
     "By default, it runs as a single-user agent.\n"
     "Be careful with tool access and keep secrets safe.\n"
     "\n"
     "Recommended baseline:\n"
     "- Use pairing/allowlists for messaging platforms\n"
     "- Keep secrets out of the agent's reachable filesystem\n"
     "- Use the strongest available model for tool-enabled bots")

# Non-interactive: just show the visual, don't wait for input
separator()
print("◆  Setup mode")
print("│  ● QuickStart (recommended)")
print("│  ○ Manual setup")
separator()

print("◆  Model/auth provider")
print("│  ○ OpenAI")
print("│  ○ Anthropic")  
print("│  ○ Google")
print("│  ● OpenRouter (selected)")
print("│  ○ Soam Portal")
print("│  ○ Custom Provider")
separator()

print("◆  Enter your API key:")
print("│  sk-or-v1-****...****")
separator()

print("◆  Select model:")
print("│  ○ claude-opus-4.6")
print("│  ● claude-sonnet-4.6 (selected)")
print("│  ○ gpt-5.4")
print("│  ○ gemini-3-pro-preview")
separator()

log_success("Provider: OpenRouter")
log_success("Model: claude-sonnet-4.6")
log_success("Config saved to ~/.clawbot/config.yaml")

outro("Setup complete! Run 'clawbot' to start chatting. 🤖")
