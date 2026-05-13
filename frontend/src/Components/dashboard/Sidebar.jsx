import "../../styles/Sidebar.css";

export default function Sidebar({ active, setActive }) {
  return (
    <aside className="side">
      <div className="sideBrand">
        <div className="sideDot" />
        <div>
          <div className="sideTitle">Civic Issue Portal</div>
          <div className="sideSmall">User Panel</div>
        </div>
      </div>

      <nav className="sideNav">
        <button className={`sideItem ${active === "report" ? "active" : ""}`} onClick={() => setActive("report")}>
          📝 Report Issue
        </button>
        <button className={`sideItem ${active === "myreports" ? "active" : ""}`} onClick={() => setActive("myreports")}>
          📌 My Reports
        </button>
        <button className={`sideItem ${active === "track" ? "active" : ""}`} onClick={() => setActive("track")}>
          🔎 Track Issue
        </button>
      </nav>

      <div className="sideFooter">
        <button className="sideLogout" onClick={() => alert("Connect logout later")}>Logout</button>
      </div>
    </aside>
  );
}
