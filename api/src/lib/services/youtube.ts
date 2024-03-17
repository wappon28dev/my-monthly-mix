import { type YoutubeVideoList } from "types/youtube";

export class Youtube {
  constructor(
    private readonly apiKey: string,
    private readonly referer: string,
  ) {}

  async getVideoData(id: string): Promise<YoutubeVideoList> {
    const param = {
      part: "snippet",
      id,
      key: this.apiKey,
    };

    const url = new URL("https://youtube.googleapis.com/youtube/v3/videos");
    url.search = new URLSearchParams(param).toString();
    console.log(url.toString());
    const res = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        Referer: this.referer,
      },
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  }
}
