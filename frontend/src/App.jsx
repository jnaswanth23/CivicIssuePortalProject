import { Routes, Route, Navigate } from "react-router-dom";
import UserRoute from "./auth/UserRoute";

import Home from "./pages/Home";
import Login from "./pages/UserLogin";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminIssuesPage from "./pages/admin/AdminIssuesPage";
export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/issues-list" element={<AdminIssuesPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/dashboard"
        element={
          <UserRoute>
            <UserDashboard />
          </UserRoute>
        }
      />

   

      <Route path="/admin" element={<AdminDashboard />} />

      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route path="/user" element={<Navigate to="/dashboard" replace />} />

      <Route path="*" element={<h2 style={{ padding: 20 }}>Page Not Found</h2>} />

    </Routes>
  );
}