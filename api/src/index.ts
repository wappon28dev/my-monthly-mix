import { Hono } from "hono";
import { type HonoType } from "@/lib/consts";
import { v1 } from "./api/v1";

const app = new Hono<HonoType>();

const route = app
  .get("/", async (ctx) => ctx.text("Hello World!"))
  .route("/v1", v1);

export type AppType = typeof route;
export default app;
