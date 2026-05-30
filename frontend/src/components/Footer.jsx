export default function Footer() {
  return (
    <footer className="site-footer glass">
      <div className="footer-grid">
        <div className="footer-brand">
          <strong>AI Resume Analyzer</strong>
          <p>
            Analyze resumes, improve ATS score, and build modern resumes with a clean premium experience.
          </p>
        </div>

        <div className="footer-links">
          <strong>Quick Links</strong>
          <a href="/analyze">Analyze</a>
          <a href="/resume-builder">Resume Builder</a>
          <a href="/history">Reports</a>
        </div>

        <div className="footer-links">
          <strong>Features</strong>
          <a href="/">ATS Analysis</a>
          <a href="/">Google Login</a>
          <a href="/">Resume Templates</a>
        </div>

        <div className="footer-links">
          <strong>Contact</strong>
          <span>Built for students, developers, and job seekers.</span>
        </div>
      </div>

      <div className="footer-copy">
        © 2026 AI Resume Analyzer • Built for smart resume growth
      </div>
    </footer>
  );
}