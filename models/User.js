// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
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
    required: true,
    validate: {
      validator: function (value) {
        return value <= new Date();
      },
      message: 'Date of birth cannot be in the future.',
    },
  },
  permission: {
    type: String,
    default:''
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'manager', 'user'], // Role enum
    default:'user',
    required: true,
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
    required: true,
    default: 'inactive',
  },
});

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 },{fullName:1});

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

module.exports = mongoose.model('User', userSchema);
