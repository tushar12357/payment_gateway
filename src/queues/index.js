import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const merchantWebhookQueue = new Queue(
  "merchant-webhook",
  {
    connection: redisConnection,
  }
);
