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
