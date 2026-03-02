# Copy Jira Issue ID

<img src="src/img/icon128.png" width="64" alt="Copy Jira Issue ID icon" />

A Chrome extension that lets you copy Jira issue IDs with a single click.

## Features

Three ways to copy a Jira issue ID:

1. **Inline copy button** — A copy button appears next to every Jira issue link on the page. Click it to copy, a checkmark confirms success.
2. **Extension popup** — Click the extension icon in the toolbar to see the current issue ID and copy it with the "複製ID" button.
3. **Right-click context menu** — Right-click anywhere on a Jira issue page and select "Jira Issue ID" to copy.

## Install

[Google Chrome Web Store](https://chrome.google.com/webstore/detail/copy-jira-issue-id/pkhafgkgndfilihcamjpnchfclnbjknb?hl=zh-TW)

Or install manually — see [Development](#development) below.

## Supported URLs

Works on all `*.atlassian.net` pages. Detects issue IDs from:

- `/browse/PROJECT-123`
- `/.*?selectedIssue=PROJECT-123`

## Development

### Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

### Setup

```bash
pnpm install
```

### Build

| Command | Description |
|---|---|
| `pnpm build` | Development build |
| `pnpm release` | Production build + zip output to `releases/` |
| `pnpm start` | Watch mode with auto-reload |
| `pnpm test` | Run tests |

### Load the extension in Chrome

1. Run `pnpm build`
2. Open `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the `dist/` folder

## Tech Stack

- **Manifest**: V3
- **Build**: Rollup + Babel
- **UI**: React 17 (popup)
- **Tests**: Jest + jest-chrome

## License

MIT
