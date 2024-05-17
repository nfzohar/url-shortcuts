setTimeout(() => {
  loadShortcutsFromStorage();
}, 100);

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
  let content = '<div class="url-shortcut">';

  content += generateKeysHTML(shortcut);
  content +=
    '<a href="' + shortcut.url + '" target="_blank">' + shortcut.url + "</a>";

  content += '<button class="url-shortcut-key">X</button></div>';
  return content;
}

function generateKeysHTML(shortcut) {
  let keys = [shortcut.eventKeys, shortcut.key].flat();
  let keysHtml = '<div class="url-shortcut-keys-section">';

  keys.forEach((key) => {
    keysHtml += '<button class="url-shortcut-key">' + key + "</button>";
  });

  keysHtml += "</div>";
  return keysHtml;
}

function addNewShortcut() {}
