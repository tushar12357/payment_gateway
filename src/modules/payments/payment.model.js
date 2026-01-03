import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["created", "success", "failed"],
      default: "created",
    },

    purpose: {
      type: String,
      enum: ["wallet_topup", "merchant_payment"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
