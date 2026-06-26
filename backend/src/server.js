import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import Razorpay from "razorpay";
import crypto from "crypto";
// IMPORTANT: Import your REAL user model here!
import User from "./models/User.js"; 

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function start() {
  try {
    console.log(
      "OPENAI KEY:",
      process.env.OPENAI_API_KEY ? "FOUND" : "MISSING"
    );

    const { default: app } = await import("./app.js");

    // ==========================================
    // RAZORPAY & PAYMENT ROUTES
    // ==========================================
    app.post("/api/payment/create-order", async (req, res) => {
      try {
        const { amount } = req.body;
        const options = {
          amount: amount * 100, // Amount in paise
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);
        res.status(200).json({ success: true, order });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error creating order" });
      }
    });

    app.post("/api/payment/verify", async (req, res) => {
      try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userEmail, planName } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
          .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
          .update(sign.toString())
          .digest("hex");

        if (razorpay_signature === expectedSign) {
          // Update the user's plan using your imported User model
          await User.findOneAndUpdate(
            { email: userEmail },
            { plan: planName, paymentId: razorpay_payment_id },
            { new: true, upsert: true } 
          );

          return res.status(200).json({ success: true, message: "Payment verified and Plan Updated!" });
        } else {
          return res.status(400).json({ success: false, message: "Invalid signature!" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error verifying payment" });
      }
    });

    // ==========================================
    // RESUME ANALYSIS ROUTE (With Limits)
    // ==========================================
    app.post("/api/resume/analyze", async (req, res) => {
      try {
        const { userEmail } = req.body;

        let user = await User.findOne({ email: userEmail });
        if (!user) {
          user = new User({ email: userEmail, plan: "Free Trial" });
          await user.save();
        }

        if (user.plan === "Pro" || user.plan === "Premium") {
          return res.status(200).json({ 
            success: true, 
            message: "Analysis Complete! (Unlimited Access)",
            remainingLimit: "Unlimited"
          });
        }

        const today = new Date().toDateString();
        const lastDate = user.lastAnalysisDate ? user.lastAnalysisDate.toDateString() : null;

        if (today !== lastDate) {
          user.analysisCount = 0;
          user.lastAnalysisDate = new Date();
        }

        const DAILY_LIMIT = 3;
        if (user.analysisCount >= DAILY_LIMIT) {
          return res.status(403).json({ 
            success: false, 
            message: "Daily limit reached. Please upgrade to Pro for unlimited analyses.",
            limitReached: true 
          });
        }

        user.analysisCount += 1;
        await user.save();

        return res.status(200).json({ 
          success: true, 
          message: "Analysis Complete!",
          remainingLimit: DAILY_LIMIT - user.analysisCount 
        });

      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error during analysis" });
      }
    });
    // ==========================================

    const PORT = process.env.PORT || 5000;

    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("SERVER ERROR:", error);
  }
}

start();