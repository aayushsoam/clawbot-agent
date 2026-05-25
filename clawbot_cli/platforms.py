"""
Shared platform registry for Clawbot Agent.

Single source of truth for platform metadata consumed by both
skills_config (label display) and tools_config (default toolset
resolution).  Import ``PLATFORMS`` from here instead of maintaining
duplicate dicts in each module.
"""

from collections import OrderedDict
from typing import NamedTuple


class PlatformInfo(NamedTuple):
    """Metadata for a single platform entry."""
    label: str
    default_toolset: str


# Ordered so that TUI menus are deterministic.
PLATFORMS: OrderedDict[str, PlatformInfo] = OrderedDict([
    ("cli",            PlatformInfo(label="🖥️  CLI",            default_toolset="clawbot-cli")),
    ("telegram",       PlatformInfo(label="📱 Telegram",        default_toolset="clawbot-telegram")),
    ("discord",        PlatformInfo(label="💬 Discord",         default_toolset="clawbot-discord")),
    ("slack",          PlatformInfo(label="💼 Slack",           default_toolset="clawbot-slack")),
    ("whatsapp",       PlatformInfo(label="📱 WhatsApp",        default_toolset="clawbot-whatsapp")),
    ("signal",         PlatformInfo(label="📡 Signal",          default_toolset="clawbot-signal")),
    ("bluebubbles",    PlatformInfo(label="💙 BlueBubbles",     default_toolset="clawbot-bluebubbles")),
    ("email",          PlatformInfo(label="📧 Email",           default_toolset="clawbot-email")),
    ("homeassistant",  PlatformInfo(label="🏠 Home Assistant",  default_toolset="clawbot-homeassistant")),
    ("mattermost",     PlatformInfo(label="💬 Mattermost",      default_toolset="clawbot-mattermost")),
    ("matrix",         PlatformInfo(label="💬 Matrix",          default_toolset="clawbot-matrix")),
    ("dingtalk",       PlatformInfo(label="💬 DingTalk",        default_toolset="clawbot-dingtalk")),
    ("feishu",         PlatformInfo(label="🪽 Feishu",          default_toolset="clawbot-feishu")),
    ("wecom",          PlatformInfo(label="💬 WeCom",           default_toolset="clawbot-wecom")),
    ("wecom_callback", PlatformInfo(label="💬 WeCom Callback",  default_toolset="clawbot-wecom-callback")),
    ("weixin",         PlatformInfo(label="💬 Weixin",          default_toolset="clawbot-weixin")),
    ("qqbot",          PlatformInfo(label="💬 QQBot",           default_toolset="clawbot-qqbot")),
    ("yuanbao",        PlatformInfo(label="🤖 Yuanbao",         default_toolset="clawbot-yuanbao")),
    ("webhook",        PlatformInfo(label="🔗 Webhook",         default_toolset="clawbot-webhook")),
    ("api_server",     PlatformInfo(label="🌐 API Server",      default_toolset="clawbot-api-server")),
    ("cron",           PlatformInfo(label="⏰ Cron",            default_toolset="clawbot-cron")),
])


def platform_label(key: str, default: str = "") -> str:
    """Return the display label for a platform key, or *default*.

    Checks the static PLATFORMS dict first, then the plugin platform
    registry for dynamically registered platforms.
    """
    info = PLATFORMS.get(key)
    if info is not None:
        return info.label
    # Check plugin registry
    try:
        from gateway.platform_registry import platform_registry
        entry = platform_registry.get(key)
        if entry:
            return f"{entry.emoji}  {entry.label}" if entry.emoji else entry.label
    except Exception:
        pass
    return default


def get_all_platforms() -> "OrderedDict[str, PlatformInfo]":
    """Return PLATFORMS merged with any plugin-registered platforms.

    Plugin platforms are appended after builtins.  This is the function
    that tools_config and skills_config should use for platform menus.
    """
    merged = OrderedDict(PLATFORMS)
    try:
        from gateway.platform_registry import platform_registry
        for entry in platform_registry.plugin_entries():
            if entry.name not in merged:
                merged[entry.name] = PlatformInfo(
                    label=f"{entry.emoji}  {entry.label}" if entry.emoji else entry.label,
                    default_toolset=f"clawbot-{entry.name}",
                )
    except Exception:
        pass
    return merged
