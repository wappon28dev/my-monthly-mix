import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { type HonoType } from "lib/consts";
import { Youtube } from "lib/services/youtube";
import { zSongKind } from "types/res";
import { z } from "zod";

export const v1 = new Hono<HonoType>()
  .use("/*", async (ctx, next) => {
    Object.entries(ctx.env).forEach(([key, value]) => {
      if (value == null) throw new Error(`key: "${key}" is null`);
    });
    await next();
  })
  .get("/", (ctx) => ctx.text("Hello World!"))
  .get(
    "/songs/data/:key",
    zValidator(
      "param",
      z.object({
        songKind: zSongKind,
        url: z.string(),
      }),
    ),
    async (ctx) => {
      const youtube = new Youtube(ctx.env.YOUTUBE_DATA_API_KEY, ctx.req.url);
      const data = await youtube.getVideoData("Ks-_Mh1QhMc");

      return ctx.json(data);
    },
  );
