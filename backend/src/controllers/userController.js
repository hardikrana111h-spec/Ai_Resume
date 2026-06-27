import User from "../models/User.js";

export const getPlanStatus = async (req, res) => {
  try {
    // Tmara auth middleware pramane req.user.uid ya req.user._id use karjo
    const userId = req.user?.uid || req.user?._id;

    if (!userId && !req.user?.email) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findOne({
      $or: [{ _id: userId }, { googleId: userId }, { email: req.user.email }],
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // ==========================================
    // 1. DAILY RESET LOGIC (Raat na 12 vagye reset)
    // ==========================================
    const todayStr = new Date().toISOString().split("T")[0];

    if (user.lastResetDate !== todayStr) {
      user.todayUsed = 0;
      user.lastResetDate = todayStr;
      await user.save(); // DB update kari didhu
    }

    // ==========================================
    // 2. CALCULATE REMAINING LIMIT
    // ==========================================
    const remainingLimit =
      user.dailyLimit === -1
        ? "Unlimited"
        : Math.max(0, user.dailyLimit - user.todayUsed);

    // ===== Live Countdown =====
    const now = new Date();
    const expiry = new Date(user.planExpiryDate);

    let totalSeconds = Math.max(
      0,
      Math.floor((expiry.getTime() - now.getTime()) / 1000),
    );

    const daysLeft = Math.floor(totalSeconds / (24 * 60 * 60));
    totalSeconds %= 24 * 60 * 60;

    const hoursLeft = Math.floor(totalSeconds / (60 * 60));
    totalSeconds %= 60 * 60;

    const minutesLeft = Math.floor(totalSeconds / 60);

    const secondsLeft = totalSeconds % 60;

    const isPlanExpired = expiry <= now;

    return res.json({
      success: true,
      planData: {
        planName: user.plan || "Free Trial",
        dailyLimit: user.dailyLimit == -1 ? "Unlimited" : user.dailyLimit,
        todayUsed: user.todayUsed,
        remainingLimit,
        daysLeft,
        hoursLeft,
        minutesLeft,
        secondsLeft,
        isPlanExpired,
        expiryDate: user.planExpiryDate,
        lastResetDate: user.lastResetDate,
      },
    });
  } catch (error) {
    console.error("GET PLAN STATUS ERROR:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error fetching plan status" });
  }
};
