import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return alert("Enter your registered email");

    try {
      setLoading(true);
      await axios.post("http://localhost:8080/api/auth/forgot-password", { email });
      alert("OTP sent to your email (if account exists)");
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Forgot Password</h2>

        <form onSubmit={sendOtp}>
          <label>Registered Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
