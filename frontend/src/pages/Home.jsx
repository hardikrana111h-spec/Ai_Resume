import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "workflow", label: "Workflow" },
  { id: "templates", label: "Templates" },
  { id: "testimonials", label: "Reviews" },
  { id: "cta", label: "Start" },
];

const stats = [
  { target: 99, suffix: "%", label: "ATS-ready structure" },
  { target: 10, suffix: "+", label: "Resume templates" },
  { target: 3, suffix: "x", label: "Faster resume creation" },
  { text: "AI", label: "Smart analysis" },
];

const features = [
  {
    title: "AI Resume Analysis",
    desc: "Upload a PDF or DOCX and instantly get ATS score, strengths, weaknesses, and missing skills.",
  },
  {
    title: "Resume Builder",
    desc: "Create polished resumes with structured sections, templates, and live preview.",
  },
  {
    title: "Google Authentication",
    desc: "Secure sign-in with Google account and private user-wise history reports.",
  },
  {
    title: "Private Reports",
    desc: "Every user sees only their own history, reports, and resume results.",
  },
];

const steps = [
  {
    no: "01",
    title: "Login securely",
    desc: "Sign in with Google or email to unlock your personal workspace.",
  },
  {
    no: "02",
    title: "Upload resume",
    desc: "Choose PDF or DOCX and select the target job role.",
  },
  {
    no: "03",
    title: "Get AI insights",
    desc: "Receive score, feedback, and suggestions in a structured report.",
  },
  {
    no: "04",
    title: "Improve and export",
    desc: "Use the builder, update sections, and export your polished resume.",
  },
];

const templates = [
  "Modern",
  "Minimal",
  "Creative",
  "Corporate",
  "Developer",
  "ATS Clean",
];

const testimonials = [
  {
    name: "BCA Student",
    text: "This helped me understand what recruiters want and how to improve my resume fast.",
  },
  {
    name: "Frontend Developer",
    text: "The resume builder and live preview feel professional and easy to use.",
  },
  {
    name: "Fresher Applicant",
    text: "The analysis points and template options are very practical for job hunting.",
  },
];

export default function Home() {
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    let rafId;
    const duration = 1400;
    const start = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);

      setCounts(
        stats.map((item) =>
          item.text ? 0 : Math.round(item.target * progress)
        )
      );

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="home-page">
      <div className="home-sections-nav glass">
        {sections.map((item) => (
          <a key={item.id} href={`#${item.id}`} className="home-section-link">
            {item.label}
          </a>
        ))}
      </div>

      <section id="overview" className="hero-section glass home-section">
        <div className="hero-left">
          <span className="hero-badge">AI Powered Resume Platform</span>
          <h1 className="hero-title">
            Build better resumes and analyze them with smart AI
          </h1>
          <p className="hero-sub">
            Create ATS-friendly resumes, track your reports, and improve your
            job application quality with a clean modern workflow.
          </p>

          <div className="hero-actions">
            <Link to="/analyze">
              <button className="primary-btn">Start Analysis</button>
            </Link>
            <Link to="/resume-builder">
              <button className="secondary-btn">Open Resume Builder</button>
            </Link>
          </div>

          <div className="hero-tags">
            <span>ATS score</span>
            <span>Resume templates</span>
            <span>Google login</span>
            <span>Private reports</span>
          </div>
        </div>

        <div className="hero-right">
          <div className="document-stage">
            <div className="document-card doc-back" />
            <div className="document-card doc-front">
              <div className="doc-topline">
                <span className="doc-pill">Resume Preview</span>
              </div>

              <div className="doc-title-lines">
                <div className="doc-name">John Doe</div>
                <div className="doc-role">React Frontend Developer</div>
              </div>

              <div className="doc-section">
                <div className="doc-line w92" />
                <div className="doc-line w78" />
                <div className="doc-line w86" />
              </div>

              <div className="doc-section">
                <div className="doc-section-title">Skills</div>
                <div className="doc-chip-row">
                  <span>React</span>
                  <span>Node.js</span>
                  <span>Tailwind</span>
                  <span>API</span>
                </div>
              </div>

              <div className="doc-section">
                <div className="doc-section-title">Experience</div>
                <div className="doc-line w88" />
                <div className="doc-line w64" />
                <div className="doc-line w72" />
              </div>
            </div>

            <div className="doc-floating doc-floating-1">PDF</div>
            <div className="doc-floating doc-floating-2">DOCX</div>
          </div>
        </div>
      </section>

      <section id="features" className="stats-section home-section">
        {stats.map((item, index) => (
          <div className="stat-card glass" key={item.label}>
            <strong>
              {item.text ? item.text : `${counts[index]}${item.suffix}`}
            </strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="content-grid home-section">
        <div className="content-card glass">
          <h2>Why this platform stands out</h2>
          <div className="feature-grid">
            {features.map((item) => (
              <div className="feature-item" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="workflow" className="content-card glass">
          <h2>How it works</h2>
          <div className="step-list">
            {steps.map((step) => (
              <div className="step-item" key={step.no}>
                <div className="step-no">{step.no}</div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="templates" className="content-grid home-section">
        <div className="content-card glass">
          <h2>Resume Builder templates</h2>
          <div className="template-chip-row">
            {templates.map((name) => (
              <span className="template-chip soft" key={name}>
                {name}
              </span>
            ))}
          </div>
          <div className="home-template-showcase">
  <div className="home-template-card">
    <div className="template-header">
      <div className="template-name">Modern</div>
      <div className="template-role">Frontend Developer</div>
    </div>

    <div className="template-line w90"></div>
    <div className="template-line w75"></div>

    <div className="template-section">
      <div className="template-title"></div>
      <div className="template-line w95"></div>
      <div className="template-line w80"></div>
    </div>

    <div className="template-footer">Modern</div>
  </div>

  <div className="home-template-card">
    <div className="template-header">
      <div className="template-name">Corporate</div>
      <div className="template-role">Software Engineer</div>
    </div>

    <div className="template-line w90"></div>
    <div className="template-line w70"></div>

    <div className="template-section">
      <div className="template-title"></div>
      <div className="template-line w92"></div>
      <div className="template-line w82"></div>
    </div>

    <div className="template-footer">Corporate</div>
  </div>

  <div className="home-template-card">
    <div className="template-header">
      <div className="template-name">ATS Clean</div>
      <div className="template-role">React Developer</div>
    </div>

    <div className="template-line w88"></div>
    <div className="template-line w72"></div>

    <div className="template-section">
      <div className="template-title"></div>
      <div className="template-line w94"></div>
      <div className="template-line w78"></div>
    </div>

    <div className="template-footer">ATS</div>
  </div>
</div>
          <p className="section-note">
            Use different layouts for corporate, creative, ATS clean, and
            developer-style resumes.
          </p>
        </div>

        <div id="testimonials" className="content-card glass">
          <h2>What users say</h2>
          <div className="testimonial-list">
            {testimonials.map((t) => (
              <div className="testimonial-card" key={t.name}>
                <strong>{t.name}</strong>
                <p>{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="cta-section glass home-section">
        <div>
          <h2>Ready to improve your resume?</h2>
          <p>
            Upload your resume, analyze it, and then build a better version
            with the builder.
          </p>
        </div>
        <div className="cta-actions">
          <Link to="/analyze">
            <button className="primary-btn">Analyze Resume</button>
          </Link>
          <Link to="/resume-builder">
            <button className="secondary-btn">Build Resume</button>
          </Link>
        </div>
      </section>
    </div>
  );
}