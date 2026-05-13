import { useState } from "react";
import api from "../../api/axios";
import "../../styles/TrackIssue.css";

export default function TrackIssue() {

  const [issueId,setIssueId] = useState("");
  const [loading,setLoading] = useState(false);
  const [issue,setIssue] = useState(null);

  const onTrack = async(e) => {

    e.preventDefault();

    if(!issueId.trim()) return alert("Enter Tracking ID");

    try{

      setLoading(true);
      setIssue(null);

      const res = await api.get(`/api/issues/track/${issueId.trim()}`);

      setIssue(res.data);

    }catch(err){

      alert(err?.response?.data || "Issue not found");

    }finally{
      setLoading(false);
    }

  };

  return(

    <div className="trackWrap">

      <div className="trackHeader">
        <h2>Track Issue</h2>
        <p>Paste your Tracking ID to see status and details.</p>
      </div>

      <form className="trackCard" onSubmit={onTrack}>

        <label className="lbl">Tracking ID</label>

        <div className="trackRow">

          <input
            className="inp"
            value={issueId}
            onChange={(e)=>setIssueId(e.target.value)}
            placeholder="Example: CIV-62909A55"
          />

          <button
            className="btnPrimary trackBtn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Checking..." : "Track"}
          </button>

        </div>

      </form>

      {issue && (

        <div className="trackResult">

          <div className="resultTop">

            <div>
              <h3 className="resultTitle">{issue.title}</h3>
              <div className="resultSub">{issue.category}</div>
            </div>

            <span className={`badge ${String(issue.status).toLowerCase()}`}>
              {issue.status}
            </span>

          </div>

          {/* Progress Tracker */}

          <div className="progressBar">

            <div className="step done">
              Reported
            </div>

            <div className={`step ${issue.status !== "Pending" ? "done" : ""}`}>
              In Progress
            </div>

            <div className={`step ${issue.status === "Solved" ? "done" : ""}`}>
              Solved
            </div>

          </div>


          {/* Issue Image */}

          {issue.imageUrl && (

            <div className="resultImgBox">

              <img
                src={issue.imageUrl}
                alt="Issue"
                loading="lazy"
                className="resultImg"
                onError={(e)=>{
                  e.target.style.display="none";
                }}
              />

            </div>

          )}

          <div className="resultGrid">

            <div className="resultItem">
              <div className="k">Issue ID</div>
              <div className="v">{issue.id}</div>
            </div>

            <div className="resultItem">

              <div className="k">Tracking ID</div>

              <div className="trackingRow">

                <span className="v tracking">
                  {issue.trackingId}
                </span>

                <button
                  className="copyBtn"
                  onClick={()=>{
                    navigator.clipboard.writeText(issue.trackingId);
                    alert("Tracking ID copied!");
                  }}
                >
                  Copy
                </button>

              </div>

            </div>

            <div className="resultItem">

              <div className="k">Location</div>

              <div className="v">
                {issue.address || `${issue.latitude}, ${issue.longitude}`}
              </div>

              {issue.latitude && (

                <button
                  className="mapBtn"
                  onClick={()=>window.open(
                    `https://www.google.com/maps?q=${issue.latitude},${issue.longitude}`
                  )}
                >
                  View Map
                </button>

              )}

            </div>

            <div className="resultItem full">

              <div className="k">Description</div>

              <div className="v">{issue.description}</div>

            </div>


            {/* ⭐ ADMIN REMARK FIELD */}

            {issue.adminRemark && (

              <div className="resultItem full">

                <div className="k">Remark / Reason</div>

                <div className="v">
                  {issue.adminRemark}
                </div>

              </div>

            )}

          </div>

        </div>

      )}

    </div>

  );

}