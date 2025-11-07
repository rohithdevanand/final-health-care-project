import Patient from "../models/Patient.js";
import jwt from "jsonwebtoken";

// Sign In (Register)
const signIn = async (req, res) => {
  try {
    const { name, email, password, address, gender } = req.body;

    // Validate required fields
    if (!name || !email || !password || !address || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if patient already exists by EMAIL
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res
        .status(400)
        .json({ message: "Patient with this email already exists" });
    }

    // Create new patient
    const patient = new Patient({
      name,
      email, // Add email
      password,
      address,
      gender,
    });

    await patient.save();

    // Generate token
    const token = jwt.sign(
      { id: patient._id, name: patient.name },
      process.env.JWT_SECRET || "your_jwt_secret_key_here",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Patient registered successfully",
      token,
      patient,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    // Login with EMAIL and password
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find patient by EMAIL
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(400).json({ message: "Patient not found" });
    }

    // Check password
    const isMatch = await patient.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: patient._id, name: patient.name },
      process.env.JWT_SECRET || "your_jwt_secret_key_here",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Patient logged in successfully",
      token,
      patient,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Patient Profile
const getProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.userId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { signIn, login, getProfile };