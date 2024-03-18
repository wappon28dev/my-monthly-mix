import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";
import { type SongData, zSongKind, zSongData } from "@/types/res";
import { type HonoType } from "@/lib/consts";
import { Spotify } from "@/lib/services/spotify";
import { Youtube } from "@/lib/services/youtube";

export const v1 = new Hono<HonoType>()
  .use("*", cors())
  .use("/*", async (ctx, next) => {
    Object.entries(ctx.env).forEach(([key, value]) => {
      if (value == null) throw new Error(`key: "${key}" is null`);
    });
    await next();
  })
  .get("/", (ctx) => ctx.text("Hello World!"))
  .get(
    "/songs/:songKind/:id",
    zValidator(
      "param",
      z.object({
        songKind: zSongKind,
        id: z.string(),
      }),
    ),
    async (ctx) => {
      const { id, songKind } = ctx.req.valid("param");
      let songData: SongData;

      switch (songKind) {
        case "youtube": {
          const youtube = new Youtube(
            ctx.env.YOUTUBE_DATA_API_KEY,
            ctx.req.url,
          );
          songData = await youtube.getSongData(id);
          break;
        }
        case "spotify": {
          const spotify = new Spotify(
            ctx.env.SPOTIFY_CLIENT_ID,
            ctx.env.SPOTIFY_CLIENT_SECRET,
          );
          songData = await spotify.getSongData(id);
          break;
        }
        default:
          throw new Error("Invalid songKind");
      }

      return ctx.json(zSongData.parse(songData));
    },
  );
