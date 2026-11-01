// The shortcut manager. Shortcuts are kept in chrome.storage.local, where
// res/shortcuts.js reads them on every page. MODIFIERS and pressedKey() come
// from res/keys.js.

const LIST_KEY = "url_shortcut_list";
const RUNNING_KEY = "service_running";
const MODIFIER_KEY_NAMES = ["Control", "Alt", "AltGraph", "Shift", "Meta", "OS", "GroupNext", "GroupPrevious"];

const form = document.getElementById("shortcut-form");
const recordButton = document.getElementById("record-button");
const urlsInput = document.getElementById("urls-input");
const formMessage = document.getElementById("form-message");
const defaultMessage = formMessage.textContent.trim();
const serviceToggle = document.getElementById("service-toggle");
const searchInput = document.getElementById("search-input");
const shortcutCount = document.getElementById("shortcut-count");
const list = document.getElementById("shortcut-list");
const emptyMessage = document.getElementById("empty-message");

// The recorded shortcut ({ key, eventKeys }). While recording, heldModifiers
// are the modifiers pressed so far, shown until a key completes the shortcut.
let recordedKeys = null;
let keysBeforeRecording = null;
let recording = false;
let heldModifiers = [];

recordButton.addEventListener("click", () => {
  recording ? stopRecording({ cancel: true }) : startRecording();
});

// Capture phase on the whole document, so the keys are recorded wherever the
// focus is, before anything else (like modal.js's Escape) reacts to them.
document.addEventListener(
  "keydown",
  (event) => {
    if (!recording) return;
    const eventKeys = MODIFIERS.filter((modifier) => event[`${modifier}Key`]);
    const plain = !eventKeys.some((modifier) => modifier !== "shift");

    // Tab keeps moving the focus, Escape cancels.
    if (event.key === "Tab" && plain) {
      stopRecording({ cancel: true });
      return;
    }
    event.preventDefault();
    if (event.key === "Escape" && !eventKeys.length) {
      stopRecording({ cancel: true });
      return;
    }
    if (event.repeat) return;

    if (isModifierKey(event)) {
      heldModifiers = eventKeys;
      renderRecorder();
      return;
    }

    heldModifiers = [];
    recordedKeys = { key: pressedKey(event), eventKeys };
    // Shift alone would fire while typing capital letters. Keep listening for another try.
    if (plain) {
      showMessage("Add Ctrl, Alt or Meta to the shortcut.", true);
      renderRecorder();
      return;
    }
    showMessage(defaultMessage);
    stopRecording({ cancel: false });
  },
  true
);

document.addEventListener("keyup", (event) => {
  if (!recording || !heldModifiers.length) return;
  heldModifiers = MODIFIERS.filter((modifier) => event[`${modifier}Key`]);
  renderRecorder();
});

// Clicking anywhere else or leaving the window cancels recording.
document.addEventListener("pointerdown", (event) => {
  if (!recordButton.contains(event.target)) stopRecording({ cancel: true });
});
window.addEventListener("blur", () => stopRecording({ cancel: true }));

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await addShortcut(readForm());
  } catch (error) {
    showMessage(error.message, true);
    return;
  }

  form.reset();
  recordedKeys = null;
  renderRecorder();
  showMessage(defaultMessage);
});

searchInput.addEventListener("input", () => render());
// Escape clears the search first; when it's empty, Escape closes the modal (modal.js).
searchInput.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !searchInput.value) return;
  event.preventDefault();
  searchInput.value = "";
  render();
});

serviceToggle.addEventListener("change", () => {
  chrome.storage.local.set({ [RUNNING_KEY]: serviceToggle.checked });
});

chrome.storage.onChanged.addListener(render);
render();
renderRecorder();

function readForm() {
  if (!recordedKeys) throw new Error("Click the shortcut button and press the keys.");
  if (!recordedKeys.eventKeys.some((modifier) => modifier !== "shift")) {
    throw new Error("Add Ctrl, Alt or Meta to the shortcut.");
  }

  const urls = urlsInput.value.split(/[\s,]+/).filter(Boolean).map(parseUrl);
  if (!urls.length) throw new Error("Enter at least one URL.");

  return { id: crypto.randomUUID(), ...recordedKeys, urls };
}

// With more than one keyboard layout, a modifier can be reported as something
// else, like "GroupNext" when Ctrl+Shift switches the layout. So check the
// physical key too, or that press would complete the shortcut.
function isModifierKey(event) {
  return /^(Control|Shift|Alt|Meta|OS)(Left|Right)$/.test(event.code) || MODIFIER_KEY_NAMES.includes(event.key);
}

function startRecording() {
  recording = true;
  keysBeforeRecording = recordedKeys;
  recordedKeys = null;
  heldModifiers = [];
  // Otherwise Space or Enter would press the button again instead of being recorded.
  recordButton.blur();
  showMessage(defaultMessage);
  renderRecorder();
}

function stopRecording({ cancel }) {
  if (!recording) return;
  recording = false;
  heldModifiers = [];
  if (cancel) {
    recordedKeys = keysBeforeRecording;
    showMessage(defaultMessage);
  }
  renderRecorder();
}

function renderRecorder() {
  recordButton.setAttribute("aria-pressed", recording);

  if (heldModifiers.length) {
    recordButton.replaceChildren(...keyElements({ eventKeys: heldModifiers, key: "" }), "…");
  } else if (recordedKeys) {
    recordButton.replaceChildren(...keyElements(recordedKeys));
  } else {
    recordButton.textContent = recording ? "Press the keys…" : "Record shortcut";
  }
}

// Without http(s)://, a host needs a dot, so a stray word isn't taken as a URL.
function parseUrl(text) {
  const hasScheme = /^https?:\/\//i.test(text);
  const url = URL.parse(hasScheme ? text : `https://${text}`);
  if (!url || (!hasScheme && !url.hostname.includes("."))) {
    throw new Error(`"${text}" isn't a valid URL.`);
  }
  return url.href;
}

async function getShortcuts() {
  const { [LIST_KEY]: shortcuts = [] } = await chrome.storage.local.get(LIST_KEY);
  return shortcuts;
}

async function addShortcut(shortcut) {
  const shortcuts = await getShortcuts();
  if (shortcuts.some((existing) => sameKeys(existing, shortcut))) {
    throw new Error(`${keyLabels(shortcut).join("+")} is already in use.`);
  }
  await chrome.storage.local.set({ [LIST_KEY]: [...shortcuts, shortcut] });
}

async function removeShortcut(id) {
  const shortcuts = await getShortcuts();
  await chrome.storage.local.set({ [LIST_KEY]: shortcuts.filter((shortcut) => shortcut.id !== id) });
}

function sameKeys(a, b) {
  return a.key === b.key && MODIFIERS.every((modifier) => a.eventKeys.includes(modifier) === b.eventKeys.includes(modifier));
}

function keyLabels(shortcut) {
  const modifiers = MODIFIERS.filter((modifier) => shortcut.eventKeys.includes(modifier));
  const labels = modifiers.map((modifier) => modifier[0].toUpperCase() + modifier.slice(1));
  return shortcut.key ? [...labels, keyLabel(shortcut.key)] : labels;
}

// Keys like "arrowup" or " " get a readable name; letters and symbols are uppercased.
function keyLabel(key) {
  if (key === " ") return "Space";
  return key.length > 1 ? key[0].toUpperCase() + key.slice(1) : key.toUpperCase();
}

function keyElements(shortcut) {
  return keyLabels(shortcut).map((label) => element("kbd", "", label));
}

function showMessage(text, isError = false) {
  formMessage.textContent = text;
  formMessage.classList.toggle("text-red-600", isError);
  formMessage.classList.toggle("text-gray-500", !isError);
}

async function render() {
  const { [LIST_KEY]: shortcuts = [], [RUNNING_KEY]: running = true } = await chrome.storage.local.get([
    LIST_KEY,
    RUNNING_KEY,
  ]);

  const query = searchInput.value.trim().toLowerCase();
  const shown = shortcuts.filter((shortcut) => matchesSearch(shortcut, query)).toReversed();

  serviceToggle.checked = running;
  shortcutCount.textContent = shown.length < shortcuts.length ? `${shown.length} of ${shortcuts.length}` : shortcuts.length;
  list.replaceChildren(...shown.map(renderShortcut));
  emptyMessage.hidden = shown.length > 0;
  emptyMessage.textContent = shortcuts.length ? `No shortcuts match "${searchInput.value.trim()}".` : "No shortcuts added yet.";
}

// Matches any of the URLs, or the keys written like "ctrl+alt+w".
function matchesSearch(shortcut, query) {
  const keys = keyLabels(shortcut).join("+").toLowerCase();
  return !query || keys.includes(query) || shortcut.urls.some((url) => url.toLowerCase().includes(query));
}

function renderShortcut(shortcut) {
  const keys = element("div", "flex shrink-0 flex-wrap items-center gap-1 sm:w-64");
  keys.append(...keyElements(shortcut));

  const links = element("div", "min-w-0 flex-1 text-sm");
  shortcut.urls.forEach((url) => {
    const link = element("a", "block w-fit max-w-full truncate text-blue-700 hover:underline", url.replace(/^https?:\/\//, ""));
    link.href = url;
    link.title = url;
    link.target = "_blank";
    links.append(link);
  });

  const removeButton = element(
    "button",
    "size-7 shrink-0 cursor-pointer rounded-md text-lg leading-none text-gray-400 hover:bg-red-600 hover:text-white",
    "×"
  );
  removeButton.title = "Remove shortcut";
  removeButton.setAttribute("aria-label", "Remove shortcut");
  removeButton.addEventListener("click", () => removeShortcut(shortcut.id));

  const item = element("li", "flex items-center gap-4 px-3 py-3 hover:bg-gray-100");
  item.append(keys, links, removeButton);
  return item;
}

function element(tag, className, text = "") {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
}
