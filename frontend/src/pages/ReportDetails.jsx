import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";

function StatCard({ label, value, delay = 0 }) {
  return (
    <div className="rd-stat-card" style={{ animationDelay: `${delay}ms` }}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SectionCard({ title, children, delay = 0, full = false }) {
  return (
    <section
      className={`rd-card glass ${full ? "rd-card-full" : ""}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function ListBlock({ items }) {
  if (!items || items.length === 0) {
    return <p className="rd-empty">No data available.</p>;
  }

  return (
    <ul className="rd-list">
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

export default function ReportDetails() {
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");

      let res;
      try {
        res = await api.get(`/api/resume/${id}`);
      } catch {
        res = await api.get(`/api/resume/report/${id}`);
      }

      const data = res.data?.data || res.data?.report || res.data;

      if (!data) {
        setError("Report not found");
        setReport(null);
        return;
      }

      setReport(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load report");
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const score = Number(report?.atsScore || 0);

  const levelText = useMemo(() => {
    const level = String(report?.overallLevel || "average").toLowerCase();
    return level.charAt(0).toUpperCase() + level.slice(1);
  }, [report?.overallLevel]);

  const achievements = useMemo(() => {
    if (Array.isArray(report?.actionPlan) && report.actionPlan.length > 0) {
      return report.actionPlan;
    }
    if (Array.isArray(report?.strengths) && report.strengths.length > 0) {
      return report.strengths;
    }
    return [];
  }, [report]);
  useEffect(() => {
    if (!report) return;

    let current = 0;

    const target = Number(score) || 0;

    const increment = Math.max(1, Math.ceil(target / 50));

    const timer = setInterval(() => {
      current += increment;

      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      setAnimatedScore(current);
    }, 20);

    return () => clearInterval(timer);
  }, [report, score]);

  return (
    <>
      <style>
        {`
          .rd-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 2rem;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #334155;
          }
          .rd-shell {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }
          .glass {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.5);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
            border-radius: 24px;
          }
          
          /* Loaders & Errors */
          .rd-loading, .rd-error {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 50vh;
            text-align: center;
            padding: 3rem;
          }
          .rd-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #e2e8f0;
            border-top-color: #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1.5rem;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          
          /* Hero Section */
          .rd-hero {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 3rem;
            flex-wrap: wrap;
            gap: 2rem;
          }
          .rd-hero-left {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .hero-badge {
            align-self: flex-start;
            background: #e0e7ff;
            color: #4338ca;
            padding: 0.4rem 1rem;
            border-radius: 99px;
            font-size: 0.875rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .rd-hero h1 {
            margin: 0;
            font-size: 2.5rem;
            color: #0f172a;
            font-weight: 900;
          }
          .rd-hero p {
            margin: 0;
            font-size: 1.1rem;
            color: #64748b;
            font-weight: 500;
          }
          
          /* ATS Score Ring */
          .rd-score-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .rd-score-ring {
            width: 140px;
            height: 140px;
            border-radius: 50%;
            /* Conic gradient uses the --p variable for dynamic score filling */
            background: conic-gradient(#10b981 calc(var(--p) * 1%), #e2e8f0 0);
            display: grid;
            place-items: center;
            box-shadow: 0 10px 20px rgba(16, 185, 129, 0.1);
          }
          .rd-score-inner {
            width: 116px;
            height: 116px;
            background: #ffffff;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: inset 0 2px 6px rgba(0,0,0,0.05);
          }
          .rd-score-inner strong {
            font-size: 2.5rem;
            color: #0f172a;
            line-height: 1;
            font-weight: 900;
          }
          .rd-score-inner span {
            font-size: 0.85rem;
            color: #64748b;
            font-weight: 700;
            text-transform: uppercase;
            margin-top: 4px;
          }

          /* Statistics Row */
          .rd-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
          }
          .rd-stat-card {
            background: #ffffff;
            padding: 1.5rem 2rem;
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
            animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
            transform: translateY(20px);
          }
          .rd-stat-card span {
            color: #64748b;
            font-size: 0.875rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .rd-stat-card strong {
            color: #0f172a;
            font-size: 1.75rem;
            font-weight: 900;
          }

          /* Main Grid */
          .rd-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
          }
          .rd-card-full {
            grid-column: 1 / -1;
          }
          .rd-card {
            padding: 2.5rem;
            animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
            transform: translateY(20px);
          }
          .rd-card h3 {
            margin-top: 0;
            margin-bottom: 1.5rem;
            color: #0f172a;
            font-size: 1.35rem;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .rd-card h3::before {
            content: '';
            display: block;
            width: 12px;
            height: 12px;
            background: #3b82f6;
            border-radius: 3px;
          }

          /* Lists and Text */
          .rd-empty {
            color: #94a3b8;
            font-style: italic;
          }
          .rd-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .rd-list li {
            position: relative;
            padding-left: 24px;
            color: #334155;
            line-height: 1.6;
            font-size: 1.05rem;
          }
          .rd-list li::before {
            content: '✦';
            position: absolute;
            left: 0;
            top: 2px;
            color: #3b82f6;
            font-size: 1rem;
          }
          .rd-paragraph {
            color: #334155;
            line-height: 1.8;
            font-size: 1.05rem;
            margin: 0;
          }

          /* Footer Buttons */
          .rd-footer-actions {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            padding: 1.5rem 2.5rem;
          }
          .primary-btn, .secondary-btn {
            padding: 1rem 1.5rem;
            border-radius: 12px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
          }
          .primary-btn {
            background: #0f172a;
            color: white;
          }
          .primary-btn:hover { background: #1e293b; transform: translateY(-2px); }
          .secondary-btn {
            background: #f1f5f9;
            color: #475569;
            border: 1px solid #cbd5e1;
          }
          .secondary-btn:hover { background: #e2e8f0; }

          @keyframes fadeUp {
            to { opacity: 1; transform: translateY(0); }
          }

          /* Responsive Breakpoints */
          @media (max-width: 900px) {
            .rd-grid { grid-template-columns: 1fr; }
          }
          @media (max-width: 768px) {
            .rd-page { padding: 1rem; }
            .rd-hero { flex-direction: column; text-align: center; padding: 2rem; }
            .rd-hero-left { align-items: center; }
            .hero-badge { align-self: center; }
            .rd-hero h1 { font-size: 2rem; }
            .rd-card { padding: 1.5rem; }
            .rd-footer-actions { flex-direction: column; padding: 1.5rem; }
            .rd-footer-actions button { width: 100%; }
          }
        `}
      </style>

      {loading ? (
        <div className="rd-page">
          <div className="rd-shell glass">
            <div className="rd-loading">
              <div className="rd-spinner" />
              <h2>Loading report...</h2>
              <p>Analyzing your resume insights.</p>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="rd-page">
          <div className="rd-shell glass">
            <div className="rd-error">
              <h2>Report Details</h2>
              <p>{error}</p>
              <Link to="/history">
                <button className="primary-btn" style={{ marginTop: "1rem" }}>
                  Back to Reports
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : report ? (
        <div className="rd-page">
          <div className="rd-shell">
            <div className="rd-hero glass">
              <div className="rd-hero-left">
                <span className="hero-badge">Analysis Report</span>
                <h1>{report.fileName || "Resume Report"}</h1>
                <p>
                  {report.role || "Target role"} • {levelText}
                </p>
              </div>

              <div className="rd-score-wrap">
                <div
                  className="rd-score-ring"
                  style={{ "--p": Math.min(score, 100) }}
                >
                  <div className="rd-score-inner">
                    <strong>{animatedScore}</strong>
                    <span>ATS</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rd-stats">
              <StatCard label="ATS Score" value={`${score}/100`} delay={50} />

              <StatCard
                label="Professional Level"
                value={levelText}
                delay={100}
              />

              <StatCard
                label="Matching Roles"
                value={report?.jobMatchRoles?.length || 0}
                delay={150}
              />

              <StatCard
                label="Missing Skills"
                value={report?.missingSkills?.length || 0}
                delay={200}
              />
            </div>

            <div className="rd-grid">
              <SectionCard title="Strengths" delay={100}>
                <ListBlock items={report.strengths} />
              </SectionCard>

              <SectionCard title="Weaknesses" delay={140}>
                <ListBlock items={report.weaknesses} />
              </SectionCard>

              <SectionCard title="Missing Skills" delay={180}>
                <ListBlock items={report.missingSkills} />
              </SectionCard>

              <SectionCard title="Interview Questions" delay={220}>
                <ListBlock items={report.interviewQuestions} />
              </SectionCard>

              <SectionCard title="Achievements / Growth Focus" delay={260}>
                <ListBlock items={achievements} />
              </SectionCard>

              <SectionCard title="Improved Summary" delay={300}>
                <p className="rd-paragraph">
                  {report.improvedSummary || "No improved summary available."}
                </p>
              </SectionCard>

              <SectionCard title="Overall Feedback" delay={340} full>
                <p className="rd-paragraph">
                  {report.overallFeedback || "No overall feedback available."}
                </p>
              </SectionCard>
            </div>

            <div className="rd-footer-actions glass">
              <Link to="/history">
                <button className="secondary-btn">Back to Reports</button>
              </Link>
              <Link to="/analyze">
                <button className="primary-btn">Analyze Another Resume</button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
