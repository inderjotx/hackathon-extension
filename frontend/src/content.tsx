import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MCQWrapper } from "./components/MCQWrapper";
import shadowStyles from "./index.css?inline";

const cartographPath = "/assets/cartograph-CNvkKI47.otf";
const wotfardPath = "/assets/wotfard-DkgpNgCy.ttf";

function resolveExtensionUrl(path: string): string {
  return chrome.runtime.getURL(path);
}

function ensureGlobalFontsInjected() {
  const STYLE_ID = "study-buddy-global-fonts";
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
@font-face { font-family: "Cartograph"; font-style: normal; font-weight: 400; font-display: swap; src: url(${resolveExtensionUrl(
    cartographPath
  )}) format("opentype"); }
@font-face { font-family: "Wotfard"; font-style: normal; font-weight: 400; font-display: swap; src: url(${resolveExtensionUrl(
    wotfardPath
  )}) format("truetype"); }
`;
  document.head.appendChild(style);
}

const CONTAINER_ID = "study-buddy-mcq-root";
const HOST_ID = "study-buddy-mcq-shadow-host";

function mountMCQWrapper() {
  if (document.getElementById(CONTAINER_ID) || document.getElementById(HOST_ID))
    return;

  // Register fonts globally once to ensure availability even if adoptedStyleSheets has limitations
  ensureGlobalFontsInjected();

  const host = document.createElement("div");
  host.id = HOST_ID;
  const shadowRoot = host.attachShadow({ mode: "open" });

  // Mirror page dark mode to the shadow host so :host(.dark) token set applies
  if (document.documentElement.classList.contains("dark")) {
    host.classList.add("dark");
  }

  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
${shadowStyles}
@font-face { font-family: "Cartograph"; font-style: normal; font-weight: 400; font-display: swap; src: url(${resolveExtensionUrl(
      cartographPath
    )}) format("opentype"); }
@font-face { font-family: "Wotfard"; font-style: normal; font-weight: 400; font-display: swap; src: url(${resolveExtensionUrl(
      wotfardPath
    )}) format("truetype"); }
`);

    console.log("cartograph path", resolveExtensionUrl(cartographPath));
    console.log("wotfard path", resolveExtensionUrl(wotfardPath));
    console.log("sheet rules", sheet.cssRules);

    if ("adoptedStyleSheets" in shadowRoot) {
      (
        shadowRoot as unknown as { adoptedStyleSheets: CSSStyleSheet[] }
      ).adoptedStyleSheets = [
        ...((shadowRoot as unknown as { adoptedStyleSheets?: CSSStyleSheet[] })
          .adoptedStyleSheets || []),
        sheet,
      ];
    } else {
      throw new Error("adoptedStyleSheets not supported");
    }
  } catch {
    const styleEl = document.createElement("style");
    styleEl.textContent = `
${shadowStyles}
@font-face { font-family: "Cartograph"; font-style: normal; font-weight: 400; font-display: swap; src: url(${resolveExtensionUrl(
      cartographPath
    )}) format("opentype"); }
@font-face { font-family: "Wotfard"; font-style: normal; font-weight: 400; font-display: swap; src: url(${resolveExtensionUrl(
      wotfardPath
    )}) format("truetype"); }
` as unknown as string;
    shadowRoot.appendChild(styleEl);
  }

  const container = document.createElement("div");
  container.id = CONTAINER_ID;
  shadowRoot.appendChild(container);
  document.body.appendChild(host);

  // Keep shadow host dark class in sync with page
  const syncDarkClass = () => {
    const isDark = document.documentElement.classList.contains("dark");
    host.classList.toggle("dark", isDark);
  };
  const darkObserver = new MutationObserver(syncDarkClass);
  darkObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <MCQWrapper />
    </StrictMode>
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountMCQWrapper, {
    once: true,
  });
} else {
  mountMCQWrapper();
}
