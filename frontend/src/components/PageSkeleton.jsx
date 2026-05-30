import { useLocation } from "react-router-dom";

function Bar({ w = "100%", h = 18, mt = 0, radius = 0 }) {
  return (
    <div
      className="sk-bar"
      style={{ width: w, height: h, marginTop: mt, borderRadius: radius }}
    />
  );
}

function Card({ children, className = "" }) {
  return <div className={`sk-card ${className}`}>{children}</div>;
}

function HomeSkeleton() {
  return (
    <div className="sk-page">
      <Card className="sk-hero">
        <div className="sk-hero-left">
          <Bar w="150px" h={22} />
          <Bar w="72%" h={52} mt={18} />
          <Bar w="90%" h={18} mt={18} />
          <Bar w="72%" h={18} mt={10} />
          <div className="sk-row" style={{ marginTop: 22 }}>
            <Bar w="170px" h={44} />
            <Bar w="210px" h={44} />
          </div>
          <div className="sk-chip-row" style={{ marginTop: 18 }}>
            <Bar w="92px" h={34} radius={999} />
            <Bar w="110px" h={34} radius={999} />
            <Bar w="92px" h={34} radius={999} />
            <Bar w="104px" h={34} radius={999} />
          </div>
        </div>

        <div className="sk-hero-right">
          <Card className="sk-preview">
            <Bar w="42%" h={20} />
            <Bar w="78%" h={16} mt={20} />
            <Bar w="62%" h={16} mt={12} />
            <Bar w="86%" h={16} mt={12} />
            <Bar w="70%" h={16} mt={18} />
            <Bar w="44%" h={16} mt={12} />
          </Card>
        </div>
      </Card>

      <div className="sk-grid sk-grid-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <Bar w="56%" h={18} />
            <Bar w="78%" h={14} mt={14} />
          </Card>
        ))}
      </div>

      <div className="sk-grid sk-grid-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="sk-panel">
            <Bar w="42%" h={22} />
            <Bar w="92%" h={14} mt={18} />
            <Bar w="88%" h={14} mt={12} />
            <Bar w="76%" h={14} mt={12} />
            <Bar w="64%" h={14} mt={12} />
          </Card>
        ))}
      </div>
    </div>
  );
}

function AnalyzeSkeleton() {
  return (
    <div className="sk-page sk-grid sk-grid-2">
      <Card className="sk-panel">
        <Bar w="170px" h={22} />
        <Bar w="76%" h={52} mt={18} />
        <Bar w="96%" h={16} mt={18} />
        <Bar w="88%" h={16} mt={10} />
        <Bar w="100%" h={170} mt={26} />
        <Bar w="100%" h={58} mt={18} />
        <Bar w="100%" h={210} mt={18} />
      </Card>

      <Card className="sk-panel">
        <Bar w="68%" h={26} />
        <Bar w="100%" h={72} mt={18} />
        <Bar w="100%" h={72} mt={14} />
        <Bar w="100%" h={72} mt={14} />
        <Bar w="100%" h={72} mt={14} />
        <Bar w="100%" h={72} mt={14} />
      </Card>
    </div>
  );
}

function ReportSkeleton() {
  return (
    <div className="sk-page">
      <Card className="sk-hero sk-report-hero">
        <div className="sk-hero-left">
          <Bar w="170px" h={22} />
          <Bar w="56%" h={46} mt={18} />
          <Bar w="40%" h={16} mt={14} />
        </div>
        <div className="sk-score-circle" />
      </Card>

      <div className="sk-grid sk-grid-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <Bar w="40%" h={16} />
            <Bar w="52%" h={32} mt={12} />
          </Card>
        ))}
      </div>

      <div className="sk-grid sk-grid-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="sk-panel">
            <Bar w="42%" h={20} />
            <Bar w="96%" h={14} mt={16} />
            <Bar w="88%" h={14} mt={12} />
            <Bar w="76%" h={14} mt={12} />
          </Card>
        ))}
      </div>
    </div>
  );
}

function BuilderSkeleton() {
  return (
    <div className="sk-page sk-grid sk-grid-2">
      <Card className="sk-panel">
        <Bar w="180px" h={22} />
        <Bar w="92%" h={52} mt={18} />
        <Bar w="100%" h={56} mt={14} />
        <Bar w="100%" h={56} mt={14} />
        <Bar w="100%" h={56} mt={14} />
        <Bar w="100%" h={120} mt={18} />
        <Bar w="100%" h={180} mt={18} />
      </Card>

      <Card className="sk-panel">
        <Bar w="120px" h={20} />
        <Bar w="100%" h={700} mt={18} />
      </Card>
    </div>
  );
}

function LoginSkeleton() {
  return (
    <div className="sk-page sk-grid sk-grid-2">
      <Card className="sk-panel">
        <Bar w="38%" h={24} />
        <Bar w="82%" h={56} mt={18} />
        <Bar w="76%" h={20} mt={16} />
        <Bar w="88%" h={20} mt={10} />
        <Bar w="68%" h={20} mt={10} />
      </Card>

      <Card className="sk-panel">
        <Bar w="42%" h={24} />
        <Bar w="100%" h={56} mt={18} />
        <Bar w="100%" h={56} mt={14} />
        <Bar w="100%" h={56} mt={14} />
        <Bar w="100%" h={56} mt={14} />
      </Card>
    </div>
  );
}

function HistorySkeleton() {
  return (
    <div className="sk-page">
      <Card className="sk-panel">
        <Bar w="120px" h={22} />
        <div className="sk-list">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="sk-history-item">
              <Bar w="38%" h={18} />
              <Bar w="22%" h={14} mt={10} />
              <Bar w="30%" h={14} mt={10} />
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function PageSkeleton() {
  const location = useLocation();
  const path = location.pathname;

  if (path.startsWith("/analyze")) return <AnalyzeSkeleton />;
  if (path.startsWith("/report")) return <ReportSkeleton />;
  if (path.startsWith("/resume-builder")) return <BuilderSkeleton />;
  if (path.startsWith("/history")) return <HistorySkeleton />;
  if (path.startsWith("/login")) return <LoginSkeleton />;
  return <HomeSkeleton />;
}