export type Provider = "Spotify" | "Apple Music" | "YouTube" | "Songlink";
export type MusicKind = "track" | "album" | "universal";

export interface MusicLink {
  sourceUrl: string;
  shareUrl: string;
  provider: Provider;
  kind: MusicKind;
}

export class MusicLinkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MusicLinkError";
  }
}

function invalid(): never {
  throw new MusicLinkError(
    "Ce lien n’est pas compatible. Colle un morceau ou un album Spotify, Apple Music ou YouTube.",
  );
}

function direct(
  sourceUrl: string,
  provider: Provider,
  kind: "track" | "album",
  code: string,
  id: string,
): MusicLink {
  const domain = kind === "album" ? "album.link" : "song.link";
  return {
    sourceUrl,
    provider,
    kind,
    shareUrl: `https://${domain}/${code}/${id}`,
  };
}

/** Builds public Songlink URLs locally. Availability is resolved by Songlink when opened. */
export function createMusicLink(text: string): MusicLink {
  if (!text.trim())
    throw new MusicLinkError(
      "Le presse-papier est vide. Copie d’abord un lien musical.",
    );
  if (text.length > 8192) invalid();
  const uri = text.trim().match(/^spotify:(track|album):([a-zA-Z0-9]{22})$/);
  if (uri)
    return createMusicLink(`https://open.spotify.com/${uri[1]}/${uri[2]}`);
  // Extract a copied link from accompanying text instead of forwarding the whole clipboard.
  const candidate = text
    .match(/https?:\/\/[^\s<>"“”]+/i)?.[0]
    ?.replace(/[.,;!?)\]}]+$/, "");
  if (!candidate) invalid();
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return invalid();
  }
  if (url.protocol !== "https:" || url.username || url.password || url.port)
    invalid();
  const host = url.hostname.toLowerCase();

  if (host === "song.link" || host === "album.link") {
    if (!/^\/[a-zA-Z0-9_/-]+$/.test(url.pathname) || url.pathname === "/")
      invalid();
    const sourceUrl = `https://${host}${url.pathname}`;
    return {
      sourceUrl,
      shareUrl: sourceUrl,
      provider: "Songlink",
      kind: "universal",
    };
  }
  if (host === "open.spotify.com") {
    const match = url.pathname.match(
      /^\/(?:intl-[a-z]{2}\/)?(track|album)\/([a-zA-Z0-9]{22})\/?$/,
    );
    if (!match) invalid();
    const kind = match[1] === "album" ? "album" : "track";
    return direct(
      `https://open.spotify.com/${match[1]}/${match[2]}`,
      "Spotify",
      kind,
      "s",
      match[2] as string,
    );
  }
  if (host === "music.apple.com") {
    const match = url.pathname.match(
      /^\/[a-z]{2}\/(album|song)\/(?:[^/]+\/)?(\d+)\/?$/,
    );
    if (!match) invalid();
    const songId = url.searchParams.get("i");
    if (songId !== null && !/^\d+$/.test(songId)) invalid();
    const kind = match[1] === "song" || songId ? "track" : "album";
    const id = songId ?? match[2];
    if (!id) invalid();
    url.search = "";
    url.hash = "";
    if (songId) url.searchParams.set("i", songId);
    return direct(url.href, "Apple Music", kind, "i", id);
  }
  if (
    [
      "youtube.com",
      "www.youtube.com",
      "m.youtube.com",
      "music.youtube.com",
      "youtu.be",
    ].includes(host)
  ) {
    const id =
      host === "youtu.be"
        ? url.pathname.match(/^\/([\w-]{11})\/?$/)?.[1]
        : url.pathname === "/watch"
          ? url.searchParams.get("v")
          : url.pathname.match(/^\/(?:shorts|embed)\/([\w-]{11})\/?$/)?.[1];
    if (!id || !/^[\w-]{11}$/.test(id)) invalid();
    return direct(
      `https://www.youtube.com/watch?v=${id}`,
      "YouTube",
      "track",
      "y",
      id,
    );
  }
  return invalid();
}
