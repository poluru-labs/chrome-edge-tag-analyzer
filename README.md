# Web Extension for HTML Tag Counter

A lightweight Chrome and Microsoft Edge extension that counts every HTML tag on the active tab and shows the totals in a simple ranked table.

Maintained by [Subrahmanyam Poluru](https://polurus.com) · Poluru Labs.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

## Overview

This extension is built as a Manifest V3 browser extension and runs entirely on the local machine. It inspects the current tab after you click Analyze Page, counts all HTML elements in the DOM, and returns the results in descending order by count with tag names sorted alphabetically when counts are tied.

It is designed for quick page audits, debugging, SEO checks, and learning how a page is structured without sending data anywhere.

## Screenshot

<img width="1593" height="922" alt="image" src="https://github.com/user-attachments/assets/5eca8cd2-32cc-4230-bfd2-9ce35b485c51" />


## Features

- Reads the current tab URL and displays it in the popup
- Counts every HTML tag on the active page
- Shows total elements and unique tag types
- Surfaces per-tag counts with a visual bar for easier reading
- Sorts tags by frequency, then by tag name
- Uses only local browser APIs; no remote requests, analytics, or persistent storage

## Example output

```text
h1     1
div   45
p     23
a     18
span  12
```

## Supported browsers

- Google Chrome
- Microsoft Edge

This extension is intended for regular web pages and local HTML files. It will not run on browser internal pages like `chrome://`, `edge://`, or extension/web store pages.

## Install (unpacked)

1. Clone this repository or download it as a ZIP.
2. Open Chrome at `chrome://extensions/` or Edge at `edge://extensions/`.
3. Turn on Developer mode.
4. Click Load unpacked.
5. Select the repository root folder that contains `manifest.json`.
6. Open `examples/test-page.html` in a tab to try a quick demo, or use any normal webpage you want to inspect.

## Usage

1. Open any normal web page or local HTML file.
2. Click the extension icon.
3. Click Analyze Page.
4. Review the table of tag names and counts.
5. Use Clear to reset the results and check another page.

## How it works

When the user clicks Analyze Page, the extension:

- queries the active tab
- validates that the page is inspectable
- runs a small script in the page context
- walks the DOM using `document.getElementsByTagName('*')`
- counts each tag name in lowercase
- returns totals to the popup for display

This keeps the extension simple and fast while staying within browser extension permissions.

## Permissions

| Permission | Why |
| --- | --- |
| `activeTab` | Lets the extension access the page the user has open only after they click Analyze Page |
| `scripting` | Injects the local counting script into the active tab |

See [PRIVACY.md](./PRIVACY.md) for the privacy policy and data handling details.

## Project structure

```text
chrome-edge-tag-analyzer/
├── manifest.json
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── examples/
│   └── test-page.html
├── LICENSE
├── NOTICE
├── PRIVACY.md
├── SECURITY.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── README.md
└── SUPPORT.md
```

## Development

This project has no build step or package manager requirement. It is a plain browser extension built from HTML, CSS, and JavaScript.

Typical workflow:

1. Edit files in `popup/`.
2. Refresh the extension card in Chrome or Edge.
3. Re-test the extension on a local page or the sample page.

## Troubleshooting

- No results appear: make sure the page is not a browser internal page or Web Store page.
- The popup says the page cannot be analyzed: use an `http:`, `https:`, or `file:` page.
- The extension is blank after reload: remove and re-load the unpacked extension, then refresh the browser tab.

## Privacy

This extension does not upload page content, does not store results in a database, and does not send analytics to a remote server. Results stay in the browser session and the popup display only.

## License

MIT © 2026 Subrahmanyam Poluru / Poluru Labs — see [LICENSE](./LICENSE) and [NOTICE](./NOTICE).

## Support

- Issues: [github.com/poluru-labs/chrome-edge-tag-analyzer/issues](https://github.com/poluru-labs/chrome-edge-tag-analyzer/issues)
- Security: [SECURITY.md](./SECURITY.md)
- Contributing: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Support: [SUPPORT.md](./SUPPORT.md)
