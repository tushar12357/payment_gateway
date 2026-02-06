import express from "express";
import {
  sendEmailOtpController,
  sendOtpController,
  verifyEmailOtpController,
  verifyOtpController,
} from "./auth.controller.js";

const router = express.Router();

router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController);
router.post("/send-email-otp", sendEmailOtpController);
router.post("/verify-email-otp", verifyEmailOtpController);


export default router;
