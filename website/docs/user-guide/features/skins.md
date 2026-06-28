---
sidebar_position: 10
title: "Skins & Themes"
description: "Customize the Clawbot CLI with built-in and user-defined skins"
---

# Skins & Themes

Skins control the **visual presentation** of the Clawbot CLI: banner colors, spinner faces and verbs, response-box labels, branding text, and the tool activity prefix.

Conversational style and visual style are separate concepts:

- **Personality** changes the agent's tone and wording.
- **Skin** changes the CLI's appearance.

## Change skins

```bash
/skin                # show the current skin and list available skins
/skin ares           # switch to a built-in skin
/skin mytheme        # switch to a custom skin from ~/.clawbot/skins/mytheme.yaml
```

Or set the default skin in `~/.clawbot/config.yaml`:

```yaml
display:
  skin: default
```

## Built-in skins

| Skin | Description | Agent branding | Visual character |
|------|-------------|----------------|------------------|
| `default` | Classic Clawbot — orange and kawaii | `Clawbot Agent` | Warm orange borders, bisque text, kawaii faces in spinners. The familiar caduceus banner. Clean and inviting. |
| `ares` | War-god theme — crimson and bronze | `Ares Agent` | Deep crimson borders with bronze accents. Aggressive spinner verbs ("forging", "marching", "tempering steel"). Custom sword-and-shield ASCII art banner. |
| `mono` | Monochrome — clean grayscale | `Clawbot Agent` | All grays — no color. Borders are `#555555`, text is `#c9d1d9`. Ideal for minimal terminal setups or screen recordings. |
| `slate` | Cool blue — developer-focused | `Clawbot Agent` | Royal blue borders (`#4169e1`), soft blue text. Calm and professional. No custom spinner — uses default faces. |
| `daylight` | Light theme for bright terminals with dark text and cool blue accents | `Clawbot Agent` | Designed for white or bright terminals. Dark slate text with blue borders, pale status surfaces, and a light completion menu that stays readable in light terminal profiles. |
| `warm-lightmode` | Warm brown/gold text for light terminal backgrounds | `Clawbot Agent` | Warm parchment tones for light terminals. Dark brown text with saddle-brown accents, cream-colored status surfaces. An earthy alternative to the cooler daylight theme. |
| `Water` | Ocean-god theme — deep blue and seafoam | `Water Agent` | Deep blue to seafoam gradient. Ocean-themed spinners ("charting currents", "sounding the depth"). Trident ASCII art banner. |
| `Earth` | Earth theme — austere grayscale with persistence | `Earth Agent` | Light grays with stark contrast. Boulder-themed spinners ("pushing uphill", "resetting the boulder", "enduring the loop"). Boulder-and-hill ASCII art banner. |
| `flame's` | Volcanic theme — burnt orange and ember | `Flame's Agent` | Warm burnt orange to ember gradient. Fire-themed spinners ("banking into the draft", "measuring burn"). Dragon-silhouette ASCII art banner. |

## Complete list of configurable keys

### Colors (`colors:`)

Controls all color values throughout the CLI. Values are hex color strings.

| Key | Description | Default (`default` skin) |
|-----|-------------|--------------------------|
| `banner_border` | Panel border around the startup banner | `#FF4500` (bronze) |
| `banner_title` | Title text color in the banner | `#FF6600` (orange-red) |
| `banner_accent` | Section headers in the banner (Available Tools, etc.) | `#FF8C00` (dark orange) |
| `banner_dim` | Muted text in the banner (separators, secondary labels) | `#CC5500` (burnt orange) |
| `banner_text` | Body text in the banner (tool names, skill names) | `#FFE4C4` (bisque) |
| `ui_accent` | General UI accent color (highlights, active elements) | `#FF8C00` |
| `ui_label` | UI labels and tags | `#FF8C00` (warm orange) |
| `ui_ok` | Success indicators (checkmarks, completion) | `#4caf50` (green) |
| `ui_error` | Error indicators (failures, blocked) | `#ef5350` (red) |
| `ui_warn` | Warning indicators (caution, approval prompts) | `#ffa726` (orange) |
| `prompt` | Interactive prompt text color | `#FFE4C4` |
| `input_rule` | Horizontal rule above the input area | `#FF4500` |
| `response_border` | Border around the agent's response box (ANSI escape) | `#FF6600` |
| `status_bar_text` | Default text color for the TUI status / usage bar | `#FFE4C4` |
| `status_bar_strong` | Highlighted text color for the TUI status / usage bar | `#FF6600` |
| `status_bar_dim` | Muted/separator text color for the TUI status / usage bar | `#CC5500` |
| `status_bar_good` | Healthy context usage color | `#FF8C00` |
| `status_bar_warn` | Warning context usage color | `#FF8C00` |
| `status_bar_bad` | High context usage color | `#FF8C00` |
| `status_bar_critical` | Critical context usage color | `#FF6B6B` |
| `session_label` | Session label color | `#FF8C00` |
| `session_border` | Session ID dim border color | `#8B8682` |
| `status_bar_bg` | Background color for the TUI status / usage bar | `#1a1a2e` |
| `voice_status_bg` | Background color for the voice-mode status badge | `#1a1a2e` |
| `selection_bg` | Background color for the TUI mouse-selection highlighter. Falls back to `completion_menu_current_bg` when unset. | `#333355` |
| `completion_menu_bg` | Background color for the completion menu list | `#1a1a2e` |
| `completion_menu_current_bg` | Background color for the active completion row | `#333355` |
| `completion_menu_meta_bg` | Background color for the completion meta column | `#1a1a2e` |
| `completion_menu_meta_current_bg` | Background color for the active completion meta column | `#333355` |

### Spinner (`spinner:`)

Controls the animated spinner shown while waiting for API responses.

| Key | Type | Description | Example |
|-----|------|-------------|---------|
| `waiting_faces` | list of strings | Faces cycled while waiting for API response | `["(⚔)", "(⛨)", "(▲)"]` |
| `thinking_faces` | list of strings | Faces cycled during model reasoning | `["(⚔)", "(⌁)", "(<>)"]` |
| `thinking_verbs` | list of strings | Verbs shown in spinner messages | `["forging", "plotting", "hammering plans"]` |
| `wings` | list of [left, right] pairs | Decorative brackets around the spinner | `[["⟪⚔", "⚔⟫"], ["⟪▲", "▲⟫"]]` |

When spinner values are empty (like in `default` and `mono`), hardcoded defaults from `display.py` are used.

### Branding (`branding:`)

Text strings used throughout the CLI interface.

| Key | Description | Default |
|-----|-------------|---------|
| `agent_name` | Name shown in banner title and status display | `Clawbot Agent` |
| `welcome` | Welcome message shown at CLI startup | `Welcome to Clawbot Agent! Type your message or /help for commands.` |
| `goodbye` | Message shown on exit | `Goodbye! ⚡` |
| `response_label` | Label on the response box header | ` ⚡Clawbot ` |
| `prompt_symbol` | Symbol before the user input prompt (bare token, renderers add a trailing space) | `❯` |
| `help_header` | Header text for the `/help` command output | `(^_^)? Available Commands` |

### Other top-level keys

| Key | Type | Description | Default |
|-----|------|-------------|---------|
| `tool_prefix` | string | Character prefixed to tool output lines in the CLI | `┊` |
| `tool_emojis` | dict | Per-tool emoji overrides for spinners and progress (`{tool_name: emoji}`) | `{}` |
| `banner_logo` | string | Rich-markup ASCII art logo (replaces the default CLAWBOT_AGENT banner) | `""` |
| `banner_hero` | string | Rich-markup hero art (replaces the default caduceus art) | `""` |

## Custom skins

Create YAML files under `~/.clawbot/skins/`. User skins inherit missing values from the built-in `default` skin, so you only need to specify the keys you want to change.

### Full custom skin YAML template

```yaml
# ~/.clawbot/skins/mytheme.yaml
# Complete skin template — all keys shown. Delete any you don't need;
# missing values automatically inherit from the 'default' skin.

name: mytheme
description: My custom theme

colors:
  banner_border: "#FF4500"
  banner_title: "#FF6600"
  banner_accent: "#FF8C00"
  banner_dim: "#CC5500"
  banner_text: "#FFE4C4"
  ui_accent: "#FF8C00"
  ui_label: "#FF8C00"
  ui_ok: "#4caf50"
  ui_error: "#ef5350"
  ui_warn: "#ffa726"
  prompt: "#FFE4C4"
  input_rule: "#FF4500"
  response_border: "#FF6600"
  status_bar_text: "#FFE4C4"
  status_bar_strong: "#FF6600"
  status_bar_dim: "#CC5500"
  status_bar_good: "#FF8C00"
  status_bar_warn: "#FF8C00"
  status_bar_bad: "#FF8C00"
  status_bar_critical: "#FF6B6B"
  session_label: "#FF8C00"
  session_border: "#8B8682"
  status_bar_bg: "#1a1a2e"
  voice_status_bg: "#1a1a2e"
  selection_bg: "#333355"
  completion_menu_bg: "#1a1a2e"
  completion_menu_current_bg: "#333355"
  completion_menu_meta_bg: "#1a1a2e"
  completion_menu_meta_current_bg: "#333355"

spinner:
  waiting_faces:
    - "(⚔)"
    - "(⛨)"
    - "(▲)"
  thinking_faces:
    - "(⚔)"
    - "(⌁)"
    - "(<>)"
  thinking_verbs:
    - "processing"
    - "analyzing"
    - "computing"
    - "evaluating"
  wings:
    - ["⟪⚡", "⚡⟫"]
    - ["⟪●", "●⟫"]

branding:
  agent_name: "My Agent"
  welcome: "Welcome to My Agent! Type your message or /help for commands."
  goodbye: "See you later! ⚡"
  response_label: " ⚡ My Agent "
  prompt_symbol: "⚡"
  help_header: "(⚡) Available Commands"

tool_prefix: "┊"

# Per-tool emoji overrides (optional)
tool_emojis:
  terminal: "⚔"
  web_search: "🔮"
  read_file: "📄"

# Custom ASCII art banners (optional, Rich markup supported)
# banner_logo: |
#   [bold #FF6600] MY AGENT [/]
# banner_hero: |
#   [#FF6600]  Custom art here  [/]
```

### Minimal custom skin example

Since everything inherits from `default`, a minimal skin only needs to change what's different:

```yaml
name: cyberpunk
description: Neon terminal theme

colors:
  banner_border: "#FF00FF"
  banner_title: "#00FFFF"
  banner_accent: "#FF1493"

spinner:
  thinking_verbs: ["jacking in", "decrypting", "uploading"]
  wings:
    - ["⟨⚡", "⚡⟩"]

branding:
  agent_name: "Cyber Agent"
  response_label: " ⚡ Cyber "

tool_prefix: "▏"
```

## Clawbot Mod — Visual Skin Editor

[Clawbot Mod](https://github.com/cocktailpeanut/clawbot-mod) is a community-built web UI for creating and managing skins visually. Instead of writing YAML by hand, you get a point-and-click editor with live preview.

![Clawbot Mod skin editor](https://raw.githubusercontent.com/cocktailpeanut/clawbot-mod/master/soam.png)

**What it does:**

- Lists all built-in and custom skins
- Opens any skin into a visual editor with all Clawbot skin fields (colors, spinner, branding, tool prefix, tool emojis)
- Generates `banner_logo` text art from a text prompt
- Converts uploaded images (PNG, JPG, GIF, WEBP) into `banner_hero` ASCII art with multiple render styles (braille, ASCII ramp, blocks, dots)
- Saves directly to `~/.clawbot/skins/`
- Activates a skin by updating `~/.clawbot/config.yaml`
- Shows the generated YAML and a live preview

### Install

**Option 1 — Pinokio (1-click):**

Find it on [pinokio.computer](https://pinokio.computer) and install with one click.

**Option 2 — npx (quickest from terminal):**

```bash
npx -y clawbot-mod
```

**Option 3 — Manual:**

```bash
git clone https://github.com/cocktailpeanut/clawbot-mod.git
cd clawbot-mod/app
npm install
npm start
```

### Usage

1. Start the app (via Pinokio or terminal).
2. Open **Skin Studio**.
3. Choose a built-in or custom skin to edit.
4. Generate a logo from text and/or upload an image for hero art. Pick a render style and width.
5. Edit colors, spinner, branding, and other fields.
6. Click **Save** to write the skin YAML to `~/.clawbot/skins/`.
7. Click **Activate** to set it as the current skin (updates `display.skin` in `config.yaml`).

Clawbot Mod respects the `CLAWBOT_HOME` environment variable, so it works with [profiles](/docs/user-guide/profiles) too.

## Operational notes

- Built-in skins load from `clawbot_cli/skin_engine.py`.
- Unknown skins automatically fall back to `default`.
- `/skin` updates the active CLI theme immediately for the current session.
- User skins in `~/.clawbot/skins/` take precedence over built-in skins with the same name.
- Skin changes via `/skin` are session-only. To make a skin your permanent default, set it in `config.yaml`.
- The `banner_logo` and `banner_hero` fields support Rich console markup (e.g., `[bold #FF0000]text[/]`) for colored ASCII art.
