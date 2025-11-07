import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js"; // Import Doctor model

// Book Appointment
const bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, hospitalId, disease, appointmentDate } = req.body;

    if (!patientId || !doctorId || !hospitalId || !disease) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const appointment = new Appointment({
      patientId,
      doctorId,
      hospitalId,
      disease,
      appointmentDate,
    });

    await appointment.save();

    res.json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Appointments for Hospital
const getAppointmentsByHospital = async (req, res) => {
  try {
    const hospitalId = req.userId;
    const appointments = await Appointment.find({ hospitalId })
      .populate("patientId")
      .populate("doctorId");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Appointments for Patient
const getAppointmentsByPatient = async (req, res) => {
  try {
    const patientId = req.userId;
    const appointments = await Appointment.find({ patientId })
      .populate("doctorId")
      .populate("hospitalId");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Appointment Status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("patientId")
      .populate("doctorId")
      .populate("hospitalId");

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    req.io.emit("appointmentUpdated", updatedAppointment);

    res.json({
      message: "Appointment status updated",
      appointment: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- NEW FUNCTION ---
// Rate an Appointment and Update Doctor Rating
const rateAppointment = async (req, res) => {
  try {
    const { appointmentId, rating } = req.body;
    const patientId = req.userId;

    const newRating = Number(rating);
    if (!appointmentId || !newRating || newRating < 1 || newRating > 5) {
      return res.status(400).json({ message: "Valid appointmentId and rating (1-5) are required." });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    if (appointment.patientId.toString() !== patientId) {
      return res.status(403).json({ message: "You are not authorized to rate this appointment." });
    }
    if (appointment.status !== "Completed") {
      return res.status(400).json({ message: "Cannot rate an appointment that is not completed." });
    }
    if (appointment.isRated) {
      return res.status(400).json({ message: "This appointment has already been rated." });
    }

    const doctor = await Doctor.findById(appointment.doctorId);
    if (doctor) {
      const oldRatingTotal = doctor.ratingAverage * doctor.ratingCount;
      const newRatingCount = doctor.ratingCount + 1;
      
      doctor.ratingAverage = (oldRatingTotal + newRating) / newRatingCount;
      doctor.ratingCount = newRatingCount;
      await doctor.save();
    }

    appointment.isRated = true;
    appointment.rating = newRating;
    const updatedAppointment = await appointment.save();
    
    const populatedAppointment = await updatedAppointment.populate('doctorId hospitalId');

    res.json({
      message: "Rating submitted successfully!",
      appointment: populatedAppointment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  bookAppointment,
  getAppointmentsByHospital,
  getAppointmentsByPatient,
  updateAppointmentStatus,
  rateAppointment,
};
