const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create a new order
router.post('/order', orderController.createOrder);

// Get all orders
router.get('/orders', orderController.getAllOrders);

// Get a specific order by ID
router.get('/order:Id', orderController.getOrderById);

// Update an order's status
router.put('/order:Id', orderController.updateOrderStatus);

// Delete an order
router.delete('/order:Id', orderController.deleteOrder);

module.exports = router;