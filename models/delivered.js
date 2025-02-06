const mongoose = require('mongoose');

const DeliveredProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Corrected type
    ref: 'User', // Reference to the User model (optional)
    required: true,
  },
  userName:{type:String},
  role:{type:String},
  deliveryDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Pending', 'Delivered', 'Cancelled'],
    default: 'Delivered',
  },
});

module.exports = mongoose.model('DeliveredProduct', DeliveredProductSchema);
