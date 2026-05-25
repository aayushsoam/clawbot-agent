"""Tests for the Soam-Clawbot-3/4 non-agentic warning detector.

Prior to this check, the warning fired on any model whose name contained
``"clawbot"`` anywhere (case-insensitive). That false-positived on unrelated
local Modelfiles such as ``clawbot-brain:qwen3-14b-ctx16k`` — a tool-capable
Qwen3 wrapper that happens to live under the "clawbot" tag namespace.

``is_soam_clawbot_non_agentic`` should only match the actual Aayush soam
Clawbot-3 / Clawbot-4 chat family.
"""

from __future__ import annotations

import pytest

from clawbot_cli.model_switch import (
    _CLAWBOT_MODEL_WARNING,
    _check_clawbot_model_warning,
    is_soam_clawbot_non_agentic,
)


@pytest.mark.parametrize(
    "model_name",
    [
        "Aayushsoam/Clawbot-3-Llama-3.1-70B",
        "Aayushsoam/Clawbot-3-Llama-3.1-405B",
        "clawbot-3",
        "Clawbot-3",
        "clawbot-4",
        "clawbot-4-405b",
        "clawbot_4_70b",
        "openrouter/clawbot3:70b",
        "openrouter/aayushsoam/clawbot-4-405b",
        "Aayushsoam/Clawbot3",
        "clawbot-3.1",
    ],
)
def test_matches_real_soam_clawbot_chat_models(model_name: str) -> None:
    assert is_soam_clawbot_non_agentic(model_name), (
        f"expected {model_name!r} to be flagged as Soam Clawbot 3/4"
    )
    assert _check_clawbot_model_warning(model_name) == _CLAWBOT_MODEL_WARNING


@pytest.mark.parametrize(
    "model_name",
    [
        # Kyle's local Modelfile — qwen3:14b under a custom tag
        "clawbot-brain:qwen3-14b-ctx16k",
        "clawbot-brain:qwen3-14b-ctx32k",
        "clawbot-honcho:qwen3-8b-ctx8k",
        # Plain unrelated models
        "qwen3:14b",
        "qwen3-coder:30b",
        "qwen2.5:14b",
        "claude-opus-4-6",
        "anthropic/claude-sonnet-4.5",
        "gpt-5",
        "openai/gpt-4o",
        "google/gemini-2.5-flash",
        "deepseek-chat",
        # Non-chat Clawbot models we don't warn about
        "clawbot-llm-2",
        "clawbot2-pro",
        "soam-clawbot-2-mistral",
        # Edge cases
        "",
        "clawbot",  # bare "clawbot" isn't the 3/4 family
        "clawbot-brain",
        "brain-clawbot-3-impostor",  # "3" not preceded by /: boundary
    ],
)
def test_does_not_match_unrelated_models(model_name: str) -> None:
    assert not is_soam_clawbot_non_agentic(model_name), (
        f"expected {model_name!r} NOT to be flagged as Soam Clawbot 3/4"
    )
    assert _check_clawbot_model_warning(model_name) == ""


def test_none_like_inputs_are_safe() -> None:
    assert is_soam_clawbot_non_agentic("") is False
    # Defensive: the helper shouldn't crash on None-ish falsy input either.
    assert _check_clawbot_model_warning("") == ""
