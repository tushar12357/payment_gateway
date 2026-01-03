import cron from "node-cron";
import { runSettlement } from "./settlement.service.js";

export const startSettlementCron = () => {
  cron.schedule("0 2 * * *", async () => {
    // runs daily at 2 AM
    await runSettlement();
  });
};
