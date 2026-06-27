import User from "../models/User.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =========================
// CREATE ORDER
// =========================
export const createOrder = async (req, res) => {
  try {
    const { amount , email} = req.body;

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

    if(
        user.planExpiryDate && new Date(user.planExpiryDate) > new Date()
    ){
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

    const daysLeft = Math.max(
      0,
      Math.ceil((user.planExpiryDate - new Date()) / (1000 * 60 * 60 * 24)),
    );

    return res.json({
      success: true,
      message: "Plan Activated",
      planData: {
        planName: user.plan,
        dailyLimit: user.dailyLimit,
        remainingLimit:
          user.dailyLimit === -1
            ? "Unlimited"
            : user.dailyLimit,
        // todayUsed: user.todayUsed,
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