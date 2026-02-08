import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import './jobs.js'
const app = express();

app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")
);

app.use(cors());

app.use(
  "/webhooks/razorpay",
  express.raw({ type: "application/json" })
);

app.use(express.json());

routes(app);

app.use(errorHandler);

export default app;
