import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

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

  const [file, setFile] = useState(null);
  const [roleQuery, setRoleQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [showNetworkSkeleton, setShowNetworkSkeleton] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const [progressValue, setProgressValue] = useState(0);
  const [progressStep, setProgressStep] = useState(0);

  const filteredRoles = useMemo(() => {
    const query = roleQuery.trim().toLowerCase();
    if (!query) return ROLE_OPTIONS;
    return ROLE_OPTIONS.filter((role) => role.toLowerCase().includes(query));
  }, [roleQuery]);

  useEffect(() => {
    const exactMatch = ROLE_OPTIONS.find(
      (role) => role.toLowerCase() === roleQuery.trim().toLowerCase()
    );

    if (exactMatch) {
      setSelectedRole(exactMatch);
    }
  }, [roleQuery]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowNetworkSkeleton(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowNetworkSkeleton(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    let timer1;
    let timer2;
    let timer3;

    if (loading) {
      setProgressValue(12);
      setProgressStep(0);

      timer1 = setTimeout(() => {
        setProgressValue(48);
        setProgressStep(1);
      }, 2500);

      timer2 = setTimeout(() => {
        setProgressValue(82);
        setProgressStep(2);
      }, 7000);

      timer3 = setTimeout(() => {
        setProgressValue(96);
      }, 10000);
    } else {
      setProgressValue(0);
      setProgressStep(0);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
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
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowNetworkSkeleton(false);

    if (!selectedRole.trim()) {
      setError("Please select a role from the list.");
      return;
    }

    if (!file) {
      setError("Please upload resume.");
      return;
    }

    if (!navigator.onLine) {
      setIsOffline(true);
      setShowNetworkSkeleton(true);
      setError("Network issue detected. Please check your internet connection.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);
      formData.append("role", selectedRole);

      const res = await api.post("/api/resume/analyze", formData);

      const reportId =
        res.data?.data?.reportId ||
        res.data?.report?._id ||
        res.data?.reportId;

      if (!reportId) {
        setError("Report ID not returned.");
        setLoading(false);
        return;
      }

      setProgressValue(100);
      setProgressStep(2);

      setTimeout(() => {
        setLoading(false);
        navigate(`/report/${reportId}`);
      }, 450);
    } catch (err) {
      if (!err.response) {
        setIsOffline(true);
        setShowNetworkSkeleton(true);
        setError("Network issue detected. Please check your internet connection.");
      } else {
        setError(err.response?.data?.message || "Analysis failed");
      }

      setLoading(false);
      setProgressValue(0);
      setProgressStep(0);
    }
  };

  return (
    <div className="analyze-page">
      <div className="analyze-grid">
        <section className="analyze-card glass">
          <span className="hero-badge">Resume Analysis</span>

          <h1 className="hero-title" style={{ fontSize: 42 }}>
            Upload resume and generate a smart report
          </h1>

          <p className="hero-sub">
            Search and select role, upload resume and get detailed AI analysis.
          </p>

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
                  onBlur={() => {
                    setTimeout(() => {
                      setShowSuggestions(false);
                    }, 150);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const exactMatch = ROLE_OPTIONS.find(
                        (role) =>
                          role.toLowerCase() === roleQuery.trim().toLowerCase()
                      );

                      if (exactMatch) {
                        handleSelectRole(exactMatch);
                      }
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
                className="upload-plus-box"
                onClick={() =>
                  document.getElementById("resumeFileInput")?.click()
                }
              >
                <div className="upload-plus-icon">
                  <PlusIcon />
                </div>

                <div className="upload-plus-copy">
                  <strong>{file ? file.name : "Choose or upload file"}</strong>
                  <span>PDF or DOCX supported</span>
                </div>
              </div>

              <input
                id="resumeFileInput"
                type="file"
                accept=".pdf,.docx"
                hidden
                onChange={handleFileChange}
              />
            </div>

            {error && <div className="error-box">{error}</div>}

            <button className="primary-btn full-btn" disabled={loading}>
              {loading ? "Analyzing Resume..." : "Analyze Resume"}
            </button>

            {loading && (
              <div className="big-progress-card glass" style={{ marginTop: 14 }}>
                <div className="big-progress-top">
                  <div>
                    <h3>
                      {progressStep === 0 && "Uploading successfully"}
                      {progressStep === 1 && "AI Analyze"}
                      {progressStep === 2 && "Report on the way"}
                    </h3>

                    <p>
                      {progressStep === 0 && "Resume uploaded successfully..."}
                      {progressStep === 1 && "AI is analyzing ATS score and skills..."}
                      {progressStep === 2 && "Generating final report..."}
                    </p>
                  </div>

                  <div className="big-progress-percent">{progressValue}%</div>
                </div>

                <div className="big-progress-bar">
                  <div
                    className="big-progress-fill"
                    style={{ width: `${progressValue}%` }}
                  />
                </div>

                <div className="big-progress-steps">
                  <div className={`big-step ${progressStep >= 0 ? "active" : ""}`}>
                    <div className="step-dot" />
                    <span>Uploading successfully</span>
                  </div>

                  <div className={`big-step ${progressStep >= 1 ? "active" : ""}`}>
                    <div className="step-dot" />
                    <span>AI Analyze</span>
                  </div>

                  <div className={`big-step ${progressStep >= 2 ? "active" : ""}`}>
                    <div className="step-dot" />
                    <span>Report on the way</span>
                  </div>
                </div>
              </div>
            )}

            {showNetworkSkeleton && isOffline && (
              <div className="big-progress-card glass" style={{ marginTop: 14 }}>
                <div className="big-progress-top">
                  <div>
                    <h3>Network issue detected</h3>
                    <p>Please check your internet connection and try again.</p>
                  </div>
                </div>

                <div className="big-progress-bar">
                  <div
                    className="big-progress-fill"
                    style={{ width: "35%" }}
                  />
                </div>

                <div className="big-progress-steps">
                  <div className="big-step active">
                    <div className="step-dot" />
                    <span>Checking connection</span>
                  </div>

                  <div className="big-step">
                    <div className="step-dot" />
                    <span>Waiting for network</span>
                  </div>
                </div>
              </div>
            )}
          </form>
        </section>

        <aside className="analyze-side glass">
          <h2>What this analysis includes</h2>

          <div className="analyze-feature-list">
            <div className="analyze-feature-item">
              ATS score for selected role
            </div>

            <div className="analyze-feature-item">
              Strengths and weaknesses
            </div>

            <div className="analyze-feature-item">
              Missing skills and keywords
            </div>

            <div className="analyze-feature-item">
              Improved summary
            </div>

            <div className="analyze-feature-item">
              Interview questions
            </div>

            <div className="analyze-feature-item">
              Action plan and growth points
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}