import jwt from "jsonwebtoken";
import User from "../users/user.model.js";
import Wallet from "../wallet/wallet.model.js";
import Otp from "./otp.model.js";
import { sendOtpSms } from "../../utils/sms.js";

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const sendOtp = async (phone) => {
  const otp = generateOtp();

  await Otp.create({
    phone,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  await sendOtpSms(phone, otp); // 🔥 REAL OTP
const recentOtps = await Otp.countDocuments({
  phone,
  createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) },
});

if (recentOtps >= 3) {
  throw new Error("OTP limit exceeded");
}

  return true;
};

export const verifyOtp = async ({ phone, otp }) => {
  const record = await Otp.findOne({ phone, otp });
  if (!record) {
    throw new Error("Invalid or expired OTP");
  }

  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({
      phone,
      isPhoneVerified: true,
    });

    // 🔥 Create wallet on first login
    await Wallet.create({ userId: user._id });
  }

  await Otp.deleteMany({ phone });

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token };
};
