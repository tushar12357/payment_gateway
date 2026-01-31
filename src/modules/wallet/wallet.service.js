import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Wallet from "./wallet.model.js";
import Transaction from "./transaction.model.js";
import User from "../users/user.model.js";

export const getWalletBalance = async (walletId) => {
  const result = await Transaction.aggregate([
    {
      $match: {
        walletId,
        status: "success",
      },
    },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  let credit = 0;
  let debit = 0;

  result.forEach((r) => {
    if (r._id === "credit") credit = r.total;
    if (r._id === "debit") debit = r.total;
  });

  return credit - debit;
};

export const transferMoney = async ({ fromUserId, toPhone, amount, note }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const senderWallet = await Wallet.findOne({ userId: fromUserId }).session(
      session,
    );

    const senderBalance = await Transaction.aggregate([
      { $match: { walletId: senderWallet._id, status: "success" } },
      {
        $group: {
          _id: null,
          balance: {
            $sum: {
              $cond: [
                { $eq: ["$type", "credit"] },
                "$amount",
                { $multiply: ["$amount", -1] },
              ],
            },
          },
        },
      },
    ]);

    if ((senderBalance[0]?.balance || 0) < amount) {
      throw new Error("Insufficient balance");
    }

    let receiver = await User.findOne({ phone: toPhone }).session(session);
    if (!receiver) {
      receiver = await User.create(
        [{ phone: toPhone, isPhoneVerified: false }],
        { session, ordered: true },
      );

      await Wallet.create([{ userId: receiver[0]._id }], {
        session,
        ordered: true,
      });
      receiver = receiver[0];
    }

    const receiverWallet = await Wallet.findOne({
      userId: receiver._id,
    }).session(session);

    const txGroupId = uuidv4();

    await Transaction.create(
      [
        {
          walletId: senderWallet._id,
          type: "debit",
          amount,
          purpose: "wallet_transfer",
          transactionGroupId: txGroupId,
          note,
          status: "success",
        },
        {
          walletId: receiverWallet._id,
          type: "credit",
          amount,
          purpose: "wallet_transfer",
          transactionGroupId: txGroupId,
          note,
          status: "success",
        },
      ],
      { session, ordered: true },
    );

    await session.commitTransaction();
    session.endSession();

    return { success: true };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
