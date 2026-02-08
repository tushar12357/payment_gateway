// redis.js
import Redis from "ioredis";

export const redisConnection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,      
  lazyConnect: true,            
  keepAlive: 30000,            
  retryStrategy(times) {
    return Math.min(times * 100, 2000);
  },
});
