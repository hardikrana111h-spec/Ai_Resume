import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";


import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminContactRoutes from "./routes/adminContactRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


dotenv.config();

const app = express();

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-resume-five-red.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  }),
);


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", userRoutes); // Add this line to include user routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin/contacts", adminContactRoutes);
app.use("/api/payment", paymentRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
  });
});



// // ==========================================
// // ADDED: RAZORPAY ROUTES
// // ==========================================
// app.post("/api/payment/create-order", async (req, res) => {
//   try {
//     const { amount } = req.body;
//     const options = {
//       amount: amount * 100, // Amount must be in paise
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     };
//     const order = await razorpay.orders.create(options);
//     res.status(200).json({ success: true, order });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Error creating order" });
//   }
// });

// app.post("/api/payment/verify", async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     const sign = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSign = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(sign.toString())
//       .digest("hex");

//     if (razorpay_signature === expectedSign) {
//       // You can add your Database update logic here (e.g., set user plan to Pro)
//       return res.status(200).json({ success: true, message: "Payment verified!" });
//     } else {
//       return res.status(400).json({ success: false, message: "Invalid signature!" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Error verifying payment" });
//   }
// });

app.use(notFound);
app.use(errorHandler);

export default app;
