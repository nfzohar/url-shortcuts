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
  let content = "";
  let url = shortcut.url;
  let keys = [shortcut.eventKeys, shortcut.key].flat();

  content += '<div class="url-shortcut">';

  content += '<div class="url-shortcut-keys-section">';
  keys.forEach((key) => {
    content += '<button class="url-shortcut-key">' + key + "</button>";
  });
  content += "</div>";

  content += '<a href="' + url + '" target="_blank">' + url + "</a>";

  content += '<button class="url-shortcut-key" >X</button>';
  content += "</div>";

  return content;
}
