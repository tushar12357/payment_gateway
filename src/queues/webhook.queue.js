import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import PgOrder from "../modules/pg/pgOrder.model.js";
import { notifyMerchant } from "../modules/pg/pg.service.js";

new Worker(
  "merchant-webhook",
  async (job) => {
    const { pgOrderId } = job.data;

    const pgOrder = await PgOrder.findById(pgOrderId);
    if (!pgOrder) return;

    await notifyMerchant(pgOrder);
  },
  {
    connection: redisConnection, // 🔥 FIXED
  }
);
