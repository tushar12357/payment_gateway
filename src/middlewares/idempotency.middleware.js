import crypto from "crypto";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export const idempotency = (ttlSeconds = 300) => {
  return async (req, res, next) => {
    const key = req.headers["idempotency-key"];
    if (!key) return next();

    const hash = crypto
      .createHash("sha256")
      .update(key + req.originalUrl)
      .digest("hex");

    const cached = await redis.get(hash);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      await redis.setex(hash, ttlSeconds, JSON.stringify(body));
      return originalJson(body);
    };

    next();
  };
};
