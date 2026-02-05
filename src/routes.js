import authRoutes from "./modules/auth/auth.routes.js";
import walletRoutes from "./modules/wallet/wallet.routes.js";
import merchantRoutes from "./modules/merchants/merchant.routes.js";
import pgRoutes from "./modules/pg/pg.routes.js";
import webhookRoutes from "./modules/webhooks/webhook.routes.js";

export default (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/wallet", walletRoutes);
  app.use("/api/merchants", merchantRoutes);
  app.use("/api/pg", pgRoutes);
  app.use("/webhooks", webhookRoutes);
};
