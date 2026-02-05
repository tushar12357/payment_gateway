// auth/auth.service.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Otp from "./otp.model.js";
import User from "../users/user.model.js";
import Wallet from "../wallet/wallet.model.js";
import { sendOtpSms } from "../../utils/sms.js";

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const sendOtp = async (phone) => {
  // ⛔ Rate limit FIRST
  const recent = await Otp.countDocuments({
    phone,
    createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) },
  });

  if (recent >= 3) throw new Error("OTP limit exceeded");

  const otp = generateOtp();
  const hash = await bcrypt.hash(otp, 10);
console.log(otp)
  await Otp.create({
    phone,
    otpHash: hash,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  await sendOtpSms(phone, otp);
};

export const verifyOtp = async ({ phone, otp }) => {
  const record = await Otp.findOne({ phone }).sort({ createdAt: -1 });

  if (!record) throw new Error("Invalid or expired OTP");
  if (record.expiresAt < new Date()) throw new Error("OTP expired");

  const valid = await bcrypt.compare(otp, record.otpHash);
  if (!valid) throw new Error("Invalid OTP");

  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({
      phone,
      isPhoneVerified: true,
    });
    await Wallet.create({ userId: user._id });
  }

  await Otp.deleteMany({ phone });

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token, user };
};
