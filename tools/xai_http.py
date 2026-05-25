"""Shared helpers for direct xAI HTTP integrations."""

from __future__ import annotations

import os
from typing import Dict

def get_env_value(name: str, default=None):
    """Read ``name`` from ``~/.clawbot/.env`` first, then ``os.environ``.

    Wraps :func:`clawbot_cli.config.get_env_value` so tests can patch
    ``tools.xai_http.get_env_value`` to inject dotenv-only secrets into the
    xAI credential resolver.
    """
    try:
        from clawbot_cli.config import get_env_value as _clawbot_get_env_value

        value = _clawbot_get_env_value(name)
        if value is not None:
            return value
    except Exception:
        pass
    return os.environ.get(name, default)


def clawbot_xai_user_agent() -> str:
    """Return a stable Clawbot-specific User-Agent for xAI HTTP calls."""
    try:
        from clawbot_cli import __version__
    except Exception:
        __version__ = "unknown"
    return f"Clawbot-Agent/{__version__}"


def resolve_xai_http_credentials() -> Dict[str, str]:
    """Resolve bearer credentials for direct xAI HTTP endpoints.

    Prefers Clawbot-managed xAI OAuth credentials when available, then falls back
    to ``XAI_API_KEY`` resolved via ``clawbot_cli.config.get_env_value`` so keys
    stored in ``~/.clawbot/.env`` (the standard Clawbot location) are honored —
    not just ones already exported into ``os.environ``. This keeps direct xAI
    endpoints (images, TTS, STT, etc.) aligned with the main runtime auth model
    and preserves the regression contract from PR #17140 / #17163.
    """
    try:
        from clawbot_cli.runtime_provider import resolve_runtime_provider

        runtime = resolve_runtime_provider(requested="xai-oauth")
        access_token = str(runtime.get("api_key") or "").strip()
        base_url = str(runtime.get("base_url") or "").strip().rstrip("/")
        if access_token:
            return {
                "provider": "xai-oauth",
                "api_key": access_token,
                "base_url": base_url or "https://api.x.ai/v1",
            }
    except Exception:
        pass

    try:
        from clawbot_cli.auth import resolve_xai_oauth_runtime_credentials

        creds = resolve_xai_oauth_runtime_credentials()
        access_token = str(creds.get("api_key") or "").strip()
        base_url = str(creds.get("base_url") or "").strip().rstrip("/")
        if access_token:
            return {
                "provider": "xai-oauth",
                "api_key": access_token,
                "base_url": base_url or "https://api.x.ai/v1",
            }
    except Exception:
        pass

    api_key = str(get_env_value("XAI_API_KEY") or "").strip()
    base_url = str(get_env_value("XAI_BASE_URL") or "https://api.x.ai/v1").strip().rstrip("/")
    return {
        "provider": "xai",
        "api_key": api_key,
        "base_url": base_url,
    }
