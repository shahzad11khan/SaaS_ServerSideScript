const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  
  warehouse: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  manager: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Warehouse', warehouseSchema);
