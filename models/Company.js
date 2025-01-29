const mongoose = require('mongoose');

// Define the company schema
const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    address: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    VatNumber: {
      type: String,
      required: false,
    },
    ownerName: {
      type: String,
      required: true,
    },
    ownerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    ownerPhoneNumber: {
      type: String,
      required: true,
    },
    businessLicense: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    taxId: {
      type: String,
      required: true,
    },
    businessType: {
      type: String,
      required: true,
    },
    businessAddress: {
      type: String,
      required: true,
    },
    isActive: {
      type:Boolean,
      default: true,
    },
    companyLogo: {
      type: String, 
      default: null,
    },
    companyLogoPublicId: {
      type: String, 
      default: null,
    },
  },
  { timestamps: true } 
);



// Create the Company model
const Company = mongoose.model('Company', companySchema);

module.exports = Company;
