// Shared by shortcuts.js (on every page) and the manager (content/app.js),
// so a shortcut is recorded the same way it's matched.

const MODIFIERS = ["ctrl", "alt", "shift", "meta"];

// Shift and Alt (Option on macOS) turn letters and digits into other symbols,
// like Shift+1 → "!" or Option+W → "∑". Fall back to the physical key for those.
// The physical key isn't used otherwise, because it ignores the keyboard layout.
function pressedKey(event) {
  const key = event.key.toLowerCase();
  if (/^[a-z0-9]$/.test(key)) return key;

  const physical = event.code.match(/^(?:Key|Digit)(\w)$/);
  return physical ? physical[1].toLowerCase() : key;
}
