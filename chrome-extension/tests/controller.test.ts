import { describe, expect, mock, test } from "bun:test";
import { LinkController } from "../src/controller";
import { createMusicLink } from "../src/music-link";
import type { Platform } from "../src/platform";

const source =
  "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b?si=tracking";
function adapter(overrides: Partial<Platform> = {}): Platform {
  return {
    readClipboard: mock(async () => source),
    writeClipboard: mock(async () => {}),
    activeTabUrl: mock(async () => source),
    ...overrides,
  };
}

describe("clipboard and tab workflow", () => {
  test("detecting the tab never reads or overwrites the clipboard", async () => {
    const platform = adapter();
    expect((await new LinkController(platform).fromTab())?.link.shareUrl).toBe(
      "https://song.link/s/0VjIjW4GlUZAMYd2vXMi3b",
    );
    expect(platform.readClipboard).not.toHaveBeenCalled();
    expect(platform.writeClipboard).not.toHaveBeenCalled();
  });
  test("reads the clipboard and copies only the generated URL on demand", async () => {
    const platform = adapter();
    const controller = new LinkController(platform);
    const prepared = await controller.fromClipboard();
    expect(platform.writeClipboard).not.toHaveBeenCalled();
    await controller.copy(prepared.link);
    expect(platform.writeClipboard).toHaveBeenCalledWith(
      "https://song.link/s/0VjIjW4GlUZAMYd2vXMi3b",
    );
  });
  test("invalid clipboard content is preserved", async () => {
    const platform = adapter({
      readClipboard: async () => "private non-music text",
    });
    await expect(new LinkController(platform).fromClipboard()).rejects.toThrow(
      "pas compatible",
    );
    expect(platform.writeClipboard).not.toHaveBeenCalled();
  });
  test("empty clipboard shows an actionable error", async () => {
    await expect(
      new LinkController(
        adapter({ readClipboard: async () => "" }),
      ).fromClipboard(),
    ).rejects.toThrow("vide");
  });
  test("denied clipboard read explains manual recovery", async () => {
    await expect(
      new LinkController(
        adapter({
          readClipboard: async () => {
            throw new Error("denied");
          },
        }),
      ).fromClipboard(),
    ).rejects.toThrow("directement dans le champ");
  });
  test("denied write never reports success", async () => {
    await expect(
      new LinkController(
        adapter({
          writeClipboard: async () => {
            throw new Error("denied");
          },
        }),
      ).copy(createMusicLink(source)),
    ).rejects.toThrow("Copie refusée");
  });
  test("unsupported tab is ignored", async () => {
    expect(
      await new LinkController(
        adapter({ activeTabUrl: async () => "chrome://extensions/" }),
      ).fromTab(),
    ).toBeUndefined();
  });
  test("missing tab permission is recoverable", async () => {
    expect(
      await new LinkController(
        adapter({
          activeTabUrl: async () => {
            throw new Error("denied");
          },
        }),
      ).fromTab(),
    ).toBeUndefined();
  });
});
