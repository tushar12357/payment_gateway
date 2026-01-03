import { createPayment } from "./payment.service.js";

export const createPaymentController = async (req, res) => {
  const payment = await createPayment(req.body);
  res.status(201).json(payment);
};
