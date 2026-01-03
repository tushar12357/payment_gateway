import express from "express";
import cors from "cors";
import routes from "./routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(
  "/webhooks/razorpay/",
  express.raw({ type: "application/json" })
);
app.use(express.json());

// routes
routes(app);

// global error handler (last)
app.use(errorHandler);

export default app;
