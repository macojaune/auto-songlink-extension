import { createMusicLink, type MusicLink } from "./music-link";
import type { Platform } from "./platform";

export interface PreparedLink {
  input: string;
  link: MusicLink;
}

export class LinkController {
  constructor(private readonly platform: Platform) {}
  async fromClipboard(): Promise<PreparedLink> {
    let input: string;
    try {
      input = await this.platform.readClipboard();
    } catch {
      throw new Error(
        "Lecture du presse-papier refusée. Colle ton lien directement dans le champ.",
      );
    }
    return { input, link: createMusicLink(input) };
  }
  async fromTab(): Promise<PreparedLink | undefined> {
    try {
      const input = await this.platform.activeTabUrl();
      return input ? { input, link: createMusicLink(input) } : undefined;
    } catch {
      return undefined;
    }
  }
  async copy(link: MusicLink): Promise<void> {
    try {
      await this.platform.writeClipboard(link.shareUrl);
    } catch {
      throw new Error(
        "Copie refusée. Ton lien reste disponible ci-dessus : sélectionne-le pour le copier.",
      );
    }
  }
}
