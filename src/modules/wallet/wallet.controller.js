import Wallet from "./wallet.model.js";
import { getWalletBalance } from "./wallet.service.js";
import razorpay from "../../config/razorpay.js";
import Transaction from "./transaction.model.js";
import { transferMoney } from "./wallet.service.js";



export const createWalletTopup = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const userId = req.user._id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `wallet_${wallet._id.toString().slice(-8)}_${Date.now()
        .toString()
        .slice(-6)}`,
    });

    await Transaction.create({
      walletId: wallet._id,
      amount,
      type: "credit",
      purpose: "wallet_topup",
      referenceId: order.id,
      status: "pending",
    });

    return res.status(201).json({
      orderId: order.id,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    next(err); // 🔥 THIS is important
  }
};

export const getWalletBalanceController = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const balance = await getWalletBalance(wallet._id);
    res.json({ balance });
  } catch (err) {
    next(err);
  }
};

export const transferMoneyController = async (req, res, next) => {
  try {
    const { toPhone, amount, note } = req.body;

    if (!toPhone || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    await transferMoney({
      fromUserId: req.user._id,
      toPhone,
      amount,
      note,
    });

    res.json({ message: "Transfer successful" });
  } catch (err) {
    next(err);
  }
};