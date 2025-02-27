const express = require('express');
const router = express.Router();
const receivedPaymentController = require('../controllers/receivedPaymentController');
const {authMiddleware} = require('../middlewares/authMiddleware');
const cacheMiddleware = require('../services/cacheMiddleware');

router.get('/', cacheMiddleware('recivedPayments') ,authMiddleware(["superadmin","admin","manager","user"]), receivedPaymentController.getReceivedPayments);
router.get('/:id', receivedPaymentController.getReceivedPaymentById);
router.post('/',authMiddleware(["superadmin","admin","manager","user"]), receivedPaymentController.createReceivedPayment);
router.put('/:id',authMiddleware(["superadmin","admin","manager"]), receivedPaymentController.updateReceivedPayment);
router.delete('/:id',authMiddleware(["superadmin","admin","manager"]), receivedPaymentController.deleteReceivedPayment);

module.exports = router;
