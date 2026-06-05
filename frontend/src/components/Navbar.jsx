import { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = useMemo(() => {
    return (
      user?.name ||
      user?.displayName ||
      user?.email?.split("@")?.[0] ||
      "User"
    );
  }, [user]);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  const navClass = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;

  return (
    <header className="site-navbar glass">
      <button
        type="button"
        className="nav-brand"
        onClick={() => {
          closeMenu();
          navigate("/");
        }}
        style={{
          border: "none",
          background: "transparent",
          padding: 0,
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <div className="brand-logo">AI</div>
        <div className="brand-copy">
          <strong>AI Resume Analyzer</strong>
          <span>AI SaaS • ATS Score • Resume Builder</span>
        </div>
      </button>

      <button
        type="button"
        className="nav-menu-btn"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        style={{
          border: "none",
          background: "transparent",
          fontSize: "28px",
          fontWeight: 900,
          color: "#0f172a",
          cursor: "pointer",
          display: "none",
        }}
      >
        ☰
      </button>

      <nav
        className={`nav-links ${menuOpen ? "open" : ""}`}
        onClick={closeMenu}
      >
        {/* <NavLink to="/" end className={navClass}>
          Home
        </NavLink>
        <NavLink to="/about" className={navClass}>
          About
        </NavLink>
        <NavLink to="/pricing" className={navClass}>
          Pricing
        </NavLink>
        <NavLink to="/contact" className={navClass}>
          Contact
        </NavLink>
        <NavLink to="/help" className={navClass}>
          Help
        </NavLink> */}

        {user && (
          <>
            <NavLink to="/analyze" className={navClass}>
              Analyze
            </NavLink>
            {/* <NavLink to="/resume-builder" className={navClass}>
              Resume Builder
            </NavLink> */}
            <NavLink to="/history" className={navClass}>
              Reports
            </NavLink>
          </>
        )}
      </nav>

      <div
        className={`nav-actions ${menuOpen ? "open" : ""}`}
        style={{ display: "flex", alignItems: "center", gap: "12px" }}
      >
        {user ? (
          <>
            <div className="user-pill" title={displayName}>
              {displayName}
            </div>

            <button
              type="button"
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
            <div className="more-menu">
  <button
    type="button"
    className="more-btn"
    onClick={() => setMoreOpen(!moreOpen)}
  >
    ⋮
  </button>

  {moreOpen && (
    <div className="more-dropdown">
      <NavLink to="/" onClick={() => setMoreOpen(false)}>
        Home
      </NavLink>
      <NavLink to="/about" onClick={() => setMoreOpen(false)}>
        About
      </NavLink>
      <NavLink to="/pricing" onClick={() => setMoreOpen(false)}>
        Pricing
      </NavLink>
      <NavLink to="/contact" onClick={() => setMoreOpen(false)}>
        Contact
      </NavLink>
      <NavLink to="/help" onClick={() => setMoreOpen(false)}>
        Help
      </NavLink>
    </div>
  )}
</div>
          </>
        ) : (
          <button
            type="button"
            className="nav-login-btn"
            onClick={() => {
              closeMenu();
              navigate("/login");
            }}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}