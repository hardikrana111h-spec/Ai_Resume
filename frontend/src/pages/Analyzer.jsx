import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api";
import {
  ArrowRight,
  FileText,
  Loader2,
  ScanSearch,
  Upload,
  Wand2,
  Bot,
  FileSearch,
  Sparkles,
} from "lucide-react";

const ROLE_OPTIONS = [
  "Frontend Developer",
  "React Developer",
  "Vue Developer",
  "Angular Developer",
  "JavaScript Developer",
  "TypeScript Developer",
  "Next.js Developer",
  "UI Developer",
  "Web Designer",
  "UI/UX Designer",
  "Graphic Designer",
  "Backend Developer",
  "Node.js Developer",
  "Express.js Developer",
  "Java Developer",
  "Spring Boot Developer",
  "Python Developer",
  "Django Developer",
  "Flask Developer",
  "PHP Developer",
  "Laravel Developer",
  "Full Stack Developer",
  "MERN Stack Developer",
  "Software Engineer",
  "Mobile App Developer",
  "Android Developer",
  "Flutter Developer",
  "React Native Developer",
  "AI Engineer",
  "Machine Learning Engineer",
  "Prompt Engineer",
  "Data Scientist",
  "DevOps Engineer",
  "Cloud Engineer",
  "Cyber Security Analyst",
  "Ethical Hacker",
  "QA Engineer",
  "Automation Tester",
  "Product Manager",
  "Business Analyst",
  "SEO Specialist",
  "Accountant",
  "Video Editor",
  "Mechanical Engineer",
  "Civil Engineer",
  "Doctor",
  "Teacher",
  "BCA Fresher",
  "MCA Fresher",
  "Intern",
];

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <path
        fill="currentColor"
        d="M11 5a1 1 0 0 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5z"
      />
    </svg>
  );
}

export default function Analyzer() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // --- Limit & Plan States ---
  const [user, setUser] = useState({ isLoggedIn: false, email: "" });
  const [remainingLimit, setRemainingLimit] = useState(null);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [isPlanExpired, setIsPlanExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [activePlan, setActivePlan] = useState({
    name: "",
    expiryDateStr: "",
    limit: "",
  });

  // --- UI States ---
  const [file, setFile] = useState(null);
  const [roleQuery, setRoleQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [progressStep, setProgressStep] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const session = localStorage.getItem("resume_app_user");
        if (session) {
          setUser(JSON.parse(session));
        }

        const res = await api.get("/api/user/plan-status");

        const plan = res.data.planData;

        setRemainingLimit(plan.remainingLimit);
        setTimeLeft({
          days: plan.daysLeft,
          hours: plan.hoursLeft,
          minutes: plan.minutesLeft,
          seconds: plan.secondsLeft,
        });

        setIsLimitReached(
          plan.remainingLimit !== "Unlimited" && plan.remainingLimit <= 0,
        );

        setIsPlanExpired(plan.daysLeft <= 0);

        setActivePlan({
          name: plan.planName,
          limit: plan.dailyLimit,
          expiryDateStr: new Date(plan.expiryDate).toLocaleDateString("en-GB"),
        });
      } catch (err) {
        console.error(err);
      }
    };

    loadPlan();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
          return prev;
        }

        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;

          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;

            if (hours > 0) {
              hours--;
            } else {
              hours = 23;

              if (days > 0) {
                days--;
              }
            }
          }
        }

        const nextTime = {
          days,
          hours,
          minutes,
          seconds,
        };

        if (
          nextTime.days === 0 &&
          nextTime.hours === 0 &&
          nextTime.minutes === 0 &&
          nextTime.seconds === 0
        ) {
          setIsPlanExpired(true);
        }

        return nextTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const filteredRoles = useMemo(() => {
    const query = roleQuery.trim().toLowerCase();
    if (!query) return ROLE_OPTIONS;
    return ROLE_OPTIONS.filter((role) => role.toLowerCase().includes(query));
  }, [roleQuery]);

  useEffect(() => {
    const exactMatch = ROLE_OPTIONS.find(
      (role) => role.toLowerCase() === roleQuery.trim().toLowerCase(),
    );
    if (exactMatch) setSelectedRole(exactMatch);
  }, [roleQuery]);

  useEffect(() => {
    if (!loading) {
      setProgressValue(0);
      setProgressStep(0);
      return;
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setProgressValue(progress);
      setProgressStep(Math.floor(progress / 25));
    }, 180);

    return () => clearInterval(interval);
  }, [loading]);

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setRoleQuery(role);
    setShowSuggestions(false);
    setError("");
  };

  const handleFileChange = (e) => {
    const chosen = e.target.files?.[0] || null;
    setFile(chosen);
    setUploadComplete(Boolean(chosen));
    setError("");
  };

  const analysisSteps = [
    {
      no: "01",
      title: "Upload Resume",
      desc: "Select PDF or DOCX",
      icon: Upload,
    },
    {
      no: "02",
      title: "Extract Resume",
      desc: "AI reads your resume",
      icon: FileText,
    },
    {
      no: "03",
      title: "ATS Analysis",
      desc: "Keyword & ATS Scan",
      icon: ScanSearch,
    },
    {
      no: "04",
      title: "Generate Report",
      desc: "Complete AI Report",
      icon: Wand2,
    },
  ];

  const openFilePicker = () => fileInputRef.current?.click();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // The button will now click, and these errors will properly show to the user!
    if (!user.isLoggedIn)
      return setError("Please log in to analyze your resume.");
    if (!selectedRole.trim())
      return setError("Please select a role from the list.");
    if (!file) return setError("Please upload resume.");
    if (!navigator.onLine)
      return setError(
        "Network issue detected. Please check your internet connection.",
      );

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("role", selectedRole);
      formData.append("userEmail", user.email);

      const res = await api.post("/api/resume/analyze", formData);

      // Sync Limits strictly from Backend and update LocalStorage
      const plan = res.data.planData;

      setRemainingLimit(plan.remainingLimit);

      setTimeLeft({
        days: plan.daysLeft,
        hours: plan.hoursLeft,
        minutes: plan.minutesLeft,
        seconds: plan.secondsLeft,
      });

      setActivePlan({
        name: plan.planName,
        limit: plan.dailyLimit,
        expiryDateStr: new Date(plan.expiryDate).toLocaleDateString("en-GB"),
      });

      setIsPlanExpired(false);

      setIsLimitReached(
        plan.remainingLimit !== "Unlimited" && plan.remainingLimit <= 0,
      );
      if (plan.remainingLimit !== "Unlimited" && plan.remainingLimit <= 0) {
        setIsLimitReached(true);
      }
      // if (res.data?.remainingLimit !== undefined) {
      //   savedPlan.remainingLimit = res.data.remainingLimit;
      //   savedPlan.dailyLimit = res.data.dailyLimit;
      //   savedPlan.todayUsed = res.data.dailyLimit - res.data.remainingLimit;
      //   localStorage.setItem("user_plan_data", JSON.stringify(savedPlan));

      //   setRemainingLimit(res.data.remainingLimit);
      //   setActivePlan((prev) => ({ ...prev, limit: res.data.dailyLimit }));

      //   if (res.data.remainingLimit <= 0) {
      //     setIsLimitReached(true);
      //     Swal.fire({
      //       icon: "warning",
      //       title: "Daily Limit Reached",
      //       html: `<b>You have used all today's analyses.</b><br><br>Upgrade your plan or come back tomorrow.`,
      //       confirmButtonText: "View Plans",
      //       confirmButtonColor: "#2563eb",
      //       allowOutsideClick: false,
      //     }).then(() => navigate("/pricing"));
      //     setLoading(false);
      //     return;
      //   }
      // }

      const reportId =
        res.data?.data?.reportId || res.data?.report?._id || res.data?.reportId;
      if (!reportId) {
        setError("Report ID not returned.");
        setLoading(false);
        return;
      }

      setProgressValue(100);
      setProgressStep(3);

      await new Promise((r) => setTimeout(r, 1200));

      Swal.fire({
        icon: "success",
        title: "Analysis Complete",
        text: "Opening your report...",
        timer: 1200,
        showConfirmButton: false,
      });

      setTimeout(() => navigate(`/report/${reportId}`), 1200);
    } catch (err) {
      if (err.response?.data?.planExpired) {
        setIsPlanExpired(true);
        Swal.fire({
          icon: "warning",
          title: "Plan Expired",
          html: `<b>Please upgrade your plan to continue using our services.</b><br><br>Upgrade your plan for more analyses.`,
          confirmButtonText: "View Plans",
          confirmButtonColor: "#2563eb",
          allowOutsideClick: false,
        }).then(() => navigate("/pricing"));
      } else if (
        err.response?.status === 403 ||
        err.response?.data?.limitReached
      ) {
        setIsLimitReached(true);
        Swal.fire({
          icon: "warning",
          title: "Daily Limit Reached",
          html: `<b>Your daily limit is finished.</b><br><br>Upgrade your plan for more analyses.`,
          confirmButtonText: "Upgrade Plan",
          confirmButtonColor: "#2563eb",
          allowOutsideClick: false,
        }).then(() => navigate("/pricing"));
      } else {
        setError(err.response?.data?.message || "Analysis failed");
      }
      setLoading(false);
      setProgressValue(0);
      setProgressStep(0);
    }
  };

  // FIX: We only disable the button if it's currently loading.
  // Let `handleSubmit` catch the other errors (missing file, not logged in) so user knows what's wrong.
  const canAnalyze = !loading;

  return (
    <div className="analyze-page">
      <style>{`
        .analyze-page { width: 100%; display: grid; gap: 24px; }
        .analyze-hero { padding: 30px; border-radius: 28px; display: flex; justify-content: space-between; gap: 20px; align-items: center; flex-wrap: wrap; }
        .analyze-hero h1 { margin: 10px 0 8px; font-size: clamp(30px, 4vw, 52px); line-height: 1.05; font-weight: 900; letter-spacing: -0.04em; color: #0f172a; }
        .analyze-hero p { margin: 0; color: #64748b; line-height: 1.7; max-width: 760px; }
        .analyze-hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 999px; background: rgba(14, 165, 233, 0.12); color: #0284c7; font-weight: 900; font-size: 13px; }
        .analyze-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 24px; align-items: start; }
        
        .analyze-card { padding: 30px; border-radius: 28px; min-width: 0; position: relative; overflow: hidden; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); border: 1px solid #e2e8f0; }
        .analyze-side { padding: 30px; border-radius: 28px; min-width: 0; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); border: 1px solid #e2e8f0; }
        .analyze-card h2, .analyze-side h2 { margin: 0 0 12px; color: #0f172a; font-size: 24px; font-weight: 900; }
        .analyze-subtext { margin: 0 0 22px; color: #64748b; line-height: 1.7; }
        .analyze-form { display: grid; gap: 22px; }
        .field-group { display: grid; gap: 10px; }
        .field-group label { font-size: 15px; font-weight: 900; color: #334155; }
        
        .search-field-wrap { position: relative; }
        .search-field-wrap input { height: 58px; padding: 0 18px; font-size: 15px; font-weight: 700; border-radius: 16px; width: 100%; box-sizing: border-box; border: 1px solid #cbd5e1; }
        .search-dropdown { position: absolute; top: calc(100% + 10px); left: 0; right: 0; max-height: 320px; overflow-y: auto; background: #fff; border: 1px solid #e2e8f0; box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08); z-index: 50; border-radius: 18px; padding: 8px; }
        .search-option { width: 100%; text-align: left; background: #fff; padding: 13px 14px; border-radius: 12px; font-size: 14px; font-weight: 700; color: #1e293b; border: none; }
        .search-option:hover { background: #eef2ff; color: #0284c7; cursor: pointer; }
        .selected-role-chip { display: flex; align-items: center; gap: 8px; min-height: 52px; padding: 14px 16px; background: #f8fafc; border: 1px solid #e2e8f0; font-size: 14px; font-weight: 700; color: #334155; border-radius: 16px; }
        
        .plan-status-banner { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; padding: 18px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; margin-bottom: 24px; }
        .plan-card { display: flex; flex-direction: column; gap: 4px; }
        .plan-label { font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; }
        .plan-card h3 { margin: 0; font-size: 18px; color: #0f172a; font-weight: 900; }
        .status.active { font-size: 12px; color: #10b981; font-weight: bold; }
        
        @media (max-width: 1024px) { .plan-status-banner { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .plan-status-banner { grid-template-columns: 1fr; } }
        
        .upload-scene { position: relative; overflow: hidden; min-height: 280px; border-radius: 24px; border: 2px dashed #94a3b8; background: #f8fafc; display: grid; place-items: center; text-align: center; padding: 24px; cursor: pointer; transition: all 0.2s ease; }
        .upload-scene:hover { border-color: #3b82f6; background: #eff6ff; }
        .upload-idle, .upload-flow { position: relative; z-index: 2; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .upload-plus-icon { width: 78px; height: 78px; border-radius: 22px; display: grid; place-items: center; background: #3b82f6; color: #fff; box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3); }
        .upload-title strong { font-size: 20px; color: #0f172a; display: block; }
        .upload-title span { color: #64748b; font-size: 14px; font-weight: 600; }
        
        .resume-card { padding: 20px; background: white; border-radius: 16px; border: 1px solid #e2e8f0; width: 100%; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .resume-icon { color: #3b82f6; margin-bottom: 8px; }
        .resume-card h3 { margin: 0 0 4px; font-size: 16px; color: #0f172a; }
        .resume-card p { margin: 0; font-size: 13px; color: #10b981; font-weight: bold; }
        .ai-card { margin-top: 16px; padding: 20px; background: #eef2ff; border-radius: 16px; border: 1px solid #c7d2fe; width: 100%; }
        .ai-card h3 { margin: 0 0 8px; color: #4338ca; font-size: 16px; }
        .typing { color: #4f46e5; font-size: 14px; font-weight: 600; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }

        .limit-overlay { position: absolute; inset: 0; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; z-index: 10; padding: 2rem; }
        .limit-icon { font-size: 4rem; margin-bottom: 1rem; }
        .upgrade-btn { margin-top: 1.5rem; padding: 1rem 2rem; border: none; border-radius: 999px; background: #3b82f6; color: white; font-weight: bold; font-size: 1.1rem; cursor: pointer; transition: 0.2s; }
        .upgrade-btn:hover { background: #2563eb; transform: scale(1.05); }

        .error-box { padding: 14px; border-radius: 12px; background: #fee2e2; color: #b91c1c; border: 1px solid #f87171; font-weight: 600; text-align: center; }
        .warning-box { padding: 12px; margin: 15px 0; background: #fff7ed; border: 1px solid #fdba74; border-radius: 12px; color: #9a3412; font-weight: 600; text-align: center; }
        
        .analysis-timeline { display: flex; flex-direction: column; gap: 20px; margin-top: 20px; }
        .timeline-item { display: flex; gap: 16px; opacity: 0.5; transition: 0.3s; }
        .timeline-item.active { opacity: 1; }
        .timeline-circle { width: 40px; height: 40px; border-radius: 50%; background: #f1f5f9; color: #64748b; display: grid; place-items: center; }
        .timeline-item.active .timeline-circle { background: #3b82f6; color: white; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4); }
        .timeline-content h3 { margin: 0 0 4px; font-size: 16px; color: #0f172a; }
        .timeline-content p { margin: 0; font-size: 14px; color: #64748b; }
        
        @media (max-width: 1100px) { .analyze-grid { grid-template-columns: 1fr; } }
      `}</style>

      <section className="analyze-hero glass">
        <div>
          <span className="analyze-hero-badge">
            <Bot size={14} /> AI Resume Analysis
          </span>
          <h1>Upload resume and generate a smart report</h1>
          <p>
            Search and select a role, upload a resume, and get a detailed ATS +
            AI analysis.
          </p>
        </div>
      </section>

      <div className="analyze-grid">
        <section className="analyze-card glass">
          {/* Lock Overlay only shows if limit is reached or expired */}
          {(isLimitReached || remainingLimit === 0 || isPlanExpired) && (
            <div className="limit-overlay">
              <div className="limit-icon">🔒</div>
              {isPlanExpired ? (
                <>
                  <h2 style={{ margin: "0 0 10px 0", color: "#0f172a" }}>
                    Plan Expired
                  </h2>
                  <p
                    style={{
                      color: "#475569",
                      lineHeight: "1.6",
                      maxWidth: "80%",
                    }}
                  >
                    Your {activePlan.name || "current"} plan validity has ended.
                    Please renew to continue.
                  </p>
                </>
              ) : activePlan.name === "Free Trial" ? (
                <>
                  <h2 style={{ margin: "0 0 10px 0", color: "#0f172a" }}>
                    Daily Limit Reached
                  </h2>
                  <p
                    style={{
                      color: "#475569",
                      lineHeight: "1.6",
                      maxWidth: "80%",
                    }}
                  >
                    You reached your limit of{" "}
                    <strong>{activePlan.limit} resumes/day</strong> on the Free
                    Trial.
                  </p>
                </>
              ) : (
                <>
                  <h2 style={{ margin: "0 0 10px 0", color: "#0f172a" }}>
                    Limit Reached
                  </h2>
                  <p
                    style={{
                      color: "#475569",
                      lineHeight: "1.6",
                      maxWidth: "80%",
                    }}
                  >
                    You have used all available analyses. Upgrade your plan to
                    unlock more!
                  </p>
                </>
              )}
              <button
                className="upgrade-btn"
                onClick={() => navigate("/pricing")}
              >
                🚀 View Pricing Plans
              </button>
            </div>
          )}

          {activePlan.name && !isPlanExpired && (
            <div className="plan-status-banner">
              <div className="plan-card">
                <span className="plan-label">Current Plan</span>
                <h3>{activePlan.name}</h3>
                <span className="status active">🟢 Active</span>
              </div>
              <div className="plan-card">
                <span className="plan-label">Today's Usage</span>
                <h3>
                  {remainingLimit === "Unlimited"
                    ? "Unlimited"
                    : `${activePlan.limit - remainingLimit}/${activePlan.limit}`}
                </h3>
              </div>
              <div className="plan-card">
                <span className="plan-label">Remaining</span>
                <h3>
                  {remainingLimit === "Unlimited"
                    ? "∞ Unlimited"
                    : remainingLimit}
                </h3>
              </div>
              <div className="plan-card">
                <span className="plan-label">Days Left</span>
                <h3>
                  {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
                  {timeLeft.seconds}s
                </h3>
              </div>
            </div>
          )}

          <h2>Analyze your resume</h2>
          <form onSubmit={handleSubmit} className="analyze-form">
            <div className="field-group">
              <label>Target Role</label>
              <div className="search-field-wrap">
                <input
                  type="text"
                  value={roleQuery}
                  placeholder="Search and select a role..."
                  onChange={(e) => {
                    setRoleQuery(e.target.value);
                    setSelectedRole("");
                    setShowSuggestions(true);
                    setError("");
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 150)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const exactMatch = ROLE_OPTIONS.find(
                        (role) =>
                          role.toLowerCase() === roleQuery.trim().toLowerCase(),
                      );
                      if (exactMatch) handleSelectRole(exactMatch);
                    }
                  }}
                />
                {showSuggestions && filteredRoles.length > 0 && (
                  <div className="search-dropdown glass">
                    {filteredRoles.map((role) => (
                      <button
                        key={role}
                        type="button"
                        className="search-option"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectRole(role);
                        }}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="selected-role-chip">
                Selected: <strong>{selectedRole || " None selected"}</strong>
              </div>
            </div>

            <div className="field-group">
              <label>Upload Resume</label>
              <div
                className={`upload-scene ${uploadComplete ? "has-file" : ""} ${loading ? "is-scanning" : ""}`}
                role="button"
                tabIndex={0}
                onClick={openFilePicker}
              >
                {!file && !loading && (
                  <div className="upload-idle">
                    <div className="upload-plus-icon">
                      <PlusIcon />
                    </div>
                    <div className="upload-title">
                      <strong>Upload Resume</strong>
                      <span>PDF or DOCX supported</span>
                    </div>
                  </div>
                )}
                {file && !loading && (
                  <div className="upload-flow">
                    <div className="scan-card">
                      <div className="scan-header">
                        <FileSearch size={18} />
                        Resume Ready
                      </div>

                      <div className="resume-lines">
                        <div className="resume-line"></div>
                        <div className="resume-line"></div>
                        <div className="resume-line"></div>
                        <div className="resume-line"></div>
                        <div className="resume-line"></div>
                      </div>

                      <div className="scanner"></div>
                    </div>

                    <div className="ai-thinking">
                      <Sparkles size={18} />
                      AI Scanner Ready...
                    </div>

                    <div className="resume-card">
                      <div className="resume-icon">
                        <FileText size={34} />
                      </div>

                      <h3>{file.name}</h3>

                      <p>Resume Uploaded Successfully</p>
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>

            {error && <div className="error-box">{error}</div>}

            {remainingLimit === 1 && !isLimitReached && !isPlanExpired && (
              <div className="warning-box">
                ⚠️ This is your <strong>last analysis</strong> available today!
              </div>
            )}

            <button
              className="primary-btn full-btn"
              style={{
                width: "100%",
                padding: "1.2rem",
                border: "none",
                borderRadius: "12px",
                backgroundColor: "#0f172a",
                color: "white",
                fontWeight: "700",
                fontSize: "1.2rem",
                cursor: canAnalyze ? "pointer" : "not-allowed",
              }}
              disabled={!canAnalyze}
            >
              {loading ? (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <Loader2 size={20} className="spin" /> Processing...{" "}
                  {progressValue}%
                </span>
              ) : (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  Analyze Resume <ArrowRight size={18} />
                </span>
              )}
            </button>
          </form>
        </section>

        <aside className="analyze-side glass">
          <h2>AI Analysis Pipeline</h2>
          <p className="analyze-subtext">
            Your resume passes through our intelligent AI engine before
            generating the final report.
          </p>

          <div className="analysis-timeline">
            {analysisSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  className={`timeline-item ${loading && progressStep >= index ? "active" : ""}`}
                  key={step.no}
                >
                  <div className="timeline-circle">
                    <Icon size={20} />
                  </div>
                  <div className="timeline-content">
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
