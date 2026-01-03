import { sendOtp, verifyOtp } from "./auth.service.js";

export const sendOtpController = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone required" });
  }

  await sendOtp(phone);
  res.json({ message: "OTP sent" });
};

export const verifyOtpController = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: "Phone & OTP required" });
  }

  const result = await verifyOtp({ phone, otp });
  res.json(result);
};
