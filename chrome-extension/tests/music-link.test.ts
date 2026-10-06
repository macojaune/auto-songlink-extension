import { describe, expect, test } from "bun:test";
import { createMusicLink, MusicLinkError } from "../src/music-link";

const id = "0VjIjW4GlUZAMYd2vXMi3b";

describe("public sharing links", () => {
  test.each([
    [
      `https://open.spotify.com/track/${id}?si=tracking#fragment`,
      `https://song.link/s/${id}`,
      "Spotify",
      "track",
    ],
    [
      `https://open.spotify.com/intl-fr/track/${id}`,
      `https://song.link/s/${id}`,
      "Spotify",
      "track",
    ],
    [`spotify:track:${id}`, `https://song.link/s/${id}`, "Spotify", "track"],
    [
      `https://open.spotify.com/album/${id}`,
      `https://album.link/s/${id}`,
      "Spotify",
      "album",
    ],
    [
      "https://music.apple.com/fr/album/after-hours/1499385848?i=1499378615&app=music",
      "https://song.link/i/1499378615",
      "Apple Music",
      "track",
    ],
    [
      "https://music.apple.com/us/song/after-hours/1499378615",
      "https://song.link/i/1499378615",
      "Apple Music",
      "track",
    ],
    [
      "https://music.apple.com/us/album/after-hours/1499385848?at=tracking",
      "https://album.link/i/1499385848",
      "Apple Music",
      "album",
    ],
    [
      "https://music.apple.com/us/album/1499385848",
      "https://album.link/i/1499385848",
      "Apple Music",
      "album",
    ],
    [
      "https://youtu.be/4NRXx6U8ABQ?si=tracking",
      "https://song.link/y/4NRXx6U8ABQ",
      "YouTube",
      "track",
    ],
    [
      "https://www.youtube.com/watch?v=4NRXx6U8ABQ&list=playlist&t=123",
      "https://song.link/y/4NRXx6U8ABQ",
      "YouTube",
      "track",
    ],
    [
      "https://music.youtube.com/watch?v=4NRXx6U8ABQ",
      "https://song.link/y/4NRXx6U8ABQ",
      "YouTube",
      "track",
    ],
    [
      "https://m.youtube.com/watch?v=4NRXx6U8ABQ",
      "https://song.link/y/4NRXx6U8ABQ",
      "YouTube",
      "track",
    ],
    [
      "https://www.youtube.com/shorts/4NRXx6U8ABQ",
      "https://song.link/y/4NRXx6U8ABQ",
      "YouTube",
      "track",
    ],
    [
      "https://song.link/s/example?utm_source=tracking",
      "https://song.link/s/example",
      "Songlink",
      "universal",
    ],
    [
      "https://album.link/my-album",
      "https://album.link/my-album",
      "Songlink",
      "universal",
    ],
  ])("%s becomes %s", (input, shareUrl, provider, kind) => {
    expect(createMusicLink(input)).toMatchObject({ shareUrl, provider, kind });
  });

  test("extracts a link from text and punctuation", () => {
    expect(
      createMusicLink(`Écoute ça (${"https://open.spotify.com/track/"}${id}).`)
        .shareUrl,
    ).toBe(`https://song.link/s/${id}`);
  });

  test("preserves Apple's song selector while removing tracking", () => {
    expect(
      createMusicLink(
        "https://music.apple.com/fr/album/name/123?i=456&at=secret#lyrics",
      ).sourceUrl,
    ).toBe("https://music.apple.com/fr/album/name/123?i=456");
  });

  test.each([
    "",
    "  ",
    "not a link",
    "javascript:alert(1)",
    "file:///etc/passwd",
    `http://open.spotify.com/track/${id}`,
    `https://open.spotify.com.evil.test/track/${id}`,
    `https://evil.test/?redirect=https://open.spotify.com/track/${id}`,
    `https://user:password@open.spotify.com/track/${id}`,
    `https://open.spotify.com:8443/track/${id}`,
    "https://open.spotify.com/track/invalid",
    `https://open.spotify.com/artist/${id}`,
    `https://open.spotify.com/playlist/${id}`,
    `https://open.spotify.com/track/${id}/extra`,
    "https://music.apple.com/fr/album/name/123?i=oops",
    "https://music.apple.com/us/artist/name/123",
    "https://www.youtube.com/playlist?list=example",
    "https://www.youtube.com/watch?v=bad",
    "https://youtu.be/4NRXx6U8ABQ/extra",
    "https://song.link/",
    "https://spotify.link/unknown",
    "https://music.apple.com/fr/album/name/123?i=",
  ])("rejects unsupported or untrusted input: %s", (input) => {
    expect(() => createMusicLink(input)).toThrow(MusicLinkError);
  });
});

test("rejects oversized clipboard input", () => {
  expect(() => createMusicLink("x".repeat(8193))).toThrow(MusicLinkError);
});
