"""Shared ANSI color utilities for Clawbot CLI modules."""

import os
import sys


def should_use_color() -> bool:
    """Return True when colored output is appropriate.

    Respects the NO_COLOR environment variable (https://no-color.org/)
    and TERM=dumb, in addition to the existing TTY check.
    """
    if os.environ.get("NO_COLOR") is not None:
        return False
    if os.environ.get("TERM") == "dumb":
        return False
    if not sys.stdout.isatty():
        return False
    return True


class Colors:
    RESET = "\033[0m"
    BOLD = "\033[1m"
    DIM = "\033[2m"
    RED = "\033[31m"
    GREEN = "\033[32m"
    YELLOW = "\033[33m"
    BLUE = "\033[34m"
    MAGENTA = "\033[35m"
    CYAN = "\033[36m"
    WHITE = "\033[37m"
    GRAY = "\033[90m"
    # True-color brand colors (Clawbot orange theme)
    BRAND = "\033[1;38;2;255;140;0m"       # Bold orange #FF8C00
    BRAND_DIM = "\033[38;2;204;112;0m"     # Dimmer orange
    BAR_GRAY = "\033[38;2;120;120;120m"    # Sidebar │ color


def color(text: str, *codes) -> str:
    """Apply color codes to text (only when color output is appropriate)."""
    if not should_use_color():
        return text
    return "".join(codes) + text + Colors.RESET
