import razorpay from "../../config/razorpay.js";
import PgOrder from "./pgOrder.model.js";
// import Refund from "../payments/refund.model.js";


export const createPgOrder = async (req, res) => {
  const { orderId, amount } = req.body;
  const merchant = req.merchant;

  const rpOrder = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: orderId,
  });

  const pgOrder = await PgOrder.create({
    merchantId: merchant._id,
    orderId,
    amount,
    razorpayOrderId: rpOrder.id,
  });

  res.json({
    pgOrderId: pgOrder._id,
    razorpayOrderId: rpOrder.id,
    amount: rpOrder.amount,
    currency: rpOrder.currency,
  });
};



// export const refundPayment = async (req, res) => {
//   const { razorpayPaymentId, amount } = req.body;

//   const refund = await razorpay.payments.refund(
//     razorpayPaymentId,
//     { amount: amount * 100 }
//   );

//   await Refund.create({
//     razorpayPaymentId,
//     amount,
//   });

//   res.json({ refundId: refund.id });
// };