import express from "express";
import hospitalController from "../controllers/hospitalController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/signin", hospitalController.signIn);
router.post("/login", hospitalController.login);
router.get("/profile", authMiddleware, hospitalController.getProfile);
router.put("/profile", authMiddleware, hospitalController.updateProfile);

// --- NEW ROUTE ---
// Get all hospitals for patient directory
router.get("/all", hospitalController.getAllHospitals);

export default router;