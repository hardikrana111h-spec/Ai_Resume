import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  FileText,
  ShieldCheck,
  Bot,
  ArrowRight,
  Upload,
  BadgeCheck,
  Briefcase,
  Zap,
  LayoutTemplate,
  Users,
  Mail,
  MessageSquare,
  Star,
  ScanSearch,
  Rocket,
  CheckCircle2,
  Layers3,
  Eye,
} from "lucide-react";

const stats = [
  { value: "99%", label: "ATS-ready structure" },
  { value: "10+", label: "Premium templates" },
  { value: "3x", label: "Faster resume creation" },
  { value: "AI", label: "Smart analysis" },
];

const features = [
  {
    icon: Bot,
    title: "AI Resume Analysis",
    desc: "Upload PDF or DOCX and get ATS score, strengths, weaknesses, and missing skills instantly.",
  },
  {
    icon: LayoutTemplate,
    title: "Resume Builder",
    desc: "Build clean professional resumes with live preview, sections, and multiple modern templates.",
  },
  {
    icon: ShieldCheck,
    title: "Private Reports",
    desc: "Each user gets their own secure dashboard with reports, history, and saved analysis.",
  },
  {
    icon: Sparkles,
    title: "Google Login",
    desc: "Fast secure login with account-based access for a more professional SaaS experience.",
  },
];

const workflow = [
  {
    no: "01",
    icon: Sparkles,
    title: "Login securely",
    desc: "Sign in with Google or email to unlock your personal workspace.",
  },
  {
    no: "02",
    icon: Upload,
    title: "Upload resume",
    desc: "Choose a PDF or DOCX file and select the target job role.",
  },
  {
    no: "03",
    icon: ScanSearch,
    title: "Get AI insights",
    desc: "Receive score, feedback, and improvement suggestions in a clear report.",
  },
  {
    no: "04",
    icon: Rocket,
    title: "Improve and export",
    desc: "Use the builder, update sections, and export a polished resume.",
  },
];

const templates = [
  {
    name: "Modern",
    role: "Frontend Developer",
    accent: "from-sky-500 via-cyan-500 to-blue-500",
    badge: "Clean + elegant",
  },
  {
    name: "Corporate",
    role: "Business Analyst",
    accent: "from-blue-600 via-indigo-600 to-sky-500",
    badge: "Professional + formal",
  },
  {
    name: "ATS Clean",
    role: "React Developer",
    accent: "from-cyan-500 via-sky-500 to-blue-500",
    badge: "Recruiter-friendly",
  },
];

const faqs = [
  {
    q: "What file types are supported?",
    a: "PDF and DOCX resume files are supported for analysis.",
  },
  {
    q: "Are reports private?",
    a: "Yes. Each user only sees their own reports and history after login.",
  },
  {
    q: "Can I build resumes on mobile?",
    a: "Yes. The builder is optimized for responsive mobile use.",
  },
];

const pricing = [
  {
    name: "Free",
    price: "₹0",
    items: ["Basic analysis", "Limited exports", "Core templates"],
  },
  {
    name: "Pro",
    price: "₹199/mo",
    items: ["Advanced AI analysis", "Builder access", "More templates"],
    featured: true,
  },
  {
    name: "Premium",
    price: "₹499/mo",
    items: ["Priority support", "Unlimited exports", "Full AI toolkit"],
  },
];

const testimonials = [
  {
    name: "Hardik R.",
    role: "Frontend Developer",
    avatar: "H",
    text: "ATS score suggestions helped me improve my resume quickly.",
  },
  {
    name: "Priya S.",
    role: "BCA Student",
    avatar: "P",
    text: "Resume Builder UI feels premium and easy to use.",
  },
  {
    name: "Rahul P.",
    role: "Job Seeker",
    avatar: "R",
    text: "Professional templates and clean AI feedback.",
  },
];

const trustItems = [
  { icon: Users, label: "Students" },
  { icon: Briefcase, label: "Professionals" },
  { icon: Zap, label: "Fast workflows" },
  { icon: BadgeCheck, label: "Secure access" },
];

export default function Home() {
  const [showNotice, setShowNotice] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const seen = localStorage.getItem("ai_resume_notice_seen");
    if (!seen) setShowNotice(true);
  }, []);

  useEffect(() => {
    const start = performance.now();
    const duration = 1200;

    let rafId = 0;

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setCounts([
        Math.round(99 * progress),
        Math.round(10 * progress),
        Math.round(3 * progress),
        progress >= 1 ? 1 : 0,
      ]);

      if (progress < 1) rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const closeNotice = () => {
    setShowNotice(false);
    localStorage.setItem("ai_resume_notice_seen", "1");
  };

  const whatIsNew = () => {
    closeNotice();
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  const statValues = useMemo(
    () => [
      `${counts[0]}%`,
      `${counts[1]}+`,
      `${counts[2]}x`,
      counts[3] ? "AI" : "",
    ],
    [counts]
  );

  return (
    <div className="hp-page">
      <style>{`
        .hp-page{
          display:grid;
          gap:24px;
          width:100%;
          color:#0f172a;
        }

        .hp-banner{
          padding:16px 18px;
          border-radius:22px;
          background:linear-gradient(135deg, rgba(220,38,38,.96), rgba(185,28,28,.96));
          color:#fff;
          display:flex;
          justify-content:space-between;
          gap:14px;
          align-items:center;
          flex-wrap:wrap;
          box-shadow:0 14px 30px rgba(220,38,38,.18);
        }

        .hp-banner strong{
          font-size:14px;
          font-weight:900;
          display:block;
        }

        .hp-banner span{
          font-size:13px;
          opacity:.95;
          line-height:1.5;
        }

        .hp-nav{
          display:flex;
          gap:10px;
          flex-wrap:nowrap;
          overflow-x:auto;
          padding:14px 16px;
          border-radius:22px;
        }

        .hp-nav::-webkit-scrollbar{
          height:6px;
        }

        .hp-nav::-webkit-scrollbar-thumb{
          background:rgba(148,163,184,.35);
          border-radius:999px;
        }

        .hp-link{
          white-space:nowrap;
          padding:10px 14px;
          border-radius:999px;
          background:#fff;
          border:1px solid rgba(148,163,184,.16);
          color:#334155;
          font-weight:700;
        }

        .hp-hero{
          display:grid;
          grid-template-columns:1.12fr .88fr;
          gap:24px;
          padding:34px;
          border-radius:32px;
          align-items:center;
        }

        .hp-left{
          display:grid;
          gap:18px;
        }

        .hp-badge{
          display:inline-flex;
          align-items:center;
          gap:8px;
          width:fit-content;
          padding:10px 16px;
          border-radius:999px;
          background:rgba(14,165,233,.10);
          color:#0284c7;
          font-weight:800;
          font-size:13px;
        }

        .hp-title{
          margin:0;
          font-size:clamp(42px,5vw,66px);
          line-height:1.02;
          font-weight:900;
          letter-spacing:-.04em;
          color:#0f172a;
        }

        .hp-sub{
          margin:0;
          color:#64748b;
          font-size:17px;
          line-height:1.75;
          max-width:680px;
        }

        .hp-actions{
          display:flex;
          gap:12px;
          flex-wrap:wrap;
        }

        .hp-tags{
          display:flex;
          gap:10px;
          flex-wrap:wrap;
        }

        .hp-tags span,
        .hp-pill{
          padding:10px 14px;
          border-radius:999px;
          background:rgba(255,255,255,.92);
          border:1px solid #dbe4f0;
          font-weight:700;
          color:#334155;
        }

        .hp-right{
          display:grid;
          place-items:center;
        }

        .hp-dashboard{
          width:min(430px,100%);
          padding:20px;
          border-radius:28px;
          background:rgba(255,255,255,.9);
          border:1px solid rgba(226,232,240,.92);
          box-shadow:0 18px 45px rgba(15,23,42,.1);
          position:relative;
          overflow:hidden;
        }

        .hp-dashboard::before{
          content:"";
          position:absolute;
          inset:-60px auto auto -60px;
          width:180px;
          height:180px;
          border-radius:50%;
          background:radial-gradient(circle, rgba(14,165,233,.16), transparent 70%);
        }

        .hp-dash-top{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:12px;
          margin-bottom:18px;
          position:relative;
          z-index:2;
        }

        .hp-dash-badge{
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding:8px 12px;
          border-radius:999px;
          background:rgba(14,165,233,.10);
          color:#0284c7;
          font-size:12px;
          font-weight:900;
        }

        .hp-score{
          width:112px;
          height:112px;
          border-radius:50%;
          display:grid;
          place-items:center;
          background:conic-gradient(#0ea5e9 0 92%, #e2e8f0 92% 100%);
          position:relative;
          box-shadow:0 18px 30px rgba(14,165,233,.16);
          animation: hpPulse 4s ease-in-out infinite;
        }

        .hp-score::before{
          content:"";
          position:absolute;
          inset:12px;
          background:#fff;
          border-radius:50%;
        }

        .hp-score span{
          position:relative;
          z-index:1;
          font-size:28px;
          font-weight:900;
          color:#111827;
        }

        .hp-mini-grid{
          display:grid;
          gap:12px;
          position:relative;
          z-index:2;
        }

        .hp-mini{
          padding:14px 16px;
          border-radius:18px;
          background:#fff;
          border:1px solid rgba(226,232,240,.92);
        }

        .hp-mini-top{
          display:flex;
          justify-content:space-between;
          gap:12px;
          align-items:center;
        }

        .hp-mini strong{
          font-size:14px;
          color:#0f172a;
        }

        .hp-mini span{
          font-size:13px;
          color:#64748b;
          font-weight:700;
        }

        .hp-bar{
          height:10px;
          border-radius:999px;
          background:#e5e7eb;
          overflow:hidden;
          margin-top:10px;
        }

        .hp-bar i{
          display:block;
          height:100%;
          border-radius:999px;
          background:linear-gradient(90deg,#0ea5e9,#38bdf8,#4f46e5);
          animation: hpSlide 2.2s ease-in-out infinite;
        }

        .hp-float-wrap{
          position:absolute;
          inset:0;
          pointer-events:none;
        }

        .hp-float{
          position:absolute;
          padding:10px 14px;
          border-radius:16px;
          background:linear-gradient(135deg,#0ea5e9,#4f46e5);
          color:#fff;
          font-size:13px;
          font-weight:900;
          box-shadow:0 12px 25px rgba(14,165,233,.22);
          animation: hpFloat 4.8s ease-in-out infinite;
        }

        .hp-f1{top:18px;right:-10px}
        .hp-f2{bottom:26px;left:-10px;animation-delay:1s}
        .hp-f3{top:55%;right:-16px;animation-delay:2s}

        .hp-section-title{
          display:flex;
          justify-content:space-between;
          gap:12px;
          align-items:end;
          margin-bottom:18px;
          flex-wrap:wrap;
        }

        .hp-section-title h2{
          margin:0;
          font-size:clamp(24px,3vw,34px);
          color:#0f172a;
        }

        .hp-section-title p{
          margin:0;
          color:#64748b;
          line-height:1.7;
          max-width:720px;
        }

        .hp-trust{
          display:grid;
          grid-template-columns:repeat(4,minmax(0,1fr));
          gap:14px;
        }

        .hp-trust-card{
          padding:18px;
          border-radius:22px;
          background:#fff;
          border:1px solid rgba(226,232,240,.92);
          display:flex;
          gap:12px;
          align-items:center;
          transition:transform .18s ease, box-shadow .18s ease;
        }

        .hp-trust-card:hover{
          transform:translateY(-2px);
          box-shadow:0 16px 40px rgba(15,23,42,.08);
        }

        .hp-icon{
          width:46px;
          height:46px;
          border-radius:16px;
          display:grid;
          place-items:center;
          background:linear-gradient(135deg,rgba(14,165,233,.12),rgba(59,130,246,.12));
          color:#0284c7;
          flex-shrink:0;
        }

        .hp-trust-card strong{
          display:block;
          color:#0f172a;
        }

        .hp-trust-card span{
          display:block;
          color:#64748b;
          font-size:13px;
          font-weight:700;
        }

        .hp-stats{
          display:grid;
          grid-template-columns:repeat(4,minmax(0,1fr));
          gap:16px;
        }

        .hp-stat{
          padding:22px;
          border-radius:24px;
          text-align:center;
        }

        .hp-stat strong{
          display:block;
          font-size:34px;
          font-weight:900;
          color:#0284c7;
          line-height:1;
        }

        .hp-stat span{
          display:block;
          margin-top:6px;
          color:#64748b;
          font-weight:600;
        }

        .hp-surface{
          padding:28px;
          border-radius:28px;
          background:rgba(255,255,255,.78);
          border:1px solid rgba(226,232,240,.92);
        }

        .hp-grid-2{
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:24px;
        }

        .hp-grid-3{
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:16px;
        }

        .hp-feature{
          padding:20px;
          border-radius:22px;
          background:rgba(255,255,255,.88);
          border:1px solid rgba(226,232,240,.92);
          transition:transform .18s ease, box-shadow .18s ease;
        }

        .hp-feature:hover{
          transform:translateY(-2px);
          box-shadow:0 16px 40px rgba(15,23,42,.08);
        }

        .hp-feature-icon{
          width:50px;
          height:50px;
          border-radius:16px;
          display:grid;
          place-items:center;
          background:linear-gradient(135deg,rgba(14,165,233,.12),rgba(79,70,229,.12));
          color:#0284c7;
          margin-bottom:12px;
        }

        .hp-feature h3{
          margin:0 0 8px;
          font-size:18px;
          color:#0f172a;
        }

        .hp-feature p{
          margin:0;
          color:#64748b;
          line-height:1.7;
        }

        .hp-steps{
          display:grid;
          gap:14px;
        }

        .hp-step{
          display:flex;
          gap:14px;
          align-items:flex-start;
          padding:18px;
          border-radius:22px;
          background:rgba(255,255,255,.88);
          border:1px solid rgba(226,232,240,.92);
        }

        .hp-step-no{
          min-width:52px;
          height:52px;
          border-radius:16px;
          display:grid;
          place-items:center;
          background:linear-gradient(135deg,#0ea5e9,#4f46e5);
          color:#fff;
          font-weight:900;
        }

        .hp-template-showcase{
          margin-top:18px;
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:14px;
        }

        .hp-template{
          border-radius:24px;
          overflow:hidden;
          background:#fff;
          border:1px solid rgba(226,232,240,.92);
          box-shadow:0 12px 30px rgba(15,23,42,.05);
        }

        .hp-template-top{
          height:84px;
          padding:16px;
          background:linear-gradient(135deg,rgba(14,165,233,.14),rgba(79,70,229,.12));
          display:flex;
          justify-content:space-between;
          align-items:flex-start;
        }

        .hp-template-top strong{
          font-size:16px;
          color:#0f172a;
        }

        .hp-template-top span{
          display:block;
          margin-top:4px;
          color:#0369a1;
          font-size:12px;
          font-weight:800;
        }

        .hp-template-body{
          padding:16px;
          display:grid;
          gap:10px;
        }

        .hp-line{
          height:10px;
          border-radius:999px;
          background:linear-gradient(90deg, rgba(14,165,233,.10), rgba(79,70,229,.16));
        }

        .hp-template-footer{
          padding:0 16px 16px;
          display:flex;
          align-items:center;
          gap:8px;
          color:#0284c7;
          font-size:13px;
          font-weight:800;
        }

        .hp-review-list{
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:14px;
        }

        .hp-review{
          padding:20px;
          border-radius:22px;
          background:#fff;
          border:1px solid rgba(226,232,240,.92);
          transition:transform .18s ease, box-shadow .18s ease;
        }

        .hp-review:hover{
          transform:translateY(-2px);
          box-shadow:0 16px 40px rgba(15,23,42,.08);
        }

        .hp-review-head{
          display:flex;
          align-items:center;
          gap:12px;
          margin-bottom:12px;
        }

        .hp-avatar{
          width:54px;
          height:54px;
          border-radius:50%;
          background:linear-gradient(135deg,#0ea5e9,#4f46e5);
          color:#fff;
          display:grid;
          place-items:center;
          font-size:20px;
          font-weight:900;
          flex-shrink:0;
        }

        .hp-review-meta strong{
          display:block;
          font-size:16px;
          color:#0f172a;
        }

        .hp-review-meta span{
          display:block;
          color:#64748b;
          font-size:13px;
          font-weight:700;
        }

        .hp-stars{
          color:#f59e0b;
          font-size:16px;
          margin-bottom:10px;
          letter-spacing:2px;
        }

        .hp-pricing{
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:16px;
        }

        .hp-plan{
          padding:20px;
          border-radius:24px;
          background:#fff;
          border:1px solid rgba(226,232,240,.92);
        }

        .hp-plan.featured{
          border-color:rgba(14,165,233,.3);
          box-shadow:0 18px 50px rgba(14,165,233,.12);
        }

        .hp-price{
          font-size:34px;
          font-weight:900;
          margin:0 0 12px;
          color:#0f172a;
        }

        .hp-plan ul{
          margin:0;
          padding-left:18px;
          display:grid;
          gap:8px;
          color:#64748b;
          line-height:1.7;
        }

        .hp-faq{
          display:grid;
          gap:12px;
        }

        .hp-faq details{
          padding:18px;
          border-radius:22px;
          background:#fff;
          border:1px solid rgba(226,232,240,.92);
        }

        .hp-faq summary{
          cursor:pointer;
          font-weight:900;
          color:#0f172a;
          list-style:none;
        }

        .hp-faq summary::-webkit-details-marker{
          display:none;
        }

        .hp-contact{
          display:grid;
          grid-template-columns:1.1fr .9fr;
          gap:24px;
        }

        .hp-contact-card{
          padding:22px;
          border-radius:24px;
          background:#fff;
          border:1px solid rgba(226,232,240,.92);
        }

        .hp-contact-card h3{
          margin:0 0 10px;
          font-size:20px;
          color:#0f172a;
        }

        .hp-contact-card p{
          margin:0;
          color:#64748b;
          line-height:1.7;
        }

        .hp-cta{
          padding:28px;
          border-radius:28px;
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:18px;
          background:linear-gradient(135deg, rgba(14,165,233,.12), rgba(79,70,229,.10));
          border:1px solid rgba(14,165,233,.14);
        }

        .hp-cta h2{
          margin:0 0 8px;
          font-size:28px;
        }

        .hp-cta p{
          margin:0;
          color:#64748b;
          line-height:1.7;
          max-width:680px;
        }

        .hp-cta-actions{
          display:flex;
          gap:12px;
          flex-wrap:wrap;
        }

        @keyframes hpFloat{
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-10px)}
        }

        @keyframes hpPulse{
          0%,100%{transform:scale(1)}
          50%{transform:scale(1.03)}
        }

        @keyframes hpSlide{
          0%{transform:translateX(-10%)}
          50%{transform:translateX(8%)}
          100%{transform:translateX(-10%)}
        }

        @media (max-width:1100px){
          .hp-hero,.hp-contact,.hp-grid-2,.hp-grid-3,.hp-pricing,.hp-review-list,.hp-template-showcase,.hp-trust,.hp-stats{
            grid-template-columns:1fr 1fr;
          }
          .hp-cta{
            flex-direction:column;
            align-items:flex-start;
          }
        }

        @media (max-width:768px){
          .hp-hero{
            grid-template-columns:1fr;
            padding:18px;
            border-radius:22px;
          }

          .hp-title{
            font-size:clamp(30px,8vw,42px);
          }

          .hp-sub{
            font-size:15px;
          }

          .hp-actions,.hp-cta-actions{
            width:100%;
            display:grid;
            grid-template-columns:1fr;
          }

          .hp-actions a,.hp-cta-actions a{
            width:100%;
          }

          .hp-trust,.hp-stats,.hp-grid-2,.hp-grid-3,.hp-pricing,.hp-review-list,.hp-template-showcase,.hp-contact{
            grid-template-columns:1fr;
          }

          .hp-surface{
            padding:18px;
            border-radius:22px;
          }

          .hp-dashboard{
            width:min(100%,340px);
          }

          .hp-feature,.hp-review,.hp-plan,.hp-template,.hp-contact-card,.hp-step{
            padding:16px;
          }

          .hp-step-no{
            min-width:46px;
            height:46px;
            font-size:14px;
          }

          .hp-cta{
            padding:18px;
            border-radius:22px;
          }

          .hp-banner{
            padding:12px 14px;
          }

          .hp-score{
            width:96px;
            height:96px;
          }
        }

        @media (max-width:480px){
          .hp-stat strong{
            font-size:28px;
          }

          .hp-dashboard{
            padding:16px;
          }
        }
      `}</style>

      {showNotice && (
        <div className="hp-banner">
          <div>
            <strong>Platform Upgrade in Progress</strong>
            <span>
              AI Resume Analyzer is live and actively improving. Some product
              pages may change while we polish the SaaS experience.
            </span>
          </div>

          <div className="hp-actions" style={{ marginTop: 0 }}>
            <button type="button" className="secondary-btn" onClick={whatIsNew}>
              What’s New
            </button>
            <button type="button" className="primary-btn" onClick={closeNotice}>
              Explore Platform
            </button>
          </div>
        </div>
      )}

      <div className="hp-nav glass">
        <a className="hp-link" href="#overview">Overview</a>
        <a className="hp-link" href="#trust">Trust</a>
        <a className="hp-link" href="#features">Features</a>
        <a className="hp-link" href="#workflow">Workflow</a>
        <a className="hp-link" href="#templates">Templates</a>
        <a className="hp-link" href="#reviews">Reviews</a>
        <a className="hp-link" href="#pricing">Pricing</a>
        <a className="hp-link" href="#faq">FAQ</a>
        <a className="hp-link" href="#contact">Contact</a>
      </div>

      <section id="overview" className="hp-hero glass">
        <div className="hp-left">
          <span className="hp-badge">
            <Sparkles size={14} /> AI Powered Resume Platform
          </span>

          <h1 className="hp-title">
            Build better resumes and analyze them with smart AI
          </h1>

          <p className="hp-sub">
            Create ATS-friendly resumes, track your reports, and improve your
            job application quality with a clean modern workflow.
          </p>

          <div className="hp-actions">
            <Link to="/analyze" className="primary-btn">
              Start Analysis <ArrowRight size={16} />
            </Link>
            <Link to="/resume-builder" className="secondary-btn">
              Open Resume Builder
            </Link>
          </div>

          <div className="hp-tags">
            <span>ATS score</span>
            <span>Resume templates</span>
            <span>Google login</span>
            <span>Private reports</span>
          </div>
        </div>

        <div className="hp-right">
          <div className="hp-dashboard">
            <div className="hp-dash-top">
              <div>
                <div className="hp-dash-badge">
                  <Bot size={14} /> AI Dashboard
                </div>
                <h3 style={{ margin: "14px 0 0", fontSize: 28, lineHeight: 1.05 }}>
                  Resume performance snapshot
                </h3>
                <p style={{ margin: "8px 0 0", color: "#64748b", lineHeight: 1.6 }}>
                  Live scoring, keyword match, and improvement suggestions.
                </p>
              </div>

              {/* <div className="hp-score" aria-label="ATS score">
                <span>92%</span>
              </div> */}
            </div>

            <div className="hp-mini-grid">
              <div className="hp-mini">
                <div className="hp-mini-top">
                  <strong>ATS Match</strong>
                  {/* <strong style={{ color: "#16a34a" }}>88%</strong> */}
                </div>
                <span>Keywords + structure</span>
                <div className="hp-bar">
                  <i style={{ width: "88%" }} />
                </div>
              </div>

              <div className="hp-mini">
                <div className="hp-mini-top">
                  <strong>Skills Match</strong>
                  {/* <strong style={{ color: "#0ea5e9" }}>95%</strong> */}
                </div>
                <span>Role compatibility</span>
                <div className="hp-bar">
                  <i style={{ width: "95%" }} />
                </div>
              </div>

              <div className="hp-mini">
                <div className="hp-mini-top">
                  <strong>AI Suggestions</strong>
                  {/* <strong style={{ color: "#7c3aed" }}>12</strong> */}
                </div>
                <span>Improvement points</span>
                <div className="hp-bar">
                  <i style={{ width: "72%" }} />
                </div>
              </div>
            </div>

            <div className="hp-mini" style={{ marginTop: 14 }}>
              <div className="hp-mini-top">
                <strong style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Upload size={16} /> Upload → Analyze → Improve
                </strong>
                <strong style={{ color: "#0ea5e9" }}>
                  <Layers3 size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />
                  PDF / DOCX
                </strong>
              </div>
              <div className="hp-bar">
                <i style={{ width: "84%" }} />
              </div>
            </div>

            <div className="hp-float-wrap">
              {/* <div className="hp-float hp-f1">
                <Star size={13} /> AI
              </div> */}
              {/* <div className="hp-float hp-f2">
                <FileText size={13} /> Resume
              </div> */}
              {/* <div className="hp-float hp-f3">
                <Zap size={13} /> ATS
              </div> */}
            </div>
          </div>
        </div>
      </section>

      <section id="trust" className="hp-trust">
        {trustItems.map((item) => {
          const Icon = item.icon;
          return (
            <div className="hp-trust-card glass" key={item.label}>
              <div className="hp-icon">
                <Icon size={18} />
              </div>
              <div>
                <strong>{item.label}</strong>
                <span>Trusted category</span>
              </div>
            </div>
          );
        })}
      </section>

      <section id="features" className="hp-stats">
        {stats.map((item, index) => (
          <div className="hp-stat glass" key={item.label}>
            <strong>{statValues[index]}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="hp-surface glass">
        <div className="hp-section-title">
          <div>
            <h2>Why this platform stands out</h2>
            <p>
              A cleaner SaaS feel with cool blue colors, feature icons, and smooth motion.
            </p>
          </div>
        </div>

        <div className="hp-grid-2">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div className="hp-feature" key={item.title}>
                <div className="hp-feature-icon">
                  <Icon size={20} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="hp-surface glass">
        <div className="hp-section-title">
          <div>
            <h2>How it works</h2>
            <p>
              A simple four-step flow that feels polished and easy to understand.
            </p>
          </div>
        </div>

        <div className="hp-steps">
          {workflow.map((step) => {
            const Icon = step.icon;
            return (
              <div className="hp-step" key={step.no}>
                <div className="hp-step-no">{step.no}</div>
                <div className="hp-feature-icon" style={{ marginBottom: 0 }}>
                  <Icon size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>{step.title}</h3>
                  <p className="section-note" style={{ marginTop: 6 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="templates" className="hp-surface glass">
        <div className="hp-section-title">
          <div>
            <h2>Resume Builder templates</h2>
            <p>
              Bigger preview cards give a better feel of the template style and layout.
            </p>
          </div>
        </div>

        <div className="hp-template-showcase">
          {templates.map((t) => (
            <div className="hp-template" key={t.name}>
              <div className={`hp-template-top bg-gradient-to-r ${t.accent}`}>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
                <Eye size={16} />
              </div>
              <div className="hp-template-body">
                <div className="hp-line" style={{ width: "92%" }} />
                <div className="hp-line" style={{ width: "76%" }} />
                <div className="hp-line" style={{ width: "86%" }} />
                <div className="hp-line" style={{ width: "64%" }} />
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                  <span className="hp-pill">{t.badge}</span>
                  <span className="hp-pill">PDF Ready</span>
                </div>
              </div>
              <div className="hp-template-footer">
                <CheckCircle2 size={14} />
                Built for {t.name.toLowerCase()} resumes
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="reviews" className="hp-surface glass">
        <div className="hp-section-title">
          <div>
            <h2>What users say</h2>
            <p>
              Real profile-style review cards with stars and short testimonials.
            </p>
          </div>
        </div>

        <div className="hp-review-list">
          {testimonials.map((t) => (
            <div className="hp-review" key={t.name}>
              <div className="hp-review-head">
                <div className="hp-avatar">{t.avatar}</div>
                <div className="hp-review-meta">
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>

              <div className="hp-stars">★★★★★</div>
              <p>{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="hp-surface glass">
  <div className="hp-section-title">
    <div>
      <h2>Pricing</h2>
      <p>
        Simple plans for testing, active job hunting, and premium support.
      </p>
    </div>
  </div>

  <div className="hp-pricing">
    <div className="hp-plan">
      <span className="hp-plan-tag">Starter</span>
      <h3>Free</h3>
      <div className="hp-price">₹0<span>/month</span></div>
      <ul>
        <li>ATS Analysis</li>
        <li>Basic Templates</li>
        <li>PDF Export</li>
        <li>5 Analyses / month</li>
      </ul>
      <div className="hp-plan-actions">
        <Link to="/analyze" className="secondary-btn full-btn">
          Get Started
        </Link>
      </div>
    </div>

    <div className="hp-plan featured">
      <div className="pricing-badge">Most Popular</div>
      <span className="hp-plan-tag">Pro</span>
      <h3>Pro</h3>
      <div className="hp-price">₹199<span>/month</span></div>
      <ul>
        <li>Unlimited Analysis</li>
        <li>Premium Templates</li>
        <li>Resume Builder</li>
        <li>AI Suggestions</li>
        <li>Report History</li>
      </ul>
      <div className="hp-plan-actions">
        <Link to="/contact" className="primary-btn full-btn">
          Upgrade to Pro
        </Link>
      </div>
    </div>

    <div className="hp-plan">
      <span className="hp-plan-tag">Business</span>
      <h3>Premium</h3>
      <div className="hp-price">₹499<span>/month</span></div>
      <ul>
        <li>Everything in Pro</li>
        <li>Team Access</li>
        <li>Priority Support</li>
        <li>Future AI Features</li>
      </ul>
      <div className="hp-plan-actions">
        <Link to="/contact" className="secondary-btn full-btn">
          Contact Sales
        </Link>
      </div>
    </div>
  </div>
</section>
      <section id="faq" className="hp-surface glass">
        <div className="hp-section-title">
          <div>
            <h2>FAQ</h2>
            <p>
              Short and useful answers only. I removed the extra help-center block.
            </p>
          </div>
        </div>

        <div className="hp-faq">
          {faqs.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p style={{ marginTop: 10 }}>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="contact" className="hp-contact">
  <div className="hp-contact-card glass">
    <div className="hp-section-title">
      <div>
        <h2>Contact</h2>
        <p>Need help, support, or want to talk about plans?</p>
      </div>
    </div>

    <div className="hp-contact-list">
      <div className="hp-contact-item">
        <Mail size={16} />
        <div>
          <strong>Email Support</strong>
          <span>support@airesumeanalyzer.com</span>
        </div>
      </div>

      <div className="hp-contact-item">
        <MessageSquare size={16} />
        <div>
          <strong>Response Time</strong>
          <span>Usually within 24 hours</span>
        </div>
      </div>

      <div className="hp-contact-item">
        <Briefcase size={16} />
        <div>
          <strong>Location</strong>
          <span>India • Remote-first SaaS</span>
        </div>
      </div>
    </div>
  </div>

  <div className="hp-contact-card glass">
    <div className="hp-section-title">
      <div>
        <h2>Platform Status</h2>
        <p>System health overview</p>
      </div>
    </div>

    <div className="hp-status-list">
      <div className="status-item">
        <span>Resume Analysis</span>
        <strong className="status-online">Operational</strong>
      </div>

      <div className="status-item">
        <span>Resume Builder</span>
        <strong className="status-online">Operational</strong>
      </div>

      <div className="status-item">
        <span>AI Features</span>
        <strong className="status-progress">Under Improvement</strong>
      </div>

      <div className="status-item">
        <span>Authentication</span>
        <strong className="status-online">Operational</strong>
      </div>
    </div>
  </div>
</section>

      <section className="hp-cta glass">
        <div>
          <h2>Ready to improve your resume?</h2>
          <p>
            Upload your resume, analyze it, and then build a better version
            with the builder.
          </p>
        </div>
        <div className="hp-cta-actions">
          <Link to="/analyze" className="primary-btn">
            Analyze Resume
          </Link>
          <Link to="/resume-builder" className="secondary-btn">
            Build Resume
          </Link>
        </div>
      </section>
    </div>
  );
}