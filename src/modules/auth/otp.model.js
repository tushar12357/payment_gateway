// auth/otp.model.js
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    phone: { type: String, index: true },
    otpHash: String,
    expiresAt: {
      type: Date,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Otp", otpSchema);
