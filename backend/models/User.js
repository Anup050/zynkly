const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  gmailId: { type: String }, // optional: set for Google login; null for manual email signup
  email: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  name: { type: String },
  mobileNumber: { type: String },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
