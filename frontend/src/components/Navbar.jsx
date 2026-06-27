import { useState, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
    setMobileOpen(false); 
  };

  const closeMenu = () => setMobileOpen(false);

  const navClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <>
      {/* Mobile Center Alignment & User Name UI Fix */}
      <style>
        {`
          @media (max-width: 768px) {
            .navbar-links.show {
              display: flex;
              flex-direction: column;
              align-items: center; /* Items ko center mein layega */
              text-align: center;
              padding: 20px 0;
            }
            .navbar-links.show .nav-link,
            .navbar-links.show .logout-btn-inline {
              width: 100%;
              justify-content: center;
              text-align: center;
            }
            .mobile-user-greeting {
              font-size: 1.1rem;
              font-weight: 700;
              color: #4f46e5;
              background: #eef2ff;
              padding: 10px 20px;
              border-radius: 12px;
              margin-bottom: 15px;
              width: 85%;
              text-align: center;
            }
          }
        `}
      </style>

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
          
          {/* Show User Name in Mobile Menu when Logged In */}
          {user && mobileOpen && (
            <div className="mobile-user-greeting">
              Hello, {displayName} 👋
            </div>
          )}

          <NavLink to="/" className={navClass} onClick={closeMenu}>Home</NavLink>
          <NavLink to="/about" className={navClass} onClick={closeMenu}>About</NavLink>
          <NavLink to="/pricing" className={navClass} onClick={closeMenu}>Pricing</NavLink>
          <NavLink to="/contact" className={navClass} onClick={closeMenu}>Contact</NavLink>
          <NavLink to="/help" className={navClass} onClick={closeMenu}>Help</NavLink>

          {user && (
            <>
              <NavLink to="/analyze" className={navClass} onClick={closeMenu}>Analyze</NavLink>
              <NavLink to="/history" className={navClass} onClick={closeMenu}>Reports</NavLink>
              
              <button 
                className="nav-link logout-btn-inline" 
                onClick={handleLogout}
                style={{ background: "transparent", border: "none", cursor: "pointer", fontWeight: "600", color: "#ef4444" }}
              >
                Logout
              </button>
            </>
          )}

          {/* Show Login button in mobile menu if NOT logged in */}
          {!user && mobileOpen && (
            <button 
              className="login-btn" 
              onClick={() => { navigate("/login"); closeMenu(); }}
              style={{ marginTop: "15px", width: "85%" }}
            >
              Login
            </button>
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
    </>
  );
}