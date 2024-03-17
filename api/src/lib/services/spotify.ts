import { SpotifyApi, type Track } from "@spotify/web-api-ts-sdk";
import { type SongData } from "types/res";

export class Spotify {
  api: SpotifyApi;
  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {
    this.api = SpotifyApi.withClientCredentials(clientId, clientSecret);
  }

  async getSongInfo(id: string): Promise<Track> {
    const res = await this.api.tracks.get(id);
    // TODO: err handling
    return res;
  }

  async getSongData(id: string): Promise<SongData> {
    const { name, album, artists } = await this.getSongInfo(id);

    return {
      title: name,
      publishedAt: album.release_date,
      thumbnail: album.images[0].url,
      tags: artists.map((artist) => artist.name),
      artists: {
        composer: album.artists.map((artist) => artist.name),
        singer: artists.map((artist) => artist.name),
      },
    };
  }
}
