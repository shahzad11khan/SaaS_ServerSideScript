const express = require('express');
const router = express.Router();
const onHandShoppingController = require('../controllers/onhandController');

// Scan a product and add it to the cart
router.post('/scan', onHandShoppingController.scanProduct);

// Get the shopping cart for a user
router.get('/cart/:userName', onHandShoppingController.getShoppingCart);

// Clear the shopping cart for a user
router.delete('/cart/:userName', onHandShoppingController.clearShoppingCart);

module.exports = router;