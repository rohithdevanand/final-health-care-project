import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true,
  },
  disease: {
    type: String,
  },
  appointmentDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Denied", "Completed"],
    default: "Pending",
  },
  // --- NEW FIELDS ---
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  isRated: {
    type: Boolean,
    default: false,
  },
  // --- END NEW FIELDS ---
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);
export default Appointment;
