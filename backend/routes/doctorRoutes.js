import express from "express";
import doctorController from "../controllers/doctorController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// @route   POST api/doctor/add
// @desc    Add a new doctor (for logged-in hospital)
// @access  Private (Hospital)
router.post("/add", authMiddleware, doctorController.addDoctor);

// @route   GET api/doctor
// @desc    Get all doctors (for patients to search)
// @access  Public
router.get("/", doctorController.getAllDoctors);

// @route   GET api/doctor/hospital
// @desc    Get all doctors for the logged-in hospital
// @access  Private (Hospital)
router.get("/hospital", authMiddleware, doctorController.getDoctorsByHospital);

// @route   PUT api/doctor/:id
// @desc    Update a doctor
// @access  Private (Hospital)
router.put("/:id", authMiddleware, doctorController.updateDoctor);

// @route   DELETE api/doctor/:id
// @desc    Delete a doctor
// @access  Private (Hospital)
router.delete("/:id", authMiddleware, doctorController.deleteDoctor);

export default router;