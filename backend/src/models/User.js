import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      default: "",
    },

    googleId: {
      type: String,
      default: "",
      index: true,
    },

    picture: {
      type: String,
      default: "",
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // Add these inside your existing UserSchema:
  plan: { type: String, default: "Free Trial" },
  paymentId: String,
  analysisCount: { type: Number, default: 0 },
  lastAnalysisDate: { type: Date, default: null }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model(
  "User",
  userSchema
);

export default User;