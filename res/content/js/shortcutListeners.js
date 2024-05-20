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

function initializeExtension() {
  if (
    !chrome.storage.sync.get(["url_shortcut_list"]) &&
    !chrome.storage.sync.get(["service_running"])
  ) {
    chrome.storage.sync.set({ url_shortcut_list: [], service_running: true });
  }

  chrome.storage.onChanged.addListener(() => {
    location.reload();
  });
  loadShortcuts();
}

function loadShortcuts() {
  let definedShortcuts = chrome.storage.sync.get(["url_shortcut_list"]);

  if (definedShortcuts.length) {
    definedShortcuts.forEach((shortcut) => {
      addShortcutListener(shortcut);
    });
  }
}

function addShortcutListener(shortcut) {
  var listenerServiceRunning = Boolean(
    chrome.storage.sync.get(["service_running"])
  );

  document.addEventListener("keydown", function (event) {
    if (listenerServiceRunning) {
      setTimeout(runKeyboardShortcut(event, shortcut), 200);
    }
  });
}

function runKeyboardShortcut(event, shortcut) {
  if (
    checkEventModifierKeys(event, shortcut.eventKeys, shortcut.key) &&
    event.key == shortcut.key
  ) {
    event.preventDefault();
    window.open(shortcut.url, "_blank");
  }
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
