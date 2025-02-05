const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
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
    productName: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    totalPrice:{
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: String,
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    warehouseName: {
        type:String,
        required:true,
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Stock', stockSchema);
