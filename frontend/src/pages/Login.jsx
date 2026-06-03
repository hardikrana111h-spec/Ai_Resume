import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Eye,
  EyeOff,
  FileText,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

function generateCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let text = "";
  for (let i = 0; i < 6; i += 1) {
    text += chars[Math.floor(Math.random() * chars.length)];
  }
  return text;
}

export default function Login() {
  const navigate = useNavigate();
  const googleBtn = useRef(null);
  const googleInitializedRef = useRef(false);
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
  const [showPassword, setShowPassword] = useState(false);

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

    const renderGoogleButton = () => {
      if (!window.google || !googleBtn.current) return;

      const buttonWidth = Math.min(
        360,
        googleBtn.current?.clientWidth || window.innerWidth - 48
      );

      googleBtn.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleBtn.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        width: buttonWidth,
        text: "continue_with",
        logo_alignment: "left",
      });
    };

    const initGoogle = () => {
      if (!window.google || !googleBtn.current) return;

      if (!googleInitializedRef.current) {
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

        googleInitializedRef.current = true;
      }

      renderGoogleButton();
      setGoogleReady(true);
      clearInterval(timer);
    };

    timer = setInterval(initGoogle, 200);

    const handleResize = () => {
      if (!window.google || !googleBtn.current || !googleInitializedRef.current) {
        return;
      }
      renderGoogleButton();
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
            radial-gradient(circle at top left, rgba(14, 165, 233, 0.16), transparent 35%),
            radial-gradient(circle at top right, rgba(79, 70, 229, 0.12), transparent 32%),
            linear-gradient(135deg, #f8fafc 0%, #e0f2fe 45%, #eef2ff 100%);
          box-sizing: border-box;
        }

        .glass {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.74);
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
          grid-template-columns: 1.08fr 0.92fr;
        }

        .login-left {
          padding: 56px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 22px;
          color: #0f172a;
          background:
            linear-gradient(180deg, rgba(14, 165, 233, 0.08), rgba(255, 255, 255, 0));
          position: relative;
          overflow: hidden;
        }

        .login-left::before {
          content: "";
          position: absolute;
          inset: -80px auto auto -110px;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(14, 165, 233, 0.18), transparent 70%);
          pointer-events: none;
        }

        .login-left::after {
          content: "";
          position: absolute;
          right: -70px;
          bottom: -70px;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(79, 70, 229, 0.14), transparent 70%);
          pointer-events: none;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          padding: 10px 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.4px;
          color: #0284c7;
          background: rgba(14, 165, 233, 0.1);
          border: 1px solid rgba(14, 165, 233, 0.16);
          position: relative;
          z-index: 1;
        }

        .login-left h1 {
          margin: 0;
          font-size: clamp(2rem, 4vw, 4rem);
          line-height: 1.03;
          font-weight: 900;
          letter-spacing: -0.04em;
          max-width: 13ch;
          position: relative;
          z-index: 1;
        }

        .login-left > p {
          margin: 0;
          font-size: 1.04rem;
          line-height: 1.75;
          color: #475569;
          max-width: 58ch;
          position: relative;
          z-index: 1;
        }

        .login-points {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 8px;
          max-width: 640px;
          position: relative;
          z-index: 1;
        }

        .login-point {
          padding: 16px 18px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(148, 163, 184, 0.18);
          color: #0f172a;
          font-weight: 700;
          box-shadow: 0 10px 26px rgba(15, 23, 42, 0.05);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .login-point-icon {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(79, 70, 229, 0.12));
          color: #0284c7;
          flex-shrink: 0;
        }

        .login-card {
          padding: 36px;
          background: rgba(255, 255, 255, 0.9);
          border-left: 1px solid rgba(226, 232, 240, 0.9);
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .login-card::before {
          content: "";
          position: absolute;
          inset: -60px -70px auto auto;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(14, 165, 233, 0.14), transparent 70%);
          pointer-events: none;
        }

        .login-top {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
          position: relative;
          z-index: 1;
        }

        .login-logo {
          width: 54px;
          height: 54px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          font-weight: 900;
          font-size: 20px;
          color: white;
          background: linear-gradient(135deg, #0ea5e9, #4f46e5);
          box-shadow: 0 14px 28px rgba(14, 165, 233, 0.22);
          flex-shrink: 0;
        }

        .login-title h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 900;
          color: #0f172a;
        }

        .login-title p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 14px;
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
          position: relative;
          z-index: 1;
        }

        .tab {
          border: 0;
          outline: none;
          padding: 12px 20px;
          border-radius: 999px;
          background: transparent;
          color: #475569;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab.active {
          background: linear-gradient(135deg, #0ea5e9, #4f46e5);
          color: #fff;
          box-shadow: 0 10px 24px rgba(14, 165, 233, 0.18);
        }

        .login-card h2 {
          margin: 0;
          font-size: 2rem;
          line-height: 1.1;
          color: #0f172a;
          letter-spacing: -0.02em;
          position: relative;
          z-index: 1;
        }

        .login-card > p {
          margin: 10px 0 24px;
          color: #64748b;
          line-height: 1.6;
          max-width: 40ch;
          position: relative;
          z-index: 1;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
          position: relative;
          z-index: 1;
        }

        .field {
          display: grid;
          gap: 8px;
        }

        .field label {
          font-size: 14px;
          font-weight: 800;
          color: #334155;
        }

        .input-wrap {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .input-wrap input {
          width: 100%;
          height: 54px;
          border-radius: 16px;
          border: 1px solid #dbe3ee;
          background: #fff;
          padding: 0 46px 0 44px;
          font-size: 15px;
          color: #0f172a;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }

        .input-wrap input::placeholder {
          color: #94a3b8;
        }

        .input-wrap input:focus {
          border-color: #0ea5e9;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.12);
        }

        .password-toggle {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 38px;
          height: 38px;
          border-radius: 12px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          background: rgba(255, 255, 255, 0.92);
          display: grid;
          place-items: center;
          color: #475569;
        }

        .captcha-row {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .captcha-code {
          flex: 1;
          min-width: 140px;
          height: 52px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(79, 70, 229, 0.1));
          border: 1px dashed rgba(14, 165, 233, 0.25);
          font-weight: 900;
          letter-spacing: 0.28em;
          color: #0f172a;
          user-select: none;
        }

        .captcha-refresh {
          min-width: 52px;
          height: 52px;
          border-radius: 16px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          background: white;
          display: grid;
          place-items: center;
          color: #0ea5e9;
        }

        .login-message {
          margin-bottom: 14px;
          padding: 12px 14px;
          border-radius: 16px;
          background: rgba(239, 68, 68, 0.08);
          color: #b91c1c;
          border: 1px solid rgba(239, 68, 68, 0.14);
          font-weight: 700;
          line-height: 1.5;
          position: relative;
          z-index: 1;
        }

        .login-success {
          margin-bottom: 14px;
          padding: 12px 14px;
          border-radius: 16px;
          background: rgba(34, 197, 94, 0.08);
          color: #166534;
          border: 1px solid rgba(34, 197, 94, 0.14);
          font-weight: 700;
          line-height: 1.5;
          position: relative;
          z-index: 1;
        }

        .login-primary-btn,
        .login-secondary-btn {
          border: 0;
          outline: none;
          min-height: 54px;
          border-radius: 16px;
          font-weight: 800;
          font-size: 15px;
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
        }

        .login-primary-btn {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          box-shadow: 0 14px 28px rgba(79, 70, 229, 0.22);
        }

        .login-secondary-btn {
          background: #f8fafc;
          color: #0f172a;
          border: 1px solid #dbe3ee;
        }

        .login-primary-btn:hover:not(:disabled),
        .login-secondary-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .login-primary-btn:disabled {
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
          font-weight: 900;
          letter-spacing: 1.5px;
          position: relative;
          z-index: 1;
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
          position: relative;
          z-index: 1;
        }

        .google-placeholder {
          width: 100%;
          min-height: 50px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          border: 1px dashed rgba(14, 165, 233, 0.25);
          color: #0284c7;
          font-weight: 700;
          background: rgba(14, 165, 233, 0.05);
        }

        .login-bottom {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 14px;
          color: #64748b;
          font-size: 14px;
          position: relative;
          z-index: 1;
        }

        .login-bottom a {
          color: #0ea5e9;
          font-weight: 800;
        }

        .mini-trust {
          margin-top: 18px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          position: relative;
          z-index: 1;
        }

        .mini-trust-card {
          padding: 12px;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid rgba(226, 232, 240, 0.92);
          text-align: center;
        }

        .mini-trust-card strong {
          display: block;
          color: #0f172a;
          font-size: 13px;
          margin-top: 6px;
        }

        .mini-trust-card span {
          display: block;
          color: #64748b;
          font-size: 12px;
          margin-top: 3px;
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

          .login-secondary-btn {
            width: 100%;
          }

          .google-wrapper {
            max-width: 100%;
          }

          .login-bottom {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .login-page {
            padding: 10px;
          }

          .login-left h1 {
            font-size: 1.9rem;
          }

          .login-left > p {
            font-size: 0.98rem;
          }

          .login-point {
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
          .login-primary-btn,
          .login-secondary-btn {
            min-height: 50px;
          }

          .input-wrap input {
            height: 50px;
          }
        }
      `}</style>

      <div className="login-split glass">
        <div className="login-left">
          <span className="hero-badge">
            <Sparkles size={14} /> Secure Resume AI
          </span>
          <h1>AI Powered Resume Analyzer & Builder</h1>
          <p>
            Analyze resumes, build ATS-friendly CVs, track reports, and improve
            your job chances with smart AI insights.
          </p>

          <div className="login-points">
            <div className="login-point">
              <div className="login-point-icon">
                <Bot size={18} />
              </div>
              <div>AI resume analysis with instant scoring</div>
            </div>

            <div className="login-point">
              <div className="login-point-icon">
                <FileText size={18} />
              </div>
              <div>Resume builder with live preview</div>
            </div>

            <div className="login-point">
              <div className="login-point-icon">
                <ShieldCheck size={18} />
              </div>
              <div>Private reports per user account</div>
            </div>

            <div className="login-point">
              <div className="login-point-icon">
                <BadgeCheck size={18} />
              </div>
              <div>Google one-click login support</div>
            </div>
          </div>

          <div className="mini-trust">
            <div className="mini-trust-card">
              <Zap size={16} color="#0ea5e9" />
              <strong>Fast login</strong>
              <span>Google or email</span>
            </div>
            <div className="mini-trust-card">
              <ShieldCheck size={16} color="#4f46e5" />
              <strong>Secure access</strong>
              <span>Private account</span>
            </div>
            <div className="mini-trust-card">
              <FileText size={16} color="#7c3aed" />
              <strong>ATS workflow</strong>
              <span>Resume ready</span>
            </div>
          </div>
        </div>

        <div className="login-card">
          <div className="login-top">
            <div className="login-logo">AI</div>
            <div className="login-title">
              <h2>Welcome back</h2>
              <p>Login to continue to your dashboard</p>
            </div>
          </div>

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

          {error && <div className="login-message">{error}</div>}
          {success && <div className="login-success">{success}</div>}

          <h2>{title}</h2>
          <p>{subtitle}</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field">
              <label>Email</label>
              <div className="input-wrap">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label>Password</label>
              <div className="input-wrap">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <>
                <div className="field">
                  <label>Captcha</label>
                  <div className="captcha-row">
                    <div className="captcha-code">{captcha}</div>
                    <button
                      type="button"
                      className="login-secondary-btn captcha-refresh"
                      onClick={refreshCaptcha}
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>
                </div>

                <div className="field">
                  <label>Enter Captcha</label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      placeholder="Type captcha code"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <button className="login-primary-btn full-btn" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}{" "}
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="divider">OR CONTINUE WITH</div>

          <div className="google-wrapper">
            <div ref={googleBtn} />
            {!googleReady && (
              <div className="google-placeholder">
                Connecting to Google...
              </div>
            )}
          </div>

          <div className="login-bottom">
            <span>
              Need help? <Link to="/contact">Contact support</Link>
            </span>
            <span>
              Learn more at <Link to="/about">About us</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}