const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');
const {authMiddleware} = require('../middlewares/authMiddleware');
const cacheMiddleware = require('../services/cacheMiddleware');

router.post('/create', authMiddleware(["superadmin","admin","manager","user"]), warehouseController.createWarehouse);
router.get('/', cacheMiddleware("warehouses") ,warehouseController.getWarehouses);
router.get('/:id', authMiddleware(["superadmin","admin","manager","user"]), warehouseController.getWarehouseById);
router.put('/:id', authMiddleware(["superadmin","admin","manager","user"]), warehouseController.updateWarehouse);
router.delete('/:id', authMiddleware(["superadmin","admin","manager","user"]), warehouseController.deleteWarehouse);

module.exports = router;
