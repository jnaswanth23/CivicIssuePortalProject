import { useEffect,useState } from "react";
import { fetchIssues,updateStatus } from "../../services/adminApi";

export default function UpdateStatus(){

  const [issues,setIssues] = useState([]);
  const [remarks,setRemarks] = useState({});
  const [statuses,setStatuses] = useState({});

  useEffect(()=>{
    loadIssues();
  },[]);

  const loadIssues = async ()=>{
    const data = await fetchIssues();
    setIssues(data);

    let statusMap = {};
    data.forEach(i=>{
      statusMap[i.id] = i.status;
    });

    setStatuses(statusMap);
  };

  const handleStatusChange = (id,value)=>{
    setStatuses(prev=>({
      ...prev,
      [id]:value
    }));
  };

  const handleRemarkChange = (id,value)=>{
    setRemarks(prev=>({
      ...prev,
      [id]:value
    }));
  };

  const saveStatus = async(id)=>{

    let status = statuses[id];
    let remark = remarks[id] || "";

    await updateStatus(id,status,remark);

    loadIssues();
  };

  return(

    <div>

      <h2>Update Issue Status</h2>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Remark</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {issues.map(i=>(

            <tr key={i.id}>

              <td>{i.id}</td>

              <td>{i.title}</td>

              <td>

                <select
                  value={statuses[i.id] || i.status}
                  onChange={(e)=>handleStatusChange(i.id,e.target.value)}
                >

                  <option value="Pending">Pending</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Solved">Solved</option>
                  <option value="NotSolved">Not Solved</option>

                </select>

              </td>

              <td>

                {(statuses[i.id] === "NotSolved") && (

                  <textarea
                    placeholder="Enter reason"
                    value={remarks[i.id] || ""}
                    onChange={(e)=>handleRemarkChange(i.id,e.target.value)}
                  />

                )}

              </td>

              <td>

                <button onClick={()=>saveStatus(i.id)}>
                  Update
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}