import express from "express";
import { createMerchantController, getMerchantsController } from "./merchant.controller.js";

const router = express.Router();

/**
 * Admin-only in real systems
 * For now, keep it open or protect with env token
 */
router.post("/", createMerchantController);
router.get("/", getMerchantsController);

export default router;
