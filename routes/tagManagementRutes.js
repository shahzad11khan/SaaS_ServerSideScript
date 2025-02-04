// routes/tagManagementRoutes.js
const express = require('express');
const router = express.Router();
const tagManagementController = require('../controllers/tagManagementController');
const {authMiddleware} = require('../middlewares/authMiddleware')

router.post('/tags',authMiddleware(["superadmin"],["admin"],["manager"]), tagManagementController.createTag);
router.get('/tags', tagManagementController.getAllTags);
router.get('/tags/:id',authMiddleware(["superadmin"],["admin"],["manager"]), tagManagementController.getTagById);
router.put('/tags/:id',authMiddleware(["superadmin"],["admin"],["manager"]), tagManagementController.updateTag);
router.delete('/tags/:id',authMiddleware(["superadmin"],["admin"],["manager"]), tagManagementController.deleteTag);

module.exports = router;