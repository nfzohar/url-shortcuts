setTimeout(() => {
  main();
}, 100);

function main() {
  generateAddNewShortcutFormHTML();

  setNewShortcutEventKeysOnChange();
  setNewShortcutSymbolOnChange();
  setNewShortcutLinksOnChange();

  addCloseButtonListener();
  addNewShortcutButtonListener();
  addToggleServiceStateListener();

  loadShortcutsFromLocalStorage();
  refreshShortcutsListOnStorageUpdate();
  setCheckedServiceRunningCheckbox();
}
