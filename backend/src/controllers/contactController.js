import Contact from "../models/Contact.js";

export const submitContact = async (req, res) => {
  try {
    const { name, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: "User email not found",
      });
    }

    const contact = await Contact.create({
      user: req.user.uid,
      name,
      email: userEmail,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Message submitted successfully",
      contact,
    });
  } catch (error) {
    console.error("CONTACT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to submit message",
    });
  }
};