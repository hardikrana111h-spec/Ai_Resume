import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "workflow", label: "Workflow" },
  { id: "templates", label: "Templates" },
  { id: "about", label: "About" },
  { id: "pricing", label: "Pricing" },
  { id: "help", label: "Help" },
  { id: "testimonials", label: "Reviews" },
  { id: "contact", label: "Contact" },
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

const templates = ["Modern", "Minimal", "Creative", "Corporate", "Developer", "ATS Clean"];

const pricingPlans = [
  {
    name: "Free",
    price: "₹0",
    tag: "For testing the platform",
    items: ["Basic resume analysis", "Limited exports", "Core templates", "Private history"],
    cta: "Start Free",
    ctaTo: "/analyze",
  },
  {
    name: "Pro",
    price: "₹199/mo",
    tag: "Best for active job seekers",
    items: ["Full AI analysis", "Resume builder", "More templates", "Priority processing"],
    cta: "Go Pro",
    ctaTo: "/resume-builder",
  },
  {
    name: "Premium",
    price: "₹499/mo",
    tag: "For power users and support",
    items: ["Advanced AI suggestions", "Cover letter flow", "Unlimited exports", "Priority support"],
    cta: "Choose Premium",
    ctaTo: "/contact",
  },
];

const faqs = [
  {
    q: "Is this platform under active development?",
    a: "Yes. The product is live and functional, while we continue polishing mobile UI, workflow speed, and SaaS pages.",
  },
  {
    q: "What file formats are supported?",
    a: "PDF and DOCX resume uploads are supported for analysis and report generation.",
  },
  {
    q: "Are reports private?",
    a: "Yes. Each user can only access their own history and reports after login.",
  },
  {
    q: "What happens if internet is slow?",
    a: "The app should show a network status banner and continue gracefully with loading feedback.",
  },
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

const contactCards = [
  {
    title: "Email Support",
    desc: "support@airesumeanalyzer.com",
  },
  {
    title: "Response Time",
    desc: "Usually within 24 hours",
  },
  {
    title: "Platform Status",
    desc: "Live beta with active improvements",
  },
];

export default function Home() {
  const [counts, setCounts] = useState(stats.map(() => 0));
  const [showNotice, setShowNotice] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("ai_resume_notice_dismissed") !== "1";
  });

  useEffect(() => {
    let rafId;
    const duration = 1400;
    const start = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);

      setCounts(
        stats.map((item) => (item.text ? 0 : Math.round(item.target * progress)))
      );

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, []);

  const dismissNotice = () => {
    setShowNotice(false);
    localStorage.setItem("ai_resume_notice_dismissed", "1");
  };

  return (
    <div className="home-page">
      {showNotice && (
        <div className="info-box" style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <strong>🚧 Platform upgrade is active.</strong>{" "}
            <span>
              AI Resume Analyzer is being upgraded into a professional SaaS
              platform. Some sections may change during improvement.
            </span>
          </div>
          <button type="button" className="secondary-btn" onClick={dismissNotice}>
            Continue Anyway
          </button>
        </div>
      )}

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
            <Link to="/analyze" className="primary-btn">
              Start Analysis
            </Link>
            <Link to="/resume-builder" className="secondary-btn">
              Open Resume Builder
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
            <strong>{item.text ? item.text : `${counts[index]}${item.suffix}`}</strong>
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

              <div className="template-line w90" />
              <div className="template-line w75" />

              <div className="template-section">
                <div className="template-title" />
                <div className="template-line w95" />
                <div className="template-line w80" />
              </div>

              <div className="template-footer">Modern</div>
            </div>

            <div className="home-template-card">
              <div className="template-header">
                <div className="template-name">Corporate</div>
                <div className="template-role">Software Engineer</div>
              </div>

              <div className="template-line w90" />
              <div className="template-line w70" />

              <div className="template-section">
                <div className="template-title" />
                <div className="template-line w92" />
                <div className="template-line w82" />
              </div>

              <div className="template-footer">Corporate</div>
            </div>

            <div className="home-template-card">
              <div className="template-header">
                <div className="template-name">ATS Clean</div>
                <div className="template-role">React Developer</div>
              </div>

              <div className="template-line w88" />
              <div className="template-line w72" />

              <div className="template-section">
                <div className="template-title" />
                <div className="template-line w94" />
                <div className="template-line w78" />
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

      <section id="about" className="content-card glass home-section">
        <h2>About AI Resume Analyzer</h2>
        <p className="section-note">
          We are building a real-world SaaS platform that helps candidates analyze
          resumes, improve job fit, and create professional documents in one
          place.
        </p>

        <div className="step-list">
          <div className="step-item">
            <div className="step-no">A1</div>
            <div>
              <h3>Built for real job seekers</h3>
              <p>Designed for students, freshers, developers, and professionals.</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-no">A2</div>
            <div>
              <h3>Private by design</h3>
              <p>Reports stay inside the logged-in user workspace.</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-no">A3</div>
            <div>
              <h3>Always improving</h3>
              <p>The platform is live and under active enhancement for SaaS quality.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="content-card glass home-section">
        <h2>Pricing</h2>
        <p className="section-note">
          Simple plans for testing, active job hunting, and premium support.
        </p>

        <div className="feature-grid">
          {pricingPlans.map((plan) => (
            <div className="feature-item" key={plan.name}>
              <h3>{plan.name}</h3>
              <p style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", marginTop: 10 }}>
                {plan.price}
              </p>
              <p style={{ marginTop: 6, color: "#64748b" }}>{plan.tag}</p>

              <ul style={{ margin: "14px 0 0", paddingLeft: 18, lineHeight: 1.8 }}>
                {plan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div style={{ marginTop: 16 }}>
                <Link to={plan.ctaTo} className="primary-btn">
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="help" className="content-card glass home-section">
        <h2>Help Center</h2>
        <p className="section-note">
          Quick answers for common usage and platform questions.
        </p>

        <div className="step-list">
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
      </section>

      <section id="contact" className="content-grid home-section">
        <div className="content-card glass">
          <h2>Contact</h2>
          <div className="feature-grid">
            {contactCards.map((item) => (
              <div className="feature-item" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="section-note" style={{ marginTop: 18 }}>
            Need support, feedback, or a feature request? Reach out and we will
            improve the platform with you.
          </p>

          <div className="hero-actions">
            <a href="mailto:support@airesumeanalyzer.com" className="primary-btn">
              Email Support
            </a>
            <Link to="/login" className="secondary-btn">
              Login
            </Link>
          </div>
        </div>

        <div className="content-card glass">
          <h2>Company status</h2>
          <div className="step-list">
            <div className="step-item">
              <div className="step-no">LV</div>
              <div>
                <h3>Live beta</h3>
                <p>The app is running and actively getting better.</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-no">UI</div>
              <div>
                <h3>UI refinement</h3>
                <p>Mobile responsiveness and company-level pages are next.</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-no">AI</div>
              <div>
                <h3>AI engine</h3>
                <p>Resume analysis, suggestions, and workflow automation are already in place.</p>
              </div>
            </div>
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