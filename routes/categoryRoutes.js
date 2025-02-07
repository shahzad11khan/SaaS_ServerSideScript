const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const {authMiddleware} = require('../middlewares/authMiddleware')

router.post('/categories', authMiddleware(["superadmin","admin","manager"]), categoryController.addCategory);
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id',authMiddleware(["superadmin","admin","manager"]), categoryController.getCategoryById);
router.put('/categories/:id', authMiddleware(["superadmin","admin","manager"]), categoryController.updateCategory);
router.delete('/categories/:id', authMiddleware(["superadmin","admin","manager"]), categoryController.deleteCategory);

module.exports = router;