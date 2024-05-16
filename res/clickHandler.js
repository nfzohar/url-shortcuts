chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: showModalOnClick,
  });
});

function showModalOnClick() {
  let modal = document.createElement("dialog");
  const indexFilePath = "res/content/html/index.html";

  modal.setAttribute(
    "style",
    "height:100%; width:100%; position:fixed; margin:auto; border:none; outline:none; background:none;"
  );

  fetch(chrome.runtime.getURL(indexFilePath))
    .then((response) => response.text())
    .then((text) => {
      modal.innerHTML = text;
    });

  document.body.appendChild(modal);
  let dialog = document.querySelector("dialog");
  dialog.showModal();
}
