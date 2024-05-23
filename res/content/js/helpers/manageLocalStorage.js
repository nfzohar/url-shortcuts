function toggleServiceState() {
  chrome.storage.local.get(["service_running"], (serviceState) => {
    let newState = !serviceState["service_running"];

    chrome.storage.local.set({ service_running: newState });
    document.getElementById("service-state-toggle").checked = newState;
  });
}

async function addNewShortcut(newShortcut) {
  let listOfShortcuts = await chrome.storage.local.get(["url_shortcut_list"]);
  listOfShortcuts = listOfShortcuts["url_shortcut_list"];

  if (
    !newShortcut.eventKeys.length ||
    !newShortcut.urls.length ||
    !newShortcut.key
  ) {
    alert("Can't add an empty shortcut.");
    return;
  }

  listOfShortcuts.push(newShortcut);
  chrome.storage.local.set({ url_shortcut_list: listOfShortcuts });
}

async function removeShortcut(removedShortcut) {
  let currentShortcuts = await chrome.storage.local.get(["url_shortcut_list"]);

  currentShortcuts = currentShortcuts["url_shortcut_list"].filter(
    (oldShortcut) => oldShortcut.id != removedShortcut.id
  );

  chrome.storage.local.set({ url_shortcut_list: currentShortcuts });
}
