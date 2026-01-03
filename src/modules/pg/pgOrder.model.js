import mongoose from "mongoose";

const pgOrderSchema = new mongoose.Schema(
  {
    merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
    },

    orderId: {
      type: String, // merchant order id
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },

    razorpayOrderId: {
      type: String,
    },
    settled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PgOrder", pgOrderSchema);
