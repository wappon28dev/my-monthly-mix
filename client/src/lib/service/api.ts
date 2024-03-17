import { type AppType } from "@api/index";
import { hc } from "hono/client";

const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
if (endpoint == null) throw new Error("Failed to get API endpoint");
export const client = hc<AppType>(endpoint);
