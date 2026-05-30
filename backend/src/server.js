import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";

async function start() {
  try {
    console.log(
      "OPENAI KEY:",
      process.env.OPENAI_API_KEY
        ? "FOUND"
        : "MISSING"
    );

    const { default: app } =
      await import("./app.js");

    const PORT =
      process.env.PORT || 5000;

    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.log(
      "SERVER ERROR:",
      error
    );
  }
}

start();