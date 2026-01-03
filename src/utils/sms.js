import axios from "axios";

export const sendOtpSms = async (phone, otp) => {
  await axios.post(
    "https://api.msg91.com/api/v5/otp",
    {
      mobile: `91${phone}`,
      otp,
      sender: process.env.MSG91_SENDER_ID,
    },
    {
      headers: {
        authkey: process.env.MSG91_AUTH_KEY,
        "Content-Type": "application/json",
      },
    }
  );
};
