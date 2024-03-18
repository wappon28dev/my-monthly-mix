import { HTTPException } from "hono/http-exception";
import { type SongData } from "@/types/res";
import { type ArrayElem } from "@/types/utils";
import { type YoutubeVideoList } from "@/types/youtube";

export class Youtube {
  constructor(
    private readonly apiKey: string,
    private readonly referer: string,
  ) {}

  async getVideoData(
    id: string,
  ): Promise<ArrayElem<YoutubeVideoList["items"]>> {
    const param = {
      part: "snippet",
      id,
      key: this.apiKey,
    };

    const url = new URL("https://youtube.googleapis.com/youtube/v3/videos");
    url.search = new URLSearchParams(param).toString();
    const res = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        Referer: this.referer,
      },
    });
    if (!res.ok) throw new Error(await res.text());
    const json = (await res.json()) as YoutubeVideoList;
    const item = json.items.at(0);

    if (item == null) throw new HTTPException(404);
    return item;
  }

  async getSongData(id: string): Promise<SongData> {
    const { snippet } = await this.getVideoData(id);
    return {
      title: snippet.title,
      publishedAt: snippet.publishedAt,
      tags: snippet.tags ?? [],
      thumbnail:
        snippet.thumbnails.maxres?.url ??
        snippet.thumbnails.standard?.url ??
        "",
      artists: {
        composer: [snippet.channelTitle],
      },
      details: {
        url: `https://www.youtube.com/watch?v=${id}`,
        kind: "youtube",
      },
    };
  }
}
