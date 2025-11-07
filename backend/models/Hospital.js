import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const HospitalSchema = new mongoose.Schema({
  hospitalName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    doorNumber: String,
    mainAddress: String,
    city: String,
    state: String,
    pincode: String,
  },
  // --- NEW FIELDS ---
  bloodBank: {
    type: Map,
    of: Number,
    default: {
      "A+": 0,
      "A-": 0,
      "B+": 0,
      "B-": 0,
      "AB+": 0,
      "AB-": 0,
      "O+": 0,
      "O-": 0,
    },
  },
  oxygen: {
    status: {
      type: String,
      enum: ["Available", "Not Available"],
      default: "Not Available",
    },
  },
  // --- END NEW FIELDS ---
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
HospitalSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
HospitalSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Hospital = mongoose.model('Hospital', HospitalSchema);
export default Hospital;