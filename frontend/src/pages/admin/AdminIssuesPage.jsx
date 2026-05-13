import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../styles/AdminIssues.css";

export default function AdminIssuesPage() {

  const [issues, setIssues] = useState([]);

  useEffect(() => {
    api.get("/api/admin/issues")
      .then(res => setIssues(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="adminIssuesContainer">

      <h2>Reported Issues</h2>

      <table className="issuesTable">

        <thead>
          <tr>
            <th>S.No</th>
            <th>Title</th>
            <th>Category</th>
            <th>Address</th>
            <th>Status</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Image</th>
          </tr>
        </thead>

        <tbody>

          {issues.map((issue, index) => (

            <tr key={issue.id}>

              <td>{index + 1}</td>
              <td>{issue.title}</td>
              <td>{issue.category}</td>
              <td>{issue.address}</td>
              <td>{issue.status}</td>
              <td>{issue.latitude}</td>
              <td>{issue.longitude}</td>

              <td>
                {issue.imageUrl && (
                  <img
                    src={issue.imageUrl}
                    alt="issue"
                    width="80"
                    style={{
                      borderRadius: "6px",
                      objectFit: "cover",
                      cursor: "pointer"
                    }}
                    onClick={() => window.open(issue.imageUrl)}
                  />
                )}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}