import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import ReportIssueForm from "../components/dashboard/ReportIssueForm";
import MyReports from "../components/dashboard/MyReports";
import TrackIssue from "../components/dashboard/TrackIssue";
import "../styles/Dashboard.css";

export default function UserDashboard() {
  const [active, setActive] = useState("report"); // report | myreports | track

  return (
    <div className="dash">
      <Sidebar active={active} setActive={setActive} />

      <main className="dashMain">
        <div className="dashTop">
          <div>
            <h1 className="dashTitle">User Dashboard</h1>
            <p className="dashSub">Report issues and track progress transparently.</p>
          </div>
        </div>

        {/* ✅ IMPORTANT: render based on active */}
        {active === "report" && <ReportIssueForm />}
        {active === "myreports" && <MyReports />}
        {active === "track" && <TrackIssue />}
      </main>
    </div>
  );
}
