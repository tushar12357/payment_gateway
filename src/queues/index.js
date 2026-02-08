import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const merchantWebhookQueue = new Queue("merchant-webhook", {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: 50,
  },
});


export const emailOtpQueue = new Queue("email-otp", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 3000 },
    removeOnComplete: true,
    removeOnFail: 50,
  },
});
