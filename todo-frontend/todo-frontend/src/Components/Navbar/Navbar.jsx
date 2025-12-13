// src/components/Navbar.jsx
import { useEffect, useState } from "react";

const MENU_ITEMS = [
  "Home",
  "Raise Complaint",
  "Track Complaint",
  "Categories",
  "Help Desk",
  "Contact",
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav-root ${scrolled ? "nav-root--scrolled" : ""}`}>
      <div className="nav-inner">
        <div className="nav-left">
          <div className="nav-logo">
            <span className="nav-logo-mark">OC</span>
            <div className="nav-logo-text">
              <span className="nav-logo-main">ComplaintMgmt</span>
              <span className="nav-logo-sub">Online Complaint System</span>
            </div>
          </div>
        </div>

        <nav className="nav-center">
          {MENU_ITEMS.map((item) => (
            <button key={item} className="nav-link">
              {item}
            </button>
          ))}
        </nav>

        <div className="nav-right">
          <button className="nav-icon-btn" aria-label="Notifications">
            <span className="nav-bell-icon" />
            <span className="nav-bell-dot" />
          </button>

          <div className="nav-user-wrapper">
            <button
              className="nav-user-btn"
              onClick={() => setUserOpen((o) => !o)}
            >
              <div className="nav-user-avatar">C</div>
              <span className="nav-user-name">Citizen</span>
              <span className="nav-user-chevron" />
            </button>

            <div
              className={`nav-user-menu ${
                userOpen ? "nav-user-menu--open" : ""
              }`}
            >
              <button className="nav-user-item">Profile</button>
              <button className="nav-user-item">My Complaints</button>
              <button className="nav-user-item nav-user-item--danger">
                Logout
              </button>
            </div>
          </div>

          <button
            className="nav-burger"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Open menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`nav-mobile ${mobileOpen ? "nav-mobile--open" : ""}`}>
        {MENU_ITEMS.map((item) => (
          <button key={item} className="nav-mobile-item">
            {item}
          </button>
        ))}
      </div>
    </header>
  );
}
