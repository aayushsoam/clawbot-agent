import subprocess
import platform

from clawbot_cli import uninstall


def test_uninstall_gateway_service_forces_systemd_kill_after_stop_timeout(
    monkeypatch, tmp_path, capsys
):
    unit_path = tmp_path / "clawbot-gateway.service"
    unit_path.write_text("[Service]\nExecStart=clawbot gateway run\n", encoding="utf-8")
    calls = []

    monkeypatch.setattr(platform, "system", lambda: "Linux")
    monkeypatch.setenv("PREFIX", "")
    monkeypatch.delenv("TERMUX_VERSION", raising=False)

    import clawbot_cli.gateway as gateway

    monkeypatch.setattr(gateway, "find_gateway_pids", lambda: [])
    monkeypatch.setattr(gateway, "kill_gateway_processes", lambda: 0)
    monkeypatch.setattr(gateway, "get_service_name", lambda: "clawbot-gateway.service")
    monkeypatch.setattr(
        gateway,
        "get_systemd_unit_path",
        lambda system=False: tmp_path / "missing.service" if system else unit_path,
    )
    monkeypatch.setattr(
        gateway,
        "_systemctl_cmd",
        lambda is_system: ["systemctl"] if is_system else ["systemctl", "--user"],
    )

    def fake_run(cmd, timeout=uninstall.SYSTEMD_UNINSTALL_TIMEOUT_SECONDS):
        calls.append(cmd)
        if cmd[-2:] == ["stop", "clawbot-gateway.service"]:
            raise subprocess.TimeoutExpired(cmd, timeout)
        return subprocess.CompletedProcess(cmd, 0, stdout="", stderr="")

    monkeypatch.setattr(uninstall, "_run_uninstall_service_cmd", fake_run)

    assert uninstall.uninstall_gateway_service() is True

    assert ["systemctl", "--user", "kill", "clawbot-gateway.service"] in calls
    assert ["systemctl", "--user", "reset-failed", "clawbot-gateway.service"] in calls
    assert ["systemctl", "--user", "disable", "clawbot-gateway.service"] in calls
    assert ["systemctl", "--user", "daemon-reload"] in calls
    assert not unit_path.exists()
    assert "stop timed out" in capsys.readouterr().out
