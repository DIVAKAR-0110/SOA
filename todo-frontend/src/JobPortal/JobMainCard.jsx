import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaMoon,
  FaSun,
  FaExpand,
  FaCompress,
  FaCompressArrowsAlt,
  FaAdjust,
  FaUndo,
  FaUserTie,
  FaBuilding,
  FaUsersCog,
  FaMapMarkedAlt,
} from "react-icons/fa";

import a1 from "../assets/1.jpg";
import a2 from "../assets/2.jpg";

const banners = [
  {
    img: a1,
    title: "Serve the Nation",
    subtitle: "Join India’s digital public grievance system",
  },
  {
    img: a2,
    title: "Transparent Governance",
    subtitle: "Structured workflow for faster resolution",
  },
];

const jobs = [
  {
    icon: <FaUserTie />,
    title: "Secondary Admin",
    department: "Public Grievance",
    location: "State Level",
    experience: "5+ Years",
    salary: "₹8–12 LPA",
    type: "Onsite",
    description:
      "Responsible for overseeing complaint resolution across multiple districts.",
  },
  {
    icon: <FaBuilding />,
    title: "District Head",
    department: "Administration",
    location: "District Office",
    experience: "3+ Years",
    salary: "₹6–9 LPA",
    type: "Hybrid",
    description:
      "Monitors task managers and ensures SLA compliance at district level.",
  },
  {
    icon: <FaUsersCog />,
    title: "Task Manager",
    department: "Operations",
    location: "City Level",
    experience: "2+ Years",
    salary: "₹4–6 LPA",
    type: "Onsite",
    description:
      "Assigns complaints to field staff and tracks resolution progress.",
  },
  {
    icon: <FaMapMarkedAlt />,
    title: "Field Employee",
    department: "Ground Operations",
    location: "Local Area",
    experience: "1+ Year",
    salary: "₹2–4 LPA",
    type: "Remote",
    description: "Handles on-ground verification and complaint resolution.",
  },
];

function BannerCarousel({ banners, motion }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!motion) return;
    const id = setInterval(
      () => setCurrent((c) => (c + 1) % banners.length),
      6000,
    );
    return () => clearInterval(id);
  }, [banners.length, motion]);

  return (
    <section
      className="banner"
      style={{ backgroundImage: `url(${banners[current].img})` }}
    >
      <div className="banner-overlay" />
      <div className="banner-content">
        <h1 className="fade-in">{banners[current].title}</h1>
        <TypingSubtitle text={banners[current].subtitle} />
        <div className="cta">
          <Link to="/jobportal-applicationform" className="btn primary">
            Apply Now
          </Link>
          <button className="btn outline">Track Status</button>
        </div>
      </div>
    </section>
  );
}

function TypingSubtitle({ text }) {
  const [out, setOut] = useState("");

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setOut(text.slice(0, ++i));
      if (i === text.length) clearInterval(id);
    }, 40);
    return () => clearInterval(id);
  }, [text]);

  return <p className="typing-subtitle fade-in">{out}</p>;
}

function ToolsPanel({
  dark,
  toggleDark,
  compact,
  toggleCompact,
  contrast,
  toggleContrast,
  motion,
  toggleMotion,
  fontSize,
  setFontSize,
  resetAll,
}) {
  const [open, setOpen] = useState(null);
  const [fs, setFs] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFs(true);
    } else {
      document.exitFullscreen();
      setFs(false);
    }
  };

  const toggle = (key) => setOpen(open === key ? null : key);

  return (
    <div className="tools-panel glass elev-3 sticky-right">
      <div className="tool-item">
        <button
          onClick={() => toggle("theme")}
          aria-expanded={open === "theme"}
        >
          {dark ? <FaSun /> : <FaMoon />}
        </button>
        {open === "theme" && (
          <div className="tool-dropdown" role="menu">
            <button onClick={toggleDark}>
              {dark ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        )}
      </div>

      <div className="tool-item">
        <button onClick={() => toggle("font")} aria-expanded={open === "font"}>
          A
        </button>
        {open === "font" && (
          <div className="tool-dropdown" role="menu">
            <button onClick={() => setFontSize("14px")}>Small</button>
            <button onClick={() => setFontSize("16px")}>Medium</button>
            <button onClick={() => setFontSize("18px")}>Large</button>
          </div>
        )}
      </div>

      <div className="tool-item">
        <button
          onClick={() => toggle("layout")}
          aria-expanded={open === "layout"}
        >
          <FaCompressArrowsAlt />
        </button>
        {open === "layout" && (
          <div className="tool-dropdown" role="menu">
            <label>
              <input
                type="checkbox"
                checked={compact}
                onChange={toggleCompact}
              />{" "}
              Compact Mode
            </label>
          </div>
        )}
      </div>

      <div className="tool-item">
        <button
          onClick={() => toggle("access")}
          aria-expanded={open === "access"}
        >
          <FaAdjust />
        </button>
        {open === "access" && (
          <div className="tool-dropdown" role="menu">
            <label>
              <input
                type="checkbox"
                checked={contrast}
                onChange={toggleContrast}
              />{" "}
              High Contrast
            </label>
            <label>
              <input
                type="checkbox"
                checked={!motion}
                onChange={toggleMotion}
              />{" "}
              Reduce Motion
            </label>
          </div>
        )}
      </div>

      <div className="tool-item">
        <button onClick={toggleFullscreen} aria-pressed={fs}>
          {fs ? <FaCompress /> : <FaExpand />}
        </button>
      </div>

      <div className="tool-item">
        <button onClick={resetAll} aria-label="Reset all settings">
          <FaUndo />
        </button>
      </div>
    </div>
  );
}

function JobCard({ job }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`job-card ${open ? "expanded" : ""}`}>
      <div className="job-header">
        <div className="job-icon">{job.icon}</div>
        <div>
          <h3>{job.title}</h3>
          <p className="meta">
            {job.department} • {job.location}
          </p>
        </div>
      </div>

      <div className="tags">
        <span>{job.experience}</span>
        <span>{job.type}</span>
        <span>{job.salary}</span>
      </div>

      {open && <p className="desc">{job.description}</p>}

      <div className="job-actions">
        <button
          className="outline"
          aria-expanded={open}
          aria-controls={`desc-${job.title.replace(/\s+/g, "-").toLowerCase()}`}
          onClick={() => setOpen(!open)}
        >
          {open ? "Hide Details" : "View Details"}
        </button>
        <button className="outline">Track Status</button>
        <Link
          to="/jobportal-applicationform"
          className="btn primary"
          role="button"
          tabIndex={0}
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
}

export default function JobMainPage() {
  const [dark, setDark] = useState(false);
  const [compact, setCompact] = useState(false);
  const [contrast, setContrast] = useState(false);
  const [motion, setMotion] = useState(true);
  const [fontSize, setFontSize] = useState("16px");

  useEffect(() => {
    document.body.className = `
      ${dark ? "dark" : ""}
      ${compact ? "compact" : ""}
      ${contrast ? "high-contrast" : ""}
      ${!motion ? "no-motion" : ""}
    `;
    document.body.style.fontSize = fontSize;
  }, [dark, compact, contrast, motion, fontSize]);

  const resetAll = () => {
    setDark(false);
    setCompact(false);
    setContrast(false);
    setMotion(true);
    setFontSize("16px");
  };

  return (
    <>
      <style>{`
        /* Root & body */
        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f0f4f8;
          color: #333;
          transition: background 0.4s ease, color 0.4s ease;
        }
        .dark {
          background: #0d1117;
          color: #c9d1d9;
        }

        /* Banner */
        .banner {
          position: relative;
          height: 520px;
          background-size: cover;
          background-position: center;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          border-radius: 16px;
          margin: 40px auto;
          max-width: 900px;
          box-shadow: 0 12px 24px rgba(0,0,0,0.3);
        }
        .banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(34,197,94,0.85) 0%, rgba(0,0,0,0.6) 100%);
          z-index: 1;
          border-radius: 16px;
        }
        .banner-content {
          position: relative;
          text-align: center;
          color: white;
          padding: 0 20px;
          max-width: 600px;
          z-index: 2;
        }
        .banner-content h1 {
          font-size: 3rem;
          font-weight: 900;
          letter-spacing: 1.5px;
          margin-bottom: 12px;
          text-shadow: 0 3px 6px rgba(0,0,0,0.7);
        }
        .typing-subtitle {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 30px;
          color: #a8f0a1;
          text-shadow: 0 2px 5px rgba(0,0,0,0.5);
          min-height: 1.6rem;
        }

        /* Buttons */
        .btn {
          padding: 14px 28px;
          border-radius: 30px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
          user-select: none;
          display: inline-block;
          text-decoration: none;
          text-align: center;
        }
        .btn.primary {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: #fff;
          box-shadow: 0 8px 15px rgba(34,197,94,0.3);
        }
        .btn.primary:hover,
        .btn.primary:focus {
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
          box-shadow: 0 12px 20px rgba(22,163,74,0.5);
          transform: translateY(-3px);
          outline: none;
        }
        .btn.outline {
          background: transparent;
          border: 2px solid #22c55e;
          color: #22c55e;
          font-weight: 600;
          padding: 12px 26px;
          border-radius: 25px;
          transition: all 0.3s ease;
        }
        .btn.outline:hover,
        .btn.outline:focus {
          background: #22c55e;
          color: white;
          box-shadow: 0 6px 15px rgba(34,197,94,0.4);
          outline: none;
          transform: translateY(-2px);
        }

        /* Fade in animation */
        .fade-in {
          animation: fadeInUp 1s ease forwards;
          opacity: 0;
        }
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Job Cards */
        .jobs {
          max-width: 1200px;
          margin: 0 auto 60px;
          padding: 0 20px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 28px;
        }
        .job-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          padding: 24px;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.3s ease;
          cursor: default;
          user-select: none;
        }
        .dark .job-card {
          background: #161b22;
          box-shadow: 0 8px 20px rgba(0,0,0,0.6);
        }
        .job-card:hover {
          box-shadow: 0 16px 40px rgba(34,197,94,0.3);
          transform: translateY(-4px);
        }

        .job-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;
        }
        .job-icon {
          font-size: 40px;
          color: #22c55e;
          flex-shrink: 0;
        }
        .job-header h3 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: #b91c1c; /* dark red for title */
          user-select: text;
        }
        .job-header p.meta {
          margin: 4px 0 0;
          font-size: 0.9rem;
          font-weight: 600;
          color: #555;
          user-select: text;
        }
        .dark .job-header p.meta {
          color: #9ca3af;
        }

        .tags {
          margin: 12px 0 16px;
        }
        .tags span {
          display: inline-block;
          background: #ef4444;
          color: white;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 5px 12px;
          border-radius: 20px;
          margin-right: 10px;
          user-select: none;
          transition: background 0.3s ease;
        }
        .tags span:hover {
          background: #b91c1c;
        }

        .desc {
          font-size: 1rem;
          line-height: 1.5;
          color: #333;
          margin-bottom: 18px;
          user-select: text;
          transition: max-height 0.4s ease;
        }
        .dark .desc {
          color: #cbd5e1;
        }

        .job-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        /* Tools Panel */
        .tools-panel {
          position: fixed;
          right: 24px;
          top: 110px;
          background: rgba(34, 197, 94, 0.15);
          backdrop-filter: blur(12px);
          border-radius: 12px;
          padding: 10px;
          box-shadow: 0 12px 25px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 1000;
          width: 56px;
          user-select: none;
        }
        .tools-panel .tool-item button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #22c55e;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .tools-panel .tool-item button:hover,
        .tools-panel .tool-item button:focus {
          background: #16a34a;
          transform: scale(1.1);
          outline: none;
        }
        .tool-dropdown {
          position: absolute;
          right: 50px;
          top: 0;
          background: #22c55e;
          padding: 14px 18px;
          border-radius: 12px;
          min-width: 160px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.25);
          font-weight: 600;
          color: white;
          user-select: none;
          z-index: 1001;
        }
        .tool-dropdown label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          cursor: pointer;
        }
        .tool-dropdown input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .banner {
            height: 420px;
            border-radius: 12px;
          }
          .banner-content h1 {
            font-size: 2.2rem;
          }
          .typing-subtitle {
            font-size: 1.1rem;
          }
          .tools-panel {
            flex-direction: row;
            width: auto;
            right: 16px;
            top: auto;
            bottom: 24px;
            padding: 6px;
            border-radius: 30px;
            box-shadow: 0 6px 16px rgba(0,0,0,0.25);
          }
          .tools-panel .tool-item button {
            width: 36px;
            height: 36px;
            font-size: 16px;
          }
          .jobs {
            grid-template-columns: 1fr;
            padding: 0 10px;
            margin-bottom: 40px;
          }
        }
      `}</style>

      <BannerCarousel banners={banners} motion={motion} />

      <ToolsPanel
        dark={dark}
        toggleDark={() => setDark((d) => !d)}
        compact={compact}
        toggleCompact={() => setCompact((c) => !c)}
        contrast={contrast}
        toggleContrast={() => setContrast((c) => !c)}
        motion={motion}
        toggleMotion={() => setMotion((m) => !m)}
        fontSize={fontSize}
        setFontSize={setFontSize}
        resetAll={() => {
          setDark(false);
          setCompact(false);
          setContrast(false);
          setMotion(true);
          setFontSize("16px");
        }}
      />

      <section className="jobs">
        {jobs.map((job) => (
          <JobCard key={job.title} job={job} />
        ))}
      </section>
    </>
  );
}
