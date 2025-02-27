const express = require("express");
const router = express.Router();
const roleController = require("../controllers/permissionController");
const {authMiddleware} = require('../middlewares/authMiddleware');
const cacheMiddleware = require("../services/cacheMiddleware");

router.post("/", authMiddleware(["superadmin","admin","manager"]),roleController.createPermission);
router.get("/" , cacheMiddleware('permissions') , cacheMiddleware("permissions") , roleController.getAllPermissions);
router.get("/:id",authMiddleware(["superadmin","admin","manager"]) ,roleController.getPermissionById);
router.put("/:id", authMiddleware(["superadmin","admin","manager"]),roleController.updatePermission);   
router.delete("/:id",authMiddleware(["superadmin","admin","manager"]), roleController.deletePermission);

module.exports = router;
