import { useState, useEffect, useMemo } from "react";
import "./myComplaints.css";

const DUMMY_COMPLAINTS = [
  {
    id: 1,
    title: "Pothole on Main St",
    category: "Roads",
    location: "Sector 5",
    status: "REGISTERED",
    registeredAt: "2025-12-25T10:30:00",
  },
  {
    id: 2,
    title: "Streetlight not working",
    category: "Utilities",
    city: "Block A",
    status: "IN_PROGRESS",
    registeredAt: "2025-11-18T09:15:00",
  },
  {
    id: 3,
    title: "Garbage collection missed",
    category: "Sanitation",
    location: "Zone 3",
    status: "RESOLVED",
    registeredAt: "2025-10-05T14:45:00",
  },
  {
    id: 4,
    title: "Water leakage",
    category: "Water",
    location: "Market Area",
    status: "IN-PROGRESS",
    registeredAt: "2025-12-01T08:20:00",
  },
  {
    id: 5,
    title: "Tree fallen",
    category: "Parks",
    location: "Riverside",
    status: "registered",
    registeredAt: "2025-12-20T16:00:00",
  },
];

function formatId(id) {
  return `#CMP-${String(id).padStart(4, "0")}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusClass(status) {
  if (!status) return "status registered";
  const normalized = String(status)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "_");
  switch (normalized) {
    case "IN_PROGRESS":
      return "status in-progress";
    case "RESOLVED":
      return "status resolved";
    case "REGISTERED":
    default:
      return "status registered";
  }
}

function MyComplaints() {
  const [complaints, setComplaints] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("my_complaints") || "[]");
      const combined = [...stored, ...DUMMY_COMPLAINTS];
      const seen = new Map();
      const result = [];
      for (const c of combined) {
        const key = String(c.id);
        if (!seen.has(key)) {
          seen.set(key, true);
          result.push(c);
        }
      }
      return result;
    } catch (e) {
      console.warn("Failed to read local complaints", e);
      return DUMMY_COMPLAINTS;
    }
  });
  const [search, setSearch] = useState("");

  const searchNormalized = search.trim().toLowerCase();

  useEffect(() => {
    const handler = () => {
      try {
        const stored = JSON.parse(
          localStorage.getItem("my_complaints") || "[]",
        );
        const combined = [...stored, ...DUMMY_COMPLAINTS];
        const seen = new Map();
        const result = [];
        for (const c of combined) {
          const key = String(c.id);
          if (!seen.has(key)) {
            seen.set(key, true);
            result.push(c);
          }
        }
        setComplaints(result);
      } catch (e) {
        console.warn("Failed to update complaints from storage", e);
      }
    };
    window.addEventListener("mycomplaints:updated", handler);
    const storageHandler = (e) => {
      if (e.key === "my_complaints") handler();
    };
    window.addEventListener("storage", storageHandler);
    return () => {
      window.removeEventListener("mycomplaints:updated", handler);
      window.removeEventListener("storage", storageHandler);
    };
  }, []);

  const filtered = useMemo(() => {
    if (!searchNormalized) return complaints;
    return complaints.filter((c) => {
      const idMatch =
        formatId(c.id).toLowerCase().includes(searchNormalized) ||
        String(c.id).includes(searchNormalized);
      const categoryMatch = (c.category || "")
        .toLowerCase()
        .includes(searchNormalized);
      const titleMatch = (c.title || "")
        .toLowerCase()
        .includes(searchNormalized);
      return idMatch || categoryMatch || titleMatch;
    });
  }, [complaints, searchNormalized]);

  return (
    <div className="complaints-page">
      <div className="complaints-header">
        <h2>My Complaints</h2>
        <input
          className="complaints-search"
          type="search"
          placeholder="Search by ID, category, or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search complaints"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="no-results">No complaints found.</p>
      ) : (
        <div className="complaints-grid">
          {filtered.map((c) => (
            <div className="complaint-card" key={c.id}>
              <div className="card-top">
                <div className="card-id">{formatId(c.id)}</div>
                <div className="card-title">{c.title}</div>
              </div>
              <div className="card-body">
                <div className="card-row">
                  <span className="label">Category:</span> {c.category}
                </div>
                <div className="card-row">
                  <span className="label">Location:</span>{" "}
                  {c.location || c.city || c.address || ""}
                </div>
                <div className="card-row">
                  <span className="label">Registered:</span>{" "}
                  {formatDate(c.registeredAt)}
                </div>
                <div className="card-row">
                  <span className="label">Status:</span>{" "}
                  <span className={statusClass(c.status)}>
                    {String(c.status || "").toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="card-footer">
                <button className="view-btn" type="button">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyComplaints;
