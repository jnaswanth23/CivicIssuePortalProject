// ✅ FILE: frontend/src/auth/UserRoute.jsx
import { Navigate } from "react-router-dom";

export default function UserRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "USER") return <Navigate to="/unauthorized" replace />;

  return children;
}
