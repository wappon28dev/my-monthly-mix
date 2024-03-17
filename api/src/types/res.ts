import { z } from "zod";

export const zSongData = z.object({
  title: z.string(),
  durationSec: z.number(),
  thumbnail: z.string(),
  authors: z.object({
    composer: z.string(),
    singer: z.string().optional(),
    lyricist: z.string().optional(),
  }),
});

export type SongData = z.infer<typeof zSongData>;

export const zSongKind = z.union([
  z.literal("youtube"),
  z.literal("spotify"),
  z.literal("soundcloud"),
]);
