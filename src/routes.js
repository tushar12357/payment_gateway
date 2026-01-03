import authRoutes from "./modules/auth/auth.routes.js";
import walletRoutes from "./modules/wallet/wallet.routes.js";
import merchantRoutes from "./modules/merchants/merchant.routes.js";
import pgRoutes from "./modules/pg/pg.routes.js";
import webhookRoutes from "./modules/webhooks/webhook.routes.js";

export default (app) => {
  app.use("/auth", authRoutes);
  app.use("/wallet", walletRoutes);
  app.use("/merchants", merchantRoutes);
  app.use("/pg", pgRoutes);
  app.use("/webhooks", webhookRoutes);
};
