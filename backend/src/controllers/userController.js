import User from "../models/User.js";

export const getPlanStatus = async (req, res) => {
  try {
    // JWT thi current logged in user
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Find only current logged in user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Daily Reset
    const today = new Date().toISOString().split("T")[0];

    if (user.lastResetDate !== today) {
      user.todayUsed = 0;
      user.lastResetDate = today;
      await user.save();
    }

    // Plan Expiry Check
    let isPlanExpired = false;

    if (user.planExpiryDate) {
      isPlanExpired = new Date(user.planExpiryDate) <= new Date();

      if (isPlanExpired) {
        // Automatically reset expired users to Free Trial
        user.plan = "Free Trial";
        user.dailyLimit = 3;
        user.todayUsed = 0;
        user.planStartDate = new Date();

        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 3);
        user.planExpiryDate = expiry;

        await user.save();
      }
    }

    // Remaining Limit
    const remainingLimit =
      user.dailyLimit === -1
        ? "Unlimited"
        : Math.max(0, user.dailyLimit - user.todayUsed);

    // Live Timer
    const now = new Date();
    const expiry = new Date(user.planExpiryDate);

    let totalSeconds = Math.max(
      0,
      Math.floor((expiry.getTime() - now.getTime()) / 1000)
    );

    const daysLeft = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;

    const hoursLeft = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;

    const minutesLeft = Math.floor(totalSeconds / 60);
    const secondsLeft = totalSeconds % 60;

    return res.status(200).json({
      success: true,

      planData: {
        planName: user.plan,

        dailyLimit:
          user.dailyLimit === -1
            ? "Unlimited"
            : user.dailyLimit,

        todayUsed: user.todayUsed,

        remainingLimit,

        expiryDate: user.planExpiryDate,

        daysLeft,

        hoursLeft,

        minutesLeft,

        secondsLeft,

        isPlanExpired,
      },
    });
  } catch (err) {
    console.error("PLAN STATUS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch plan status",
    });
  }
};