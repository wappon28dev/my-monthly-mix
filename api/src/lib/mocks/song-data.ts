import { type SongData } from "types/res";

export const mocks = {
  fetchSongData: async (): Promise<SongData> => ({
    title: "Never Gonna Give You Up",
    publishedAt: "2009-10-25T00:00:00Z",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    tags: ["Rick Astley", "Never Gonna Give You Up", "RickRoll"],
    artists: {
      composer: ["Rick Astley"],
    },
  }),
};
