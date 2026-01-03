import Wallet from "../wallet/wallet.model.js";

export const createUserWallet = async (userId) => {
  return Wallet.create({ userId });
};
