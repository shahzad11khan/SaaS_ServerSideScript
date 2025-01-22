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
//   deliveredTo: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Person', // Reference to Person model
//     required: true,
//   },
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
