const express = require("express");
const router = express.Router();
const roleController = require("../controllers/permissionController");

router.post("/", roleController.createPermission);
router.get("/", roleController.getAllPermissions);
router.get("/:id", roleController.getPermissionById);
router.put("/:id", roleController.updatePermission);
router.delete("/:id", roleController.deletePermission);

module.exports = router;
