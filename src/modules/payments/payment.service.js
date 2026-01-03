import Payment from "./payment.model.js";

export const createPayment = async (data) => {
  return Payment.create(data);
};

export const markPaymentSuccess = async (razorpayPaymentId) => {
  return Payment.findOneAndUpdate(
    { razorpayPaymentId },
    { status: "success" }
  );
};
