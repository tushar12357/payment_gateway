import Redis from "ioredis";

export const redisConnection = new Redis(process.env.REDIS_URL, {
  tls: {},

  enableReadyCheck: false,
  lazyConnect: true,
  keepAlive: 30000,
  maxRetriesPerRequest: null,

  retryStrategy(times) {
    return Math.min(times * 100, 2000);
  },
});
