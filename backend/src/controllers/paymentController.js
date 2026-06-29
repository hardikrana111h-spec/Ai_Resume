import User from "../models/User.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

// Load env vars explicitly just in case
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =========================
// CREATE ORDER
// =========================
export const createOrder = async (req, res) => {
  try {
    const { amount, email } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return res.json({
      success: true,
      order,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Unable to create order",
    });
  }
};

// =========================
// VERIFY PAYMENT
// =========================
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userEmail,
      planName,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid Payment",
      });
    }
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.planExpiryDate && new Date(user.planExpiryDate) > new Date()) {
      return res.status(400).json({
        success: false,
        activePlanError: true,
        message: "Current plan is still active. Cannot upgrade now.",
        expiryDate: user.planExpiryDate,
      });
    }

    let dailyLimit = 3;
    let validityDays = 3;

    switch (planName) {
      case "Basic":
        dailyLimit = 10;
        validityDays = 30;
        break;

      case "Pro":
        dailyLimit = 50;
        validityDays = 30;
        break;

      case "Premium":
        dailyLimit = 100; // Unlimited
        validityDays = 30;
        break;

      default:
        dailyLimit = 3;
        validityDays = 3;
    }

    const startDate = new Date();

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + validityDays);

    user.plan = planName;
    user.paymentId = razorpay_payment_id;
    user.dailyLimit = dailyLimit;
    user.todayUsed = 0;
    user.lastResetDate = new Date().toISOString().split("T")[0];
    user.planStartDate = startDate;
    user.planExpiryDate = expiryDate;

    await user.save();

    return res.json({
      success: true,
      message: "Plan Activated",
      planData: {
        planName: user.plan,
        dailyLimit: user.dailyLimit,
        remainingLimit: user.dailyLimit === -1 ? "Unlimited" : user.dailyLimit,
        expiryDate: user.planExpiryDate,
        paymentId: razorpay_payment_id,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

// =========================
// ACTIVATE FREE TRIAL
// =========================
export const activateFreeTrial = async (req, res) => {
  try {
    const { userEmail } = req.body;

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 1. Check if user already has an active plan
    if (user.planExpiryDate && new Date(user.planExpiryDate) > new Date()) {
      return res.status(400).json({
        success: false,
        activePlanError: true,
        message: "Current plan is still active. Cannot activate trial.",
      });
    }

    // 2. Check if they have already used a free trial in the past
    if (user.hasUsedFreeTrial) {
      return res.status(403).json({
        success: false,
        message: "You have already used your one-time free trial.",
      });
    }

    // 3. Set Trial Logic (3 Days Validity, 3 Daily Limit)
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    user.plan = "Free Trial";
    user.dailyLimit = 3;
    user.todayUsed = 0;
    user.lastResetDate = new Date().toISOString().split("T")[0];
    user.planStartDate = startDate;
    user.planExpiryDate = expiryDate;
    
    // Safety flag so they can't abuse the free trial forever
    user.hasUsedFreeTrial = true; 

    await user.save();

    return res.json({
      success: true,
      message: "Free Trial Activated Successfully",
      planData: {
        planName: user.plan,
        dailyLimit: user.dailyLimit,
        remainingLimit: user.dailyLimit,
        expiryDate: user.planExpiryDate,
      },
    });
  } catch (err) {
    console.error("Activate Trial Error:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to activate free trial",
    });
  }
};