import axios from "axios";
import Merchant from "../merchants/merchant.model.js";

export const notifyMerchant = async (pgOrder) => {
  const merchant = await Merchant.findById(pgOrder.merchantId).select("+apiSecret");

  const payload = {
    orderId: pgOrder.orderId,
    status: pgOrder.status,
    amount: pgOrder.amount,
  };

  const signature = crypto
    .createHmac("sha256", merchant.apiSecret)
    .update(JSON.stringify(payload))
    .digest("hex");

  await axios.post(merchant.webhookUrl, payload, {
    headers: {
      "x-signature": signature,
    },
  });
};
