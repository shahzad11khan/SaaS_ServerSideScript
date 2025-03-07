const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const {authMiddleware} = require('../middlewares/authMiddleware');
const cacheMiddleware = require('../services/cacheMiddleware');

router.post('/categories', authMiddleware(["superadmin","admin","manager","user"]), categoryController.addCategory);
router.get('/categories', cacheMiddleware('categories') , categoryController.getAllCategories);
router.get('/categories/:id',authMiddleware(["superadmin","admin","manager","user"]), categoryController.getCategoryById);
router.put('/categories/:id', authMiddleware(["superadmin","admin","manager","user"]), categoryController.updateCategory);
router.delete('/categories/:id', authMiddleware(["superadmin","admin","manager","user"]), categoryController.deleteCategory);

module.exports = router;