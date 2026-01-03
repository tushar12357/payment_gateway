import "./config/env.js";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { startSettlementCron } from "./modules/settlements/settlement.cron.js";
import "./queues/webhook.queue.js";

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  startSettlementCron();
};

start();
