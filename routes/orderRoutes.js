const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const {authMiddleware} = require('../middlewares/authMiddleware')

router.post('/order', authMiddleware(["superadmin"],["admin"],["manager"],["user"]),orderController.createOrder);

router.get('/orders', orderController.getAllOrders);
router.get('/deliverdOrders', orderController.getDeliveredOrders);

router.get('/order:Id',authMiddleware(["superadmin"],["admin"],["manager"]), orderController.getOrderById);

router.put('/order:Id', authMiddleware(["superadmin"],["admin"],["manager"]),orderController.updateOrderStatus);

router.delete('/order:Id',authMiddleware(["superadmin"],["admin"],["manager"]), orderController.deleteOrder);

module.exports = router;