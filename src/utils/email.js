import nodemailer from "nodemailer";

export const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,     // your gmail
      pass: process.env.EMAIL_PASS,     // app password    ywux ejgg ctvj zmcm
    },
  });

  await transporter.sendMail({
    from: `"PayGate" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: `
      <h2>Your OTP</h2>
      <p><b>${otp}</b></p>
      <p>Valid for 5 minutes</p>
    `,
  });
};
