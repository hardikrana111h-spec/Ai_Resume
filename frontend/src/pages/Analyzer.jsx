import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
  ArrowRight,
  AlertTriangle,
  BadgeCheck,
  Bot,
  Briefcase,
  CheckCircle2,
  CircleDot,
  FileText,
  Loader2,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Upload,
  Wand2,
  Zap,
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

  const [uploadComplete, setUploadComplete] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

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
      setIsScanning(true);
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
      setIsScanning(false);
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
    setUploadComplete(Boolean(chosen));
    setError("");
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
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
      setIsScanning(false);
    }
  };

  const analysisSteps = [
    {
      no: "01",
      title: "Upload resume",
      desc: "Select PDF or DOCX and attach it for deep analysis.",
      icon: Upload,
    },
    {
      no: "02",
      title: "Extract text",
      desc: "We read the document and prepare it for AI review.",
      icon: FileText,
    },
    {
      no: "03",
      title: "ATS analysis",
      desc: "The engine checks keywords, structure, and role alignment.",
      icon: ScanSearch,
    },
    {
      no: "04",
      title: "Generate report",
      desc: "You get score, strengths, weaknesses, and action items.",
      icon: Wand2,
    },
  ];

  const insightCards = [
    {
      icon: BadgeCheck,
      title: "ATS Compatibility",
      desc: "Score your resume against recruiter-friendly structure.",
    },
    {
      icon: Bot,
      title: "AI Suggestions",
      desc: "Get stronger summary, skills, and project improvements.",
    },
    {
      icon: ShieldCheck,
      title: "Private Reports",
      desc: "All reports stay tied to the logged-in user account.",
    },
    {
      icon: Zap,
      title: "Fast Workflow",
      desc: "Smooth upload, progress feedback, and clear navigation.",
    },
  ];

  return (
    <div className="analyze-page">
      <style>{`
        .analyze-page {
          width: 100%;
          display: grid;
          gap: 24px;
        }

        .analyze-hero {
          padding: 30px;
          border-radius: 28px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: center;
          flex-wrap: wrap;
        }

        .analyze-hero h1 {
          margin: 10px 0 8px;
          font-size: clamp(30px, 4vw, 52px);
          line-height: 1.05;
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #0f172a;
        }

        .analyze-hero p {
          margin: 0;
          color: #64748b;
          line-height: 1.7;
          max-width: 760px;
        }

        .analyze-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(14, 165, 233, 0.12);
          color: #0284c7;
          font-weight: 900;
          font-size: 13px;
        }

        .analyze-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 24px;
          align-items: start;
        }

        .analyze-card,
        .analyze-side {
          padding: 30px;
          border-radius: 28px;
          min-width: 0;
        }

        .analyze-card h2,
        .analyze-side h2 {
          margin: 0 0 12px;
          color: #0f172a;
          font-size: 24px;
          font-weight: 900;
        }

        .analyze-subtext {
          margin: 0 0 22px;
          color: #64748b;
          line-height: 1.7;
        }

        .analyze-form {
          display: grid;
          gap: 22px;
        }

        .field-group {
          display: grid;
          gap: 10px;
        }

        .field-group label {
          font-size: 15px;
          font-weight: 900;
          color: #334155;
        }

        .search-field-wrap {
          position: relative;
        }

        .search-field-wrap input {
          height: 58px;
          padding: 0 18px;
          font-size: 15px;
          font-weight: 700;
          border-radius: 16px;
        }

        .search-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          left: 0;
          right: 0;
          max-height: 320px;
          overflow-y: auto;
          background: #fff;
          border: 1px solid rgba(148, 163, 184, 0.14);
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
          z-index: 50;
          border-radius: 18px;
          padding: 8px;
        }

        .search-option {
          width: 100%;
          text-align: left;
          background: #fff;
          padding: 13px 14px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
        }

        .search-option:hover {
          background: #eef2ff;
          color: #0284c7;
        }

        .selected-role-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          min-height: 52px;
          padding: 14px 16px;
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.08), rgba(79, 70, 229, 0.08));
          border: 1px solid rgba(14, 165, 233, 0.14);
          font-size: 14px;
          font-weight: 700;
          color: #334155;
          border-radius: 16px;
        }

        .selected-role-chip strong {
          color: #0284c7;
        }

        .upload-scene {
          position: relative;
          overflow: hidden;
          min-height: 280px;
          border-radius: 24px;
          border: 2px dashed rgba(14, 165, 233, 0.22);
          background:
            radial-gradient(circle at top right, rgba(14, 165, 233, 0.08), transparent 24%),
            radial-gradient(circle at bottom left, rgba(79, 70, 229, 0.08), transparent 24%),
            #fff;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 24px;
          cursor: pointer;
          transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
          user-select: none;
        }

        .upload-scene:hover {
          transform: translateY(-2px);
          border-color: #0ea5e9;
          box-shadow: 0 20px 45px rgba(14, 165, 233, 0.08);
        }

        .upload-scene::before {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-120%);
          background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.72), transparent);
          animation: uploadShine 3.2s linear infinite;
          pointer-events: none;
        }

        .upload-idle,
        .upload-flow,
        .upload-scan-stage {
          position: relative;
          z-index: 2;
          width: 100%;
          display: grid;
          gap: 16px;
          justify-items: center;
        }

        .upload-plus-icon {
          width: 78px;
          height: 78px;
          border-radius: 22px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #0ea5e9, #4f46e5);
          color: #fff;
          box-shadow: 0 18px 35px rgba(14, 165, 233, 0.24);
          animation: floatBadge 4.8s ease-in-out infinite;
        }

        .upload-title {
          display: grid;
          gap: 4px;
        }

        .upload-title strong {
          font-size: 20px;
          color: #0f172a;
        }

        .upload-title span {
          color: #64748b;
          font-size: 14px;
          font-weight: 600;
        }

        .upload-chip-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .upload-chip {
          padding: 9px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(226, 232, 240, 0.95);
          font-size: 13px;
          font-weight: 800;
          color: #334155;
        }

        .upload-flow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          flex-wrap: wrap;
        }

        .upload-file-card {
          width: 186px;
          min-height: 128px;
          border-radius: 22px;
          background: #fff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
          display: grid;
          place-items: center;
          padding: 16px;
          animation: floatCard 4.8s ease-in-out infinite;
        }

        .upload-file-icon {
          width: 56px;
          height: 56px;
          border-radius: 18px;
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(79, 70, 229, 0.12));
          display: grid;
          place-items: center;
          margin-bottom: 10px;
          color: #0284c7;
          font-size: 24px;
        }

        .upload-file-card strong {
          font-size: 14px;
          color: #0f172a;
          text-align: center;
          word-break: break-word;
        }

        .upload-file-card span {
          margin-top: 4px;
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
        }

        .flow-arrow {
          width: 86px;
          display: grid;
          justify-items: center;
          gap: 10px;
          color: #0ea5e9;
        }

        .flow-arrow .arrow-line {
          width: 100%;
          height: 4px;
          border-radius: 999px;
          background: repeating-linear-gradient(
            90deg,
            #0ea5e9,
            #0ea5e9 10px,
            transparent 10px,
            transparent 20px
          );
          animation: moveArrow 0.8s linear infinite;
        }

        .flow-arrow .arrow-tip {
          width: 14px;
          height: 14px;
          border-right: 4px solid #0ea5e9;
          border-top: 4px solid #0ea5e9;
          transform: rotate(45deg);
          margin-top: -3px;
        }

        .ai-engine-card {
          width: 186px;
          min-height: 128px;
          border-radius: 22px;
          background: linear-gradient(135deg, #0ea5e9, #4f46e5);
          color: white;
          display: grid;
          place-items: center;
          padding: 16px;
          box-shadow: 0 18px 40px rgba(14, 165, 233, 0.22);
          position: relative;
          overflow: hidden;
          animation: floatCard 4.8s ease-in-out infinite;
        }

        .ai-engine-card::before {
          content: "";
          position: absolute;
          inset: 10px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.16);
        }

        .ai-engine-card .engine-inner {
          position: relative;
          z-index: 1;
          display: grid;
          justify-items: center;
          gap: 8px;
        }

        .engine-orb {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,255,255,0.18) 65%, transparent 66%);
          box-shadow:
            0 0 0 10px rgba(255,255,255,0.08),
            0 0 0 20px rgba(255,255,255,0.05);
          animation: pulseOrb 1.8s ease-in-out infinite;
        }

        .ai-engine-card strong {
          font-size: 15px;
          letter-spacing: 0.03em;
        }

        .ai-engine-card span {
          font-size: 12px;
          opacity: 0.92;
          font-weight: 600;
        }

        .scan-stage {
          width: min(420px, 100%);
          display: grid;
          gap: 16px;
          justify-items: center;
        }

        .scan-paper {
          width: 260px;
          height: 340px;
          border-radius: 24px;
          background: #fff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
          position: relative;
          overflow: hidden;
        }

        .scan-paper::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 18% 14%, rgba(14, 165, 233, 0.10), transparent 26%),
            radial-gradient(circle at 82% 12%, rgba(79, 70, 229, 0.10), transparent 24%);
        }

        .scan-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, rgba(14, 165, 233, 0), #22c55e, rgba(14, 165, 233, 0));
          box-shadow: 0 0 18px rgba(34, 197, 94, 0.55);
          animation: scanDoc 1.6s linear infinite;
          z-index: 2;
        }

        .scan-row {
          height: 10px;
          margin: 18px;
          border-radius: 999px;
          background: linear-gradient(90deg, #e2e8f0, #cbd5e1);
          opacity: 0.95;
        }

        .scan-title {
          display: grid;
          gap: 4px;
          text-align: center;
        }

        .scan-title strong {
          font-size: 18px;
          color: #0f172a;
        }

        .scan-title span {
          color: #64748b;
          font-size: 13px;
          font-weight: 700;
        }

        .progress-card {
          margin-top: 14px;
          padding: 24px;
          display: grid;
          gap: 22px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          overflow: hidden;
          border-radius: 24px;
        }

        .progress-top {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: flex-start;
        }

        .progress-top h3 {
          margin: 0;
          font-size: 24px;
          font-weight: 900;
          color: #0f172a;
        }

        .progress-top p {
          margin: 8px 0 0;
          color: #64748b;
          line-height: 1.7;
          font-weight: 600;
        }

        .progress-percent {
          min-width: 92px;
          height: 92px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #0ea5e9, #4f46e5);
          color: #fff;
          font-size: 24px;
          font-weight: 900;
          border-radius: 999px;
          box-shadow: 0 18px 35px rgba(14, 165, 233, 0.18);
        }

        .progress-bar {
          height: 18px;
          background: rgba(148, 163, 184, 0.16);
          overflow: hidden;
          position: relative;
          border-radius: 999px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0ea5e9, #4f46e5, #7c3aed);
          transition: width 0.5s ease;
          position: relative;
          border-radius: 999px;
        }

        .progress-fill::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45), transparent);
          animation: progressGlow 1.2s linear infinite;
        }

        .progress-steps {
          display: grid;
          gap: 14px;
        }

        .big-step {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
          background: rgba(248, 250, 252, 0.86);
          border: 1px solid rgba(148, 163, 184, 0.12);
          color: #64748b;
          font-weight: 700;
          transition: transform 0.22s ease, background 0.22s ease, border-color 0.22s ease;
          border-radius: 18px;
        }

        .big-step.active {
          background: rgba(14, 165, 233, 0.08);
          color: #0f172a;
          border-color: rgba(14, 165, 233, 0.2);
        }

        .step-dot {
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: #cbd5e1;
          transition: 0.25s ease;
          flex: 0 0 auto;
        }

        .big-step.active .step-dot {
          background: #0ea5e9;
          box-shadow: 0 0 0 6px rgba(14, 165, 233, 0.12);
        }

        .error-box,
        .success-box,
        .info-box {
          padding: 14px 16px;
          border-radius: 16px;
          line-height: 1.55;
          font-weight: 700;
        }

        .error-box {
          background: rgba(254, 226, 226, 0.9);
          color: #b91c1c;
          border: 1px solid rgba(248, 113, 113, 0.18);
        }

        .success-box {
          background: rgba(220, 252, 231, 0.9);
          color: #166534;
          border: 1px solid rgba(34, 197, 94, 0.16);
        }

        .info-box {
          background: rgba(239, 246, 255, 0.92);
          color: #1d4ed8;
          border: 1px solid rgba(96, 165, 250, 0.2);
        }

        .analyze-side {
          display: grid;
          gap: 18px;
          align-content: start;
        }

        .analyze-side-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .insight-card {
          padding: 18px;
          border-radius: 22px;
          background: #fff;
          border: 1px solid rgba(226, 232, 240, 0.92);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .insight-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
        }

        .insight-icon {
          width: 50px;
          height: 50px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(79, 70, 229, 0.12));
          color: #0284c7;
          margin-bottom: 12px;
        }

        .insight-card h3 {
          margin: 0 0 8px;
          font-size: 18px;
          color: #0f172a;
        }

        .insight-card p {
          margin: 0;
          color: #64748b;
          line-height: 1.7;
        }

        .analysis-flow {
          display: grid;
          gap: 14px;
        }

        .flow-step {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          padding: 16px 18px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.86);
          border: 1px solid rgba(226, 232, 240, 0.92);
        }

        .flow-step.active {
          background: rgba(14, 165, 233, 0.08);
          border-color: rgba(14, 165, 233, 0.18);
        }

        .flow-dot {
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: #cbd5e1;
          flex-shrink: 0;
          margin-top: 5px;
        }

        .flow-step.active .flow-dot {
          background: #0ea5e9;
          box-shadow: 0 0 0 6px rgba(14, 165, 233, 0.12);
        }

        .flow-step strong {
          display: block;
          color: #0f172a;
          font-size: 15px;
        }

        .flow-step span {
          display: block;
          margin-top: 4px;
          color: #64748b;
          line-height: 1.6;
          font-size: 13px;
        }

        .live-tip {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 16px 18px;
          border-radius: 20px;
          background: rgba(239, 246, 255, 0.88);
          border: 1px solid rgba(96, 165, 250, 0.18);
          color: #1d4ed8;
          font-weight: 700;
          line-height: 1.65;
        }

        .live-tip svg {
          flex-shrink: 0;
          margin-top: 2px;
        }

        @keyframes floatBadge {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes floatCard {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes uploadShine {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(120%);
          }
        }

        @keyframes moveArrow {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 40px 0;
          }
        }

        @keyframes scanDoc {
          0% {
            top: 0;
          }
          100% {
            top: 100%;
          }
        }

        @keyframes progressGlow {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(220%);
          }
        }

        @keyframes pulseOrb {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.95;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        .spin {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1100px) {
          .analyze-grid {
            grid-template-columns: 1fr;
          }

          .analyze-side-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .analyze-hero,
          .analyze-card,
          .analyze-side {
            padding: 18px;
            border-radius: 22px;
          }

          .analyze-card h2,
          .analyze-side h2 {
            font-size: 22px;
          }

          .analyze-hero h1 {
            font-size: clamp(30px, 8vw, 42px);
          }

          .analyze-side-grid {
            grid-template-columns: 1fr;
          }

          .upload-scene {
            min-height: 220px;
          }

          .upload-flow {
            flex-direction: column;
          }

          .flow-arrow {
            transform: rotate(90deg);
            width: 76px;
          }

          .progress-top {
            flex-direction: column;
          }

          .progress-percent {
            width: 100%;
            min-width: 0;
            height: 60px;
            border-radius: 16px;
          }

          .analyze-actions,
          .hero-actions {
            width: 100%;
          }

          .analyze-actions .primary-btn,
          .analyze-actions .secondary-btn,
          .hero-actions .primary-btn,
          .hero-actions .secondary-btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .progress-card {
            padding: 16px;
          }

          .selected-role-chip {
            line-height: 1.55;
          }

          .search-field-wrap input {
            height: 52px;
          }

          .upload-file-card,
          .ai-engine-card {
            width: 100%;
          }

          .scan-paper {
            width: 100%;
            max-width: 260px;
          }
        }
      `}</style>

      <section className="analyze-hero glass">
        <div>
          <span className="analyze-hero-badge">
            <Bot size={14} /> AI Resume Analysis
          </span>
          <h1>Upload resume and generate a smart report</h1>
          <p>
            Search and select a role, upload a resume, and get a detailed ATS +
            AI analysis with visual scanning feedback.
          </p>
        </div>

        {/* <div className="hero-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={openFilePicker}
          >
            <Upload size={16} />
            Choose File
          </button>
          <button
            type="button"
            className="primary-btn"
            onClick={() => navigate("/resume-builder")}
          >
            <Sparkles size={16} />
            Open Builder
          </button>
        </div> */}
      </section>

      <div className="analyze-grid">
        <section className="analyze-card glass">
          <h2>Analyze your resume</h2>
          <p className="analyze-subtext">
            Pick the target role, upload your resume, and let the AI generate a
            structured report.
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
                className={`upload-scene ${uploadComplete ? "has-file" : ""} ${
                  loading ? "is-scanning" : ""
                }`}
                role="button"
                tabIndex={0}
                onClick={openFilePicker}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openFilePicker();
                  }
                }}
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

                    <div className="upload-chip-row">
                      <span className="upload-chip">ATS Ready</span>
                      <span className="upload-chip">AI Scan</span>
                      <span className="upload-chip">Instant Report</span>
                    </div>
                  </div>
                )}

                {file && !loading && (
                  <div className="upload-flow">
                    <div className="upload-file-card">
                      <div className="upload-file-icon">
                        <FileText size={26} />
                      </div>
                      <strong>{file.name}</strong>
                      <span>Ready for AI processing</span>
                    </div>

                    <div className="flow-arrow" aria-hidden="true">
                      <div className="arrow-line" />
                      <div className="arrow-tip" />
                    </div>

                    <div className="ai-engine-card">
                      <div className="engine-inner">
                        <div className="engine-orb" />
                        <strong>AI Engine</strong>
                        <span>ATS + Skills + Keywords</span>
                      </div>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="upload-scan-stage">
                    <div className="scan-stage">
                      <div className="scan-paper">
                        <div className="scan-line" />
                        <div className="scan-row" style={{ width: "78%" }} />
                        <div className="scan-row" style={{ width: "66%" }} />
                        <div className="scan-row" style={{ width: "84%" }} />
                        <div className="scan-row" style={{ width: "58%" }} />
                        <div className="scan-row" style={{ width: "72%" }} />

                        <div
                          style={{
                            position: "absolute",
                            bottom: 18,
                            left: 18,
                            right: 18,
                            padding: 12,
                            borderRadius: 16,
                            background: "rgba(14, 165, 233, 0.08)",
                            color: "#0284c7",
                            fontWeight: 800,
                            fontSize: 13,
                            textAlign: "center",
                            border: "1px solid rgba(14, 165, 233, 0.12)",
                          }}
                        >
                          Scanning document...
                        </div>
                      </div>

                      <div className="upload-chip-row">
                        <span className="upload-chip">Extracting text</span>
                        <span className="upload-chip">Checking ATS</span>
                        <span className="upload-chip">Generating report</span>
                      </div>
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

            <button className="primary-btn full-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  Analyze Resume <ArrowRight size={16} />
                </>
              )}
            </button>

            {loading && (
              <div className="progress-card glass">
                <div className="progress-top">
                  <div>
                    <h3>
                      {progressStep === 0 && "Uploading successfully"}
                      {progressStep === 1 && "AI Analyze"}
                      {progressStep === 2 && "Report on the way"}
                    </h3>

                    <p>
                      {progressStep === 0 && "Resume uploaded successfully..."}
                      {progressStep === 1 &&
                        "AI is analyzing ATS score and skills..."}
                      {progressStep === 2 && "Generating final report..."}
                    </p>
                  </div>

                  <div className="progress-percent">{progressValue}%</div>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progressValue}%` }}
                  />
                </div>

                <div className="progress-steps">
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
              <div className="progress-card glass">
                <div className="progress-top">
                  <div>
                    <h3>Network issue detected</h3>
                    <p>Please check your internet connection and try again.</p>
                  </div>
                </div>

                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "35%" }} />
                </div>

                <div className="progress-steps">
                  <div className="big-step active">
                    <div className="step-dot" />
                    <span>Checking connection</span>
                  </div>

                  <div className="big-step">
                    <div className="step-dot" />
                    <span>Waiting for network</span>
                  </div>
                </div>

                <div className="live-tip">
                  <AlertTriangle size={18} />
                  <span>
                    Internet is required to upload and analyze your resume.
                    Please reconnect and try again.
                  </span>
                </div>
              </div>
            )}

            <div className="info-box">
              <CheckCircle2 size={16} style={{ verticalAlign: "middle", marginRight: 8 }} />
              PDF and DOCX are supported. Choose a role first for best analysis.
            </div>
          </form>
        </section>

        <aside className="analyze-side glass">
          <h2>What this analysis includes</h2>
          <p className="analyze-subtext">
            A clear AI workflow with visual feedback, role alignment, and report generation.
          </p>

          <div className="analyze-side-grid">
            {insightCards.map((item) => {
              const Icon = item.icon;
              return (
                <div className="insight-card" key={item.title}>
                  <div className="insight-icon">
                    <Icon size={20} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="analysis-flow">
            {analysisSteps.map((step, index) => {
              const Icon = step.icon;
              const active =
                (loading && progressStep >= index) || (!loading && index === 0);

              return (
                <div className={`flow-step ${active ? "active" : ""}`} key={step.no}>
                  <div className="flow-dot" />
                  <div className="insight-icon" style={{ width: 42, height: 42, marginBottom: 0 }}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <strong>{step.title}</strong>
                    <span>{step.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="live-tip">
            <CircleDot size={18} />
            <span>
              This page keeps your current backend flow unchanged. It only upgrades the UI around it.
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}