const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    parentPermission: { type: String, required: true }, // Parent permission name
    permissions: {
      productManager: { type: Object, default: {} },
      stockManager: { type: Object, default: {} },
      customerManager: { type: Object, default: {} },
      warehouseManager: { type: Object, default: {} },
      repairManager: { type: Object, default: {} },
      tagManager: { type: Object, default: {} },
    },
  },
  { timestamps: true }
);

roleSchema.index({parentPermission:1})
const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
