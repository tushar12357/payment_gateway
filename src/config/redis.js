// redis.js
import Redis from "ioredis";

export const redisConnection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  },
});
