import React, { useState, useEffect } from "react";
import api from "../../services/api";
import socket from "../../services/socket"; // Import socket

const AppointmentRequests = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // 1. Connect to socket
    socket.connect();

    // 2. Fetch initial appointments
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/appointment/hospital");
        setAppointments(res.data);
      } catch (err) {
        setError("Failed to fetch appointments.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();

    // 3. Listen for real-time appointment updates
    const onAppointmentUpdate = (updatedAppointment) => {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === updatedAppointment._id ? updatedAppointment : apt
        )
      );
    };

    socket.on("appointmentUpdated", onAppointmentUpdate);

    // 4. Clean up listeners on unmount
    return () => {
      socket.off("appointmentUpdated", onAppointmentUpdate);
      socket.disconnect();
    };
  }, []);

  // --- MODIFIED FUNCTION ---
  const handleUpdateStatus = async (id, status) => {
    try {
      // API call triggers socket event — updates all clients in real time
      await api.put(`/appointment/${id}`, { status });
    } catch (err) {
      alert("Failed to update status.");
    }
  };
  // --- END MODIFIED FUNCTION ---

  if (loading) return <div>Loading appointments...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>Appointment Requests</h2>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Disease</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td>{apt.patientId?.name || "N/A"}</td>
                <td>{apt.doctorId?.name || "N/A"}</td>
                <td>{apt.disease}</td>
                <td>{new Date(apt.appointmentDate).toLocaleString()}</td>
                <td>{apt.status}</td>
                <td>
                  {apt.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(apt._id, "Accepted")}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(apt._id, "Denied")}
                      >
                        Deny
                      </button>
                    </>
                  )}

                  {apt.status === "Accepted" && (
                    <button
                      onClick={() => handleUpdateStatus(apt._id, "Completed")}
                    >
                      Mark as Completed
                    </button>
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

export default AppointmentRequests;
