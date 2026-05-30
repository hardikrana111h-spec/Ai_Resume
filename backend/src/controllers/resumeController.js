import path from "path";
import ResumeReport from "../models/ResumeReport.js";
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

    return res.status(201).json({
      success: true,
      message: "Resume analyzed successfully",
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