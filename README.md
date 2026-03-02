# Copy Jira Issue ID

<img src="src/img/icon128.png" width="64" alt="Copy Jira Issue ID icon" />

A Chrome extension that lets you copy Jira issue IDs with a single click. Works on all `*.atlassian.net` pages.

## Features

### Inline Copy Button

A small copy button appears when you hover over any Jira issue link on the page. Click it to instantly copy the issue ID to your clipboard.

**On navigation breadcrumbs:**

<img src="src/img/nav-button.png" width="360" alt="Copy button on navigation breadcrumbs" />

**On board cards:**

<img src="src/img/card-button.png" width="360" alt="Copy button on board cards" />

### Popup Window

Click the extension icon in the toolbar to see all Jira issue IDs found on the current page. Each ID is shown with its issue type (Epic, Story, Bug, Sub-task, Task, etc.). Click the copy icon on any row to copy that ID.

<img src="src/img/popup-window.png" width="320" alt="Popup window showing issue IDs with type badges" />

### Settings

Choose your preferred language (English / Traditional Chinese) from the settings page.

<img src="src/img/settings.png" width="400" alt="Settings page with language selection" />

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
