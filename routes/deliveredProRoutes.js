const express = require('express');
const router = express.Router();
const deliveredProductController = require('../controllers/deliveredProController');

router.get('/', deliveredProductController.getDeliveredProducts);
router.post('/', deliveredProductController.createDeliveredProduct);
router.put('/:id', deliveredProductController.updateDeliveredProduct);
router.get('/:id', deliveredProductController.getDeliveredProById);
router.delete('/:id', deliveredProductController.deleteDeliveredProduct);

module.exports = router;
