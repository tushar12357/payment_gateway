import { createMerchant } from "./merchant.service.js";

export const createMerchantController = async (req, res) => {
  const { name, webhookUrl } = req.body;

  if (!name || !webhookUrl) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const merchant = await createMerchant({ name, webhookUrl });

  res.status(201).json({
    message: "Merchant created",
    credentials: merchant,
  });
};
