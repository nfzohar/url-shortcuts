setTimeout(() => {
  main();
}, 100);

function main() {
  generateAddNewShortcutFormHTML();

  addCloseButtonListener();
  addNewShortcutButtonListener();
  addToggleServiceStateListener();

  loadShortcutsFromLocalStorage();
}
