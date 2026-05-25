---
sidebar_position: 15
title: "MiniMax OAuth"
description: "Log into MiniMax via browser OAuth and use MiniMax-M2.7 models in Clawbot Agent — no API key required"
---

# MiniMax OAuth

Clawbot Agent supports **MiniMax** through a browser-based OAuth login flow, using the same credentials as the [MiniMax portal](https://www.minimax.io). No API key or credit card is required — log in once and Clawbot automatically refreshes your session.

The transport reuses the `anthropic_messages` adapter (MiniMax exposes an Anthropic Messages-compatible endpoint at `/anthropic`), so all existing tool-calling, streaming, and context features work without any adapter changes.

## Overview

| Item | Value |
|------|-------|
| Provider ID | `minimax-oauth` |
| Display name | MiniMax (OAuth) |
| Auth type | Browser OAuth (PKCE device-code flow) |
| Transport | Anthropic Messages-compatible (`anthropic_messages`) |
| Models | `MiniMax-M2.7`, `MiniMax-M2.7-highspeed` |
| Global endpoint | `https://api.minimax.io/anthropic` |
| China endpoint | `https://api.minimaxi.com/anthropic` |
| Requires env var | No (`MINIMAX_API_KEY` is **not** used for this provider) |

## Prerequisites

- Python 3.9+
- Clawbot Agent installed
- A MiniMax account at [minimax.io](https://www.minimax.io) (global) or [minimaxi.com](https://www.minimaxi.com) (China)
- A browser available on the local machine (or use `--no-browser` for remote sessions)

## Quick Start

```bash
# Launch the provider and model picker
clawbot model
# → Select "MiniMax (OAuth)" from the provider list
# → Clawbot opens your browser to the MiniMax authorization page
# → Approve access in the browser
# → Select a model (MiniMax-M2.7 or MiniMax-M2.7-highspeed)
# → Start chatting

clawbot
```

After the first login, credentials are stored under `~/.clawbot/auth.json` and are refreshed automatically before each session.

## Logging In Manually

You can trigger a login without going through the model picker:

```bash
clawbot auth add minimax-oauth
```

### China region

If your account is on the China platform (`minimaxi.com`), use the China-region OAuth provider id `minimax-cn` instead, or skip OAuth and configure `MINIMAX_CN_API_KEY` / `MINIMAX_CN_BASE_URL` directly. The `--region cn` flag described in older docs is **not** wired through the CLI's argument parser; use the `minimax-cn` provider instead:

```bash
clawbot auth add minimax-cn --type oauth   # if OAuth is supported on your CN account
# or simpler:
echo 'MINIMAX_CN_API_KEY=your-key' >> ~/.clawbot/.env
```

### Remote / headless sessions

On servers or containers where no browser is available:

```bash
clawbot auth add minimax-oauth --no-browser
```

Clawbot will print the verification URL and user code — open the URL on any device and enter the code when prompted.

## The OAuth Flow

Clawbot implements a PKCE device-code flow against the MiniMax OAuth endpoints:

1. Clawbot generates a PKCE verifier / challenge pair and a random state value.
2. It POSTs to `{base_url}/oauth/code` with the challenge and receives a `user_code` and `verification_uri`.
3. Your browser opens `verification_uri`. If prompted, enter the `user_code`.
4. Clawbot polls `{base_url}/oauth/token` until the token arrives (or the deadline passes).
5. Tokens (`access_token`, `refresh_token`, expiry) are saved to `~/.clawbot/auth.json` under the `minimax-oauth` key.

Token refresh (standard OAuth `refresh_token` grant) runs automatically at each session start when the access token is within 60 seconds of expiry.

## Checking Login Status

```bash
clawbot doctor
```

The `◆ Auth Providers` section will show:

```
✓ MiniMax OAuth  (logged in, region=global)
```

or, if not logged in:

```
⚠ MiniMax OAuth  (not logged in)
```

## Switching Models

```bash
clawbot model
# → Select "MiniMax (OAuth)"
# → Pick from the model list
```

Or set the model directly:

```bash
clawbot config set model MiniMax-M2.7
clawbot config set provider minimax-oauth
```

## Configuration Reference

After login, `~/.clawbot/config.yaml` will contain entries similar to:

```yaml
model:
  default: MiniMax-M2.7
  provider: minimax-oauth
  base_url: https://api.minimax.io/anthropic
```

### Region endpoints

| Provider id | Portal | Inference endpoint |
|-------------|--------|-------------------|
| `minimax-oauth` (global) | `https://api.minimax.io` | `https://api.minimax.io/anthropic` |
| `minimax-cn` (China) | `https://api.minimaxi.com` | `https://api.minimaxi.com/anthropic` |

### Provider aliases

All of the following resolve to `minimax-oauth`:

```bash
clawbot --provider minimax-oauth    # canonical
clawbot --provider minimax-portal   # alias
clawbot --provider minimax-global   # alias
clawbot --provider minimax_oauth    # alias (underscore form)
```

## Environment Variables

The `minimax-oauth` provider does **not** use `MINIMAX_API_KEY` or `MINIMAX_BASE_URL`. Those variables are for the API-key-based `minimax` and `minimax-cn` providers only.

| Variable | Effect |
|----------|--------|
| `MINIMAX_API_KEY` | Used by `minimax` provider only — ignored for `minimax-oauth` |
| `MINIMAX_CN_API_KEY` | Used by `minimax-cn` provider only — ignored for `minimax-oauth` |

To force the `minimax-oauth` provider at runtime:

```bash
CLAWBOT_INFERENCE_PROVIDER=minimax-oauth clawbot
```

## Models

| Model | Best for |
|-------|----------|
| `MiniMax-M2.7` | Long-context reasoning, complex tool-calling |
| `MiniMax-M2.7-highspeed` | Lower latency, lighter tasks, auxiliary calls |

Both models support up to 200,000 tokens of context.

`MiniMax-M2.7-highspeed` is also used automatically as the auxiliary model for vision and delegation tasks when `minimax-oauth` is the primary provider.

## Troubleshooting

### Token expired — not re-logging in automatically

Clawbot refreshes the token on every session start if it is within 60 seconds of expiry. If the access token is already expired (for example, after a long offline period), the refresh happens automatically on the next request. If refresh fails with `refresh_token_reused` or `invalid_grant`, Clawbot marks the session as requiring re-login.

**Fix:** run `clawbot auth add minimax-oauth` again to start a fresh login.

### Authorization timed out

The device-code flow has a finite expiry window. If you don't approve the login in time, Clawbot raises a timeout error.

**Fix:** re-run `clawbot auth add minimax-oauth` (or `clawbot model`). The flow starts fresh.

### State mismatch (possible CSRF)

Clawbot detected that the `state` value returned by the authorization server does not match what it sent.

**Fix:** re-run the login. If it persists, check for a proxy or redirect that is modifying the OAuth response.

### Logging in from a remote server

If `clawbot` cannot open a browser window, use `--no-browser`:

```bash
clawbot auth add minimax-oauth --no-browser
```

Clawbot prints the URL and code. Open the URL on any device and complete the flow there.

### "Not logged into MiniMax OAuth" error at runtime

The auth store has no credentials for `minimax-oauth`. You have not logged in yet, or the credential file was deleted.

**Fix:** run `clawbot model` and select MiniMax (OAuth), or run `clawbot auth add minimax-oauth`.

## Logging Out

To remove stored MiniMax OAuth credentials:

```bash
clawbot auth remove minimax-oauth
```

## See Also

- [AI Providers reference](../integrations/providers.md)
- [Environment Variables](../reference/environment-variables.md)
- [Configuration](../user-guide/configuration.md)
- [clawbot doctor](../reference/cli-commands.md)
