// Helpers for pages shown in the modal. Include it with <script src="modal.js">.
//
//   closeModal()            close the modal from your own code
//   data-close-modal        clicking this element closes the modal
//   data-modal-backdrop     clicking this element itself (not its children)
//                           closes the modal; use it on a full-screen wrapper
//   Escape                  closes the modal

function closeModal() {
  window.parent.postMessage({ type: "extension-modal:close" }, "*");
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !event.defaultPrevented) closeModal();
});

// Only close on a backdrop click that also started on the backdrop, so that
// selecting text inside the modal and releasing outside doesn't close it.
let pressedOnBackdrop = false;
document.addEventListener("pointerdown", (event) => {
  pressedOnBackdrop = event.target.hasAttribute("data-modal-backdrop");
});

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-modal]")) {
    closeModal();
  } else if (pressedOnBackdrop && event.target.hasAttribute("data-modal-backdrop")) {
    closeModal();
  }
});
