import nodemailer from 'nodemailer';

export const sendOtpEmail = async (email, otp) => {
  try {
    console.log("inside send otp");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify(); // 🔥 ADD THIS
    console.log("✅ SMTP verified");

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

    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ EMAIL ERROR:", err);
    throw err;
  }
};
