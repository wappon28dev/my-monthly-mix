import { google } from "googleapis";
import { type SongKind } from "@/lib/detect-song.ts";

type SongData = {
  kind: SongKind;
  url: string;
  title: string;
  image: string;
  author: Partial<{
    composer: string;
    arranger: string;
    lyricist: string;
  }>;
};

async function fetchFromYoutube(url: string): Promise<unknown> {
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_DATA_API_KEY;
  if (API_KEY == null) {
    throw new Error("Missing env variable for Youtube Data API key");
  }
  const youtube = google.youtube({
    version: "v3",
    auth: API_KEY,
  });
  const video = await youtube.videos.list({
    part: ["snippet"],
    id: [url],
  });
  // TODO: convert to SongData
  return video;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useSongData() {
  async function fetch(kind: SongKind, url: string): Promise<SongData> {
    const data = await fetchFromYoutube(url);
    console.log(data);
    return {
      kind,
      url,
      title: "title",
      image: "image",
      author: {},
    };
  }

  return { fetch };
}
