# HTML Tag Counter

Chrome and Microsoft Edge extension (Manifest V3) that counts every HTML tag on the **active tab** after you click **Analyze Page**.

Maintained by [Subrahmanyam Poluru](https://polurus.com) · Poluru Labs.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

## Features

- Reads the current tab URL
- Counts all HTML tags on the page
- Shows total elements, unique tag types, and per-tag counts
- Sorted by frequency, then tag name
- Local only: no network calls, storage, or analytics

## Example output

```
h1    1
h2    5
div  45
p    23
a    18
```

## Install (unpacked)

1. Clone this repository
2. Open Chrome (`chrome://extensions/`) or Edge (`edge://extensions/`)
3. Enable **Developer mode**
4. Click **Load unpacked** and select **this repository folder** (the one that contains `manifest.json`)
5. Open `examples/test-page.html` in a tab to try it

## Usage

1. Open a webpage
2. Click the extension icon
3. Click **Analyze Page**
4. Review tag names and counts
5. Click **Clear Results** to reset

Chrome and Edge cannot run this on `chrome://`, `edge://`, or Web Store pages.

## Project structure

```
chrome-edge-tag-analyzer/     # Load unpacked this folder
├── manifest.json
├── popup/
├── icons/
├── examples/test-page.html
└── LICENSE, NOTICE, PRIVACY.md, …
```

## Permissions

| Permission | Why |
| --- | --- |
| `activeTab` | Access the tab you are viewing, after you click Analyze Page |
| `scripting` | Run a one-shot tag count on that tab |

See [PRIVACY.md](./PRIVACY.md).

## Development

Edit files under `popup/`, then click the refresh icon on the extension card.

## License

MIT © 2026 Subrahmanyam Poluru / Poluru Labs — see [LICENSE](./LICENSE) and [NOTICE](./NOTICE).

## Support

- Issues: [github.com/poluru-labs/chrome-edge-tag-analyzer/issues](https://github.com/poluru-labs/chrome-edge-tag-analyzer/issues)
- Security: [SECURITY.md](./SECURITY.md)
- Contributing: [CONTRIBUTING.md](./CONTRIBUTING.md)
