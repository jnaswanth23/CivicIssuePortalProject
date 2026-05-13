export default function Sidebar({ setPage }) {

  return (
    <div className="sidebar">

      <h2>Admin Panel</h2>

      <button onClick={() => setPage("issues")}>
        Issues
      </button>

      <button onClick={() => setPage("issuesList")}>
        Issues List
      </button>

      <button onClick={() => setPage("status")}>
        Update Status
      </button>

    </div>
  );
}