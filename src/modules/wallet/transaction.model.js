import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },

    purpose: {
      type: String,
      enum: [
        "wallet_topup",
        "wallet_transfer",
        "merchant_payment",
        "refund",
        "settlement",
      ],
      required: true,
    },

    referenceId: {
      type: String,
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    transactionGroupId: {
      type: String,
      index: true,
    },

    note: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
