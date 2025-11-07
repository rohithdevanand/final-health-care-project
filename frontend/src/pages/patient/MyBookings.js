import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import socket from "../../services/socket"; // Import the socket connection
import AuthContext from "../../context/AuthContext"; // Import auth context

const MyBookings = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext); // Get the logged-in patient

  useEffect(() => {
    // 1. Connect to socket
    socket.connect();

    // 2. Fetch initial appointments
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/appointment/patient");
        setAppointments(res.data);
      } catch (err) {
        setError("Failed to fetch appointments.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();

    // 3. Set up the socket listener
    const onAppointmentUpdate = (updatedAppointment) => {
      if (user && updatedAppointment.patientId._id === user._id) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((apt) =>
            apt._id === updatedAppointment._id ? updatedAppointment : apt
          )
        );
      }
    };

    socket.on("appointmentUpdated", onAppointmentUpdate);

    // 4. Clean up on component unmount
    return () => {
      socket.off("appointmentUpdated", onAppointmentUpdate);
      socket.disconnect();
    };
  }, [user]); // Add 'user' as a dependency

  // --- NEW FUNCTION ---
  const handleRate = async (appointmentId) => {
    const ratingInput = prompt("Please rate your doctor (from 1 to 5):");
    const rating = parseInt(ratingInput, 10);

    if (isNaN(rating) || rating < 1 || rating > 5) {
      alert("Invalid rating. Please enter a number between 1 and 5.");
      return;
    }

    try {
      const res = await api.post("/appointment/rate", { appointmentId, rating });
      // Update the local appointment to hide the button
      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === appointmentId ? res.data.appointment : apt
        )
      );
      alert("Rating submitted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit rating.");
    }
  };
  // --- END NEW FUNCTION ---

  if (loading) return <div>Loading your appointments...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>My Appointments</h2>
      {appointments.length === 0 ? (
        <p>You have no appointments.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Hospital</th>
              <th>Disease</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td>{apt.doctorId?.name || "N/A"}</td>
                <td>{apt.hospitalId?.hospitalName || "N/A"}</td>
                <td>{apt.disease}</td>
                <td>{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                <td>{apt.status}</td>
                <td>
                  {apt.status === "Completed" && !apt.isRated && (
                    <button onClick={() => handleRate(apt._id)}>
                      Rate Doctor
                    </button>
                  )}
                  {apt.isRated && (
                    <span style={{ color: "green" }}>
                      Rated ({apt.rating}★)
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyBookings;
