import "./styles.css";
import { LinkController, type PreparedLink } from "./controller";
import { createMusicLink, type MusicLink, MusicLinkError } from "./music-link";
import { platform } from "./platform";

function element<T extends Element = HTMLElement>(id: string): T {
  const node = document.querySelector<T>(`#${id}`);
  if (!node) throw new Error(`Missing popup element: ${id}`);
  return node;
}

const input = element<HTMLInputElement>("music-url");
const form = element<HTMLFormElement>("link-form");
const convert = element<HTMLButtonElement>("convert");
const paste = element<HTMLButtonElement>("paste");
const useTab = element<HTMLButtonElement>("use-tab");
const result = element("result");
const status = element("status");
const shareLink = element<HTMLAnchorElement>("share-link");
const controller = new LinkController(platform);
let current: MusicLink | undefined;
let tabLink: PreparedLink | undefined;
let busy = false;
let inputRevision = 0;

function message(
  text: string,
  state: "neutral" | "error" | "success" = "neutral",
) {
  status.textContent = text;
  status.dataset.state = state;
}

function render(link?: MusicLink) {
  current = link;
  input.removeAttribute("aria-invalid");
  result.dataset.state = link ? "ready" : "empty";
  result.hidden = !link;
  element("action-icon").removeAttribute("hidden");
  element("success-icon").setAttribute("hidden", "");
  convert.dataset.state = "ready";
  element("action-label").textContent = link
    ? "Copier le lien"
    : "Convertir et copier";
  if (!link) {
    shareLink.removeAttribute("href");
    return;
  }
  shareLink.href = link.shareUrl;
  shareLink.setAttribute(
    "aria-label",
    `Ouvrir le lien ${link.shareUrl} dans un nouvel onglet`,
  );
  element("share-url").textContent = link.shareUrl.replace("https://", "");
}

function prepare(prepared: PreparedLink) {
  input.value = prepared.link.sourceUrl;
  render(prepared.link);
}

function setBusy(value: boolean) {
  busy = value;
  convert.disabled = value;
  paste.disabled = value;
  useTab.disabled = value;
  input.readOnly = value;
  form.setAttribute("aria-busy", String(value));
}

function showError(error: unknown) {
  if (error instanceof MusicLinkError)
    input.setAttribute("aria-invalid", "true");
  message(
    error instanceof Error
      ? error.message
      : "Une erreur est survenue. Réessaie avec un lien musical.",
    "error",
  );
}

input.addEventListener("input", () => {
  inputRevision++;
  try {
    render(createMusicLink(input.value));
  } catch {
    render();
  }
  message("");
});

paste.addEventListener("click", async () => {
  if (busy) return;
  setBusy(true);
  message("Lecture du presse-papier…");
  try {
    prepare(await controller.fromClipboard());
    message("");
  } catch (error) {
    showError(error);
  } finally {
    setBusy(false);
    input.focus();
  }
});

useTab.addEventListener("click", () => {
  if (tabLink && !busy) {
    inputRevision++;
    prepare(tabLink);
    message("");
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy) return;
  setBusy(true);
  try {
    if (!input.value.trim()) {
      message("Lecture du presse-papier…");
      prepare(await controller.fromClipboard());
    } else {
      render(createMusicLink(input.value));
    }
    if (!current) return;
    message("Copie du lien…");
    await controller.copy(current);
    result.dataset.state = "copied";
    convert.dataset.state = "copied";
    element("action-icon").setAttribute("hidden", "");
    element("success-icon").removeAttribute("hidden");
    element("action-label").textContent = "Copié";
    message("Lien copié", "success");
  } catch (error) {
    showError(error);
  } finally {
    setBusy(false);
  }
});

// Never read or replace clipboard content at startup. Only inspect the user-invoked active tab.
const initialRevision = inputRevision;
void controller.fromTab().then((prepared) => {
  if (!prepared) return;
  tabLink = prepared;
  useTab.hidden = false;
  if (inputRevision === initialRevision && !input.value && !busy) {
    prepare(prepared);
    message("");
  }
});
