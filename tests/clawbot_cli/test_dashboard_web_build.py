import subprocess

import pytest

from clawbot_cli import main


@pytest.mark.parametrize(
    ("version_text", "expected"),
    [
        ("v20.18.1", False),
        ("v20.19.0", True),
        ("v21.7.3", False),
        ("v22.11.0", False),
        ("v22.12.0", True),
        ("v24.0.0", True),
    ],
)
def test_node_version_supports_dashboard(version_text, expected):
    version = main._parse_node_version(version_text)
    assert version is not None
    assert main._node_version_supports_web_ui(version) is expected


def test_npm_install_failure_reports_ci_and_install(monkeypatch, tmp_path):
    (tmp_path / "package-lock.json").write_text("{}")
    calls = []

    def fake_run(cmd, **_kwargs):
        calls.append(cmd)
        if cmd[1] == "ci":
            return subprocess.CompletedProcess(cmd, 1, stdout="", stderr="ci failed")
        return subprocess.CompletedProcess(cmd, 2, stdout="install failed", stderr="")

    monkeypatch.setattr(main.subprocess, "run", fake_run)

    result = main._run_npm_install_deterministic(
        "npm",
        tmp_path,
        extra_args=("--silent",),
    )

    assert [call[1] for call in calls] == ["ci", "install"]
    assert result.returncode == 2
    assert "npm ci exited with code 1" in result.stdout
    assert "ci failed" in result.stdout
    assert "npm install exited with code 2" in result.stdout
    assert "install failed" in result.stdout
