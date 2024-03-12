import { Hono } from "hono";
import { type HonoType } from "lib/consts";

export const v1 = new Hono<HonoType>()
  .use("/*", async (ctx, next) => {
    Object.entries(ctx.env).forEach(([key, value]) => {
      if (value == null) throw new Error(`key: "${key}" is null`);
    });
    await next();
  })
  .get("/", (ctx) => ctx.text("Hello World!"));
