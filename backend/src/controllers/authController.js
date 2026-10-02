import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID is missing");
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID.trim();

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// ==============================
// CREATE JWT
// ==============================
const createToken = (user) => {
  return jwt.sign(
    {
      uid: user._id.toString(),
      email: user.email,
      name: user.name || "",
      picture: user.picture || "",
      authProvider: user.authProvider || "local",
      role: user.role || "user",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ==============================
// SANITIZE USER
// ==============================
const sanitizeUser = (user) => ({
  id: user._id,
  uid: user._id.toString(),
  name: user.name || "",
  email: user.email,
  picture: user.picture || "",
  authProvider: user.authProvider || "local",
  role: user.role || "user",
});

// ==============================
// SIGNUP
// ==============================
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    }).lean();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      authProvider: "local",
      name: normalizedEmail.split("@")[0],
      plan: "Free Trial",
    });

    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: sanitizeUser(user),
      isNewUser: true,
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Signup failed",
    });
  }
};

// ==============================
// NORMAL LOGIN
// ==============================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(user);

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: sanitizeUser(user),
      isNewUser: false,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

// ==============================
// GOOGLE LOGIN - OPTIMIZED
// ==============================
export const googleLogin = async (req, res) => {
  try {
    const credential = req.body?.credential;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential missing",
      });
    }

    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google token",
      });
    }

    const email = (payload.email || "")
      .trim()
      .toLowerCase();

    const googleId = payload.sub;

    const name =
      payload.name ||
      payload.given_name ||
      email.split("@")[0] ||
      "";

    const picture = payload.picture || "";

    if (!email || !googleId) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google account information",
      });
    }

    // Find existing user
    let user = await User.findOne({
      $or: [
        { googleId },
        { email },
      ],
    });

    let isNewUser = false;

    // ==============================
    // NEW GOOGLE USER
    // ==============================
    if (!user) {
      isNewUser = true;

      user = await User.create({
        email,
        name,
        picture,
        googleId,
        authProvider: "google",
        password: "",
        plan: "Free Trial",
      });
    } else {
      // ==============================
      // EXISTING USER
      // Only update if something changed
      // ==============================

      let changed = false;

      if (!user.googleId) {
        user.googleId = googleId;
        changed = true;
      }

      if (!user.name && name) {
        user.name = name;
        changed = true;
      }

      if (picture && user.picture !== picture) {
        user.picture = picture;
        changed = true;
      }

      if (user.authProvider !== "google") {
        user.authProvider = "google";
        changed = true;
      }

      // DB write only when required
      if (changed) {
        await user.save();
      }
    }

    // Create JWT
    const token = createToken(user);

    // Send response immediately
    return res.status(200).json({
      success: true,
      message: "Google login successful",
      token,
      user: sanitizeUser(user),
      isNewUser,
    });
  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Google login failed",
    });
  }
};

// ==============================
// LOGOUT
// ==============================
export const logout = async (req, res) => {
  return res.json({
    success: true,
    message: "Logged out successfully",
  });
};

// ==============================
// GET ME
// ==============================
export const getMe = async (req, res) => {
  try {
    return res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("GET ME ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get current user",
    });
  }
};
