import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  consultancyFee: { // Renamed from 'price'
    type: Number,
    required: true,
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
  },
  // --- MODIFIED FIELDS ---
  ratingAverage: {
    type: Number,
    default: 0, // Default to 0, will be calculated
    min: 0,
    max: 5,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
  // --- END MODIFIED FIELDS ---
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Doctor = mongoose.model('Doctor', DoctorSchema);
export default Doctor;
