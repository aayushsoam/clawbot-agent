"""Regression tests for _apply_profile_override CLAWBOT_HOME guard (issue #22502).

When CLAWBOT_HOME is set to the clawbot root (e.g. systemd hardcodes
CLAWBOT_HOME=/root/.clawbot), _apply_profile_override must still read
active_profile and update CLAWBOT_HOME to the profile directory.

When CLAWBOT_HOME is already a profile directory (.../profiles/<name>),
_apply_profile_override must trust it and return without re-reading
active_profile (child-process inheritance contract).
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

import pytest


def _run_apply_profile_override(
    tmp_path, monkeypatch, *, clawbot_home: str | None, active_profile: str | None,
    argv: list[str] | None = None,
):
    """Run _apply_profile_override in isolation.

    Returns the value of os.environ["CLAWBOT_HOME"] after the call,
    or None if unset.
    """
    clawbot_root = tmp_path / ".clawbot"
    clawbot_root.mkdir(parents=True, exist_ok=True)

    if active_profile is not None:
        (clawbot_root / "active_profile").write_text(active_profile)

    if active_profile and active_profile != "default":
        (clawbot_root / "profiles" / active_profile).mkdir(parents=True, exist_ok=True)

    monkeypatch.setattr(Path, "home", lambda: tmp_path)
    if clawbot_home is not None:
        monkeypatch.setenv("CLAWBOT_HOME", clawbot_home)
    else:
        monkeypatch.delenv("CLAWBOT_HOME", raising=False)

    monkeypatch.setattr(sys, "argv", argv or ["clawbot", "gateway", "start"])

    from clawbot_cli.main import _apply_profile_override
    _apply_profile_override()

    return os.environ.get("CLAWBOT_HOME")


class TestApplyProfileOverrideClawbotHomeGuard:
    """Regression guard for issue #22502.

    Verifies that CLAWBOT_HOME pointing to the clawbot root does NOT suppress
    the active_profile check, while CLAWBOT_HOME already pointing to a
    profile directory IS trusted as-is.
    """

    def test_clawbot_home_at_root_with_active_profile_is_redirected(
        self, tmp_path, monkeypatch
    ):
        """CLAWBOT_HOME=/root/.clawbot + active_profile=coder must redirect
        CLAWBOT_HOME to .../profiles/coder.

        Bug scenario from #22502: systemd sets CLAWBOT_HOME to the clawbot root
        and the user switches to a profile via `clawbot profile use`.
        Before the fix, the guard returned early and active_profile was ignored.
        """
        clawbot_root = tmp_path / ".clawbot"
        clawbot_root.mkdir(parents=True, exist_ok=True)

        result = _run_apply_profile_override(
            tmp_path,
            monkeypatch,
            clawbot_home=str(clawbot_root),
            active_profile="coder",
        )

        assert result is not None, "CLAWBOT_HOME must be set after profile redirect"
        assert "profiles" in result, (
            f"Expected CLAWBOT_HOME to point into profiles/ dir, got: {result!r}"
        )
        assert result.endswith("coder"), (
            f"Expected CLAWBOT_HOME to end with 'coder', got: {result!r}"
        )

    def test_clawbot_home_already_profile_dir_is_trusted(self, tmp_path, monkeypatch):
        """CLAWBOT_HOME=.../profiles/coder must not be overridden even when
        active_profile says something different.

        Preserves the child-process inheritance contract: a subprocess spawned
        with CLAWBOT_HOME already set to a specific profile must stay in that
        profile.
        """
        clawbot_root = tmp_path / ".clawbot"
        profile_dir = clawbot_root / "profiles" / "coder"
        profile_dir.mkdir(parents=True, exist_ok=True)

        (clawbot_root / "active_profile").write_text("other")

        monkeypatch.setattr(Path, "home", lambda: tmp_path)
        monkeypatch.setenv("CLAWBOT_HOME", str(profile_dir))
        monkeypatch.setattr(sys, "argv", ["clawbot", "gateway", "start"])

        from clawbot_cli.main import _apply_profile_override
        _apply_profile_override()

        assert os.environ.get("CLAWBOT_HOME") == str(profile_dir), (
            "CLAWBOT_HOME must remain unchanged when already pointing to a profile dir"
        )

    def test_clawbot_home_unset_reads_active_profile(self, tmp_path, monkeypatch):
        """Classic case: CLAWBOT_HOME unset + active_profile=coder must set
        CLAWBOT_HOME to the profile directory (existing behaviour must not regress).
        """
        result = _run_apply_profile_override(
            tmp_path,
            monkeypatch,
            clawbot_home=None,
            active_profile="coder",
        )

        assert result is not None
        assert "coder" in result

    def test_clawbot_home_unset_default_profile_no_redirect(self, tmp_path, monkeypatch):
        """active_profile=default must not redirect CLAWBOT_HOME."""
        clawbot_root = tmp_path / ".clawbot"
        clawbot_root.mkdir(parents=True, exist_ok=True)

        monkeypatch.setattr(Path, "home", lambda: tmp_path)
        monkeypatch.delenv("CLAWBOT_HOME", raising=False)
        monkeypatch.setattr(sys, "argv", ["clawbot", "gateway", "start"])
        (clawbot_root / "active_profile").write_text("default")

        from clawbot_cli.main import _apply_profile_override
        _apply_profile_override()

        assert os.environ.get("CLAWBOT_HOME") is None
