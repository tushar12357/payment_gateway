import mongoose from "mongoose";

const merchantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    apiKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    apiSecret: {
      type: String,
      required: true,
      select: false,
    },

    webhookUrl: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Merchant", merchantSchema);
