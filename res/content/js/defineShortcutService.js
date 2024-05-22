/*
  {
    eventKeys: ["alt", "shift"],
    key: ["Š"],
    url: "https://erp.dewesoft.com",
  },
  { eventKeys: ["alt"], key: ["p"], url: "https://process.dewesoft.com/" },
  { eventKeys: ["ctrl"], key: ["i"], url: "https://dewesoft.com/" },
  { eventKeys: ["shift"], key: ["1"], url: "https://dewesoft.com/" },
*/
initializeExtension();

async function initializeExtension() {
  let definedShortcuts = await chrome.storage.local.get(["url_shortcut_list"]);
  definedShortcuts = definedShortcuts["url_shortcut_list"];

  if (typeof definedShortcuts == "undefined") {
    chrome.storage.local.set({
      url_shortcut_list: [],
      service_running: true,
    });
  }

  loadShortcuts(definedShortcuts);
}

async function loadShortcuts(definedShortcuts) {
  if (definedShortcuts.length) {
    definedShortcuts.forEach((shortcut) => {
      addCustomShortcutListener(shortcut);
    });
  }
}

function addCustomShortcutListener(shortcut) {
  document.addEventListener("keydown", function (event) {
    setTimeout(runKeyboardShortcut(event, shortcut), 200);
  });
}

function runKeyboardShortcut(event, shortcut) {
  chrome.storage.local.get(["service_running"], (serviceIsRunning) => {
    if (
      checkEventModifierKeys(event, shortcut.eventKeys, shortcut.key) &&
      event.key == shortcut.key &&
      serviceIsRunning
    ) {
      event.preventDefault();
      window.open(shortcut.url, "_blank");
    }
  });
}

function checkEventModifierKeys(event, eventKeys) {
  let areModifierKeysSet = true;
  let events = {
    alt: event.altKey,
    ctrl: event.ctrlKey,
    meta: event.metaKey,
    shift: event.shiftKey,
  };

  eventKeys.forEach((eventKey) => {
    areModifierKeysSet = areModifierKeysSet && events[eventKey];
  });

  return areModifierKeysSet;
}
