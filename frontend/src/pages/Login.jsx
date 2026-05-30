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
    const timer = setInterval(() => {
      if (!window.google || !googleBtn.current) return;

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

      googleBtn.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleBtn.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        width: 360,
        text: "continue_with",
        logo_alignment: "left",
      });

      clearInterval(timer);
    }, 200);

    return () => clearInterval(timer);
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