async function loadShortcutsFromLocalStorage() {
  let shortcutsList = document.getElementById("url-shortcuts-list");
  let localStorage = await chrome.storage.local.get("url_shortcut_list");

  if (!localStorage["url_shortcut_list"].length) {
    shortcutsList.innerHTML = "<b>No shortcuts added yet.</b>";
    return;
  }

  let definedShortcuts = localStorage["url_shortcut_list"].reverse();
  shortcutsList.innerHTML = "";

  definedShortcuts.forEach((shortcut) => {
    shortcutsList.innerHTML += generateShortcutHTML(shortcut);
  });

  addRemoveShortcutButtonListeners(definedShortcuts);
}

function generateShortcutHTML(shortcut) {
  return `<div class="url-shortcut">
    ${generateKeysHTML(shortcut)} 
    ${formatURLs(shortcut.urls)}
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

function formatURLs(urls) {
  let urlsHTML = '<div id="url-shortcut-links">';

  urls.forEach((url) => {
    let link = url.replace("https://", "").replace("http://", "");
    urlsHTML += `<a class="url-shortcut-link" title="${url}" href="${url}" target="_blank">${link}</a>`;
  });

  return urlsHTML + "</div>";
}

function addDeleteShortcutButton(shortcut) {
  return `<button id="remove-${shortcut.id}" title="Remove shortcut" class="a-button url-shortcut-remove-button">X</button>`;
}

async function setCheckedServiceRunningCheckbox() {
  let isServiceRunning = await chrome.storage.local.get(["service_running"]);

  if (isServiceRunning["service_running"]) {
    document.getElementById("service-state-toggle").checked =
      isServiceRunning["service_running"];
  }
}
