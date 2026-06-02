const faqs = [
  {
    q: "How do I analyze a resume?",
    a: "Go to Analyze, upload a PDF or DOCX file, choose a role, and submit.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Each user only sees their own reports and resume history.",
  },
  {
    q: "Does the builder support live preview?",
    a: "Yes. The builder is designed for live preview and export-friendly editing.",
  },
  {
    q: "What if the internet is slow?",
    a: "The app should show network-aware messages and continue gracefully.",
  },
];

export default function Help() {
  return (
    <div className="content-card glass">
      <span className="hero-badge">Help Center</span>
      <h1 style={{ marginTop: 14 }}>Quick answers for common questions</h1>
      <p className="section-note">
        Use this page to understand how the platform works and how to get the
        best results.
      </p>

      <div className="step-list" style={{ marginTop: 22 }}>
        {faqs.map((item, index) => (
          <div className="step-item" key={item.q}>
            <div className="step-no">{String(index + 1).padStart(2, "0")}</div>
            <div>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}