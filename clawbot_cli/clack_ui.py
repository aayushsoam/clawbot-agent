"""Clawbot CLI @clack/prompts-style TUI components for Clawbot CLI.

Provides professional terminal UI elements with box-drawing characters,
diamond markers, vertical sidebars, and colored output — all in pure
Python with zero additional dependencies beyond ``clawbot_cli.colors``.

Usage::

    from clawbot_cli.clack_ui import intro, outro, note, select, confirm, text_input

    intro("Clawbot Agent setup", "Built different. Built by Aayush Soam.")
    name = text_input("What is your name?", placeholder="Aayush")
    idx = select("Choose provider", [
        {"value": "openai", "label": "OpenAI", "hint": "GPT-5"},
        {"value": "anthropic", "label": "Anthropic", "hint": "Claude"},
    ])
    ok = confirm("Continue?", default=True)
    outro("Setup complete! Run 'clawbot' to start.")

Visual output mirrors the @clack/prompts Node.js library::

    ┌  Clawbot Agent setup
    │
    ◇  What is your name?
    │  Aayush
    │
    ◆  Choose provider
    │  ○ OpenAI — GPT-5
    │  ● Anthropic — Claude
    │
    ◆  Continue?
    │  ● Yes / ○ No
    │
    └  Setup complete! Run 'clawbot' to start.
"""

from __future__ import annotations

import getpass
import os
import re
import shutil
import sys
from typing import Any, Callable, Dict, List, Optional, Sequence

from clawbot_cli.colors import Colors, color, should_use_color

# ─── Box-drawing symbols ────────────────────────────────────────────────────

S_BAR = "│"
S_BAR_H = "─"
S_CORNER_TOP_LEFT = "┌"
S_CORNER_BOTTOM_LEFT = "└"
S_CONNECT_LEFT = "├"
S_CORNER_TOP_RIGHT = "╮"
S_CORNER_BOTTOM_RIGHT = "╯"
S_STEP_ACTIVE = "◆"
S_STEP_DONE = "◇"
S_RADIO_ACTIVE = "●"
S_RADIO_INACTIVE = "○"
S_CHECKBOX_ACTIVE = "◻"  # ▪ alternative
S_CHECKBOX_CHECKED = "◼"
S_CHECK = "✓"
S_WARN = "⚠"
S_ERROR = "✗"
S_INFO = "·"

# ─── Color palette ──────────────────────────────────────────────────────────

# Customize these for the Clawbot brand (orange/amber tones)
_BRAND = "\033[1;38;2;255;140;0m"     # Bold orange #FF8C00
_BRAND_DIM = "\033[38;2;204;112;0m"   # Dimmer orange
_BAR_COLOR = "\033[38;2;120;120;120m"  # Gray for │ sidebar
_TITLE_COLOR = "\033[1;38;2;255;165;0m"  # Bold amber for titles
_GREEN = Colors.GREEN
_YELLOW = Colors.YELLOW
_RED = Colors.RED
_DIM = Colors.DIM
_BOLD = Colors.BOLD
_CYAN = Colors.CYAN
_RESET = Colors.RESET


def _c(text: str, *codes: str) -> str:
    """Apply ANSI codes only when color output is appropriate."""
    if not should_use_color():
        return text
    return "".join(codes) + text + _RESET


def _bar() -> str:
    """Return a colored │ bar."""
    return _c(S_BAR, _BAR_COLOR)


def _term_width() -> int:
    """Get current terminal width, clamped to a minimum of 40."""
    try:
        return max(shutil.get_terminal_size((80, 24)).columns, 40)
    except Exception:
        return 80


# ─── Sanitization ───────────────────────────────────────────────────────────

_BRACKETED_PASTE = re.compile(r"\x1b\[\s*200~|\x1b\[\s*201~")


def _sanitize(value: str) -> str:
    """Strip terminal bracketed-paste control markers."""
    if not value:
        return value
    return _BRACKETED_PASTE.sub("", value).strip()


# ═══════════════════════════════════════════════════════════════════════════
# PUBLIC API
# ═══════════════════════════════════════════════════════════════════════════


def intro(title: str, tagline: str = "") -> None:
    """Print the wizard intro header.

    Output::

        ┌  Clawbot Agent setup
        │  Built different. Built by Aayush Soam.
        │
    """
    print()
    corner = _c(S_CORNER_TOP_LEFT, _BAR_COLOR)
    print(f"{corner}  {_c(title, _TITLE_COLOR)}")
    if tagline:
        print(f"{_bar()}  {_c(tagline, _DIM)}")
    print(_bar())


def outro(message: str, symbol: str = "") -> None:
    """Print the wizard outro footer.

    Output::

        │
        └  Setup complete!
    """
    print(_bar())
    corner = _c(S_CORNER_BOTTOM_LEFT, _BAR_COLOR)
    if symbol:
        print(f"{corner}  {_c(symbol, _GREEN)} {message}")
    else:
        print(f"{corner}  {_c(message, _GREEN)}")
    print()


def step(current: int, total: int, title: str) -> None:
    """Print a step/phase header with progress counter.

    Output::

        [2/3] Installing Clawbot Agent
    """
    print()
    counter = _c(f"[{current}/{total}]", _BRAND)
    print(f"{counter} {_c(title, _BOLD)}")


def note(title: str, body: str) -> None:
    """Print a bordered info box with sidebar.

    Output::

        ◇  Security disclaimer ─────────────────────╮
        │                                             │
        │  Some important text here.                  │
        │  More text.                                 │
        │                                             │
        ├─────────────────────────────────────────────╯
    """
    w = _term_width()
    # Calculate box width: leave room for "│  " prefix and " │" suffix
    content_width = w - 6  # "│  " (3) + content + " │" (2) + margin (1)
    if content_width < 20:
        content_width = 20
    box_inner = content_width + 2  # padding inside box

    # Top line: ◇  Title ─────╮
    diamond = _c(S_STEP_DONE, _CYAN)
    title_text = f"  {title} "
    dashes_count = max(box_inner - len(title) - 2, 4)
    dashes = S_BAR_H * dashes_count
    print(f"{diamond}{title_text}{_c(dashes + S_CORNER_TOP_RIGHT, _BAR_COLOR)}")

    # Empty line
    padding = " " * box_inner
    print(f"{_bar()}{padding}{_c(S_BAR, _BAR_COLOR)}")

    # Body lines
    lines = body.split("\n")
    for line in lines:
        # Wrap long lines
        while len(line) > content_width:
            chunk = line[:content_width]
            line = line[content_width:]
            pad = " " * max(0, content_width - len(chunk))
            print(f"{_bar()}  {chunk}{pad} {_c(S_BAR, _BAR_COLOR)}")
        pad = " " * max(0, content_width - len(line))
        print(f"{_bar()}  {line}{pad} {_c(S_BAR, _BAR_COLOR)}")

    # Empty line
    print(f"{_bar()}{padding}{_c(S_BAR, _BAR_COLOR)}")

    # Bottom line: ├─────╯
    bottom_dashes = S_BAR_H * (box_inner + 1)
    print(f"{_c(S_CONNECT_LEFT, _BAR_COLOR)}{_c(bottom_dashes + S_CORNER_BOTTOM_RIGHT, _BAR_COLOR)}")


def text_input(
    message: str,
    *,
    placeholder: str = "",
    default: str = "",
    password: bool = False,
    required: bool = False,
) -> str:
    """Prompt for text input with @clack-style formatting.

    Output::

        │
        ◆  Enter your API key:
        │  sk-...
        │

    Returns the user's input (stripped), or *default* if empty.
    Returns empty string on Ctrl-C / EOF.
    """
    print(_bar())
    diamond = _c(S_STEP_ACTIVE, _BRAND)
    print(f"{diamond}  {_c(message, _BOLD)}")

    prompt_prefix = f"{_bar()}  "
    if default:
        hint = _c(f" [{default}]", _DIM)
        display = f"{prompt_prefix}{hint} "
    elif placeholder:
        hint = _c(f" ({placeholder})", _DIM)
        display = f"{prompt_prefix}{hint} "
    else:
        display = f"{prompt_prefix}"

    try:
        if password:
            value = getpass.getpass(display)
        else:
            value = input(display)
        value = _sanitize(value)
        result = value if value else default

        if required and not result:
            log_error("This field is required.")
            return text_input(message, placeholder=placeholder, default=default,
                              password=password, required=required)
        return result
    except (KeyboardInterrupt, EOFError):
        print()
        return default or ""


def select(
    message: str,
    options: Sequence[Dict[str, Any]],
    *,
    initial: int = 0,
    use_curses: bool = True,
) -> int:
    """Single-select prompt with @clack-style formatting.

    Each option dict should have:
        - ``label`` (str): Display text
        - ``value`` (any): Return value (not used directly, caller gets index)
        - ``hint`` (str, optional): Gray hint text after label

    When ``use_curses=True`` (default), delegates to ``curses_radiolist``
    for keyboard navigation. Falls back to numbered list on non-TTY or
    curses failure.

    Output (non-curses fallback)::

        │
        ◆  Choose provider
        │  ○ OpenAI — GPT-5
        │  ● Anthropic — Claude (selected)
        │  ○ Google — Gemini
        │

    Returns the selected index (0-based).
    """
    print(_bar())
    diamond = _c(S_STEP_ACTIVE, _BRAND)
    print(f"{diamond}  {_c(message, _BOLD)}")

    # Try curses-based interactive selection first
    if use_curses and sys.stdin.isatty():
        try:
            from clawbot_cli.curses_ui import curses_radiolist
            labels = []
            for opt in options:
                label = opt.get("label", str(opt.get("value", "")))
                hint = opt.get("hint", "")
                if hint:
                    labels.append(f"{label} — {hint}")
                else:
                    labels.append(label)

            idx = curses_radiolist(message, labels, selected=initial, cancel_returns=-1)
            if idx < 0:
                idx = initial  # ESC → keep default

            # Show the result in clack style
            selected_label = options[idx].get("label", str(options[idx].get("value", "")))
            selected_hint = options[idx].get("hint", "")
            display = selected_label
            if selected_hint:
                display += f" — {selected_hint}"
            print(f"{_bar()}  {_c(display, _DIM)}")
            return idx
        except Exception:
            pass  # Fall through to numbered fallback

    # Numbered fallback for non-TTY or curses failure
    for i, opt in enumerate(options):
        label = opt.get("label", str(opt.get("value", "")))
        hint = opt.get("hint", "")
        if i == initial:
            marker = _c(S_RADIO_ACTIVE, _GREEN)
            text = _c(label, _BOLD)
        else:
            marker = _c(S_RADIO_INACTIVE, _DIM)
            text = label
        if hint:
            text += _c(f" — {hint}", _DIM)
        print(f"{_bar()}  {marker} {text}")

    print(_bar())

    try:
        raw = input(f"{_bar()}  {_c('Enter number', _DIM)} [{initial + 1}]: ")
        raw = _sanitize(raw)
        if not raw:
            return initial
        num = int(raw) - 1
        if 0 <= num < len(options):
            return num
        return initial
    except (ValueError, KeyboardInterrupt, EOFError):
        return initial


def confirm(message: str, *, default: bool = True) -> bool:
    """Yes/No confirm prompt with @clack-style formatting.

    Output::

        │
        ◆  Continue with setup?
        │  ● Yes / ○ No
        │

    Returns bool.
    """
    print(_bar())
    diamond = _c(S_STEP_ACTIVE, _BRAND)
    print(f"{diamond}  {_c(message, _BOLD)}")

    if default:
        yes_marker = _c(S_RADIO_ACTIVE, _GREEN)
        no_marker = _c(S_RADIO_INACTIVE, _DIM)
        hint = "Y/n"
    else:
        yes_marker = _c(S_RADIO_INACTIVE, _DIM)
        no_marker = _c(S_RADIO_ACTIVE, _GREEN)
        hint = "y/N"

    print(f"{_bar()}  {yes_marker} Yes / {no_marker} No")

    try:
        raw = input(f"{_bar()}  {_c(f'({hint})', _DIM)} ")
        raw = _sanitize(raw).lower()
        if not raw:
            return default
        return raw.startswith("y")
    except (KeyboardInterrupt, EOFError):
        print()
        return default


def log_info(message: str) -> None:
    """Print an info message with │ sidebar.

    Output: ``│  · Some info``
    """
    print(f"{_bar()}  {_c(S_INFO, _DIM)} {_c(message, _DIM)}")


def log_success(message: str) -> None:
    """Print a success message with │ sidebar.

    Output: ``│  ✓ Something succeeded``
    """
    print(f"{_bar()}  {_c(S_CHECK, _GREEN)} {message}")


def log_warn(message: str) -> None:
    """Print a warning message with │ sidebar.

    Output: ``│  ⚠ Watch out``
    """
    print(f"{_bar()}  {_c(S_WARN, _YELLOW)} {message}")


def log_error(message: str) -> None:
    """Print an error message with │ sidebar.

    Output: ``│  ✗ Something failed``
    """
    print(f"{_bar()}  {_c(S_ERROR, _RED)} {message}")


def separator() -> None:
    """Print a blank bar line for visual spacing.

    Output: ``│``
    """
    print(_bar())


def banner(text: str, subtitle: str = "") -> None:
    """Print a large branded banner/title.

    Output::

        🤖 Clawbot Agent Installer
        Built different. Built by Aayush Soam.
    """
    print()
    print(f"  {_c(text, _BRAND)}")
    if subtitle:
        print(f"  {_c(subtitle, _DIM)}")
    print()


def install_plan(os_name: str, method: str, version: str = "latest") -> None:
    """Print an install plan summary box.

    Output::

        Install plan
        OS: linux
        Install method: uv + pip
        Requested version: latest
    """
    print(_c("Install plan", _BOLD))
    print(f"{_c('OS:', _DIM)} {os_name}")
    print(f"{_c('Install method:', _DIM)} {method}")
    print(f"{_c('Requested version:', _DIM)} {version}")
    print()


def detected(label: str, value: str) -> None:
    """Print a detection result line.

    Output: ``✓ Detected: linux``
    """
    print(f"{_c(S_CHECK, _GREEN)} {label}: {_c(value, _BOLD)}")
    print()


def final_message(
    title: str,
    tagline: str = "",
    *,
    emoji: str = "🤖",
) -> None:
    """Print the final success message after install/setup.

    Output::

        🤖 Clawbot Agent installed successfully!
        Your AI agent is ready. Time to build something amazing.
    """
    print()
    print(f"{emoji} {_c(title, _GREEN, _BOLD)}")
    if tagline:
        print(f"{_c(tagline, _DIM)}")
    print()


# ─── Witty taglines ─────────────────────────────────────────────────────────

INSTALL_TAGLINES = [
    "Built different. Built by Aayush Soam.",
    "Your AI agent that actually remembers things.",
    "Because copy-pasting from ChatGPT is so 2024.",
    "Self-improving since before it was cool.",
    "Ready to automate your life, whether you're ready or not.",
]

SETUP_TAGLINES = [
    "Let's get you set up. This won't hurt... much.",
    "Configuration time. The fun part, obviously.",
    "A few questions and you're off to the races.",
    "Setting up your AI sidekick in 60 seconds.",
]

COMPLETE_TAGLINES = [
    "Your AI agent is ready. Time to build something amazing.",
    "Setup complete. Now go break things responsibly.",
    "All systems go. Talk to your agent with 'clawbot'.",
    "Configuration saved. Your agent awaits your command.",
]


def random_tagline(collection: list[str]) -> str:
    """Pick a random tagline from a collection."""
    import random
    return random.choice(collection)
