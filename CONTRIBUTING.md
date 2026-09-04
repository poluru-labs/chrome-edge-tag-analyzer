# Contributing

Thanks for helping improve HTML Tag Counter.

## Ground rules

- Keep the extension **local-only**: no analytics, remote logging, or network calls.
- Do not inject a content script on every page. Use `activeTab` + `scripting` on user action.
- Do not commit secrets, real credentials, or copyrighted third-party assets.
- Keep LICENSE, NOTICE, AUTHORS, and PRIVACY.md in sync when behavior changes.

## Local setup

```bash
git clone https://github.com/poluru-labs/chrome-edge-tag-analyzer.git
cd chrome-edge-tag-analyzer
```

1. Open Chrome or Edge and go to `chrome://extensions/` or `edge://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** and select this repository folder (contains `manifest.json`)
4. Open `examples/test-page.html` in a tab and click **Analyze Page**

After code changes, click the refresh icon on the extension card.

## Project layout

```
manifest.json       Required at repo root for Load unpacked
popup/              Toolbar UI
icons/              16 / 48 / 128 PNG
examples/           Local test page
```

## Pull requests

1. Create a focused branch from `main`
2. Describe the user-facing change
3. Update README.md and CHANGELOG.md when behavior changes
4. Do not commit `.env`, `.DS_Store`, or packaged `.crx` / `.pem` files

## Code of conduct

Participation is governed by [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).
