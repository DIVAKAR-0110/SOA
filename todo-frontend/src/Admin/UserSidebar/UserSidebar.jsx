import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./usersidebar.css";

function UserSidebar({ onNavigate, currentPage = "home" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [localActiveItem, setLocalActiveItem] = useState("dashboard");

  // Map pages to menu items
  const pageToItemMap = {
    home: "dashboard",
    complaints: "complaints",
    form: "lodge",
    category: "lodge",
    status: "status",
  };

  // Sync local active item with actual page after navigation completes
  useEffect(() => {
    const newActiveItem = pageToItemMap[currentPage] || "dashboard";
    setLocalActiveItem(newActiveItem);
  }, [currentPage]);

  // Current active item for rendering
  const activeItem = localActiveItem;

  const handleMenuClick = (e, itemKey, action) => {
    e.preventDefault();
    e.stopPropagation();

    // Update active item IMMEDIATELY for visual feedback
    setLocalActiveItem(itemKey);

    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 768) {
      setTimeout(() => setIsOpen(false), 100);
    }

    if (action === "dashboard") {
      onNavigate("home");
    } else if (action === "lodge") {
      navigate("/categories");
    } else if (action === "complaints") {
      onNavigate("complaints");
    } else if (action === "status") {
      onNavigate("status");
    } else if (action === "profile") {
      navigate("/profile");
    } else if (action === "delete") {
      if (
        window.confirm(
          "Are you sure you want to delete your account? This action cannot be undone.",
        )
      ) {
        navigate("/delete-account");
      }
    } else if (action === "logout") {
      if (window.confirm("Are you sure you want to sign out?")) {
        navigate("/logout");
      }
    }
  };

  const toggleSidebar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        title={isOpen ? "Close menu" : "Open menu"}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <aside className={`user-sidebar ${isOpen ? "open" : ""}`}>
        <nav className="sidebar-nav">
          {/* Main Menu Section */}
          <div className="sidebar-section">
            <ul className="nav-menu">
              <li>
                <button
                  className={`nav-item ${activeItem === "dashboard" ? "active" : ""}`}
                  onClick={(e) => handleMenuClick(e, "dashboard", "dashboard")}
                  title="Go to your dashboard"
                >
                  <span className="nav-icon">🏠</span>
                  <span className="nav-text">User Dashboard</span>
                </button>
              </li>

              <li>
                <button
                  className={`nav-item ${activeItem === "lodge" ? "active" : ""}`}
                  onClick={(e) => handleMenuClick(e, "lodge", "lodge")}
                  title="Lodge a new complaint"
                >
                  <span className="nav-icon">➕</span>
                  <span className="nav-text">Lodge Complaint</span>
                </button>
              </li>

              <li>
                <button
                  className={`nav-item ${activeItem === "complaints" ? "active" : ""}`}
                  onClick={(e) =>
                    handleMenuClick(e, "complaints", "complaints")
                  }
                  title="View your complaints"
                >
                  <span className="nav-icon">📄</span>
                  <span className="nav-text">My Complaints</span>
                </button>
              </li>

              <li>
                <button
                  className={`nav-item ${activeItem === "status" ? "active" : ""}`}
                  onClick={(e) => handleMenuClick(e, "status", "status")}
                  title="Track complaint status"
                >
                  <span className="nav-icon">🔍</span>
                  <span className="nav-text">View Status</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Account Activity Section */}
          <div className="sidebar-section">
            <h3 className="section-header">Account Activity</h3>
            <ul className="nav-menu">
              <li>
                <button
                  className={`nav-item ${activeItem === "profile" ? "active" : ""}`}
                  onClick={(e) => handleMenuClick(e, "profile", "profile")}
                  title="Edit your profile"
                >
                  <span className="nav-icon">✏️</span>
                  <span className="nav-text">Edit Profile</span>
                </button>
              </li>

              <li>
                <button
                  className={`nav-item danger ${activeItem === "delete" ? "active" : ""}`}
                  onClick={(e) => handleMenuClick(e, "delete", "delete")}
                  title="Permanently delete your account"
                >
                  <span className="nav-icon">🗑️</span>
                  <span className="nav-text">Delete Account</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Sign Out Button - Fixed at Bottom */}
        <div className="sidebar-footer">
          <button
            className="nav-item logout"
            onClick={(e) => handleMenuClick(e, "logout", "logout")}
            title="Sign out from your account"
          >
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default UserSidebar;
