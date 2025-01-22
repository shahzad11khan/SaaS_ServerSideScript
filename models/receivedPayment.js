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
//   receivedFrom: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Person', 
//     required: true,
//   },
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
