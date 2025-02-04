const express = require('express');
const router = express.Router();
const deliveredProductController = require('../controllers/deliveredProController');
const {authMiddleware} = require('../middlewares/authMiddleware')

router.get('/',authMiddleware(["superadmin"],["admin"],["manager"],["user"]), deliveredProductController.getDeliveredProducts);
router.post('/', deliveredProductController.createDeliveredProduct);
router.put('/:id',authMiddleware(["superadmin"],["admin"],["manager"]), deliveredProductController.updateDeliveredProduct);
router.get('/:id', deliveredProductController.getDeliveredProById);
router.delete('/:id',authMiddleware(["superadmin"],["admin"],["manager"]), deliveredProductController.deleteDeliveredProduct);

module.exports = router;
