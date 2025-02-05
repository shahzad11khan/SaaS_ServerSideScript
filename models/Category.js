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
    role:{  type: String,
      required: true,
      enum: ['admin', 'user','superadmin'], // Restrict role to specific values
    }
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  });

module.exports = mongoose.model('Category', categorySchema);
