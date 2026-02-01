import { useState } from "react";
import "./user.css";
import ComplaintForm from "./ComplaintForm";
import MyComplaints from "./MyComplaints";
import ViewStatus from "./ViewStatus";
import CategoryPage from "../../modules/complaint/category";
import UserSidebar from "./UserSidebar";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const initialPage = location?.state?.show === 'complaints' ? 'complaints' : 'home';
  const [page, setPage] = useState(initialPage); // keep internal for MyComplaints fallback
  const userName = user?.name || "User";

  // Home Page
  if (page === "home") {
    return (
      <div className="user-dashboard-wrapper">
        <UserSidebar onNavigate={setPage} currentPage={page} />
        <div className="dashboard-container">
          <h2>Welcome back, {userName} 👋</h2>

          {/* Trust & Confidence Message */}
          <div className="trust-message">
            <p className="trust-title">📋 Your Voice Matters</p>
            <p className="trust-desc">
              We are here to listen and act. Every complaint you file is important and deserves attention. 
              Our system is designed with your trust in mind—your information is secure, your concerns are 
              confidential, and your grievances are handled with care by dedicated officials. From the moment 
              you submit, you can track every step of your complaint's progress. We don't just register complaints; 
              we work towards real solutions. Your feedback helps us build a better system for everyone.
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="statistics-container">
            {/* Total Complaints Card */}
            <div className="stat-card stat-blue">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <p className="stat-number">0</p>
                <p className="stat-label">Total Complaints Registered</p>
              </div>
            </div>

            {/* Pending Complaints Card */}
            <div className="stat-card stat-orange">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <p className="stat-number">0</p>
                <p className="stat-label">Complaints Pending</p>
              </div>
            </div>

            {/* Closed Complaints Card */}
            <div className="stat-card stat-green">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <p className="stat-number">0</p>
                <p className="stat-label">Complaints Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Complaint Form Page (kept for internal navigation fallback)
  if (page === "form") {
    return (
      <div className="user-dashboard-wrapper">
        <UserSidebar onNavigate={setPage} currentPage={page} />
        <div className="dashboard-container">
          <button className="back-btn" onClick={() => setPage("home")}>
            ← Back to Home
          </button>
          <ComplaintForm />
        </div>
      </div>
    );
  }

  // My Complaints Page
  if (page === "complaints") {
    return (
      <div className="user-dashboard-wrapper">
        <UserSidebar onNavigate={setPage} currentPage={page} />
        <div className="dashboard-container">
          <button className="back-btn" onClick={() => setPage("home")}>
            ← Back to Home
          </button>
          <MyComplaints />
        </div>
      </div>
    );
  }

  // Category Page
  if (page === "category") {
    return (
      <div className="user-dashboard-wrapper">
        <UserSidebar onNavigate={setPage} currentPage={page} />
        <div className="dashboard-container">
          <button className="back-btn" onClick={() => setPage("home")}>
            ← Back to Home
          </button>
          <CategoryPage />
        </div>
      </div>
    );
  }

  // View Status Page
  if (page === "status") {
    return (
      <div className="user-dashboard-wrapper">
        <UserSidebar onNavigate={setPage} currentPage={page} />
        <div className="dashboard-container">
          <button className="back-btn" onClick={() => setPage("home")}>
            ← Back to Home
          </button>
          <ViewStatus />
        </div>
      </div>
    );
  }

  // Default fallback (should not reach here)
  return (
    <div className="user-dashboard-wrapper">
      <UserSidebar onNavigate={setPage} currentPage={page} />
      <div className="dashboard-container">
        <h2>Welcome back, {userName} 👋</h2>
        <p>Page not found. Please select a menu option.</p>
      </div>
    </div>
  );
}

export default UserDashboard;
