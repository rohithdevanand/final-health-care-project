import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./Navbar.css"; 

const Navbar = () => {
  const { user, userType, logout, isAuthenticated } = useContext(AuthContext);

  const patientLinks = (
    <>
      <NavLink to="/patient/dashboard">Dashboard</NavLink>
      <NavLink to="/patient/book-appointment">Book Appointment</NavLink>
      <NavLink to="/patient/my-bookings">My Bookings</NavLink>
      {/* --- NEW LINK --- */}
      <NavLink to="/patient/find-hospitals">Find Hospitals</NavLink>
      <NavLink to="/patient/ai-consult">AI Consult</NavLink>
    </>
  );

  const hospitalLinks = (
    <>
      <NavLink to="/hospital/dashboard/appointments">Appointments</NavLink>
      <NavLink to="/hospital/dashboard/doctors">Manage Doctors</NavLink>
      <NavLink to="/hospital/dashboard/inventory">Manage Inventory</NavLink>
      <NavLink to="/hospital/dashboard/resources">Resources</NavLink>
    </>
  );

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Healthcare Portal</Link>
      </div>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            {userType === "patient" && patientLinks}
            {userType === "hospital" && hospitalLinks}
            <span className="navbar-welcome">
              Welcome, {user ? user.name || user.hospitalName : ""}
            </span>
            <button onClick={logout} className="navbar-logout">
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/">Login</NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;