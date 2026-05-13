import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import CivicLogo from "../assets/CivicLogo.png";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LEFT: LOGO */}
        <div className="navbar-left">
          <img src={CivicLogo} alt="Civic Issue Portal Logo" className="logo-img" />
          <span className="logo-text">Civic Issue Portal</span>
        </div>

        {/* RIGHT: SIMPLE TEXT LINKS */}
        <div className="navbar-right">
          <Link to="/" className="nav-text">Home</Link>
          <Link to="/login" className="nav-text">Login</Link>
          <Link to="/register" className="nav-text">Signup</Link>
        </div>

      </div>
    </nav>
  );
}
