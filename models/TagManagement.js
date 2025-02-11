// models/TagManagement.js
const mongoose = require('mongoose');

const tagManagementSchema = new mongoose.Schema({
  
  tagNumber: {
    type: String,
    required: true,
    unique: true, // Ensure tagNumber is unique
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user','superadmin'], // Restrict role to specific values
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('TagManagement', tagManagementSchema);