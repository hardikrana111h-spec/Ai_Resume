import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

function generateCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let text = "";
  for (let i = 0; i < 6; i++) {
    text += chars[Math.floor(Math.random() * chars.length)];
  }
  return text;
}

export default function Login() {
  const navigate = useNavigate();
  const googleBtn = useRef(null);
  const { setUser } = useAuth();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("resume_token")) {
      navigate("/");
    }
  }, [navigate]);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
  };

  const title = useMemo(
    () => (mode === "login" ? "Welcome Back" : "Create Account"),
    [mode]
  );

  const subtitle = useMemo(
    () =>
      mode === "login"
        ? "Login to access your resume reports and builder."
        : "Create a secure account to start analyzing resumes.",
    [mode]
  );

  useEffect(() => {
    let timer;

    const initGoogle = () => {
      if (!window.google || !googleBtn.current) return;

      const buttonWidth = Math.min(
        360,
        googleBtn.current?.clientWidth || window.innerWidth - 48
      );

      googleBtn.current.innerHTML = "";

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        ux_mode: "popup",
        callback: async (response) => {
          try {
            setError("");
            setSuccess("");
            setLoading(true);

            const res = await api.post("/api/auth/google", {
              credential: response.credential,
            });

            localStorage.setItem("resume_token", res.data.token);
            localStorage.setItem("resume_user", JSON.stringify(res.data.user));
            setUser(res.data.user);

            setSuccess("Google login successful");

            setTimeout(() => {
              navigate("/");
            }, 700);
          } catch (err) {
            setError(err.response?.data?.message || "Google login failed");
          } finally {
            setLoading(false);
          }
        },
      });

      window.google.accounts.id.renderButton(googleBtn.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        width: buttonWidth,
        text: "continue_with",
        logo_alignment: "left",
      });

      setGoogleReady(true);
    };

    timer = setInterval(initGoogle, 200);

    const handleResize = () => {
      if (!window.google || !googleBtn.current) return;
      initGoogle();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [navigate, setUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    if (mode === "signup" && captchaInput.trim().toUpperCase() !== captcha) {
      setError("Wrong captcha");
      refreshCaptcha();
      return;
    }

    try {
      setLoading(true);

      if (mode === "signup") {
        const res = await api.post("/api/auth/signup", {
          email,
          password,
        });

        localStorage.setItem("resume_token", res.data.token);
        localStorage.setItem("resume_user", JSON.stringify(res.data.user));
        setUser(res.data.user);

        setSuccess("Account created successfully");

        setTimeout(() => {
          navigate("/");
        }, 700);
        return;
      }

      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("resume_token", res.data.token);
      localStorage.setItem("resume_user", JSON.stringify(res.data.user));
      setUser(res.data.user);

      setSuccess("Login successful");

      setTimeout(() => {
        navigate("/");
      }, 700);
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <style>{`
        .login-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          overflow-x: hidden;
          background:
            radial-gradient(circle at top left, rgba(99, 102, 241, 0.16), transparent 35%),
            radial-gradient(circle at top right, rgba(16, 185, 129, 0.12), transparent 32%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 45%, #f8fafc 100%);
          box-sizing: border-box;
        }

        .glass {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.12);
        }

        .login-split {
          width: 100%;
          max-width: 1180px;
          min-height: 720px;
          border-radius: 32px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
        }

        .login-left {
          padding: 56px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 22px;
          color: #0f172a;
          background:
            linear-gradient(180deg, rgba(99, 102, 241, 0.08), rgba(255, 255, 255, 0));
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          padding: 10px 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.4px;
          color: #4f46e5;
          background: rgba(79, 70, 229, 0.1);
          border: 1px solid rgba(79, 70, 229, 0.16);
        }

        .login-left h1 {
          margin: 0;
          font-size: clamp(2rem, 4vw, 4rem);
          line-height: 1.05;
          font-weight: 800;
          letter-spacing: -0.03em;
          max-width: 12ch;
        }

        .login-left p {
          margin: 0;
          font-size: 1.05rem;
          line-height: 1.75;
          color: #475569;
          max-width: 56ch;
        }

        .login-points {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 8px;
          max-width: 620px;
        }

        .login-points div {
          padding: 16px 18px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(148, 163, 184, 0.2);
          color: #0f172a;
          font-weight: 600;
          box-shadow: 0 10px 26px rgba(15, 23, 42, 0.05);
        }

        .login-card {
          padding: 36px;
          background: rgba(255, 255, 255, 0.88);
          border-left: 1px solid rgba(226, 232, 240, 0.9);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .auth-tabs {
          display: inline-flex;
          gap: 10px;
          padding: 6px;
          width: fit-content;
          border-radius: 999px;
          background: rgba(241, 245, 249, 0.95);
          border: 1px solid rgba(226, 232, 240, 0.9);
          margin-bottom: 24px;
        }

        .tab {
          border: 0;
          outline: none;
          padding: 12px 20px;
          border-radius: 999px;
          background: transparent;
          color: #475569;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab.active {
          background: #111827;
          color: #fff;
          box-shadow: 0 10px 24px rgba(17, 24, 39, 0.18);
        }

        .login-card h2 {
          margin: 0;
          font-size: 2rem;
          line-height: 1.1;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .login-card > p {
          margin: 10px 0 24px;
          color: #64748b;
          line-height: 1.6;
          max-width: 40ch;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .auth-form input {
          width: 100%;
          height: 54px;
          border-radius: 16px;
          border: 1px solid #dbe3ee;
          background: #fff;
          padding: 0 16px;
          font-size: 15px;
          color: #0f172a;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }

        .auth-form input::placeholder {
          color: #94a3b8;
        }

        .auth-form input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
        }

        .captcha-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .captcha-code {
          min-width: 140px;
          padding: 14px 16px;
          border-radius: 16px;
          text-align: center;
          letter-spacing: 4px;
          font-weight: 800;
          font-size: 18px;
          color: #111827;
          background: linear-gradient(135deg, #eef2ff, #e0f2fe);
          border: 1px dashed #94a3b8;
          user-select: none;
        }

        .secondary-btn {
          border: 0;
          outline: none;
          height: 48px;
          padding: 0 18px;
          border-radius: 14px;
          background: #f8fafc;
          color: #0f172a;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid #dbe3ee;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .secondary-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.06);
        }

        .error-box,
        .success-box {
          padding: 14px 16px;
          border-radius: 14px;
          font-weight: 600;
          line-height: 1.5;
          font-size: 14px;
        }

        .error-box {
          color: #b91c1c;
          background: #fef2f2;
          border: 1px solid #fecaca;
        }

        .success-box {
          color: #166534;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
        }

        .primary-btn {
          border: 0;
          outline: none;
          height: 54px;
          border-radius: 16px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          font-weight: 800;
          font-size: 15px;
          cursor: pointer;
          box-shadow: 0 14px 28px rgba(79, 70, 229, 0.22);
          transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
        }

        .primary-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 18px 34px rgba(79, 70, 229, 0.28);
        }

        .primary-btn:disabled {
          opacity: 0.72;
          cursor: not-allowed;
        }

        .full-btn {
          width: 100%;
          margin-top: 4px;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 22px 0 16px;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .divider::before,
        .divider::after {
          content: "";
          height: 1px;
          flex: 1;
          background: #e2e8f0;
        }

        .google-wrapper {
          width: 100%;
          max-width: 360px;
        }

        .google-wrapper > div {
          width: 100%;
        }

        .google-wrapper iframe {
          width: 100% !important;
        }

        @media (max-width: 1024px) {
          .login-split {
            grid-template-columns: 1fr;
            min-height: auto;
          }

          .login-left {
            padding: 40px 40px 0;
          }

          .login-card {
            border-left: 0;
            padding: 32px 40px 40px;
          }
        }

        @media (max-width: 768px) {
          .login-page {
            padding: 16px;
            align-items: flex-start;
          }

          .login-split {
            border-radius: 24px;
            overflow: hidden;
          }

          .login-left {
            padding: 28px 22px 10px;
            gap: 16px;
          }

          .login-left h1 {
            max-width: 100%;
          }

          .login-points {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .login-card {
            padding: 22px;
          }

          .login-card h2 {
            font-size: 1.6rem;
          }

          .auth-tabs {
            width: 100%;
          }

          .tab {
            flex: 1;
            text-align: center;
            padding: 12px 14px;
          }

          .captcha-row {
            flex-direction: column;
            align-items: stretch;
          }

          .captcha-code {
            width: 100%;
            min-width: 0;
          }

          .secondary-btn {
            width: 100%;
          }

          .google-wrapper {
            max-width: 100%;
          }
        }

        @media (max-width: 480px) {
          .login-page {
            padding: 10px;
          }

          .login-left h1 {
            font-size: 1.9rem;
          }

          .login-left p {
            font-size: 0.98rem;
          }

          .login-points div {
            padding: 14px 16px;
            font-size: 14px;
          }

          .login-card {
            padding: 18px;
          }

          .login-card h2 {
            font-size: 1.45rem;
          }

          .auth-form input,
          .primary-btn {
            height: 50px;
          }
        }
      `}</style>

      <div className="login-split glass">
        <div className="login-left">
          <span className="hero-badge">Secure Resume AI</span>
          <h1>AI Powered Resume Analyzer & Builder</h1>
          <p>
            Analyze resumes, build ATS-friendly CVs, track reports, and improve
            your job chances with smart AI insights.
          </p>

          <div className="login-points">
            <div>Secure authentication system</div>
            <div>Google one-click login</div>
            <div>Personal private reports</div>
            <div>ATS optimized resume builder</div>
          </div>
        </div>

        <div className="login-card">
          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "login" ? "tab active" : "tab"}
              onClick={() => {
                setMode("login");
                setError("");
                setSuccess("");
              }}
            >
              Login
            </button>

            <button
              type="button"
              className={mode === "signup" ? "tab active" : "tab"}
              onClick={() => {
                setMode("signup");
                setError("");
                setSuccess("");
                refreshCaptcha();
              }}
            >
              Sign Up
            </button>
          </div>

          <h2>{title}</h2>
          <p>{subtitle}</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {mode === "signup" && (
              <>
                <div className="captcha-row">
                  <div className="captcha-code">{captcha}</div>
                  <button
                    type="button"
                    className="secondary-btn captcha-refresh"
                    onClick={refreshCaptcha}
                  >
                    Refresh
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Enter captcha"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                />
              </>
            )}

            {error && <div className="error-box">{error}</div>}
            {success && <div className="success-box">{success}</div>}

            <button className="primary-btn full-btn" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
            </button>
          </form>

          <div className="divider">OR CONTINUE WITH</div>

          <div className="google-wrapper">
            <div ref={googleBtn} />
          </div>
        </div>
      </div>
    </div>
  );
}