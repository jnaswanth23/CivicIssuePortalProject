import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/MyReports.css";

const API = "http://localhost:8080";

export default function MyReports() {

  const [items,setItems] = useState([]);
  const [loading,setLoading] = useState(true);

  const load = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/api/issues/my-reports`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });

      setItems(res.data || []);

    } catch(err){
      console.log(err);
    } finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    load();
  },[]);

  return(

    <div className="reports-container">

      <h2 className="reports-title">My Reports</h2>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No reports submitted yet</p>
      ) : (

        <table className="reports-table">

          <thead>
            <tr>
              <th>S.No</th>
              <th>Issue Title</th>
              <th>Tracking ID</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {items.map((it,index)=>(
              <tr key={it.id}>

                <td>{index+1}</td>

                <td>{it.title}</td>

                <td className="tracking-id">
                  {it.trackingId}
                </td>

                <td>
                  <span className={`status ${it.status?.toLowerCase()}`}>
                    {it.status}
                  </span>
                </td>

              </tr>
            ))}

          </tbody>

        </table>
      )}

    </div>

  );
}