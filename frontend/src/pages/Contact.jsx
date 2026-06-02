export default function Contact() {
  return (
    <div className="content-card glass">
      <span className="hero-badge">Contact Us</span>
      <h1 style={{ marginTop: 14 }}>Let us know what you need</h1>
      <p className="section-note">
        For support, feedback, partnership, or product requests, reach out to
        the team.
      </p>

      <div className="feature-grid" style={{ marginTop: 22 }}>
        <div className="feature-item">
          <h3>Email</h3>
          <p>support@airesumeanalyzer.com</p>
        </div>
        <div className="feature-item">
          <h3>Response Time</h3>
          <p>Usually within 24 hours</p>
        </div>
        <div className="feature-item">
          <h3>Feedback</h3>
          <p>We use user feedback to improve the platform continuously.</p>
        </div>
        <div className="feature-item">
          <h3>Location</h3>
          <p>Online-first SaaS platform</p>
        </div>
      </div>
    </div>
  );
}