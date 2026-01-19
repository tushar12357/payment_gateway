import "./config/env.js";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { startSettlementCron } from "./modules/settlements/settlement.cron.js";
import "./queues/webhook.queue.js";

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectDB();
app.get('/', (req, res) => {
  res.status(200).send('OK');
});

 app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

  startSettlementCron();
};

start();
