import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = (user) => {
  return jwt.sign(
    {
      uid: user._id.toString(),
      email: user.email,
      name: user.name || "",
      picture: user.picture || "",
      authProvider: user.authProvider || "local",
      role: user.role || "user", // ADD THIS
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const sanitizeUser = (user) => ({
  id: user._id,
  uid: user._id.toString(),
  name: user.name || "",
  email: user.email,
  picture: user.picture || "",
  authProvider: user.authProvider || "local",
  role: user.role || "user",
});

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
    const existingUser = await User.findOne({ email: normalizedEmail });

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
    });

    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Signup failed",
    });
  }
};

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
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

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
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const email = (payload.email || "").toLowerCase();
    const googleId = payload.sub;
    const name = payload.name || payload.given_name || email.split("@")[0] || "";
    const picture = payload.picture || "";

    if (!email) {
      return res.status(401).json({
        success: false,
        message: "Google account email not found",
      });
    }

    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    });

    if (!user) {
      user = await User.create({
        email,
        name,
        picture,
        googleId,
        authProvider: "google",
        password: "",
      });
    } else {
      user.name = user.name || name;
      user.picture = picture || user.picture;
      user.googleId = user.googleId || googleId;
      user.authProvider = "google";
      await user.save();
    }

    const token = createToken(user);

    return res.json({
      success: true,
      message: "Google login successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);
    return res.status(401).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};

export const logout = async (req, res) => {
  return res.json({
    success: true,
    message: "Logged out successfully",
  });
};

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