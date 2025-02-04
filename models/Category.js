const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    mainCategory: { type: String, required: true, trim: true },
    subCategory: { type: String, required: true, trim: true },

    // User Information from Middleware
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Corrected type
      ref: 'User', // Reference to the User model (optional)
      required: true,
    },
    userName:{type:String},
    role:{type:String},
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  });

module.exports = mongoose.model('Category', categorySchema);
