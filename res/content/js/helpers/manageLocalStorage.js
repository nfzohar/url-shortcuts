function toggleServiceState() {
  chrome.storage.local.get(["service_running"], (serviceState) => {
    let newState = !serviceState["service_running"];

    chrome.storage.local.set({ service_running: newState });
    document.getElementById("service-state-toggle").checked = newState;
  });
}

async function addNewShortcut() {
  let listOfShortcuts = await chrome.storage.local.get(["url_shortcut_list"]);
  listOfShortcuts = listOfShortcuts["url_shortcut_list"];

  let newShortcut = {
    eventKeys: ["alt"],
    key: ["P"],
    url: "https://erp.dewesoft.com/",
  };

  listOfShortcuts.push(newShortcut);

  chrome.storage.local.set({ url_shortcut_list: listOfShortcuts }).then(() => {
    console.log(chrome.storage.local.get(["url_shortcut_list"]));
  });
}

function removeShortcut(shortcut) {}

function isUpperCase(value) {
  let str = String(value);
  return str !== str.toLowerCase() && str === str.toUpperCase();
}
