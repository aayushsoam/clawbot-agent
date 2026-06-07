# Clawbot Mobile

Phone-first web shell for Clawbot Agent. It runs as a Vite PWA and connects to the Clawbot dashboard gateway over WebSocket.

## Android Termux

Use one terminal for the backend:

```bash
cd ~/clawbot-agent
export CLAWBOT_DASHBOARD_SESSION_TOKEN=clawbot-mobile
python -m clawbot_cli.main dashboard --tui --host 127.0.0.1 --port 9120 --no-open
```

Use a second terminal for the mobile UI:

```bash
cd ~/clawbot-agent/apps/mobile
npm install
npm run dev
```

Open `http://127.0.0.1:5180` on the same Android device.

Gateway: `http://127.0.0.1:9120`

Token: `clawbot-mobile`

## Build

```bash
npm run build
npm run preview
```

The preview URL is `http://127.0.0.1:4180`.

## APK

Debug APK:

```text
apps/mobile/Clawbot-Mobile-debug.apk
```

Install with USB debugging:

```bash
adb install -r apps/mobile/Clawbot-Mobile-debug.apk
```

Or send the APK to your phone, open it, and allow install from unknown apps.

After opening the app, keep the Termux backend running:

```bash
export CLAWBOT_DASHBOARD_SESSION_TOKEN=clawbot-mobile
python -m clawbot_cli.main dashboard --tui --host 127.0.0.1 --port 9120 --no-open
```
