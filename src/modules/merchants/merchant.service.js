import crypto from "crypto";
import Merchant from "./merchant.model.js";

const generateKey = () => crypto.randomBytes(16).toString("hex");
const generateSecret = () => crypto.randomBytes(32).toString("hex");

export const createMerchant = async ({ name, webhookUrl }) => {
  const apiKey = generateKey();
  const apiSecret = generateSecret();

  const merchant = await Merchant.create({
    name,
    webhookUrl,
    apiKey,
    apiSecret,
  });

  return {
    merchantId: merchant._id,
    apiKey,
    apiSecret, // ⚠️ show ONLY ONCE
  };
};


export const getMerchants = async () => {
  return Merchant.find({})
    .select("_id name webhookUrl apiKey apiSecret status createdAt")
    .sort({ createdAt: -1 });
};