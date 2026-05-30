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

  if (loading) {
    return (
      <div className="rd-page">
        <div className="rd-shell glass">
          <div className="rd-loading">
            <div className="rd-spinner" />
            <h2>Loading report...</h2>
            <p>Analyzing your resume insights.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rd-page">
        <div className="rd-shell glass">
          <div className="rd-error">
            <h2>Report Details</h2>
            <p>{error}</p>
            <Link to="/history">
              <button className="primary-btn">Back to Reports</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
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
            <div className="rd-score-ring" style={{ "--p": Math.min(score, 100) }}>
              <div className="rd-score-inner">
                <strong>{score}</strong>
                <span>ATS</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rd-stats">
          <StatCard label="Level" value={levelText} delay={50} />
          <StatCard label="Skills Found" value={report?.strengths?.length || 0} delay={100} />
          <StatCard
            label="Missing Skills"
            value={report?.missingSkills?.length || 0}
            delay={150}
          />
          <StatCard
            label="Questions"
            value={report?.interviewQuestions?.length || 0}
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
  );
}