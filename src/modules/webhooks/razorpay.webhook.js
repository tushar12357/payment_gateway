import crypto from "crypto";
import Transaction from "../wallet/transaction.model.js";
import PgOrder from "../pg/pgOrder.model.js";
import { merchantWebhookQueue } from "../../queues/index.js";

console.log("🚀 razorpay.webhook.js LOADED");

export const razorpayWebhook = async (req, res) => {
  console.log("🔥 WEBHOOK HANDLER HIT");

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  // 1️⃣ Verify signature using RAW BODY
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(req.body)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.log("❌ Signature mismatch");
    return res.status(401).json({ message: "Invalid signature" });
  }

  // 2️⃣ Parse JSON AFTER verification
  const payload = JSON.parse(req.body.toString());
  const event = payload.event;

  console.log("✅ Razorpay webhook event:", event);

  if (event !== "payment.captured") {
    return res.json({ received: true });
  }

  const payment = payload.payload.payment.entity;
  const razorpayOrderId = payment.order_id;

  /**
   * 3️⃣ WALLET TOP-UP FLOW
   */
  const walletTxn = await Transaction.findOne({
    referenceId: razorpayOrderId,
    status: "pending",
  });

  if (walletTxn) {
    walletTxn.status = "success";
    await walletTxn.save();

    console.log("💰 Wallet transaction marked SUCCESS");
    return res.json({ received: true });
  }

  /**
   * 4️⃣ MERCHANT PG FLOW
   */
  const pgOrder = await PgOrder.findOne({
    razorpayOrderId,
    status: { $ne: "paid" },
  });

  if (pgOrder) {
    pgOrder.status = "paid";
    await pgOrder.save();

    await merchantWebhookQueue.add(
      "notify-merchant",
      { pgOrderId: pgOrder._id },
      {
        attempts: 5,
        backoff: { type: "exponential", delay: 5000 },
      }
    );

    console.log("🏪 Merchant order marked PAID");
  }

  res.json({ received: true });
};
