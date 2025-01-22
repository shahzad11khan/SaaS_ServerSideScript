const express = require('express');
const router = express.Router();
const receivedPaymentController = require('../controllers/receivedPaymentController');

router.get('/', receivedPaymentController.getReceivedPayments);
router.get('/:id', receivedPaymentController.getReceivedPaymentById);
router.post('/', receivedPaymentController.createReceivedPayment);
router.put('/:id', receivedPaymentController.updateReceivedPayment);
router.delete('/:id', receivedPaymentController.deleteReceivedPayment);

module.exports = router;
