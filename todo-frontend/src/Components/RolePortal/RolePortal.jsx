// src/pages/RoleEntry.jsx
import { useNavigate } from "react-router-dom";
import "./RolePortal.css";

export default function RolePortal() {
  const navigate = useNavigate();

  return (
    <div className="re-root">
      {/* Top bar */}
      <header className="re-topbar">
        <div className="re-brand">
          <div className="re-logo">OC</div>
          <div>
            <div className="re-title">OCMS</div>
            <div className="re-subtitle">
              Online Complaint Management System
            </div>
          </div>
        </div>
        <nav className="re-nav">
          <button className="re-nav-link" type="button">
            Home
          </button>
          <button className="re-nav-link" type="button">
            Complaints
          </button>
          <button className="re-nav-link" type="button">
            Help
          </button>
        </nav>
      </header>

      {/* Page heading */}
      <section className="re-hero">
        <h1>Register and manage complaints as part of the OCMS team.</h1>
        <p>
          If you are an Officer Head or Task Manager, use these secure
          registration and login options to access your dashboards.
        </p>
      </section>

      {/* Officer Head block */}
      <section className="re-role-block">
        <div className="re-role-header">
          <div className="re-role-chip re-role-chip--head">Officer Head</div>
          <h2>Lead a location as an Officer Head</h2>
          <p>
            Own all complaints for one or more locations, configure
            auto‑assignment rules, and monitor the performance of your Task
            Managers.
          </p>
        </div>

        <div className="re-role-content">
          <div className="re-role-main">
            <div className="re-btn-row">
              <button
                type="button"
                className="re-btn re-btn-primary"
                onClick={() => navigate("/officer-head/register")}
              >
                Register Officer Head
              </button>
              <button
                type="button"
                className="re-btn re-btn-outline"
                onClick={() => navigate("/officer-head/login")}
              >
                Officer Head Login
              </button>
            </div>

            <ul className="re-list">
              <li>Register with your official email and location details.</li>
              <li>
                Wait for Admin approval (your backend will validate & activate).
              </li>
              <li>
                After approval, access the Officer Dashboard to hire Task
                Managers and oversee complaints.
              </li>
            </ul>
          </div>

          <aside className="re-role-side">
            <h3>Your responsibilities</h3>
            <ul>
              <li>Monitor all complaints for your location.</li>
              <li>Assign tasks to Task Managers automatically or manually.</li>
              <li>Track SLA, workload and salary metrics for your team.</li>
            </ul>
            <p className="re-note">
              This UI only handles navigation; all approvals and security checks
              will be implemented in your backend.
            </p>
          </aside>
        </div>
      </section>

      {/* Task Manager block */}
      <section className="re-role-block">
        <div className="re-role-header">
          <div className="re-role-chip re-role-chip--tm">Task Manager</div>
          <h2>Work as a Task Manager</h2>
          <p>
            Receive assigned complaints from your Officer Head, update status,
            log work time and help citizens get faster resolutions.
          </p>
        </div>

        <div className="re-role-content">
          <div className="re-role-main">
            <div className="re-btn-row">
              <button
                type="button"
                className="re-btn re-btn-primary re-btn-primary--tm"
                onClick={() => navigate("/task-manager/register")}
              >
                Register Task Manager
              </button>
              <button
                type="button"
                className="re-btn re-btn-outline"
                onClick={() => navigate("/task-manager/login")}
              >
                Task Manager Login
              </button>
            </div>

            <ul className="re-list">
              <li>Register using the code or email of your Officer Head.</li>
              <li>Backend will link you to the correct Head and location.</li>
              <li>
                After activation, use your dashboard to see assigned complaints
                and update progress.
              </li>
            </ul>
          </div>

          <aside className="re-role-side">
            <h3>What you can do</h3>
            <ul>
              <li>View tasks assigned to you, with clear priorities.</li>
              <li>Change status, add remarks and upload supporting details.</li>
              <li>
                See your own SLA performance and incentives as your career
                grows.
              </li>
            </ul>
            <p className="re-note">
              Navigation from here is mobile‑friendly and safe to share with new
              team members.
            </p>
          </aside>
        </div>
      </section>

      {/* Extra trust info */}
      <section className="re-trust">
        <div className="re-trust-card">
          <h3>Designed for trust</h3>
          <p>
            OCMS separates citizen, Officer Head and Task Manager access. Only
            authenticated users can reach internal dashboards, while all
            complaint data stays behind secure APIs.
          </p>
        </div>
        <div className="re-trust-card">
          <h3>Mobile ready</h3>
          <p>
            This page uses a stacked layout and responsive styles so new Heads
            and Task Managers can register from laptops, tablets or mobiles.
          </p>
        </div>
      </section>

      <footer className="re-footer">
        <span>OCMS · Online Complaint Management System</span>
        <span>Officer Head & Task Manager entry</span>
      </footer>
    </div>
  );
}
