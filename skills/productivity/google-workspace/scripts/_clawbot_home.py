"""Resolve CLAWBOT_HOME for standalone skill scripts.

Skill scripts may run outside the Clawbot process (e.g. system Python,
nix env, CI) where ``clawbot_constants`` is not importable.  This module
provides the same ``get_clawbot_home()`` and ``display_clawbot_home()``
contracts as ``clawbot_constants`` without requiring it on ``sys.path``.

When ``clawbot_constants`` IS available it is used directly so that any
future enhancements (profile resolution, Docker detection, etc.) are
picked up automatically.  The fallback path replicates the core logic
from ``clawbot_constants.py`` using only the stdlib.

All scripts under ``google-workspace/scripts/`` should import from here
instead of duplicating the ``CLAWBOT_HOME = Path(os.getenv(...))`` pattern.
"""

from __future__ import annotations

import os
from pathlib import Path

try:
    from clawbot_constants import display_clawbot_home as display_clawbot_home
    from clawbot_constants import get_clawbot_home as get_clawbot_home
except (ModuleNotFoundError, ImportError):

    def get_clawbot_home() -> Path:
        """Return the Clawbot home directory (default: ~/.clawbot).

        Mirrors ``clawbot_constants.get_clawbot_home()``."""
        val = os.environ.get("CLAWBOT_HOME", "").strip()
        return Path(val) if val else Path.home() / ".clawbot"

    def display_clawbot_home() -> str:
        """Return a user-friendly ``~/``-shortened display string.

        Mirrors ``clawbot_constants.display_clawbot_home()``."""
        home = get_clawbot_home()
        try:
            return "~/" + str(home.relative_to(Path.home()))
        except ValueError:
            return str(home)
