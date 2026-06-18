import { useState, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const displayName = useMemo(() => {
    return (
      user?.name ||
      user?.displayName ||
      user?.email?.split("@")[0] ||
      "User"
    );
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header className="navbar">
      <div
        className="navbar-logo"
        onClick={() => navigate("/")}
      >
        <div className="logo-circle">AI</div>

        <div>
          <h3>AI Resume Analyzer</h3>
          <span>ATS Resume Platform</span>
        </div>
      </div>

      <button
        className="mobile-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      <nav
        className={`navbar-links ${
          mobileOpen ? "show" : ""
        }`}
      >
        <NavLink to="/" className={navClass}>
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
        </NavLink>

        {user && (
          <>
            <NavLink
              to="/analyze"
              className={navClass}
            >
              Analyze
            </NavLink>

            <NavLink
              to="/history"
              className={navClass}
            >
              Reports
            </NavLink>
          </>
        )}
      </nav>

      <div className="navbar-right">
        {user ? (
          <>
            <div className="user-chip">
              {displayName}
            </div>

            <div className="dropdown">
              <button
                className="more-btn"
                onClick={() =>
                  setMoreOpen(!moreOpen)
                }
              >
                More
                <ChevronDown size={16} />
              </button>

              {moreOpen && (
                <div className="dropdown-menu">
                  <NavLink
                    to="/admin/contacts"
                    onClick={() =>
                      setMoreOpen(false)
                    }
                  >
                    Admin Contacts
                  </NavLink>

                  <button
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button
            className="login-btn"
            onClick={() =>
              navigate("/login")
            }
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}