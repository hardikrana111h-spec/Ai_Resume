import { useState, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // We only need the mobile menu state now
  const [mobileOpen, setMobileOpen] = useState(false);

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
    setMobileOpen(false); // Close the mobile menu after logging out
  };

  // Helper to close mobile menu on link click
  const closeMenu = () => setMobileOpen(false);

  const navClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header className="navbar">
      <div className="navbar-logo" onClick={() => { navigate("/"); closeMenu(); }}>
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

      <nav className={`navbar-links ${mobileOpen ? "show" : ""}`}>
        <NavLink to="/" className={navClass} onClick={closeMenu}>Home</NavLink>
        <NavLink to="/about" className={navClass} onClick={closeMenu}>About</NavLink>
        <NavLink to="/pricing" className={navClass} onClick={closeMenu}>Pricing</NavLink>
        <NavLink to="/contact" className={navClass} onClick={closeMenu}>Contact</NavLink>
        <NavLink to="/help" className={navClass} onClick={closeMenu}>Help</NavLink>

        {user && (
          <>
            <NavLink to="/analyze" className={navClass} onClick={closeMenu}>Analyze</NavLink>
            <NavLink to="/history" className={navClass} onClick={closeMenu}>Reports</NavLink>
            
            {/* Logout is now a standard link in the menu */}
            <button className="nav-link logout-btn-inline" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </nav>

      <div className="navbar-right">
        {user ? (
          <div className="user-chip">{displayName}</div>
        ) : (
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>
    </header>
  );
}