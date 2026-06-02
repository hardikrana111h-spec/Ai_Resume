export default function About() {
  return (
    <div className="content-card glass">
      <span className="hero-badge">About Us</span>
      <h1 style={{ marginTop: 14 }}>Built for modern job seekers</h1>
      <p className="section-note">
        AI Resume Analyzer is a SaaS platform designed to help students,
        freshers, and professionals create stronger resumes, understand ATS
        gaps, and present themselves better to employers.
      </p>

      <div className="step-list" style={{ marginTop: 20 }}>
        <div className="step-item">
          <div className="step-no">01</div>
          <div>
            <h3>Our mission</h3>
            <p>Make resume improvement simple, fast, and accessible for everyone.</p>
          </div>
        </div>
        <div className="step-item">
          <div className="step-no">02</div>
          <div>
            <h3>Our vision</h3>
            <p>Build a complete career toolkit around resume analysis and smart AI guidance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}