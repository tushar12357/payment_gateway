import express from "express";
import { createPaymentController } from "./payment.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createPaymentController);

export default router;
