import express from "express";
import {
  createWalletTopup,
  getTransactionHistoryController,
  getWalletBalanceController,
  transferMoneyController,
} from "./wallet.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { idempotency } from "../../middlewares/idempotency.middleware.js";

const router = express.Router();

/**
 * Add money to wallet (Razorpay order creation)
 */
router.post(
  "/topup",
  authMiddleware,
  idempotency(), // prevents duplicate orders
  createWalletTopup
);

/**
 * Get wallet balance (derived from ledger)
 */
router.get(
  "/balance",
  authMiddleware,
  getWalletBalanceController
);

router.post(
  "/transfer",
  authMiddleware,
  transferMoneyController
);

router.get(
  "/transactions",
  authMiddleware,
  getTransactionHistoryController
);

export default router;
