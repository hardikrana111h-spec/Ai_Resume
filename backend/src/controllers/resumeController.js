import path from "path";
import ResumeReport from "../models/ResumeReport.js";
import User from "../models/User.js"; // ADDED: User model to check limits
import { extractResumeText } from "../services/parseResume.js";
import { analyzeResumeWithAI } from "../services/analyzeResume.js";

function getSafeOriginalName(file) {
  const original =
    file?.originalname?.trim() ||
    file?.filename?.trim() ||
    (file?.path ? path.basename(file.path) : "") ||
    "";

  return original || "resume.pdf";
}

function getSafeRole(role) {
  return String(role || "").trim();
}

// // ==========================
// // FIND USER
// // ==========================

// const user = await User.findById(req.user.uid);
// const today = new Date().toISOString().split("T")[0];

// // if (!user) {
// //   return res.status(404).json({
// //     success: false,
// //     message: "User not found",
// //   });
// // }

// // ==========================
// // PLAN EXPIRY CHECK
// // ==========================

// if (user.planExpiryDate && new Date() > new Date(user.planExpiryDate)) {
//   return res.status(403).json({
//     success: false,
//     planExpired: true,
//     message: "Your plan has expired.",
//   });
// }

// // ==========================
// // DAILY RESET
// // ==========================

// const today = new Date().toISOString().split("T")[0];

// if (user.lastResetDate !== today) {
//   user.todayUsed = 0;

//   user.lastResetDate = today;

//   await user.save();
// }

// // ==========================
// // LIMIT CHECK
// // ==========================

// if (user.dailyLimit !== -1 && user.todayUsed >= user.dailyLimit) {
//   return res.status(403).json({
//     success: false,

//     limitReached: true,

//     message: "Daily limit reached.",

//     remainingLimit: 0,

//     dailyLimit: user.dailyLimit,
//   });
// }

export const analyzeResume = async (req, res) => {
  try {
    if (!req.user?.uid) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    const role = getSafeRole(req.body.role);

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Please select a role before analyzing the resume",
      });
    }
    // // ==========================
    // // UPDATE LIMIT
    // // ==========================

    // if (user.dailyLimit !== -1) {
    //   user.todayUsed++;

    //   await user.save();
    // }

    // const remaining =
    //   user.dailyLimit === -1 ? "Unlimited" : user.dailyLimit - user.todayUsed;

    // ==========================================
    // BACKEND LIMIT & VALIDITY CHECK START
    // ==========================================
    const user = await User.findOne({
      $or: [{ _id: req.user.uid }, { googleId: req.user.uid }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // if (!userRecord) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "User not found in database",
    //   });
    // }

    // 1. Check Plan Expiry
    if (
      user.planExpiryDate &&
      Date.now() > new Date(user.planExpiryDate).getTime()
    ) {
      return res.status(403).json({
        success: false,
        message: "Your plan has expired. Please renew.",
        planExpired: true,
      });
    }

    // 2. Daily Usage Reset Logic (Midnight Reset)
    const today = new Date().toISOString().split("T")[0];

    if (user.lastResetDate !== today) {
      user.todayUsed = 0;
      user.lastResetDate = today;
    }

    // 3. Limit Check
    if (user.dailyLimit !== -1 && user.todayUsed >= user.dailyLimit) {
      return res.status(403).json({
        success: false,
        message: "Daily limit reached for your current plan.",
        limitReached: true,
      });
    }
    // ==========================================
    // BACKEND LIMIT CHECK END
    // ==========================================

    const originalName = getSafeOriginalName(req.file);

    const rawText = await extractResumeText(req.file);

    if (!rawText || rawText.length < 20) {
      return res.status(400).json({
        success: false,
        message: "Could not read enough text from the resume",
      });
    }

    const analysis = await analyzeResumeWithAI({
      resumeText: rawText.slice(0, 30000),
      role,
    });

    const report = await ResumeReport.create({
      ownerUid: req.user.uid,
      originalName,
      fileName: originalName,
      role,
      atsScore: analysis.atsScore,
      overallLevel: analysis.overallLevel,
      roleMatch: analysis.roleMatch,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      missingSkills: analysis.missingSkills,
      improvedSummary: analysis.improvedSummary,
      jobMatchRoles: analysis.jobMatchRoles,
      interviewQuestions: analysis.interviewQuestions,
      overallFeedback: analysis.overallFeedback,
      actionPlan: analysis.actionPlan,
      rawTextLength: rawText.length,
      rawTextPreview: rawText.slice(0, 500),
    });
    // ==========================
    // UPDATE USER LIMIT
    // ==========================

    if (user.dailyLimit !== -1) {
      user.todayUsed += 1;
    }

    await user.save();

    const remaining =
      user.dailyLimit === -1
        ? "Unlimited"
        : Math.max(0, user.dailyLimit - user.todayUsed);

    const daysLeft = Math.max(
      0,
      Math.ceil(
        (new Date(user.planExpiryDate) - new Date()) / (1000 * 60 * 60 * 24),
      ),
    );

    return res.status(201).json({
      success: true,

      message: "Resume analyzed successfully",

      planData: {
        planName: user.plan,

        dailyLimit: user.dailyLimit === -1 ? "Unlimited" : user.dailyLimit,

        todayUsed: user.todayUsed,

        remainingLimit: remaining,

        daysLeft,

        expiryDate: user.planExpiryDate,
      },

      data: {
        reportId: report._id,

        report,

        analysis,
      },
    });
  } catch (error) {
    console.error("ANALYZE RESUME ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getReports = async (req, res) => {
  try {
    if (!req.user?.uid) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const reports = await ResumeReport.find({
      ownerUid: req.user.uid,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    console.error("GET REPORTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch reports",
    });
  }
};

export const getReportById = async (req, res) => {
  try {
    if (!req.user?.uid) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const report = await ResumeReport.findOne({
      _id: req.params.id,
      ownerUid: req.user.uid,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("GET REPORT BY ID ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const deleteReport = async (req, res) => {
  try {
    if (!req.user?.uid) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const report = await ResumeReport.findOneAndDelete({
      _id: req.params.id,
      ownerUid: req.user.uid,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("DELETE REPORT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
