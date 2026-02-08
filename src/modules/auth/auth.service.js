// auth/auth.service.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Otp from "./otp.model.js";
import User from "../users/user.model.js";
import Wallet from "../wallet/wallet.model.js";
import { sendOtpSms } from "../../utils/sms.js";
import { sendOtpEmail } from "../../utils/email.js";
import { emailOtpQueue } from "../../queues/index.js";

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
  console.log(otp);
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

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return { token, user };
};

export const sendEmailOtp = async (email) => {
  const recent = await Otp.countDocuments({
    email,
    createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) },
  });

  if (recent >= 3) throw new Error("OTP limit exceeded");

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 6);

  await Otp.create({
    email,
    otpHash,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  // 🔥 NON-BLOCKING EMAIL
  // sendOtpEmail(email, otp).catch(console.error);
  emailOtpQueue
  .add("send-email-otp", { email, otp })
  .catch((err) => {
    console.error("QUEUE ADD FAILED:", err);
  });

};

export const verifyEmailOtp = async ({ email, otp }) => {
  const record = await Otp.findOne({ email }).sort({ createdAt: -1 });
  if (!record || record.expiresAt < new Date())
    throw new Error("Invalid or expired OTP");

  const valid = await bcrypt.compare(otp, record.otpHash);
  if (!valid) throw new Error("Invalid OTP");

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ email, isEmailVerified: true });
    await Wallet.create({ userId: user._id });
  }

  await Otp.deleteMany({ email });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return { token, user };
};
