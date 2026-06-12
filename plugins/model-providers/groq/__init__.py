"""Groq provider profile."""

from __future__ import annotations

from providers import register_provider
from providers.base import ProviderProfile


groq = ProviderProfile(
    name="groq",
    env_vars=("GROQ_API_KEY",),
    display_name="Groq",
    description="Groq — fast OpenAI-compatible API",
    signup_url="https://console.groq.com/keys",
    fallback_models=(
        "openai/gpt-oss-120b",
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
    ),
    base_url="https://api.groq.com/openai/v1",
    default_aux_model="llama-3.1-8b-instant",
)

register_provider(groq)
