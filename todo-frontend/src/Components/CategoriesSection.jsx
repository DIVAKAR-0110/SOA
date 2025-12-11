// src/components/CategoriesSection.jsx
const CATEGORIES = [
  "Electricity Complaint",
  "Water Supply Issues",
  "Sanitation Complaint",
  "Road Damage / Potholes",
  "Street Light Complaint",
  "School / College Issues",
  "Medical Emergency",
  "Public Safety",
  "Property / Tax Complaint",
  "Transport / MTC Issues",
];

const descriptions = [
  "Power failures, voltage issues, faulty meters, and unsafe wiring.",
  "Low pressure, supply cuts, contamination, and leakage.",
  "Garbage collection, overflowing bins, and drainage cleaning.",
  "Broken roads, potholes, and unsafe pathways.",
  "Defective, flickering, or non‑functional street lights.",
  "School/college infrastructure, staff behavior, or facilities.",
  "Critical medical issues and hospital complaint escalation.",
  "Eve‑teasing, harassment, and local public safety threats.",
  "Property tax disputes, assessment, or billing concerns.",
  "Bus delays, overcrowding, and route‑related complaints.",
];

export default function CategoriesSection() {
  return (
    <section className="cards-wrap" id="categories">
      <div className="cards-header">
        <h2>Complaint Categories</h2>
        <p>
          Select the relevant type of issue to raise a complaint. Each request
          is mapped to the correct authority for faster resolution.
        </p>
      </div>

      <div className="cards-grid">
        {CATEGORIES.map((title, idx) => (
          <article key={title} className="card">
            <div className="card-icon">
              <span className="card-icon-inner">{idx + 1}</span>
            </div>
            <h3 className="card-title">{title}</h3>
            <p className="card-desc">{descriptions[idx]}</p>
            <button
              className="card-btn"
              onClick={() => alert(`Apply for: ${title}`)}
            >
              Apply Now
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
