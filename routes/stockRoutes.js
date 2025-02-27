const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const {authMiddleware} = require('../middlewares/authMiddleware')
const cacheMiddleware = require('../services/cacheMiddleware')

// Add New Stock
router.post('/add', authMiddleware(["superadmin","admin","manager","user"]),stockController.createStock);

// Get All Stock
router.get('/' , cacheMiddleware('stocks'), stockController.getAllStock);

// Get Stock by ID
router.get('/:id', authMiddleware(["superadmin","admin","manager","user"]),stockController.getStockById);

// Update Stock
router.put('/:id', authMiddleware(["superadmin","admin","manager","user"]),stockController.updateStock);

// Delete Stock
router.delete('/:id',authMiddleware(["superadmin","admin","manager","user"]), stockController.deleteStock);

module.exports = router;
