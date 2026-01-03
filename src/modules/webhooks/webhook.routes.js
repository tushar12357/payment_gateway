import express from "express";
import { razorpayWebhook } from "./razorpay.webhook.js";

const router = express.Router();

/**
 * Razorpay Webhook
 * IMPORTANT: must use raw body in production
 */
router.post("/razorpay/", razorpayWebhook);

export default router;
