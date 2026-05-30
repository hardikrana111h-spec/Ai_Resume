import mongoose from "mongoose";

const resumeReportSchema = new mongoose.Schema(
  {
    ownerUid: {
      type: String,
      required: true,
      index: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "React Developer",
    },

    atsScore: {
      type: Number,
      default: 0,
    },

    overallLevel: {
      type: String,
      default: "Professional",
    },

    roleMatch: {
      type: String,
      default: "",
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    improvedSummary: {
      type: String,
      default: "",
    },

    jobMatchRoles: {
      type: [String],
      default: [],
    },

    interviewQuestions: {
      type: [String],
      default: [],
    },

    overallFeedback: {
      type: String,
      default: "",
    },

    actionPlan: {
      type: [String],
      default: [],
    },

    rawTextLength: {
      type: Number,
      default: 0,
    },

    rawTextPreview: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const ResumeReport =
  mongoose.models.ResumeReport ||
  mongoose.model(
    "ResumeReport",
    resumeReportSchema
  );

export default ResumeReport;