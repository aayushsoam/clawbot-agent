import subprocess

from clawbot_cli import doctor


def test_gh_authenticated_handles_non_executable_gh(monkeypatch):
    monkeypatch.setattr(doctor.shutil, "which", lambda name: "/usr/local/bin/gh" if name == "gh" else None)

    def raise_permission_error(_gh):
        raise PermissionError(13, "Permission denied", "gh")

    monkeypatch.setattr(doctor, "_run_gh_auth_status", raise_permission_error)

    assert doctor._gh_authenticated() is False


def test_gh_authenticated_uses_resolved_gh_path(monkeypatch):
    calls = []
    monkeypatch.setattr(doctor.shutil, "which", lambda name: "/usr/bin/gh" if name == "gh" else None)

    def fake_run(gh):
        calls.append(gh)
        return subprocess.CompletedProcess([gh], 0)

    monkeypatch.setattr(doctor, "_run_gh_auth_status", fake_run)

    assert doctor._gh_authenticated() is True
    assert calls == ["/usr/bin/gh"]
