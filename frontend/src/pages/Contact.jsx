import { useEffect, useState } from "react";
import {
  Mail,
  User,
  MessageSquare,
  Send,
  Clock,
  Shield,
  Lightbulb,
} from "lucide-react";
import api from "../api";

export default function Contact() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const user = JSON.parse(
        localStorage.getItem("resume_user") || "{}"
      );

      setEmail(user.email || "");
      setName(user.name || "");
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!message.trim()) {
      setError("Please enter your message");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/contact", {
        name,
        message,
      });

      setSuccess(
        res.data.message ||
          "Message sent successfully. Please check your email."
      );

      setMessage("");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to send message"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-card glass">
      <span className="hero-badge">
        Contact Us
      </span>

      <h1 style={{ marginTop: 14 }}>
        We'd Love To Hear From You
      </h1>

      <p className="section-note">
        Have a question, suggestion,
        feature request, or partnership
        inquiry? Send us a message and
        our team will get back to you.
      </p>

      <div
        className="feature-grid"
        style={{ marginTop: 24 }}
      >
        <div className="feature-item">
          <Mail
            size={24}
            style={{
              color: "#4f46e5",
              marginBottom: 10,
            }}
          />
          <h3>Developer Email</h3>
          <p>hardikrana.dev@gmail.com</p>
        </div>

        <div className="feature-item">
          <Clock
            size={24}
            style={{
              color: "#4f46e5",
              marginBottom: 10,
            }}
          />
          <h3>Fast Support</h3>
          <p>Usually within 24 hours</p>
        </div>

        <div className="feature-item">
          <Lightbulb
            size={24}
            style={{
              color: "#4f46e5",
              marginBottom: 10,
            }}
          />
          <h3>Suggestions</h3>
          <p>
            We continuously improve
            based on user feedback
          </p>
        </div>

        <div className="feature-item">
          <Shield
            size={24}
            style={{
              color: "#4f46e5",
              marginBottom: 10,
            }}
          />
          <h3>Secure Support</h3>
          <p>
            Your messages remain
            private and secure
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: 32,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div className="feature-item">
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 700,
            }}
          >
            Email Address
          </label>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Mail size={18} />

            <input
              type="email"
              value={email}
              readOnly
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "15px",
              }}
            />
          </div>
        </div>

        <div className="feature-item">
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 700,
            }}
          >
            Your Name
          </label>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <User size={18} />

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your name"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "15px",
              }}
            />
          </div>
        </div>

        <div className="feature-item">
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 700,
            }}
          >
            Your Message
          </label>

          <div
            style={{
              display: "flex",
              gap: 10,
            }}
          >
            <MessageSquare
              size={18}
              style={{
                marginTop: 6,
              }}
            />

            <textarea
              rows={6}
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Write your question, suggestion, feedback or issue here..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                resize: "vertical",
                background: "transparent",
                fontSize: "15px",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "12px",
              background:
                "rgba(239,68,68,0.1)",
              color: "#dc2626",
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "12px",
              background:
                "rgba(34,197,94,0.1)",
              color: "#16a34a",
              fontWeight: 600,
            }}
          >
            ✅ {success}
            <br />
            Thank you for contacting
            AI Resume Analyzer.
            <br />
            Please check your email for
            our confirmation message.
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            border: "none",
            cursor: loading
              ? "not-allowed"
              : "pointer",
            padding: "14px 22px",
            borderRadius: "14px",
            background:
              "linear-gradient(135deg,#4f46e5,#7c3aed)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            width: "fit-content",
            minWidth: 180,
            boxShadow:
              "0 10px 25px rgba(79,70,229,0.25)",
          }}
        >
          <Send size={18} />

          {loading
            ? "Sending..."
            : "Send Message"}
        </button>
      </form>
    </div>
  );
}