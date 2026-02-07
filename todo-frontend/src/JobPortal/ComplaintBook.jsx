import { useEffect, useRef, useState } from "react";

/* ------------------ MOCK DATA (20 PAGES) ------------------ */
const complaintsData = [
  {
    id: 1,
    title: "Major potholes near NH",
    description: "Deep potholes causing frequent accidents.",
    category: "Road",
    priority: "High",
    status: "Open",
    location: "Kochi",
    time: "2 hrs ago",
    upvotes: 22,
    comments: 6,
    image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231",
    verified: true,
  },
  {
    id: 2,
    title: "Street light failure",
    description: "Entire street is dark after sunset.",
    category: "Electricity",
    priority: "Medium",
    status: "In Progress",
    location: "Trivandrum",
    time: "5 hrs ago",
    upvotes: 10,
    comments: 2,
    image: "https://images.unsplash.com/photo-1527766833261-b09c3163a791",
    verified: false,
  },
  {
    id: 3,
    title: "Water pipe leakage",
    description: "Continuous water leakage near houses.",
    category: "Water",
    priority: "High",
    status: "Open",
    location: "Aluva",
    time: "1 day ago",
    upvotes: 18,
    comments: 5,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
    verified: true,
  },
  {
    id: 4,
    title: "Garbage overflow",
    description: "Waste not collected for 4 days.",
    category: "Sanitation",
    priority: "Medium",
    status: "Open",
    location: "Thrissur",
    time: "8 hrs ago",
    upvotes: 9,
    comments: 1,
    image: "https://images.unsplash.com/photo-1598514982205-f33c61c5f3a6",
    verified: false,
  },
  // auto-generate more pages
  ...Array.from({ length: 16 }, (_, i) => ({
    id: i + 5,
    title: `Public issue report #${i + 5}`,
    description: "Reported by residents regarding ongoing civic inconvenience.",
    category: ["Road", "Water", "Electricity", "Sanitation"][i % 4],
    priority: ["High", "Medium", "Low"][i % 3],
    status: ["Open", "In Progress", "Resolved"][i % 3],
    location: ["Kollam", "Palakkad", "Kannur", "Kottayam"][i % 4],
    time: `${i + 1} days ago`,
    upvotes: Math.floor(Math.random() * 25),
    comments: Math.floor(Math.random() * 8),
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    verified: i % 2 === 0,
  })),
];

/* ------------------ COMPONENT ------------------ */
export default function ComplaintBook() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState("");

  const bookRef = useRef(null);
  const flipSound = useRef(
    new Audio("https://www.fesliyanstudios.com/play-mp3/387"),
  );

  /* ------------------ SEARCH FILTER ------------------ */
  const filteredComplaints = complaintsData.filter((c) =>
    `${c.title} ${c.description} ${c.location}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const current = filteredComplaints[index];

  /* Reset page if search reduces list */
  useEffect(() => {
    setIndex(0);
  }, [search]);

  /* Auto-close */
  useEffect(() => {
    const handler = (e) => {
      if (bookRef.current && !bookRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const flip = (dir) => {
    flipSound.current.currentTime = 0;
    flipSound.current.play();
    setIndex((i) =>
      dir === "next"
        ? Math.min(i + 1, filteredComplaints.length - 1)
        : Math.max(i - 1, 0),
    );
  };

  if (!current) return null;

  return (
    <>
      <style>{`
        body {
          background: ${dark ? "#020617" : "#f8fafc"};
          color: ${dark ? "#e5e7eb" : "#020617"};
        }

        .book-section {
          padding: 70px;
          display: flex;
          justify-content: center;
        }

        .top-bar {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        input {
          padding: 8px;
          width: 240px;
        }

        .book {
          width: 820px;
          height: 430px;
          display: flex;
          perspective: 2000px;
          position: relative;
        }

        .book-cover {
          position: absolute;
          width: 410px;
          height: 430px;
          background: linear-gradient(135deg, #1e293b, #020617);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 12px 0 0 12px;
          transform-origin: left;
          transition: transform 1s ease;
          z-index: 5;
        }

        .book-cover:hover {
          transform: rotateY(-20deg);
        }

        .book.open .book-cover {
          transform: rotateY(-160deg);
        }

        .page {
          width: 410px;
          height: 430px;
          padding: 25px;
          background: ${dark ? "#020617" : "#7f6262"};
          box-shadow: inset 0 0 40px rgba(0,0,0,0.25);
          background-image: radial-gradient(
            rgba(255,255,255,${dark ? 0.04 : 0.06}) 1px,
            transparent 1px
          );
          background-size: 4px 4px;
        }

        .page img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px;
        }

        .badge {
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 6px;
          margin-right: 6px;
        }

        .Road { background: #fde68a; color: #000; }
        .Water { background: #bae6fd; color: #000; }
        .Electricity { background: #c7d2fe; color: #000; }
        .Sanitation { background: #bbf7d0; color: #000; }

        .High { color: #ef4444; }
        .Medium { color: #f59e0b; }
        .Low { color: #22c55e; }

        .verified {
          color: #22c55e;
          font-weight: bold;
        }

        .actions {
          display: flex;
          gap: 15px;
          margin-top: 12px;
        }

        button {
          padding: 6px 12px;
          cursor: pointer;
        }
      `}</style>

      <section className="book-section">
        <div>
          <div className="top-bar">
            <input
              placeholder="Search complaints or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={() => setDark(!dark)}>
              {dark ? "☀ Light" : "🌙 Dark"}
            </button>
          </div>

          <div ref={bookRef} className={`book ${open ? "open" : ""}`}>
            <div className="book-cover" onClick={() => setOpen(true)}>
              <h2>Citizen Complaints</h2>
              <p>Top {filteredComplaints.length} Reports</p>
            </div>

            <div className="page">
              <img src={current.image} alt="" />
            </div>

            <div className="page">
              <h3>{current.title}</h3>
              <p>{current.description}</p>

              <div>
                <span className={`badge ${current.category}`}>
                  {current.category}
                </span>
                <span className={current.priority}>● {current.priority}</span>
              </div>

              <p>Status: {current.status}</p>
              <p>📍 {current.location}</p>
              <p>⏱ {current.time}</p>

              {current.verified && (
                <p className="verified">✔ Verified Authority</p>
              )}

              <div className="actions">
                <span>👍 {current.upvotes}</span>
                <span>💬 {current.comments}</span>
              </div>

              <div className="actions">
                <button onClick={() => flip("prev")}>◀ Prev</button>
                <button onClick={() => flip("next")}>Next ▶</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
