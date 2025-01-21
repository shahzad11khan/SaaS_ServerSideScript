const Permissions = require('../models/permissions');
  exports.createPermission = async (req, res) => {
    try {
      const { parentPermission, permissions } = req.body;
  
      if (!parentPermission) {
        return res.status(400).json({ success: false, message: "Parent permission is required" });
      }

      const newPermission = await Permissions.create({ parentPermission, permissions });
      res.status(201).json({ success: true, data: newPermission });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
//   exports.getAllPermissions = async (req, res) => {
//     try {
//       const permission = await Permissions.find();
//       res.status(200).json({ success: true, data: permission });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   };

  exports.getAllPermissions = async (req, res) => {
    try {
      const { page = 1, limit = 10, sortBy = 'parentPermission', order = 'asc', search = '' } = req.query;
  
      const sortOrder = order === 'desc' ? -1 : 1;
      const searchQuery = search
        ? { $or: [{ email: { $regex: search, $options: 'i' } }] }
        : {}; 

      const permission = await Permissions.aggregate([
        { $match: searchQuery }, 
        { $sort: { [sortBy]: sortOrder } }, 
        { $skip: (page - 1) * limit }, 
        { $limit: parseInt(limit) }, 
      ]);
  
      const permissionCount = await Permissions.aggregate([
        { $match: searchQuery }, 
        { $count: "totalPermissions" } 
      ]);
  
      res.status(200).json({
        permission,
        permissionCount: permissionCount.length > 0 ? permissionCount[0].totalPermissions : 0,
        currentPage: parseInt(page),
        totalPages: Math.ceil(permissionCount.length > 0 ? permissionCount[0].totalPermissions / limit : 1)
      });
  
    } catch (error) {
      res.status(500).json({ message: 'Error fetching Permissions', error });
    }
  };
  exports.getPermissionById = async (req, res) => {
    try {
      const { id } = req.params;
      const permission = await Permissions.findById(id);
      if (!permission) return res.status(404).json({ success: false, message: "Permission not found" });
      res.status(200).json({ success: true, data: role });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  exports.updatePermission = async (req, res) => {
    try {
      const { id } = req.params;
      const { parentPermission, permissions } = req.body;
  
      // Update role
      const updatedPermission = await Permissions.findByIdAndUpdate(
        id,
        { parentPermission, permissions },
        { new: true }
      );
  
      if (!updatedPermission) return res.status(404).json({ success: false, message: "Permission not found" });
      res.status(200).json({ success: true, data: updatedPermission });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  exports.deletePermission = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedPermission = await Permissions.findByIdAndDelete(id);
      if (!deletedPermission) return res.status(404).json({ success: false, message: "Permission not found" });
      res.status(200).json({ success: true, message: "Permission deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };


  