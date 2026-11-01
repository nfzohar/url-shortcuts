// Runs on every page: when a shortcut's keys are pressed, asks background.js
// to open its URLs. Shortcuts are edited in the modal (content/app.js).
// MODIFIERS and pressedKey() come from keys.js.

let shortcuts = [];
let enabled = true;

// Keep a copy in memory, so a key press doesn't wait on storage and
// preventDefault() still stops the browser's own action for the keys.
function loadShortcuts() {
  chrome.storage.local.get(["url_shortcut_list", "service_running"]).then((data) => {
    shortcuts = data.url_shortcut_list ?? [];
    enabled = data.service_running ?? true;
  });
}

loadShortcuts();
chrome.storage.onChanged.addListener(loadShortcuts);

// Capture phase, so the page's own key handlers can't swallow the event first.
window.addEventListener(
  "keydown",
  (event) => {
    // After the extension is reloaded, scripts left in open tabs lose access to it.
    if (!enabled || event.repeat || !event.key || !chrome.runtime?.id) return;

    const key = pressedKey(event);
    const shortcut = shortcuts.find(
      (shortcut) =>
        shortcut.key === key &&
        MODIFIERS.every((modifier) => shortcut.eventKeys.includes(modifier) === event[`${modifier}Key`])
    );
    if (!shortcut) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    chrome.runtime.sendMessage({ type: "open-urls", urls: shortcut.urls });
  },
  true
);
