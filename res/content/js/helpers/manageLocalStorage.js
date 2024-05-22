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

  let newShortcut = getFormInputValues();
  listOfShortcuts.push(newShortcut);

  chrome.storage.local.set({ url_shortcut_list: listOfShortcuts }).then(() => {
    console.log(chrome.storage.local.get(["url_shortcut_list"]));
  });
}

function removeShortcut(shortcut) {}

function getFormInputValues() {
  let urls = document.getElementById("form-input-link");
  let symbol = document.getElementById("form-input-symbol");
  let eventKeys = document.getElementById("form-input-link");

  // TO DO: add a global variable for new shortcut object

  // TO DO: set event listeners to denote selected state and new shortcut object manipulation

  return {
    id: "",
    eventKeys: ["alt"],
    key: ["P"],
    url: "https://erp.dewesoft.com/",
  };
}

function isUpperCase(value) {
  let str = String(value);
  return str !== str.toLowerCase() && str === str.toUpperCase();
}
