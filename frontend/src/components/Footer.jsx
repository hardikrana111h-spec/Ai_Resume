import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer glass">
      <div className="footer-grid">
        <div className="footer-brand">
          <strong>AI Resume Analyzer</strong>
          <p className="footer-text">
            Build better resumes, analyze ATS compatibility, and improve your
            career profile with a professional AI-powered SaaS platform.
          </p>
        </div>

        <div className="footer-links">
          <strong>Product</strong>
          <Link to="/analyze">Resume Analyzer</Link>
          <Link to="/resume-builder">Resume Builder</Link>
          <Link to="/history">Reports</Link>
          <Link to="/pricing">Pricing</Link>
        </div>

        <div className="footer-links">
          <strong>Company</strong>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/help">Help Center</Link>
          <Link to="/login">Login</Link>
        </div>

        <div className="footer-links">
          <strong>Legal</strong>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms &amp; Conditions</Link>
          <span>Made for students, professionals, and job seekers.</span>
        </div>
      </div>

      <div className="footer-bottom footer-copy">
        <span>© 2026 AI Resume Analyzer</span>
        <span>Professional SaaS for resume growth</span>
      </div>
    </footer>
  );
}