import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, Mail, RefreshCw } from "lucide-react";
import Swal from "sweetalert2"; // Added SweetAlert for Popups
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
  const googleInitialized = useRef(false);
  const { login } = useAuth();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  
  // Track specific input errors for the red box UI
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("resume_token")) {
      navigate("/");
    }
  }, [navigate]);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
    setFieldErrors((prev) => ({ ...prev, captcha: "" }));
  };

  const title = useMemo(() => (mode === "login" ? "Welcome Back" : "Create Account"), [mode]);
  const subtitle = useMemo(() => mode === "login" ? "Login to access your resume reports." : "Create a secure account to get started.", [mode]);

  const handleGoogleResponse = useCallback(async (response) => {
    try {
      setLoading(true);
      const res = await api.post("/api/auth/google", {
        credential: response.credential,
      });
      
      login(res.data.token, res.data.user);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Successfully logged in with Google',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });

      if (res.data.isNewUser) {
        navigate("/pricing", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Google Login Failed',
        text: err.response?.data?.message || "An error occurred with Google Auth",
      });
      setLoading(false);
    }
  }, [login, navigate]);

  useEffect(() => {
    const initializeGoogle = () => {
      if (window.google && !googleInitialized.current && googleBtn.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(googleBtn.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          width: 320,
        });
        googleInitialized.current = true;
      }
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = initializeGoogle;
      document.body.appendChild(script);
      
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    } else {
      initializeGoogle();
    }
  }, [handleGoogleResponse]);

  const isValidEmail = (emailStr) => /\S+@\S+\.\S+/.test(emailStr);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sanitizedEmail = email.trim();
    const sanitizedPassword = password.trim();
    
    // Front-end Validation Logic
    const errors = {};
    
    if (!sanitizedEmail) {
      errors.email = "Email address is required";
    } else if (!isValidEmail(sanitizedEmail)) {
      errors.email = "Please enter a valid email address";
    }

    if (!sanitizedPassword) {
      errors.password = "Password is required";
    } else if (mode === "signup" && sanitizedPassword.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    if (mode === "signup" && captchaInput.trim().toUpperCase() !== captcha) {
      errors.captcha = "Incorrect security code";
      refreshCaptcha();
    }

    // If there are errors, stop submission and show red boxes
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      Swal.fire({
        icon: 'warning',
        title: 'Check your inputs',
        text: 'Please fix the highlighted errors before continuing.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    // Clear errors if everything is valid
    setFieldErrors({});

    try {
      setLoading(true);
      const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const res = await api.post(endpoint, {
        email: sanitizedEmail,
        password: sanitizedPassword,
      });

      login(res.data.token, res.data.user);

      Swal.fire({
        icon: 'success',
        title: mode === "signup" ? 'Account Created!' : 'Welcome Back!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });

      if (mode === "signup") {
        navigate("/pricing", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
      
    } catch (err) {
      // Backend Error Popup
      Swal.fire({
        icon: 'error',
        title: 'Authentication Failed',
        text: err.response?.data?.message || "An unexpected error occurred",
      });
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <style>{`
        .login-page { min-height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center; padding: 24px; background: radial-gradient(circle at top left, rgba(14, 165, 233, 0.16), transparent 35%), radial-gradient(circle at top right, rgba(79, 70, 229, 0.12), transparent 32%), linear-gradient(135deg, #f8fafc 0%, #e0f2fe 45%, #eef2ff 100%); box-sizing: border-box; }
        .glass { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); background: rgba(255, 255, 255, 0.95); border: 1px solid rgba(255, 255, 255, 0.6); box-shadow: 0 24px 70px rgba(15, 23, 42, 0.12); }
        .login-card { width: 100%; max-width: 440px; padding: 40px; border-radius: 28px; display: flex; flex-direction: column; position: relative; overflow: hidden; }
        .login-top { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
        .login-logo { width: 48px; height: 48px; border-radius: 14px; display: grid; place-items: center; font-weight: 900; font-size: 18px; color: white; background: linear-gradient(135deg, #0ea5e9, #4f46e5); box-shadow: 0 10px 20px rgba(14, 165, 233, 0.22); flex-shrink: 0; }
        .login-title h2 { margin: 0; font-size: 22px; font-weight: 900; color: #0f172a; }
        .login-title p { margin: 4px 0 0; color: #64748b; font-size: 13px; }
        .auth-tabs { display: flex; gap: 8px; padding: 6px; border-radius: 999px; background: rgba(241, 245, 249, 0.95); border: 1px solid rgba(226, 232, 240, 0.9); margin-bottom: 28px; }
        .tab { flex: 1; border: 0; outline: none; padding: 12px 16px; border-radius: 999px; background: transparent; color: #475569; font-weight: 800; font-size: 14px; cursor: pointer; transition: all 0.2s ease; text-align: center; }
        .tab.active { background: linear-gradient(135deg, #0ea5e9, #4f46e5); color: #fff; box-shadow: 0 8px 16px rgba(14, 165, 233, 0.18); }
        .login-card > h2 { margin: 0; font-size: 1.8rem; line-height: 1.2; color: #0f172a; }
        .login-card > p { margin: 8px 0 24px; color: #64748b; font-size: 14px; }
        .auth-form { display: flex; flex-direction: column; gap: 16px; }
        .field { display: grid; gap: 8px; }
        .field label { font-size: 13px; font-weight: 800; color: #334155; }
        .input-wrap { position: relative; }
        .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; transition: color 0.2s; }
        .input-wrap input { width: 100%; height: 50px; border-radius: 14px; border: 1px solid #dbe3ee; background: #fff; padding: 0 46px 0 42px; font-size: 14px; color: #0f172a; outline: none; transition: all 0.2s ease; box-sizing: border-box; }
        .input-wrap input:focus { border-color: #0ea5e9; box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.12); }
        
        /* Error UI Upgrades */
        .input-wrap.has-error input { border-color: #ef4444 !important; background-color: #fef2f2; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1); }
        .input-wrap.has-error .input-icon { color: #ef4444; }
        .error-message { color: #ef4444; font-size: 12.5px; font-weight: 700; margin-top: 4px; display: flex; align-items: center; gap: 4px; }
        
        .password-toggle { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 34px; height: 34px; border-radius: 10px; border: 1px solid rgba(148, 163, 184, 0.2); background: rgba(255, 255, 255, 0.92); display: grid; place-items: center; color: #475569; cursor: pointer; }
        .captcha-row { display: flex; gap: 10px; align-items: center; }
        .captcha-code { flex: 1; height: 50px; display: grid; place-items: center; border-radius: 14px; background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(79, 70, 229, 0.1)); border: 1px dashed rgba(14, 165, 233, 0.25); font-weight: 900; letter-spacing: 0.25em; color: #0f172a; user-select: none; }
        .captcha-refresh { width: 50px; height: 50px; border-radius: 14px; border: 1px solid rgba(148, 163, 184, 0.2); background: white; display: grid; place-items: center; color: #0ea5e9; cursor: pointer; }
        .login-primary-btn { border: 0; outline: none; min-height: 52px; border-radius: 14px; font-weight: 800; font-size: 15px; cursor: pointer; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; box-shadow: 0 10px 20px rgba(79, 70, 229, 0.2); display: flex; align-items: center; justify-content: center; gap: 8px; transition: transform 0.2s ease, opacity 0.2s ease; width: 100%; margin-top: 8px; }
        .login-primary-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .login-primary-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .divider { display: flex; align-items: center; gap: 12px; margin: 24px 0; color: #94a3b8; font-size: 11px; font-weight: 900; letter-spacing: 1.5px; }
        .divider::before, .divider::after { content: ""; height: 1px; flex: 1; background: #e2e8f0; }
        .google-wrapper { width: 100%; display: flex; justify-content: center; min-height: 44px; }
        
        @media (max-width: 480px) { .login-page { padding: 16px; } .login-card { padding: 24px; } }
      `}</style>
      
      <div className="login-card glass">
        <div className="login-top">
          <div className="login-logo">AI</div>
          <div className="login-title">
            <h2>Welcome</h2>
            <p>Secure authentication portal</p>
          </div>
        </div>

        <div className="auth-tabs">
          <button type="button" className={mode === "login" ? "tab active" : "tab"} onClick={() => { setMode("login"); setFieldErrors({}); }}>
            Login
          </button>
          <button type="button" className={mode === "signup" ? "tab active" : "tab"} onClick={() => { setMode("signup"); setFieldErrors({}); refreshCaptcha(); }}>
            Sign Up
          </button>
        </div>

        <h2>{title}</h2>
        <p>{subtitle}</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>Email Address</label>
            <div className={`input-wrap ${fieldErrors.email ? 'has-error' : ''}`}>
              <Mail className="input-icon" size={18} />
              <input 
                type="text" 
                placeholder="name@company.com" 
                value={email} 
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, email: "" }));
                }} 
              />
            </div>
            {fieldErrors.email && <span className="error-message">{fieldErrors.email}</span>}
          </div>

          <div className="field">
            <label>Password</label>
            <div className={`input-wrap ${fieldErrors.password ? 'has-error' : ''}`}>
              <Lock className="input-icon" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter password" 
                value={password} 
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, password: "" }));
                }} 
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {fieldErrors.password && <span className="error-message">{fieldErrors.password}</span>}
          </div>

          {mode === "signup" && (
            <>
              <div className="field">
                <label>Security Captcha</label>
                <div className="captcha-row">
                  <div className="captcha-code">{captcha}</div>
                  <button type="button" className="captcha-refresh" onClick={refreshCaptcha}>
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
              <div className="field">
                <div className={`input-wrap ${fieldErrors.captcha ? 'has-error' : ''}`}>
                  <input 
                    type="text" 
                    placeholder="Type the 6-character code" 
                    value={captchaInput} 
                    onChange={(e) => {
                      setCaptchaInput(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, captcha: "" }));
                    }} 
                  />
                </div>
                {fieldErrors.captcha && <span className="error-message">{fieldErrors.captcha}</span>}
              </div>
            </>
          )}

          <button className="login-primary-btn" disabled={loading}>
            {loading ? "Authenticating..." : mode === "login" ? "Secure Login" : "Create Account"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="divider">OR CONTINUE WITH</div>

        <div className="google-wrapper">
          <div ref={googleBtn} style={{ minHeight: '44px', display: 'flex', justifyContent: 'center' }}></div>
        </div>
      </div>
    </div>
  );
}