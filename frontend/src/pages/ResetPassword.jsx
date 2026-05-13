import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const e = params.get("email");
    if (e) setEmail(e);
  }, [location.search]);

  const reset = async (e) => {
    e.preventDefault();

    if (!email.trim()) return alert("Email required");
    if (!otp.trim()) return alert("OTP required");
    if (!newPassword.trim()) return alert("New password required");
    if (newPassword !== confirm) return alert("Passwords do not match");

    try {
      setLoading(true);
      await axios.post("http://localhost:8080/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      alert("Password updated. Please login.");
      navigate("/login");
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="auth-page">
    <div className="auth-card">
      <h2>Reset Password</h2>

      <form onSubmit={reset}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <label>OTP</label>
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="6-digit OTP"
        />

        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
        />

        <label>Confirm Password</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm password"
        />

        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
  </div>
);

}
