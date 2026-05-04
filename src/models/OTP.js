import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    // Auto delete after expiry
    index: { expires: 0 },
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const OTP = mongoose.model('OTP', otpSchema);
export default OTP;
