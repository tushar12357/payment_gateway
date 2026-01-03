import express from "express";
import { createPgOrder } from "./pg.controller.js";
import { verifyMerchant } from "../../middlewares/signature.middleware.js";
import { idempotency } from "../../middlewares/idempotency.middleware.js";

const router = express.Router();

router.post(
  "/orders",
  verifyMerchant,
  idempotency(),
  createPgOrder
);

export default router;
