import crypto from "crypto";
import { redisConnection } from "../config/redis.js";

export const idempotency = (ttlSeconds = 300) => {
  return async (req, res, next) => {
    const key = req.headers["idempotency-key"];
    if (!key) return next();

    const hash = crypto
      .createHash("sha256")
      .update(key + req.originalUrl)
      .digest("hex");

    const cached = await redisConnection.get(hash);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      await redisConnection.setex(hash, ttlSeconds, JSON.stringify(body));
      return originalJson(body);
    };

    next();
  };
};
