import { useEffect,useState } from "react";

import Sidebar from "../../Components/admin/Sidebar";
import AndhraMap from "../../Components/admin/AndhraMap";
import UpdateStatus from "../../Components/admin/UpdateStatus";
import AdminIssuesPage from "./AdminIssuesPage";

import { fetchIssues } from "../../services/adminApi";

import "../../components/admin/map.css";

export default function AdminDashboard(){

  const [page,setPage] = useState("issues");
  const [issues,setIssues] = useState([]);

  useEffect(()=>{
    loadIssues();
  },[]);

  const loadIssues = async()=>{
    const data = await fetchIssues();
    setIssues(data);
  };

  return(

    <div style={{display:"flex"}}>

      <Sidebar setPage={setPage}/>

      <div style={{flex:1,padding:"20px"}}>

        {page==="issues" && <AndhraMap issues={issues}/>}

        {page==="issuesList" && <AdminIssuesPage/>}

        {page==="status" && <UpdateStatus/>}

      </div>

    </div>

  );
}