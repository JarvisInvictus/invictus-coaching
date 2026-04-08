import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.KV_REST_API_URL || "https://subtle-oryx-80524.upstash.io",
  token: process.env.KV_REST_API_TOKEN || "",
});
