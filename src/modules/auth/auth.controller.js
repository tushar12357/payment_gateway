// auth/auth.controller.js
import { sendEmailOtp, sendOtp, verifyEmailOtp, verifyOtp } from "./auth.service.js";

export const sendOtpController = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone required" });

    await sendOtp(phone);
    res.json({ message: "OTP sent" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const verifyOtpController = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp)
      return res.status(400).json({ message: "Phone & OTP required" });

    const result = await verifyOtp({ phone, otp });
    res.json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};


export const sendEmailOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    await sendEmailOtp(email);
    res.json({ message: "OTP sent to email" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const verifyEmailOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email & OTP required" });
    }

    const result = await verifyEmailOtp({ email, otp });
    res.json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};