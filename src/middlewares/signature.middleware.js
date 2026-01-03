import Merchant from "../modules/merchants/merchant.model.js";
import crypto from "crypto";

export const verifyMerchant = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  const signature = req.headers["x-signature"];

  if (!apiKey || !signature) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const merchant = await Merchant.findOne({ apiKey }).select("+apiSecret");

  if (!merchant) {
    return res.status(401).json({ message: "Invalid API key" });
  }

  const payload = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac("sha256", merchant.apiSecret)
    .update(payload)
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(401).json({ message: "Invalid signature" });
  }

  req.merchant = merchant;
  next();
};
