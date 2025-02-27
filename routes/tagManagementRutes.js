// routes/tagManagementRoutes.js
const express = require('express');
const router = express.Router();
const tagManagementController = require('../controllers/tagManagementController');
const {authMiddleware} = require('../middlewares/authMiddleware')
const cacheMiddleware = require('../services/cacheMiddleware');


router.post('/tags',authMiddleware(["superadmin","admin","manager","user"]), tagManagementController.createTag);
router.get('/tags',cacheMiddleware('tags'), tagManagementController.getAllTags);
router.get('/tags/:id',authMiddleware(["superadmin","admin","manager","user"]), tagManagementController.getTagById);
router.put('/tags/:id',authMiddleware(["superadmin","admin","manager","user"]), tagManagementController.updateTag);
router.delete('/tags/:id',authMiddleware(["superadmin","admin","manager","user"]), tagManagementController.deleteTag);

module.exports = router;