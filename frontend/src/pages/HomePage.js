import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css"; // We'll add some CSS

const HomePage = () => {
  return (
    <div className="home-container">
      <h1>Welcome to the Healthcare Portal</h1>
      <p>Please select your role to login or sign up.</p>
      <div className="role-selection">
        <Link to="/patient/login" className="role-card">
          <h2>Patient</h2>
          <p>Login or Sign In as a Patient</p>
        </Link>
        <Link to="/hospital/login" className="role-card">
          <h2>Hospital</h2>
          <p>Login or Sign In as a Hospital</p>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;