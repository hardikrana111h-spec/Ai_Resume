import { useLocation } from "react-router-dom";

function Sk({
  w = "100%",
  h = 18,
  r = 12,
  className = "",
  mt = 0,
}) {
  return (
    <div
      className={`sk ${className}`}
      style={{
        width: w,
        height: h,
        borderRadius: r,
        marginTop: mt,
      }}
    />
  );
}

function HomeSkeleton() {
  return (
    <div className="page-skeleton">
      {/* HERO */}
      <section className="home-hero-sk">
        <div className="home-left-sk">
          <Sk w="140px" h={32} />
          <Sk w="78%" h={66} mt={20} />
          <Sk w="90%" h={18} mt={18} />
          <Sk w="74%" h={18} mt={10} />

          <div className="sk-btn-row">
            <Sk w="180px" h={52} mt={26} />
            <Sk w="200px" h={52} mt={26} />
          </div>

          <div className="sk-chip-row">
            {Array.from({ length: 5 }).map((_, i) => (
              <Sk key={i} w="110px" h={38} r={999} mt={16} />
            ))}
          </div>
        </div>

        <div className="home-right-sk">
          <div className="resume-preview-sk">
            <Sk w="42%" h={26} />
            <Sk w="90%" h={14} mt={22} />
            <Sk w="72%" h={14} mt={10} />
            <Sk w="84%" h={14} mt={10} />
            <Sk w="62%" h={14} mt={10} />

            <Sk w="36%" h={22} mt={26} />

            <Sk w="92%" h={14} mt={18} />
            <Sk w="82%" h={14} mt={10} />
            <Sk w="66%" h={14} mt={10} />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="sk-feature-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="sk-feature-card">
            <Sk w="64px" h={64} r={18} />
            <Sk w="60%" h={20} mt={18} />
            <Sk w="90%" h={14} mt={14} />
            <Sk w="74%" h={14} mt={10} />
          </div>
        ))}
      </section>

      {/* ANALYTICS */}
      <section className="sk-analytics-grid">
        <div className="sk-analytics-card">
          <Sk w="180px" h={24} />
          <Sk w="100%" h={240} mt={24} />
        </div>

        <div className="sk-analytics-card">
          <Sk w="160px" h={24} />
          <div className="sk-list-area">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="sk-list-item">
                <Sk w="44px" h={44} r={14} />
                <div style={{ flex: 1 }}>
                  <Sk w="72%" h={16} />
                  <Sk w="48%" h={14} mt={10} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function AnalyzeSkeleton() {
  return (
    <div className="analyze-sk-layout">
      {/* LEFT */}
      <div className="analyze-left-sk">
        <Sk w="150px" h={28} />
        <Sk w="80%" h={68} mt={20} />
        <Sk w="90%" h={16} mt={18} />
        <Sk w="74%" h={16} mt={10} />

        <Sk w="120px" h={18} mt={30} />
        <Sk w="100%" h={58} mt={14} />
        <Sk w="100%" h={44} mt={12} />

        <Sk w="150px" h={18} mt={32} />

        <div className="upload-area-sk">
          <Sk w="76px" h={76} r={20} />
          <Sk w="220px" h={18} mt={20} />
          <Sk w="180px" h={14} mt={10} />
        </div>

        <Sk w="100%" h={58} mt={20} />

        <div className="step-progress-sk">
          <div className="step-row-sk">
            <Sk w="44px" h={44} r={999} />
            <Sk w="84%" h={14} />
          </div>

          <div className="step-row-sk">
            <Sk w="44px" h={44} r={999} />
            <Sk w="72%" h={14} />
          </div>

          <div className="step-row-sk">
            <Sk w="44px" h={44} r={999} />
            <Sk w="66%" h={14} />
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="analyze-right-sk">
        <Sk w="60%" h={28} />

        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="analysis-point-sk">
            <Sk w="44%" h={18} />
            <Sk w="88%" h={14} mt={12} />
            <Sk w="68%" h={14} mt={10} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportSkeleton() {
  return (
    <div className="report-sk-page">
      {/* TOP */}
      <div className="report-top-sk">
        <div>
          <Sk w="240px" h={40} />
          <Sk w="320px" h={18} mt={16} />
          <Sk w="240px" h={16} mt={10} />
        </div>

        <Sk w="150px" h={150} r={999} />
      </div>

      {/* SCORE CARDS */}
      <div className="report-score-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="report-score-card-sk">
            <Sk w="44%" h={16} />
            <Sk w="56%" h={38} mt={18} />
          </div>
        ))}
      </div>

      {/* CONTENT */}
      <div className="report-content-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="report-block-sk">
            <Sk w="46%" h={22} />
            <Sk w="94%" h={14} mt={18} />
            <Sk w="88%" h={14} mt={12} />
            <Sk w="72%" h={14} mt={12} />
            <Sk w="80%" h={14} mt={12} />
          </div>
        ))}
      </div>
    </div>
  );
}

function BuilderSkeleton() {
  return (
    <div className="builder-sk-layout">
      {/* FORM */}
      <div className="builder-form-sk">
        <Sk w="180px" h={28} />

        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <Sk w="120px" h={16} mt={24} />
            <Sk w="100%" h={54} mt={10} />
          </div>
        ))}

        <Sk w="100%" h={120} mt={20} />
      </div>

      {/* PREVIEW */}
      <div className="builder-preview-sk">
        <div className="resume-paper-sk">
          <div className="resume-header-sk">
            <div>
              <Sk w="240px" h={34} />
              <Sk w="160px" h={18} mt={14} />
            </div>

            <div>
              <Sk w="180px" h={14} />
              <Sk w="140px" h={14} mt={10} />
              <Sk w="120px" h={14} mt={10} />
            </div>
          </div>

          <Sk w="100%" h={2} mt={24} />

          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ marginTop: 26 }}>
              <Sk w="180px" h={20} />
              <Sk w="96%" h={14} mt={14} />
              <Sk w="88%" h={14} mt={10} />
              <Sk w="76%" h={14} mt={10} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HistorySkeleton() {
  return (
    <div className="history-sk-page">
      <Sk w="220px" h={42} />

      <div className="history-grid-sk">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="history-card-sk">
            <Sk w="70%" h={24} />
            <Sk w="40%" h={18} mt={14} />
            <Sk w="50%" h={14} mt={10} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RouteSkeleton() {
  const location = useLocation();
  const path = location.pathname;

  if (path.startsWith("/analyze")) {
    return <AnalyzeSkeleton />;
  }

  if (path.startsWith("/report")) {
    return <ReportSkeleton />;
  }

  if (path.startsWith("/resume-builder")) {
    return <BuilderSkeleton />;
  }

  if (path.startsWith("/history")) {
    return <HistorySkeleton />;
  }

  return <HomeSkeleton />;
}