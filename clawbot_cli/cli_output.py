"""Shared CLI output helpers for Clawbot CLI modules.

Extracts the identical ``print_info/success/warning/error`` and ``prompt()``
functions previously duplicated across setup.py, tools_config.py,
mcp_config.py, and memory_setup.py.

Also provides bar-prefixed (│) variants for use within @clack-style
wizard flows via ``clack_ui``.
"""

import getpass

from clawbot_cli.colors import Colors, color


# ─── Print Helpers ────────────────────────────────────────────────────────────


def print_info(text: str) -> None:
    """Print a dim informational message."""
    print(color(f"  {text}", Colors.DIM))


def print_success(text: str) -> None:
    """Print a green success message with ✓ prefix."""
    print(color(f"✓ {text}", Colors.GREEN))


def print_warning(text: str) -> None:
    """Print a yellow warning message with ⚠ prefix."""
    print(color(f"⚠ {text}", Colors.YELLOW))


def print_error(text: str) -> None:
    """Print a red error message with ✗ prefix."""
    print(color(f"✗ {text}", Colors.RED))


def print_header(text: str) -> None:
    """Print a bold yellow header."""
    print(color(f"\n  {text}", Colors.YELLOW))


# ─── Bar-prefixed variants (for @clack-style wizard flows) ───────────────────


def bar_info(text: str) -> None:
    """Print info with │ sidebar: ``│  · message``"""
    bar = color("│", Colors.BAR_GRAY)
    print(f"{bar}  {color('·', Colors.DIM)} {color(text, Colors.DIM)}")


def bar_success(text: str) -> None:
    """Print success with │ sidebar: ``│  ✓ message``"""
    bar = color("│", Colors.BAR_GRAY)
    print(f"{bar}  {color('✓', Colors.GREEN)} {text}")


def bar_warn(text: str) -> None:
    """Print warning with │ sidebar: ``│  ⚠ message``"""
    bar = color("│", Colors.BAR_GRAY)
    print(f"{bar}  {color('⚠', Colors.YELLOW)} {text}")


def bar_error(text: str) -> None:
    """Print error with │ sidebar: ``│  ✗ message``"""
    bar = color("│", Colors.BAR_GRAY)
    print(f"{bar}  {color('✗', Colors.RED)} {text}")


# ─── Input Prompts ────────────────────────────────────────────────────────────


def prompt(
    question: str,
    default: str | None = None,
    password: bool = False,
) -> str:
    """Prompt the user for input with optional default and password masking.

    Replaces the four independent ``_prompt()`` / ``prompt()`` implementations
    in setup.py, tools_config.py, mcp_config.py, and memory_setup.py.

    Returns the user's input (stripped), or *default* if the user presses Enter.
    Returns empty string on Ctrl-C or EOF.
    """
    suffix = f" [{default}]" if default else ""
    display = color(f"  {question}{suffix}: ", Colors.YELLOW)

    try:
        if password:
            value = getpass.getpass(display)
        else:
            value = input(display)
        value = value.strip()
        return value if value else (default or "")
    except (KeyboardInterrupt, EOFError):
        print()
        return ""


def prompt_yes_no(question: str, default: bool = True) -> bool:
    """Prompt for a yes/no answer. Returns bool."""
    hint = "Y/n" if default else "y/N"
    answer = prompt(f"{question} ({hint})")
    if not answer:
        return default
    return answer.lower().startswith("y")

