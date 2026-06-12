import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// SMTP Check
transporter.verify((error) => {
  if (error) {
    console.error("SMTP ERROR:", error);
  } else {
    console.log("SMTP READY ✅");
  }
});

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

    console.log("📩 Sending owner email...");

    await transporter.sendMail({
      from: `"AI Resume Analyzer" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      replyTo: userEmail,
      subject: `New Contact Message - ${name}`,
      html: `
        <h2>New Contact Message</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${userEmail}</p>

        <hr/>

        <p>${message}</p>
      `,
    });

    console.log("✅ Owner email sent");

    // Confirmation Email (Optional)
    try {
      console.log("📩 Sending confirmation email...");

      await transporter.sendMail({
        from: `"AI Resume Analyzer" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: "Thank You For Contacting AI Resume Analyzer",
        html: `
          <h2>Hello ${name},</h2>

          <p>Thank you for contacting AI Resume Analyzer.</p>

          <p>We received your message successfully.</p>

          <p>Our team will get back to you shortly.</p>

          <br/>

          <p>Regards,</p>
          <p>AI Resume Analyzer Team</p>
        `,
      });

      console.log("✅ Confirmation email sent");
    } catch (confirmationError) {
      console.error(
        "⚠️ Confirmation email failed:",
        confirmationError.message
      );
    }

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("❌ CONTACT ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Unable to send message right now. Please try again later.",
    });
  }
};