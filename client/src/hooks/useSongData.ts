import { type SongData } from "@api/types/res";
import { client } from "@/lib/service/api";

export type SongKind = "youtube" | "spotify" | "soundcloud" | "blank" | "other";
export type SongInfo = {
  kind: SongKind;
  id?: string;
};

export const songServices = {
  soundcloud: {
    name: "SoundCloud",
    icon: "mdi:soundcloud",
    color: "orange",
  },
  spotify: {
    name: "Spotify",
    icon: "mdi:spotify",
    color: "green",
  },
  youtube: {
    name: "YouTube",
    icon: "material-symbols:youtube-music",
    color: "red",
  },
  blank: {
    name: "",
    icon: "mdi:blank",
    color: "gray",
  },
  other: {
    name: "",
    icon: "mdi:blank",
    color: "gray",
  },
} as const satisfies Record<
  SongKind,
  {
    name: string;
    icon: string;
    color: string;
  }
>;

export function inferSongInfo(url: string): SongInfo {
  if (url === "") {
    return {
      kind: "blank",
    };
  }

  if (url.includes("youtube.com")) {
    const id = new URL(url).searchParams.get("v");
    if (id == null) throw new Error("Failed to parse youtube video id");
    return {
      kind: "youtube",
      id,
    };
  }
  if (url.includes("https://open.spotify.com/track")) {
    const id = url.split("/").pop();
    if (id == null) throw new Error("Failed to parse spotify track id");
    return {
      kind: "spotify",
      id,
    };
  }
  if (url.includes("soundcloud.com")) {
    return {
      kind: "soundcloud",
      id: "", // TODO: implement
    };
  }

  return {
    kind: "other",
  };
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useSongData() {
  async function fetchSingle(
    songKind: SongKind,
    id: string,
  ): Promise<SongData> {
    const res = await client.v1.songs[":songKind"][":id"].$get({
      param: {
        songKind,
        id,
      },
    });

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!res.ok) throw new Error("Failed to fetch song data");
    return await res.json();
  }

  async function fetchSingleMock(): Promise<SongData> {
    return {
      title: "Never Gonna Give You Up",
      publishedAt: "2009-10-25T00:00:00Z",
      thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      tags: ["Rick Astley", "Never Gonna Give You Up", "RickRoll"],
      artists: {
        composer: ["Rick Astley"],
      },
      details: {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        kind: "youtube",
      },
    };
  }

  return { fetchSingle, fetchSingleMock };
}
