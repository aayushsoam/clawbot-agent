"""Soam Portal provider profile."""

from typing import Any

from agent.portal_tags import soam_portal_tags
from providers import register_provider
from providers.base import ProviderProfile


class SoamProfile(ProviderProfile):
    """Soam Portal — product tags, reasoning with Soam-specific omission."""

    def build_extra_body(
        self, *, session_id: str | None = None, **context
    ) -> dict[str, Any]:
        return {"tags": soam_portal_tags()}

    def build_api_kwargs_extras(
        self,
        *,
        reasoning_config: dict | None = None,
        supports_reasoning: bool = False,
        **context,
    ) -> tuple[dict[str, Any], dict[str, Any]]:
        """Soam: passes full reasoning_config, but OMITS when disabled."""
        extra_body = {}
        if supports_reasoning:
            if reasoning_config is not None:
                rc = dict(reasoning_config)
                if rc.get("enabled") is False:
                    pass  # Soam omits reasoning when disabled
                else:
                    extra_body["reasoning"] = rc
            else:
                extra_body["reasoning"] = {"enabled": True, "effort": "medium"}
        return extra_body, {}


soam = SoamProfile(
    name="soam",
    aliases=("soam-portal", "aayushsoam"),
    env_vars=("SOAM_API_KEY",),
    display_name="Aayush soam",
    description="Aayush soam — Clawbot model family",
    signup_url="https://github.com/aayushsoam/",
    fallback_models=(
        "clawbot-3-405b",
        "clawbot-3-70b",
    ),
    base_url="https://inference.aayushsoam.com/v1",
    auth_type="oauth_device_code",
)

register_provider(soam)
