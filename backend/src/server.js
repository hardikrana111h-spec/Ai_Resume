import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import connectDB from "./config/db.js";

// Initialize dotenv
dotenv.config();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ⚠️ Note: Using an array as a dummy database for testing. 
// Once you're ready, you can move this logic to your MongoDB controllers.
const users = []; 

async function start() {
  try {
    console.log(
      "GOOGLE CLIENT:",
      process.env.GOOGLE_CLIENT_ID ? "FOUND" : "MISSING",
    );

    console.log("JWT:", process.env.JWT_SECRET ? "FOUND" : "MISSING");

    // Import app AFTER environment variables are loaded
    const { default: app } = await import("./app.js");

    // Ensure CORS and JSON parsing are applied to your imported app
    app.use(cors());
    app.use(express.json());

    // --- 1. NORMAL SIGNUP ---
    // --- 1. NORMAL SIGNUP (No automatic plan assign) ---
app.post("/api/auth/signup", (req, res) => {
  const { email, password } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "User already exists!" });
  }

  // User is created fresh with NO plan attached
  const newUser = { id: Date.now(), email, password, activePlan: null };
  users.push(newUser);

  const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.status(201).json({ token, user: { email: newUser.email } });
});

// --- 4. UPDATED PLAN STATUS ROUTE ---
app.get("/api/user/plan-status", (req, res) => {
  // In a real app, find the logged-in user in your database.
  // For now, let's assume we check if a user profile has chosen a plan.
  
  // If the user has NOT chosen a plan yet, we send back "none" or activePlan: null
  res.status(200).json({
    status: "success",
    planData: {
      planName: "None",         // Changed from "Free Trial" to "None"
      remainingLimit: 0,        // No free analyzer credits until they click a plan
      dailyLimit: 0,
      daysLeft: 0,
      hoursLeft: 0,
      minutesLeft: 0,
      secondsLeft: 0,
      hasPlan: false            // Extra flag so the frontend knows to block them
    }
  });
});

    // --- 2. NORMAL LOGIN ---
    app.post("/api/auth/login", (req, res) => {
      const { email, password } = req.body;
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.status(200).json({ token, user: { email: user.email } });
    });

    // --- 3. GOOGLE AUTHENTICATION ---
    app.post("/api/auth/google", async (req, res) => {
      const { credential } = req.body;
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        const email = payload.email;

      // Inside your Google Auth Route:
    let isNewUser = false;
    let user = users.find(u => u.email === email);
    
    if (!user) {
      user = { id: Date.now(), email: email, password: "", activePlan: null }; 
      users.push(user);
      isNewUser = true; // Mark them as new!
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Add isNewUser to the response
    res.status(200).json({ token, isNewUser, user: { email: user.email, name: payload.name, picture: payload.picture } });
      } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(401).json({ message: "Google authentication failed" });
      }
    });

    // --- 4. GET USER PLAN STATUS (Fixes Pricing Page 404 Error) ---
    app.get("/api/user/plan-status", (req, res) => {
      res.status(200).json({
        status: "success",
        plan: "free", 
        credits: 10,
        isActive: true
      });
    });

    const PORT = process.env.PORT || 5000;

    // Connect to your MongoDB database
    await connectDB();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("SERVER ERROR:", error);
  }
}

start();