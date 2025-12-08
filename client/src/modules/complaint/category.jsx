import React, { useMemo, useState } from "react";
import "./category.css";

/**
 * Category.jsx
 * - self-contained: uses default categories if none provided
 * - renders a full-page large-card grid
 * - onSelect currently alerts (replace with navigation as needed)
 */

const DEFAULT_CATS = [
  { id: 1, name: "Electricity", emoji: "💡", desc: "Power cuts, lights, wiring" },
  { id: 2, name: "Water", emoji: "🚰", desc: "No supply, leakage" },
  { id: 3, name: "Network", emoji: "📶", desc: "Wi-Fi / Internet issues" },
  { id: 4, name: "Maintenance", emoji: "🔧", desc: "Furniture, fixtures" },
  { id: 5, name: "Cleaning", emoji: "🧹", desc: "Washrooms, garbage" },
  { id: 6, name: "Hostel", emoji: "🏠", desc: "Room, mess troubles" },
  { id: 7, name: "Staff", emoji: "👨‍💼", desc: "Service or conduct" },
  { id: 8, name: "Others", emoji: "📝", desc: "Anything else" },
];

export default function Category({ categories = DEFAULT_CATS, onSelect }) {
  const [query, setQuery] = useState("");
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.desc && c.desc.toLowerCase().includes(q))
    );
  }, [categories, query]);

  const handle = (c) => {
    if (typeof onSelect === "function") onSelect(c);
    else alert(`Open complaint form for: ${c.name}`);
  };

  return (
    <div className="cat-page-full">
      <div className="cat-hero">
        <div>
          <h1 className="cat-title">Report an Issue</h1>
          <p className="cat-sub">Choose a category to quickly file your complaint.</p>
        </div>

        <div className="cat-search-wrap">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories (e.g. water, wifi)"
            className="cat-search"
            aria-label="Search categories"
          />
          {query && (
            <button className="cat-clear" onClick={() => setQuery("")} aria-label="Clear">
              ✕
            </button>
          )}
        </div>
      </div>

      <main className="cat-grid-wrap">
        {list.length === 0 ? (
          <div className="cat-empty">No categories match “{query}”</div>
        ) : (
          <div className="cat-grid">
            {list.map((c, i) => (
              <button
                key={c.id}
                className="cat-card"
                onClick={() => handle(c)}
                title={`Report ${c.name}`}
              >
                <div className="cat-left">
                  <div className="cat-emoji">{c.emoji}</div>
                  <div className="cat-text">
                    <div className="cat-name">{c.name}</div>
                    <div className="cat-desc">{c.desc}</div>
                  </div>
                </div>

                <div className="cat-right" aria-hidden>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <div className={`cat-blob blob-${(i % 6) + 1}`} aria-hidden />
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
