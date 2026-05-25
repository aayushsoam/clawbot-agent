# Langfuse Observability Plugin

This plugin ships bundled with Clawbot but is **opt-in** — it only loads when
you explicitly enable it.

## Enable

```bash
pip install langfuse
clawbot plugins enable observability/langfuse
```

Or check the box in the interactive `clawbot plugins` UI.

## Required credentials

Set these in `~/.clawbot/.env`:

```bash
CLAWBOT_LANGFUSE_PUBLIC_KEY=pk-lf-...
CLAWBOT_LANGFUSE_SECRET_KEY=sk-lf-...
CLAWBOT_LANGFUSE_BASE_URL=https://cloud.langfuse.com   # or your self-hosted URL
```

Without the SDK or credentials the hooks no-op silently — the plugin fails
open.

## Verify

```bash
clawbot plugins list                 # observability/langfuse should show "enabled"
clawbot chat -q "hello"              # then check Langfuse for a "Clawbot turn" trace
```

## Optional tuning

```bash
CLAWBOT_LANGFUSE_ENV=production       # environment tag
CLAWBOT_LANGFUSE_RELEASE=v1.0.0       # release tag
CLAWBOT_LANGFUSE_SAMPLE_RATE=0.5      # sample 50% of traces
CLAWBOT_LANGFUSE_MAX_CHARS=12000      # max chars per field (default: 12000)
CLAWBOT_LANGFUSE_DEBUG=true           # verbose plugin logging
```

## Disable

```bash
clawbot plugins disable observability/langfuse
```
