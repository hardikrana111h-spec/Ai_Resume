import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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

    const userEmail = req.user.email;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.OWNER_EMAIL,
      replyTo: userEmail,
      subject: `New Contact Message - ${name}`,
      html: `
        <h2>New Contact Message</h2>

        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${userEmail}</p>

        <hr />

        <p>${message}</p>
      `,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Thank You For Contacting AI Resume Analyzer",
      html: `
        <h2>Hello ${name},</h2>

        <p>
          Thank you for contacting AI Resume Analyzer.
        </p>

        <p>
          We received your message successfully.
        </p>

        <p>
          Our team will get back to you shortly.
        </p>

        <br/>

        <p>Regards,</p>
        <p>AI Resume Analyzer Team</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("CONTACT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};