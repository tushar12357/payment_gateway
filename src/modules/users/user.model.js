import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    isKycVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
