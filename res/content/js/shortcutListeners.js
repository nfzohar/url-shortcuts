let timeoutId = "";
let listenersRunning = true;
let definedShortcuts = [{
        eventKeys: ["alt", "shift"],
        key: ["Š"],
        url: "https://erp.dewesoft.com",
    },
    { eventKeys: ["alt"], key: ["p"], url: "https://process.dewesoft.com/" },
    { eventKeys: ["ctrl"], key: ["i"], url: "https://dewesoft.com/" },
    { eventKeys: ["shift"], key: ["1"], url: "https://dewesoft.com/" },
];

loadShortcuts();

function loadShortcuts() {
    if (definedShortcuts.length) {
        definedShortcuts.forEach((shortcut) => {
            addShortcutListener(shortcut);
        });
    }
}

function addShortcutListener(shortcut) {
    document.addEventListener("keydown", function(event) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(runKeyboardShortcut(event, shortcut), 200);
    });
}

function runKeyboardShortcut(event, shortcut) {
    if (
        listenersRunning &&
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