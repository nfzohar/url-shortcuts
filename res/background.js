const MODAL_PAGE = "res/content/index.html";

// Toolbar icon click: open the modal on the current page, or close it.
chrome.action.onClicked.addListener(async (tab) => {
  let opened = false;
  try {
    const [injection] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: toggleModal,
      args: [chrome.runtime.getURL(MODAL_PAGE)],
    });
    opened = injection?.result === true;
  } catch {
    // Handled below.
  }

  // Browsers don't allow extensions on their own pages (chrome://, about:,
  // the extension stores, …). Chrome throws there, Firefox returns no result.
  if (!opened) {
    await chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color: "#dc2626" });
    await chrome.action.setBadgeText({ tabId: tab.id, text: "!" });
    setTimeout(() => chrome.action.setBadgeText({ tabId: tab.id, text: "" }).catch(() => {}), 3000);
  }
});

// Runs inside the web page. Shows res/content/index.html in an iframe inside a
// full-screen <dialog>, so the page's CSS and scripts can't interfere with it.
function toggleModal(src) {
  const id = `extension-modal-${chrome.runtime.id}`;
  const existing = document.getElementById(id)?.shadowRoot?.querySelector("dialog");
  if (existing) {
    if (existing.open) {
      existing.close();
    } else {
      existing.showModal();
      existing.querySelector("iframe").focus();
    }
    return true;
  }

  // The dialog lives in a shadow root, so page CSS like `dialog { … }` or
  // `dialog::backdrop { … }` can't match it.
  const host = document.createElement("extension-modal");
  host.id = id;
  const shadow = host.attachShadow({ mode: "open" });
  const dialog = document.createElement("dialog");
  const iframe = document.createElement("iframe");
  iframe.src = src;

  // Styles set through element.style can't be blocked by the page's Content
  // Security Policy, unlike <style> elements.
  Object.assign(dialog.style, {
    position: "fixed",
    inset: "0",
    width: "100vw",
    height: "100vh",
    maxWidth: "none",
    maxHeight: "none",
    margin: "0",
    padding: "0",
    border: "none",
    outline: "none",
    background: "transparent",
    overflow: "hidden",
  });
  Object.assign(iframe.style, {
    display: "block",
    width: "100%",
    height: "100%",
    border: "none",
    background: "transparent",
    // A color-scheme mismatch with the page makes the iframe opaque.
    colorScheme: "normal",
  });
  hideDefaultBackdrop(shadow);

  // index.html asks to close via window.parent.postMessage (see modal.js).
  window.addEventListener("message", (event) => {
    if (event.source === iframe.contentWindow && event.data?.type === "extension-modal:close") {
      dialog.close();
    }
  });

  dialog.append(iframe);
  shadow.append(dialog);
  document.documentElement.append(host);
  dialog.showModal();
  iframe.focus();
  return true;

  // The browser's default ::backdrop slightly dims the page; let index.html
  // decide instead. ::backdrop can only be styled from a stylesheet.
  function hideDefaultBackdrop(root) {
    const css = "dialog::backdrop { background: transparent; }";
    try {
      // Constructable stylesheets aren't subject to the page's CSP...
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(css);
      root.adoptedStyleSheets = [sheet];
    } catch {
      // ...but Firefox doesn't let content scripts adopt them.
      const style = document.createElement("style");
      style.textContent = css;
      root.append(style);
    }
  }
}

// A shortcut was pressed on a page (see shortcuts.js): open its URLs in new
// tabs next to that page. Tabs opened here aren't stopped by popup blockers.
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.type !== "open-urls" || !sender.tab) return;

  message.urls.forEach((url, i) => {
    chrome.tabs.create({
      url,
      windowId: sender.tab.windowId,
      index: sender.tab.index + 1 + i,
      openerTabId: sender.tab.id,
      active: i === 0,
    });
  });
});

// Shortcuts saved by version 1 can share IDs, have uppercase keys and repeat
// modifiers. Give every shortcut its own ID and a consistent format.
chrome.runtime.onInstalled.addListener(async () => {
  const { url_shortcut_list: shortcuts } = await chrome.storage.local.get("url_shortcut_list");
  if (!shortcuts) return;

  await chrome.storage.local.set({
    url_shortcut_list: shortcuts.map((shortcut) => ({
      id: crypto.randomUUID(),
      key: shortcut.key.toLowerCase(),
      eventKeys: [...new Set(shortcut.eventKeys)],
      urls: shortcut.urls,
    })),
  });
});
