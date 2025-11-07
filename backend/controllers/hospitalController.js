import Hospital from "../models/Hospital.js";
import jwt from "jsonwebtoken";

// Sign In (Register)
const signIn = async (req, res) => {
  try {
    const { hospitalName, password, address } = req.body;

    if (!hospitalName || !password || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if hospital already exists
    const existingHospital = await Hospital.findOne({ hospitalName });
    if (existingHospital) {
      return res
        .status(400)
        .json({ message: "Hospital with this name already exists" });
    }

    // Create new hospital
    const hospital = new Hospital({
      hospitalName,
      password,
      address,
    });

    await hospital.save();

    // Generate token
    const token = jwt.sign(
      { id: hospital._id, hospitalName: hospital.hospitalName },
      process.env.JWT_SECRET || "your_jwt_secret_key_here",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Hospital registered successfully",
      token,
      hospital,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { hospitalName, password } = req.body;

    if (!hospitalName || !password) {
      return res
        .status(400)
        .json({ message: "Hospital name and password are required" });
    }

    // Find hospital
    const hospital = await Hospital.findOne({ hospitalName });
    if (!hospital) {
      return res.status(400).json({ message: "Hospital not found" });
    }

    // Check password
    const isMatch = await hospital.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: hospital._id, hospitalName: hospital.hospitalName },
      process.env.JWT_SECRET || "your_jwt_secret_key_here",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Hospital logged in successfully",
      token,
      hospital,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Hospital Profile
const getProfile = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.userId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Hospital Profile (for Inventory)
const updateProfile = async (req, res) => {
  try {
    const { bloodBank, oxygenStatus } = req.body;

    const hospital = await Hospital.findById(req.userId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Update the fields
    if (bloodBank) {
      hospital.bloodBank = bloodBank;
    }
    if (oxygenStatus) {
      hospital.oxygen.status = oxygenStatus;
    }

    const updatedHospital = await hospital.save();
    
    // Emit a real-time update to all clients
    req.io.emit("inventoryUpdated", updatedHospital);

    res.json({
      message: "Profile updated successfully",
      hospital: updatedHospital,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- NEW FUNCTION ---
// Get All Hospitals (for patient-facing list)
const getAllHospitals = async (req, res) => {
  try {
    // Find all hospitals and exclude their passwords
    const hospitals = await Hospital.find().select("-password");
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export default { 
  signIn, 
  login, 
  getProfile, 
  updateProfile,
  getAllHospitals // Add getAllHospitals
};