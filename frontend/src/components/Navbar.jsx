import { useState, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  CircleUserRound,
  FileText,
  CreditCard,
  LogOut,
  House,
  ScanSearch,
  BadgeDollarSign,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  //const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const displayName = useMemo(() => {
    return (
      user?.name || user?.displayName || user?.email?.split("@")[0] || "User"
    );
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
  };

  //const closeMenu = () => setMobileOpen(false);

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
        <div className="navbar-logo" onClick={() => navigate("/")}>
          <div className="logo-circle">AI</div>
          <div>
            <h3>AI Resume Analyzer</h3>
            <span>ATS Resume Platform</span>
          </div>
        </div>

        {/* <div className="mobile-actions">
          {user && (
            <div className="mobile-profile">
              <button
                className="mobile-profile-btn"
                onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
              >
                <CircleUserRound size={24} />
              </button>

              {mobileProfileOpen && (
                <div className="mobile-profile-dropdown">
                  <div className="mobile-profile-header">
                    <div className="mobile-avatar">
                      {displayName.charAt(0).toUpperCase()}
                    </div>

                    <h4>{displayName}</h4>

                    <p>{user?.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      navigate("/history");
                      setMobileProfileOpen(false);
                    }}
                  >
                    <FileText size={18} />
                    My Reports
                  </button>

                  <button
                    onClick={() => {
                      navigate("/pricing");
                      setMobileProfileOpen(false);
                    }}
                  >
                    <CreditCard size={18} />
                    My Plan
                  </button>

                  <button onClick={handleLogout} className="logout-btn-mobile">
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className="mobile-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div> */}

        <nav className="navbar-links desktop-nav">
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
              <NavLink to="/analyze" className={navClass}>
                Analyze
              </NavLink>

              <NavLink to="/history" className={navClass}>
                Reports
              </NavLink>
            </>
          )}
        </nav>
        <div className="navbar-right">
          {user ? (
            <div className="mobile-profile">
              <button
                className="mobile-profile-btn"
                onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
              >
                <CircleUserRound size={24} />
              </button>

              {mobileProfileOpen && (
                <div className="mobile-profile-dropdown">
                  <div className="mobile-profile-header">
                    <div className="mobile-avatar">
                      {displayName.charAt(0).toUpperCase()}
                    </div>

                    <h4>{displayName}</h4>

                    <p>{user?.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      navigate("/history");
                      setMobileProfileOpen(false);
                    }}
                  >
                    <FileText size={18} />
                    My Reports
                  </button>

                  <button
                    onClick={() => {
                      navigate("/pricing");
                      setMobileProfileOpen(false);
                    }}
                  >
                    <CreditCard size={18} />
                    My Plan
                  </button>

                  <button onClick={handleLogout} className="logout-btn-mobile">
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      </header>
      <div className="mobile-bottom-nav">
        <NavLink to="/">
          <House size={22} />
          <span>Home</span>
        </NavLink>

        {user && (
          <NavLink to="/analyze">
            <ScanSearch size={22} />
            <span>Analyze</span>
          </NavLink>
        )}

        {user && (
          <NavLink to="/history">
            <FileText size={22} />
            <span>Reports</span>
          </NavLink>
        )}

        <NavLink to="/pricing">
          <BadgeDollarSign size={22} />
          <span>Plans</span>
        </NavLink>
      </div>
    </>
  );
}
