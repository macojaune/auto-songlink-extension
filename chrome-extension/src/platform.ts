export interface Platform {
  readClipboard(): Promise<string>;
  writeClipboard(text: string): Promise<void>;
  activeTabUrl(): Promise<string | undefined>;
}

export const platform: Platform = {
  async readClipboard() {
    return navigator.clipboard.readText();
  },
  async writeClipboard(text) {
    await navigator.clipboard.writeText(text);
  },
  async activeTabUrl() {
    // Localhost previews use the actual Clipboard API without pretending to be an extension.
    if (typeof chrome === "undefined" || !chrome.tabs?.query) return undefined;
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    return tab?.url;
  },
};
