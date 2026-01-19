import Redis from "ioredis";

export const redisConnection = new Redis({
  host: "payment_gateway_redis",
  port: 6379,
  maxRetriesPerRequest: null, // 🔥 REQUIRED by BullMQ
});
