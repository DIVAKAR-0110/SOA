import { useEffect, useState } from "react";

/* ======================
   MOCK DATA
====================== */
const secondaryAdmins = [
  { id: 1, name: "Admin Tamil Nadu", state: "Tamil Nadu", email: "tn@gov.in" },
  { id: 2, name: "Admin Kerala", state: "Kerala", email: "kl@gov.in" },
];

const heads = [
  {
    id: 1,
    name: "Head Chennai",
    constituency: "Chennai Central",
    state: "Tamil Nadu",
  },
  { id: 2, name: "Head Madurai", constituency: "Madurai", state: "Tamil Nadu" },
];

const taskManagers = [
  {
    id: 1,
    name: "Ravi",
    department: "Electricity",
    constituency: "Chennai",
    state: "Tamil Nadu",
    status: "ACTIVE",
  },
  {
    id: 2,
    name: "Suresh",
    department: "Water Supply",
    constituency: "Madurai",
    state: "Tamil Nadu",
    status: "ACTIVE",
  },
];

/* ======================
   MAIN COMPONENT
====================== */
export default function AdminDashboard() {
  const [page, setPage] = useState("dashboard");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={styles.app}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>OCMS ADMIN</h2>

        <Nav
          label="Dashboard"
          active={page === "dashboard"}
          onClick={() => setPage("dashboard")}
        />
        <Nav
          label="Secondary Admins"
          active={page === "secondary"}
          onClick={() => setPage("secondary")}
        />
        <Nav
          label="Heads"
          active={page === "heads"}
          onClick={() => setPage("heads")}
        />
        <Nav
          label="Task Managers"
          active={page === "task"}
          onClick={() => setPage("task")}
        />
      </div>

      {/* CONTENT */}
      <div style={styles.content}>
        <div style={{ ...styles.topbar, ...styles.moduleBar[page] }}>
          <strong>{page.toUpperCase().replace("_", " ")}</strong>
          <span>
            {time.toLocaleDateString()} | {time.toLocaleTimeString()}
          </span>
        </div>

        {page === "dashboard" && <Dashboard />}
        {page === "secondary" && <SecondaryAdminPage />}
        {page === "heads" && <HeadsPage />}
        {page === "task" && <TaskManagerPage />}
      </div>
    </div>
  );
}

/* ======================
   NAV ITEM
====================== */
function Nav({ label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...styles.navItem,
        ...(active ? styles.activeNav : {}),
      }}
    >
      {label}
    </div>
  );
}

/* ======================
   DASHBOARD
====================== */
function Dashboard() {
  return (
    <>
      <div style={styles.kpiGrid}>
        <KPI title="Total Complaints" value="12,458" />
        <KPI title="Active Complaints" value="312" />
        <KPI title="Resolved" value="11,890" />
        <KPI title="Escalated" value="256" />
      </div>
    </>
  );
}

function KPI({ title, value }) {
  return (
    <>
      <div style={styles.kpiCard}>
        <span>{title}</span>
        <h2>{value}</h2>
      </div>
    </>
  );
}

/* ======================
   SECONDARY ADMINS (SEARCH)
====================== */
function SecondaryAdminPage() {
  const [search, setSearch] = useState("");

  const filtered = secondaryAdmins.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.state.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div>
        <button>+ ADD Secondary Admin</button>
      </div>
      <Section title="Secondary Admins">
        <input
          style={styles.input}
          placeholder="Search by name or state"
          onChange={(e) => setSearch(e.target.value)}
        />

        <Table
          headers={["Name", "State", "Email", "Edit"]}
          rows={filtered.map((a) => [a.name, a.state, a.email, <EditBtn />])}
        />
      </Section>
    </>
  );
}

/* ======================
   HEADS (FILTER + SEARCH)
====================== */
function HeadsPage() {
  const [search, setSearch] = useState("");

  const filtered = heads.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.constituency.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div>
        <button>+ ADD Heads</button>
      </div>
      <Section title="Heads">
        <input
          style={styles.input}
          placeholder="Search name / constituency"
          onChange={(e) => setSearch(e.target.value)}
        />

        <Table
          headers={["Name", "Constituency", "State", "Edit"]}
          rows={filtered.map((h) => [
            h.name,
            h.constituency,
            h.state,
            <EditBtn />,
          ])}
        />
      </Section>
    </>
  );
}

/* ======================
   TASK MANAGERS (ADVANCED FILTERS)
====================== */
function TaskManagerPage() {
  const [filters, setFilters] = useState({
    name: "",
    state: "",
    constituency: "",
  });

  const filtered = taskManagers.filter(
    (t) =>
      t.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      t.state.toLowerCase().includes(filters.state.toLowerCase()) &&
      t.constituency.toLowerCase().includes(filters.constituency.toLowerCase()),
  );

  return (
    <>
      <div>
        <button>+ ADD Task Manager</button>
      </div>
      <Section title="Task Managers">
        <div style={styles.filters}>
          <input
            style={styles.input}
            placeholder="Name"
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="State"
            onChange={(e) => setFilters({ ...filters, state: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Constituency"
            onChange={(e) =>
              setFilters({ ...filters, constituency: e.target.value })
            }
          />
        </div>

        <Table
          headers={["Name", "Department", "Constituency", "Status", "Edit"]}
          rows={filtered.map((t) => [
            t.name,
            t.department,
            t.constituency,
            t.status,
            <EditBtn />,
          ])}
        />
      </Section>
    </>
  );
}

/* ======================
   COMMON COMPONENTS
====================== */
function Section({ title, children }) {
  return (
    <div style={styles.card}>
      <h3 style={{ color: "#1e40af" }}>{title}</h3>
      {children}
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={styles.th}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td key={j} style={styles.td}>
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const EditBtn = () => <button style={styles.editBtn}>Edit</button>;

/* ======================
   STYLES
====================== */
const styles = {
  app: { display: "flex", height: "100vh", background: "#f1f5f9" },
  sidebar: {
    width: 240,
    background: "linear-gradient(#1e3a8a,#1e40af)",
    color: "#fff",
    padding: 24,
  },
  logo: { marginBottom: 30 },
  navItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    cursor: "pointer",
    background: "rgba(255,255,255,0.1)",
  },
  activeNav: { background: "linear-gradient(90deg,#60a5fa,#2563eb)" },
  content: { flex: 1, padding: 24, overflowY: "auto" },
  topbar: {
    padding: 14,
    borderRadius: 12,
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  moduleBar: {
    dashboard: { background: "linear-gradient(90deg,#2563eb,#1e40af)" },
    secondary: { background: "linear-gradient(90deg,#0ea5e9,#2563eb)" },
    heads: { background: "linear-gradient(90deg,#38bdf8,#0284c7)" },
    task: { background: "linear-gradient(90deg,#6366f1,#4338ca)" },
  },
  kpiGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 },
  kpiCard: {
    background: "linear-gradient(#2563eb,#1e40af)",
    color: "#fff",
    padding: 20,
    borderRadius: 14,
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 14,
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
    marginBottom: 20,
  },
  table: { width: "100%", borderCollapse: "collapse", marginTop: 10 },
  th: { background: "#eff6ff", padding: 12, color: "#1e3a8a" },
  td: { padding: 12, borderBottom: "1px solid #e5e7eb" },
  editBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
  },
  input: {
    padding: 8,
    borderRadius: 6,
    border: "1px solid #93c5fd",
    marginBottom: 10,
  },
  filters: { display: "flex", gap: 10 },
  moduleHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },

  addBtn: {
    background: "linear-gradient(135deg,#2563eb,#1e40af)",
    color: "#ffffff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(37,99,235,0.35)",
  },
};
