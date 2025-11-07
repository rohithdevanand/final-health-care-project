import express from "express";
import patientController from "../controllers/patientController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// @route   POST api/patient/signin
// @desc    Register a new patient
// @access  Public
router.post("/signin", patientController.signIn);

// @route   POST api/patient/login
// @desc    Authenticate patient & get token
// @access  Public
router.post("/login", patientController.login);

// @route   GET api/patient/profile
// @desc    Get patient profile
// @access  Private
router.get("/profile", authMiddleware, patientController.getProfile);

export default router;