import mongoose from "mongoose";

const settlementSchema = new mongoose.Schema(
  {
    merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
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

    pgOrders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PgOrder",
      },
    ],

    status: {
      type: String,
      enum: ["initiated", "completed"],
      default: "initiated",
    },

    settledAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Settlement", settlementSchema);
