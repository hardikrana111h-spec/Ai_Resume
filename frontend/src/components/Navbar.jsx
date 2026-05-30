import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navClass = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;

  const displayName =
    user?.name ||
    user?.displayName ||
    user?.email?.split("@")?.[0] ||
    "User";

  return (
    <header className="site-navbar glass">
      <div className="nav-brand">
        <div className="brand-logo">AI</div>
        <div className="brand-copy">
          <strong>AI Resume Analyzer</strong>
          <span>Google login • ATS score • Resume Builder</span>
        </div>
      </div>

      <nav className="nav-links">
        <NavLink to="/" end className={navClass}>
          Home
        </NavLink>
        <NavLink to="/analyze" className={navClass}>
          Analyze
        </NavLink>
        <NavLink to="/history" className={navClass}>
          Reports
        </NavLink>
        <NavLink to="/resume-builder" className={navClass}>
          Build Resume
        </NavLink>
      </nav>

      <div className="nav-actions">
        <div className="user-pill" title={displayName}>
          {displayName}
        </div>

        <button
          type="button"
          className="logout-btn"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}