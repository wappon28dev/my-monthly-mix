import { z } from "zod";

export const zSongKind = z.union([
  z.literal("youtube"),
  z.literal("spotify"),
  z.literal("soundcloud"),
]);

export const zSongData = z.object({
  title: z.string(),
  publishedAt: z.string(),
  tags: z.array(z.string()),
  thumbnail: z.string().url(),
  artists: z.object({
    composer: z.array(z.string()),
    singer: z.array(z.string()).optional(),
    lyricist: z.array(z.string()).optional(),
  }),
  details: z.object({
    url: z.string().url(),
    kind: zSongKind,
  }),
});

export type SongData = z.infer<typeof zSongData>;
