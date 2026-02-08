import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { sendOtpEmail } from "../utils/email.js";

new Worker(
  "email-otp",
  async (job) => {
    const { email, otp } = job.data;

    console.log("📧 Sending OTP email:", email);

    await sendOtpEmail(email, otp);
  },
  {
    connection: redisConnection,
    concurrency: 1,
  }
);
