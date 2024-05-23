var newShortcut = {
    id: "",
    key: "",
    urls: [],
    eventKeys: [],
};

function refreshShortcutsListOnStorageUpdate() {
    chrome.storage.onChanged.addListener(() => {
        loadShortcutsFromLocalStorage();
        setCheckedServiceRunningCheckbox()
    });
}

function addToggleServiceStateListener() {
    document
        .getElementById("service-state-toggle")
        .addEventListener("click", () => {
            toggleServiceState();
        });
}

function addCloseButtonListener() {
    let dialog = document.querySelector("dialog");
    if (!dialog) return;

    document
        .getElementById("modal-close-button")
        .addEventListener("click", () => {
            dialog.close();
        });
}

function addRemoveShortcutButtonListeners(shortcuts) {
    shortcuts.forEach((shortcut) => {
        document
            .getElementById(`remove-${shortcut.id}`)
            .addEventListener("click", () => {
                removeShortcut(shortcut);
            });
    });
}

function setNewShortcutEventKeysOnChange() {
    let eventKeys = ["meta", "ctrl", "alt"];

    eventKeys.forEach((eventKey) => {
        let eventKeyButton = document.getElementById(
            `new-shortcut-input-key-${eventKey}`
        );

        eventKeyButton.addEventListener("click", () => {
            if (!newShortcut.eventKeys.includes(eventKey)) {
                newShortcut.eventKeys.push(eventKey);
                eventKeyButton.classList.add("form-event-key-selected");
            } else {
                newShortcut.eventKeys.filter((key) => key != eventKey);
                eventKeyButton.classList.remove("form-event-key-selected");
            }
        });
    });
}

function setNewShortcutSymbolOnChange() {
    let symbolInput = document.getElementById("form-input-symbol");

    symbolInput.addEventListener("change", () => {
        newShortcut.key = symbolInput.value;

        isUpperCase(symbolInput.value) ?
            newShortcut.eventKeys.push("shift") :
            newShortcut.eventKeys.filter((key) => key != "shift");
    });
}

function setNewShortcutLinksOnChange() {
    let linksInput = document.getElementById("form-input-links");

    linksInput.addEventListener("change", () => {
        let urlList = linksInput.value.split(", ");
        newShortcut.urls = urlList.map((url) => url.trim());
    });
}

function addNewShortcutButtonListener() {
    document.getElementById("form-input-submit").addEventListener("click", () => {
        newShortcut.id = generateNewShortcutId();
        addNewShortcut(newShortcut);
    });
}

function generateNewShortcutId() {
    return (
        newShortcut.eventKeys.join("+") +
        "+" +
        newShortcut.key +
        "-" +
        newShortcut.urls.length
    );
}

function isUpperCase(value) {
    let str = String(value);
    return str !== str.toLowerCase() && str === str.toUpperCase();
}