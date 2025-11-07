import express from "express";
import appointmentController from "../controllers/appointmentController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/book", appointmentController.bookAppointment);
router.get("/hospital", authMiddleware, appointmentController.getAppointmentsByHospital);
router.get("/patient", authMiddleware, appointmentController.getAppointmentsByPatient);
router.put("/:id", authMiddleware, appointmentController.updateAppointmentStatus);

// --- NEW ROUTE ---
router.post("/rate", authMiddleware, appointmentController.rateAppointment);

export default router;
