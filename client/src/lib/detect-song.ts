export type SongKind = "youtube" | "spotify" | "soundcloud" | "blank" | "other";

export function detectSongKind(url: string): SongKind {
  if (url === "") return "blank";
  if (url.includes("youtube.com")) {
    return "youtube";
  }
  if (url.includes("https://open.spotify.com/track")) {
    return "spotify";
  }
  if (url.includes("soundcloud.com")) {
    return "soundcloud";
  }
  return "other";
}
