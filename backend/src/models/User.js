import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ==========================
    // USER INFO
    // ==========================
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

    // ==========================
    // PLAN
    // ==========================

    plan: {
      type: String,
      enum: ["Free Trial", "Basic", "Pro", "Premium"],
      default: "Free Trial",
    },

    paymentId: {
      type: String,
      default: "",
    },

    // ==========================
    // LIMIT
    // ==========================

    dailyLimit: {
      type: Number,
      default: 3,
    },

    todayUsed: {
      type: Number,
      default: 0,
    },

    lastResetDate: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },

    // ==========================
    // VALIDITY
    // ==========================

    planStartDate: {
      type: Date,
      default: Date.now,
    },

    planExpiryDate: {
      type: Date,
      default: () => {
        const d = new Date();
        d.setDate(d.getDate() + 3); // Free Trial = 3 Days
        return d;
      },
    },

    // ==========================
    // OPTIONAL
    // ==========================

    analysisCount: {
      type: Number,
      default: 0,
    },

    lastAnalysisDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================
// Virtual Remaining Limit
// ==========================

userSchema.virtual("remainingLimit").get(function () {
  if (this.dailyLimit === -1) return -1; // Unlimited

  const remaining = this.dailyLimit - this.todayUsed;

  return remaining < 0 ? 0 : remaining;
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

const User = mongoose.model("User", userSchema);

export default User;