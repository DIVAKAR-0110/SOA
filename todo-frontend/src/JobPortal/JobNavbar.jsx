import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";

export default function JobNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    "Home",
    "About",
    "Apply Now",
    "Track Application",
    "Contact",
  ];

  return (
    <>
      <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 30px;
          background: linear-gradient(90deg, #1e293b, #0f172a);
          color: #fff;
          font-family: 'Segoe UI', sans-serif;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .logo {
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 1px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logo span {
          color: #22c55e; /* OCMS green accent */
        }

        .nav-links {
          display: flex;
          gap: 25px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .nav-links a {
          color: #fff;
          text-decoration: none;
          position: relative;
          padding: 4px 0;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -3px;
          width: 0%;
          height: 2px;
          background: #22c55e;
          transition: width 0.3s ease;
        }

        .nav-links a:hover::after {
          width: 100%;
        }

        .hamburger {
          display: none;
          cursor: pointer;
          font-size: 24px;
        }

        @media (max-width: 900px) {
          .nav-links {
            display: none;
          }
          .hamburger {
            display: block;
            color: #dadada;
          }
        }

        /* Mobile Menu */
        .mobile-menu {
          position: fixed;
          top: 0;
          right: 0;
          width: 250px;
          height: 100vh;
          background: #0f172a;
          display: flex;
          flex-direction: column;
          padding: 30px;
          transition: transform 0.3s ease-in-out;
          z-index: 1001;
        }

        .mobile-menu a {
          margin: 15px 0;
          color: #fff;
          font-size: 18px;
          text-decoration: none;
        }

        .close-menu {
          align-self: flex-end;
          font-size: 28px;
          cursor: pointer;
        }

        /* Overlay when menu open */
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.4);
          z-index: 1000;
          transition: opacity 0.3s ease;
        }
      `}</style>

      <nav className="navbar">
        <div className="logo">
          <span>📝</span> OCMS Jobs
        </div>

        <div className="nav-links">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}>
              {item}
            </a>
          ))}
        </div>

        <div className="hamburger" onClick={() => setMenuOpen(true)}>
          <GiHamburgerMenu />
        </div>
      </nav>

      {/* Overlay */}
      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)}></div>
      )}

      {/* Mobile Menu */}
      <div
        className="mobile-menu"
        style={{ transform: menuOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="close-menu" onClick={() => setMenuOpen(false)}>
          <AiOutlineClose />
        </div>
        {navItems.map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
            onClick={() => setMenuOpen(false)}
          >
            {item}
          </a>
        ))}
      </div>
    </>
  );
}
