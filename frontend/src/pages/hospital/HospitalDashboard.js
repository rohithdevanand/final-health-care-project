import React, { useContext } from "react";
import { Outlet, NavLink } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./HospitalDashboard.css";

const HospitalDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="hospital-dashboard">
      <aside className="hospital-sidebar">
        <h3>{user?.hospitalName}</h3>
        <nav>
          <NavLink to="/hospital/dashboard/appointments">
            Appointment Requests
          </NavLink>
          <NavLink to="/hospital/dashboard/doctors">
            Manage Doctors
          </NavLink>
          {/* --- NEW LINKS --- */}
          <NavLink to="/hospital/dashboard/inventory">
            Manage Inventory
          </NavLink>
          <NavLink to="/hospital/dashboard/resources">
            Resources
          </NavLink>
        </nav>
      </aside>
      <main className="hospital-content">
        <Outlet /> 
      </main>
    </div>
  );
};

export default HospitalDashboard;