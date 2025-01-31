const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Corrected type
    ref: 'User', // Reference to the User model (optional)
    required: true,
  },
  userName:{type:String},
  role:{type:String},
  productName: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  productQuantity: {
    type: Number,
    required: true,
  },
  productCategory: {
    type: String,
    required: true,
  },
  productImageUrl: {
    type: String, 
    default: null,
  },
  productImagePublicId: {
    type: String, 
    default: null,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

module.exports = mongoose.model('Product', productSchema);
