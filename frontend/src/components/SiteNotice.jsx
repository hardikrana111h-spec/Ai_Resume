import { useEffect, useState } from "react";

export default function SiteNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("ai_resume_notice_seen");
    if (!seen) setOpen(true);
  }, []);

  const closeNotice = () => {
    setOpen(false);
    localStorage.setItem("ai_resume_notice_seen", "1");
  };

  const openHighlights = () => {
    closeNotice();
    window.location.href = "#features";
  };

  if (!open) return null;

  return (
    <div className="site-notice-backdrop">
      <div className="site-notice glass">
        <span className="hero-badge">Platform Upgrade</span>
        <h2>AI Resume Analyzer is live and actively improving</h2>
        <p>
          We are upgrading the platform into a professional SaaS experience.
          Some pages and features may change as we polish mobile UI, performance,
          and AI workflows.
        </p>

        <div className="site-notice-actions">
          <button type="button" className="secondary-btn" onClick={openHighlights}>
            What’s New
          </button>

          <button type="button" className="primary-btn" onClick={closeNotice}>
            Explore Platform
          </button>
        </div>
      </div>
    </div>
  );
}