function generateAddNewShortcutFormHTML() {
  let newShortcutForm = document.getElementById("new-shortcut-form");

  newShortcutForm.innerHTML = `
  <div class="form-key-inputs">
    ${generateSupportedEventKeysHTML()}
    <b>+</b>
    ${generateSymbolInputHTML()} 
  </div>
  ${generateLinkInputHTML()}`;
}

function generateSupportedEventKeysHTML() {
  let eventKeys = ["meta", "ctrl", "alt"];
  let eventKeysHTML = "";

  eventKeys.forEach((key) => {
    let title = `Listen for ${key} key`;
    let id = `new-shortcut-input-key-${key}`;

    eventKeysHTML += `<button id="${id}" title="${title}" class="url-shortcut-key form-input-event-key">${key.toUpperCase()}</button>`;
  });

  return eventKeysHTML;
}

function generateSymbolInputHTML() {
  let title = "Shortcut symbol (a-z, 0-9...)";
  let placeholder = "W";

  return `<input id="form-input-symbol" type="text" title="${title}" maxlength=1 placeholder="${placeholder}" />`;
}

function generateLinkInputHTML() {
  let linkInput =
    '<textarea id="form-input-links" placeholder="http://example-1.com, http://example-2.com..." rows="1"></textarea>';
  let submitInput =
    '<button id="form-input-submit" title="Add new shortcut" class="a-button">+</button>';

  return `<div class="form-link-section">${linkInput}${submitInput}<div>`;
}
