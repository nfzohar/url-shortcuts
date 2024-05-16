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
    let content = "";
    let url = shortcut.url;
    let keys = [shortcut.eventKeys, shortcut.key].flat();

    content +=
      '<div class="flex justify-between items-center p-4 rounded-lg hover:bg-gray-100"><div>';

    keys.forEach((key) => {
      content +=
        '<button class="border rounded-md px-2 py-1 bg-white">' +
        key +
        "</button>";
    });

    content += "</div>";
    content += '<a href="' + url + '" target="_blank">';
    content += url + "</a></div>;";

    shortcutsList.innerHTML += content;
  });
}

function makeCAll() {
  alert("AAAAAAAA");
}
