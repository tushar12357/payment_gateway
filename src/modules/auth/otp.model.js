// auth/otp.model.js
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    phone: { type: String },
    email: { type: String },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

otpSchema.index({ phone: 1, createdAt: -1 });
otpSchema.index({ email: 1, createdAt: -1 });

export default mongoose.model("Otp", otpSchema);
