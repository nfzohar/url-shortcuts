# Browser extension: Custom URL shortcuts

A browser extension for setting up custom keyboard shortcuts that open one or more URLs, for **Chrome, Firefox and Safari** (plus Edge, Brave, Opera and other Chromium browsers).

Used: JS + HTML + CSS (Tailwind). No build step. Built on the [extension-with-modal template](https://github.com/nfzohar/chrome-extension-with-modal).

## Usage

Click the extension icon to open the shortcut manager on the current page:

- Click the shortcut button and press the key combination you want, like Ctrl+Alt+W. It needs Ctrl, Alt or Meta, so shortcuts don't fire while you type. Escape or clicking again (or elsewhere) stops recording and keeps the previous combination.
- Enter one or more URLs, separated by commas, spaces or new lines. `https://` is added when missing.
- Search the list by URL or keys (like `ctrl+alt`).
- Use **Shortcuts enabled** to turn all shortcuts off or on.

Pressing a shortcut on any page opens its URLs in new tabs next to the current one. Browsers reserve some shortcuts (like Ctrl+T or Ctrl+W) and don't let extensions override them.

## Getting started

### Chrome, Edge, Brave, Opera

1. Open `chrome://extensions` (Edge: `edge://extensions`) and turn on **Developer mode**.
2. Click **Load unpacked** and select this folder.

After editing files, click the reload icon on the extension's card. Chrome may warn about `background.scripts` and `browser_specific_settings`. Those keys are for Firefox, and Chrome ignores them.

### Firefox (128+)

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…** and select `manifest.json` in this folder.

### Safari

See the [template's instructions](https://github.com/nfzohar/chrome-extension-with-modal#safari-macos-requires-xcode).

## Project structure

```
manifest.json
res/
  background.js     Icon click → open/close the manager; opens a shortcut's URLs
  shortcuts.js      Runs on every page: listens for shortcut keys
  keys.js           Key helpers shared by shortcuts.js and the manager
  icon/             Extension icons
  content/          The manager modal (shown in an iframe, isolated from the page)
    index.html
    app.js          Record, add, remove and list shortcuts
    style.css
    modal.js        Close helpers (Escape, close button, backdrop click)
    lib/            Tailwind
```

Shortcuts are stored in `chrome.storage.local` under `url_shortcut_list` as `{ id, key, eventKeys, urls }`, and the on/off state under `service_running`.

## Permissions

- `storage`: saves the shortcuts.
- `activeTab`, `scripting`: show the manager on the page where the icon is clicked.
- Content script on all sites: needed to listen for the shortcut keys on every page, so browsers show an "access to all websites" notice at install.

The manager can't open on the browser's own pages (`chrome://`, `about:`, the New Tab page, the extension stores). There, the icon shows a red **!** for a few seconds. Shortcuts don't work on those pages either.
