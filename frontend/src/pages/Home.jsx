import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import "../styles/Home.css";
import howItWorksImg from "../assets/Home-bg.png";

export default function Home() {
  return (
    <>
      <div className="plain-bg" />
      <Navbar />

      <div className="page">
        {/* HERO (with extra top spacing) */}
        <section className="hero">
          <div className="hero-center">
            <div className="pill">
              <span className="dot" />
              Report • Track • Resolve
            </div>

            <h1 className="hero-title">
              Make your area <span>cleaner & safer</span>
              <br />
              report issues in seconds.
            </h1>

            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary">
                Start Reporting →
              </Link>
              <Link to="/register" className="btn btn-ghost">
                Create Account
              </Link>
            </div>
          </div>
        </section>

        {/* HOW TO REPORT (cards only) */}
        <section className="section soft">
          <div className="section-head center">
            <h2>How to report</h2>
            <p>Simple steps to submit an issue.</p>
          </div>

          <div className="how-grid">
            <div className="how-card">
              <div className="how-icon">📷</div>
              <h3>Take a photo</h3>
              <p>Capture the issue clearly.</p>
            </div>

            <div className="how-card">
              <div className="how-icon">📍</div>
              <h3>Pin location</h3>
              <p>Select the exact location.</p>
            </div>

            <div className="how-card">
              <div className="how-icon">🔔</div>
              <h3>Track updates</h3>
              <p>Follow status until resolved.</p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS (IMAGE ONLY – NOT CROPPED) */}
        <section className="section">
          <div className="section-head center">
            <h2>How it works</h2>
            <p>From reporting to resolution.</p>
          </div>

          <div className="how-image">
            <img src={howItWorksImg} alt="How it works flow" />
          </div>
        </section>

        <footer className="footer">
          © {new Date().getFullYear()} Civic Issue Portal • Built with React
        </footer>
      </div>
    </>
  );
}
