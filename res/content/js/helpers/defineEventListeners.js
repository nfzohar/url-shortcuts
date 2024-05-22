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

function addNewShortcutButtonListener() {
  document.getElementById("form-input-submit").addEventListener("click", () => {
    addNewShortcut();
  });
}
