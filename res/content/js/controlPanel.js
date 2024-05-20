setTimeout(() => {
  main();
}, 100);

function main() {
  addCloseButtonListener();
  addToggleServiceStateListener();
  generateAddNewShortcutFormHTML();
  loadShortcutsFromStorage();
}

function addCloseButtonListener() {
  let dialog = document.querySelector("dialog");
  if (!dialog) return;

  document
    .getElementById("modal-close-button")
    .addEventListener("click", () => {
      dialog.close();
    });
}

function addToggleServiceStateListener() {
  document
    .getElementById("service-state-toggle")
    .addEventListener("click", () => {
      toggleServiceState();
    });
}

function loadShortcutsFromStorage() {
  let definedShortcuts = [
    {
      eventKeys: ["alt", "ctrl"],
      key: ["Š"],
      url: "https://erp.dewesoft.com/#",
    },
    { eventKeys: ["alt"], key: ["p"], url: "https://process.dewesoft.com/" },
    { eventKeys: ["ctrl"], key: ["i"], url: "https://dewesoft.com/" },
    { eventKeys: ["shift"], key: ["1"], url: "https://dewesoft.com/" },
  ];

  let shortcutsList = document.getElementById("shortcuts-list");
  shortcutsList.innerHTML = "";

  definedShortcuts.forEach((shortcut) => {
    shortcutsList.innerHTML += generateShortcutHTML(shortcut);
  });
}

function generateShortcutHTML(shortcut) {
  return `<div class="url-shortcut">
    ${generateKeysHTML(shortcut)} 
    ${formatURL(shortcut.url)}
    ${addDeleteShortcutButton(shortcut)}
  </div>`;
}

function generateKeysHTML(shortcut) {
  let keys = shortcut.eventKeys;
  let keysHtml = "";

  if (isUpperCase(shortcut.key)) {
    keys.push("shift");
  }
  keys.push(shortcut.key);

  keys.forEach((key) => {
    keysHtml += `<button class="url-shortcut-key">${key}</button>`;
  });

  return `<div class="url-shortcut-keys-section">${keysHtml}</div>`;
}

function isUpperCase(value) {
  let str = String(value);
  return str !== str.toLowerCase() && str === str.toUpperCase();
}

function formatURL(url) {
  let link = url.replace("https://", "").replace("http://", "");
  return `<a title="${url}" href="${url}" target="_blank">${link}</a>`;
}

function addDeleteShortcutButton(shortcut) {
  return '<button class="url-shortcut-remove-button">X</button>';
}

function generateAddNewShortcutFormHTML() {
  let newShortcutForm = document.getElementById("new-shortcut-form");
  newShortcutForm.innerHTML = "<div>";

  newShortcutForm.innerHTML += '<button class="url-shortcut-key">Meta</button>';
  newShortcutForm.innerHTML += '<button class="url-shortcut-key">Ctrl</button>';
  newShortcutForm.innerHTML += '<button class="url-shortcut-key">Alt</button>';
  newShortcutForm.innerHTML += "</div>";
  newShortcutForm.innerHTML +=
    '<input type="text" maxlength=1 placeholder="w" id="new-shortcut-letter" class="new-shortcut-text-input" />';
  newShortcutForm.innerHTML +=
    '<input type="text" placeholder="url..." id="new-shortcut-url" class="new-shortcut-text-input" />';
  newShortcutForm.innerHTML += '<button class="url-shortcut-key">Add</button>';
}

function updateShortcutList(shortcut, action) {
  let shortcutList = chrome.storage.sync.get(["key"]);

  chrome.storage.sync.set({ key: value });
}

function addShortcut(shortcut) {}

function removeShortcut(shortcut) {}

function toggleServiceState() {
  let currentState = chrome.storage.sync.get(["service_running"]);
  chrome.storage.sync.set({ service_running: !currentState });

  console.log("service running state toggled");

  document.getElementById("service-state-toggle").checked = !currentState
    ? true
    : false;
}

function toggleServiceState() {
  let currentState = Boolean(chrome.storage.sync.get(["service_running"]));

  chrome.storage.sync.set({ service_running: !currentState }).then(() => {
    console.log("service running state toggled");
    console.log(chrome.storage.sync.get(["service_running"]));
  });

  document.getElementById("service-state-toggle").checked = !currentState
    ? true
    : false;
}

function addNewShortcut(shortcut) {}

function removeShortcut(shortcut) {}

function updateShortcutList(shortcut, action) {
  let shortcutList = chrome.storage.sync.get(["key"]);

  chrome.storage.sync.set({ key: value });
}
