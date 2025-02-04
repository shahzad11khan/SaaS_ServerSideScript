const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // For generating secure tokens

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim:true,
  },
  username: {
    type: String,
    trim:true,
    index:true,
    unique: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    index: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
  },
  permission: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'manager', 'user'], // Role enum
    default: 'user',
    index: true,
  },
  userLogoUrl: {
    type: String, 
    default: null,
  },
  userLogoPublicId: {
    type: String, 
    default: null,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive',
  },
  refreshToken: {
    type: String,
    default: null,
  },
  refreshOTP: {
    type: String,
    default: null,
  },
}, { timestamps: true });



// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  const token = crypto.randomBytes(32).toString('hex'); // Generate a secure token
  this.refreshToken = token;
  return token;
};
// Generate Refresh Token
userSchema.methods.generateRefreshOtp = function () {
  const OTP = Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit random number
  this.refreshOTP= OTP.toString(); // Store as a string if needed
  return this.refreshOTP;
};

// Clear Refresh Token
userSchema.methods.clearRefreshToken = function () {
  this.refreshToken = null;
};
// Clear Refresh OTP
userSchema.methods.clearRefreshOtp = function () {
  this.refreshPTO = "";
};

module.exports = mongoose.model('User', userSchema);
