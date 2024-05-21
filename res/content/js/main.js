setTimeout(() => {
  main();
}, 100);

function main() {
  generateAddNewShortcutFormHTML();

  addCloseButtonListener();
  addNewShortcutButtonListener();
  addToggleServiceStateListener();

  loadShortcutsFromStorage();
}

// BUILD 'URL SHORTCUTS LIST'

function loadShortcutsFromStorage() {
  // let definedShortcuts = [{
  //         eventKeys: ["alt", "ctrl", "shift"],
  //         key: ["š"],
  //         url: "https://erp.dewesoft.com/#",
  //     },
  //     { eventKeys: ["alt"], key: ["p"], url: "https://process.dewesoft.com/" },
  //     { eventKeys: ["ctrl"], key: ["i"], url: "https://dewesoft.com/" },
  // ];

  let shortcutsList = document.getElementById("url-shortcuts-list");
  let definedShortcuts = chrome.storage.sync.get(["url_shortcut_list"]);

  if (!definedShortcuts.length) {
    shortcutsList.innerHTML = "<b>No shortcuts added yet.</b>";
    return;
  }

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
  let keys = shortcut.eventKeys.concat(shortcut.key);
  let keysHtml = "";

  keys.forEach((key) => {
    keysHtml += `<button class="url-shortcut-key">${key.toUpperCase()}</button>`;
  });

  return `<div class="url-shortcut-keys-section">${keysHtml}</div>`;
}

function formatURL(url) {
  let link = url.replace("https://", "").replace("http://", "");
  return `<a class="url-shortcut-link" title="${url}" href="${url}" target="_blank">${link}</a>`;
}

function addDeleteShortcutButton(shortcut) {
  return '<button title="Remove shortcut" class="a-button url-shortcut-remove-button">X</button>';
}

// BUILD 'ADD NEW URL SHORTCUT FORM'

function generateAddNewShortcutFormHTML() {
  let newShortcutForm = document.getElementById("new-shortcut-form");
  let formHTML = "";

  formHTML += `<div class="new-shortcut-input-keys">
  ${generateSupportedEventKeysHTML()}
  <span>+</span>
  <input type="text" title="Shortcut symbol (a-z, 0-9...)" maxlength=1 placeholder="w" id="new-shortcut-input-key-letter" />
  </div>`;

  formHTML +=
    '<input type="text" placeholder="http://example.com/..." id="new-shortcut-input-link" />';
  formHTML +=
    '<button id="add-new-url-shortcut-button" title="Add new shortcut" class="a-button form-new-button">Add</button>';

  newShortcutForm.innerHTML = formHTML;
}

function generateSupportedEventKeysHTML() {
  let eventKeys = ["meta", "ctrl", "alt"];
  let eventKeysHTML = "";

  eventKeys.forEach((key) => {
    let title = `Listen for ${key} key`;
    let id = `new-shortcut-input-key-${key}`;

    eventKeysHTML += `<button id="${id}" title="${title}" class="a-button form-new-button">${key.toUpperCase()}</button>`;
  });

  return eventKeysHTML;
}

// MANAGE STORAGE

function toggleServiceState() {
  let state = Boolean(chrome.storage.sync.get(["service_running"]));
  state = !state;

  chrome.storage.sync.set({ service_running: state });
  document.getElementById("service-state-toggle").checked = state;

  console.log(chrome.storage.sync.get(["service_running"]));
}

function addNewShortcut() {
  let shortcutsList = [];
  let definedShortcuts = chrome.storage.sync.get(["url_shortcut_list"]);

  let newShortcut = {
    eventKeys: ["alt"],
    key: ["p"],
    url: "https://process.dewesoft.com/",
  };

  shortcutsList.concat(definedShortcuts);
  shortcutsList.push(newShortcut);

  chrome.storage.sync.set({ url_shortcut_list: shortcutsList });

  //
  console.log(chrome.storage.sync.get(["url_shortcut_list"]));
}

function removeShortcut(shortcut) {}

// ADD EVENT LISTENERS

function addToggleServiceStateListener() {
  document
    .getElementById("service-state-toggle")
    .addEventListener("click", () => {
      toggleServiceState();
    });
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

function addNewShortcutButtonListener() {
  document
    .getElementById("add-new-url-shortcut-button")
    .addEventListener("click", () => {
      addNewShortcut();
    });
}

// GENERAL

function isUpperCase(value) {
  let str = String(value);
  return str !== str.toLowerCase() && str === str.toUpperCase();
}
