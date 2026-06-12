import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

const transporter =
  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user:
        process.env.EMAIL_USER,
      pass:
        process.env.EMAIL_PASS,
    },
  });

export const getAllContacts =
  async (req, res) => {
    try {
      const contacts =
        await Contact.find().sort({
          createdAt: -1,
        });

      return res.json({
        success: true,
        contacts,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch contacts",
      });
    }
  };

export const getContactById =
  async (req, res) => {
    try {
      const contact =
        await Contact.findById(
          req.params.id
        );

      if (!contact) {
        return res.status(404).json({
          success: false,
          message:
            "Contact not found",
        });
      }

      return res.json({
        success: true,
        contact,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch contact",
      });
    }
  };

export const replyContact =
  async (req, res) => {
    try {
      const { reply } = req.body;

      if (!reply) {
        return res.status(400).json({
          success: false,
          message:
            "Reply is required",
        });
      }

      const contact =
        await Contact.findById(
          req.params.id
        );

      if (!contact) {
        return res.status(404).json({
          success: false,
          message:
            "Contact not found",
        });
      }

      await transporter.sendMail({
        from:
          process.env.EMAIL_USER,

        to: contact.email,

        subject: `Reply: ${contact.subject}`,

        html: `
          <h2>Hello ${contact.name}</h2>

          <p>${reply}</p>

          <br/>

          <p>Regards,</p>
          <p>AI Resume Analyzer Team</p>
        `,
      });

      contact.adminReply =
        reply;

      contact.status =
        "replied";

      contact.repliedAt =
        new Date();

      await contact.save();

      return res.json({
        success: true,
        message:
          "Reply sent successfully",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Failed to send reply",
      });
    }
  };

export const toggleImportant =
  async (req, res) => {
    try {
      const contact =
        await Contact.findById(
          req.params.id
        );

      if (!contact) {
        return res.status(404).json({
          success: false,
          message:
            "Contact not found",
        });
      }

      contact.important =
        !contact.important;

      await contact.save();

      return res.json({
        success: true,
        important:
          contact.important,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          "Failed to update",
      });
    }
  };

export const deleteContact =
  async (req, res) => {
    try {
      await Contact.findByIdAndDelete(
        req.params.id
      );

      return res.json({
        success: true,
        message:
          "Deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          "Delete failed",
      });
    }
  };