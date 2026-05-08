/* global React, ReactDOM, ALSScreens */
const { useState } = React;
const {
  ScreenToday, ScreenTrials, ScreenProfile, ScreenDoctor,
  ScreenInbox, ScreenOutreach, ScreenResearch,
} = window.ALSScreens;

const NAV = [
  { id: "today",    label: "Today",            badge: "1",  group: "calm",    role: "all" },
  { id: "trials",   label: "Trials & leads",   badge: "5",  group: "calm",    role: "all" },
  { id: "profile",  label: "Scott fit profile",badge: "3",  group: "calm",    role: "all" },
  { id: "doctor",   label: "Ask the doctor",   badge: "5",  group: "calm",    role: "all" },
  { id: "inbox",    label: "Lead inbox",       badge: "3",  group: "shared",  role: "all" },
  { id: "outreach", label: "Outreach queue",   badge: "6",  group: "shared",  role: "operator" },
  { id: "research", label: "Research watch",   badge: "4",  group: "shared",  role: "all" },
];

const ROLES = [
  { id: "scott",    label: "Scott",    note: "Quiet view: Today + the things Rachel or McDee thought he'd want to see." },
  { id: "rachel",   label: "Rachel",   note: "Action-oriented: doctor questions, profile, lead inbox, and trial cards." },
  { id: "operator", label: "Operator", note: "Full access — outreach drafts, lead triage, and source-evidence layers." },
];

function App() {
  const [page, setPage] = useState("today");
  const [role, setRole] = useState("rachel");

  const visibleNav = NAV.filter(n => n.role === "all" || n.role === role);
  const ScreenMap = {
    today:    ScreenToday,
    trials:   ScreenTrials,
    profile:  ScreenProfile,
    doctor:   ScreenDoctor,
    inbox:    ScreenInbox,
    outreach: ScreenOutreach,
    research: ScreenResearch,
  };
  const Screen = ScreenMap[page] || ScreenToday;
  const roleNote = ROLES.find(r => r.id === role).note;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark"></span>
          <div>
            <div className="brand-name">ALS Watch</div>
            <div className="brand-sub">private · for Scott</div>
          </div>
        </div>

        <div>
          <div className="nav-section-label">For Scott & Rachel</div>
          <div className="nav-list">
            {visibleNav.filter(n => n.group === "calm").map(n => (
              <button
                key={n.id}
                className={"nav-item" + (page === n.id ? " active" : "")}
                onClick={() => setPage(n.id)}
              >
                <span>{n.label}</span>
                <span className="badge">{n.badge}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="nav-section-label">Shared with care network</div>
          <div className="nav-list">
            {visibleNav.filter(n => n.group === "shared").map(n => (
              <button
                key={n.id}
                className={"nav-item" + (page === n.id ? " active" : "")}
                onClick={() => setPage(n.id)}
              >
                <span>{n.label}</span>
                <span className="badge">{n.badge}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="role-switch">
          <div className="role-switch-label">Viewing as</div>
          <div className="role-options">
            {ROLES.map(r => (
              <button
                key={r.id}
                className={"role-option" + (role === r.id ? " active" : "")}
                onClick={() => {
                  setRole(r.id);
                  if (r.id !== "operator" && page === "outreach") setPage("today");
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
          <div className="role-note">{roleNote}</div>
        </div>
      </aside>

      <main className="main">
        <Screen />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
