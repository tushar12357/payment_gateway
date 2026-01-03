import PgOrder from "../pg/pgOrder.model.js";
import Settlement from "./settlement.model.js";

export const runSettlement = async () => {
  // find paid but unsettled orders
  const orders = await PgOrder.find({
    status: "paid",
    settled: false,
  });

  if (!orders.length) return;

  // group by merchant
  const grouped = orders.reduce((acc, order) => {
    acc[order.merchantId] = acc[order.merchantId] || [];
    acc[order.merchantId].push(order);
    return acc;
  }, {});

  for (const merchantId in grouped) {
    const merchantOrders = grouped[merchantId];

    const totalAmount = merchantOrders.reduce(
      (sum, o) => sum + o.amount,
      0
    );

    const settlement = await Settlement.create({
      merchantId,
      amount: totalAmount,
      pgOrders: merchantOrders.map((o) => o._id),
      status: "completed",
      settledAt: new Date(),
    });

    await PgOrder.updateMany(
      { _id: { $in: settlement.pgOrders } },
      { settled: true }
    );
  }
};
