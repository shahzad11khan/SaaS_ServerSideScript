const mongoose = require('mongoose');

const ReceivedPaymentSchema = new mongoose.Schema({
  paymentAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Corrected type
    ref: 'User', // Reference to the User model (optional)
    required: true,
  },
  userName:{type:String},
  role:{type:String},
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'Bank Transfer', 'Online Payment'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Completed',
  },
});

module.exports = mongoose.model('ReceivedPayment', ReceivedPaymentSchema);
