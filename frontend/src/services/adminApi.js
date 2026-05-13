import axios from "axios";

const API="http://localhost:8080/api/admin";

export const fetchIssues = async()=>{

  const res = await axios.get(`${API}/issues`);
  return res.data;

};

export const updateStatus = async(id,status)=>{

  await axios.put(`${API}/status/${id}`,{status});

};