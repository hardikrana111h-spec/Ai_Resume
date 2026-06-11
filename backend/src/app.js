import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use(
  cors({
    origin: ["http://localhost:5173", "https://ai-resume-s7lv.onrender.com"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/contact", contactRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
