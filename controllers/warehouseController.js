const Warehouse = require('../models/warehouse');

// Create Warehouse
exports.createWarehouse = async (req, res) => {
  const { warehouse, location, manager } = req.body;
  const userId = req.user.id;
  const userName = req.user.username;
  const role = req.user.role;

  try {
    const newWarehouse = new Warehouse({
      warehouse,
      location,
      manager,
      userId,
      userName,
      role
    });

    const savedWarehouse = await newWarehouse.save();
    res.status(201).json(savedWarehouse);
  } catch (error) {
    res.status(500).json({ message: 'Error creating warehouse', error });
  }
};

// Get All Warehouses
exports.getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find().populate({
      path: 'userId',
      select: 'companyId', // Fetch userName and companyId from User model
      populate: {
        path: 'companyId',
        select: 'companyName', // Fetch companyName from Company model
      },
    });
    res.status(200).json(warehouses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching warehouses', error });
  }
};

// Get Warehouse by ID
exports.getWarehouseById = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) return res.status(404).json({ message: 'Warehouse not found' });

    res.status(200).json(warehouse);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching warehouse', error });
  }
};

// Update Warehouse
exports.updateWarehouse = async (req, res) => {
  try {
    const userId = req.user.id;
    const userName = req.user.username;
    const role = req.user.role;
    const updatedWarehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,{
        ...req.body,
        userId,
        userName,
        role
      },
      { new: true }
    );

    if (!updatedWarehouse) return res.status(404).json({ message: 'Warehouse not found' });

    res.status(200).json(updatedWarehouse);
  } catch (error) {
    res.status(500).json({ message: 'Error updating warehouse', error });
  }
};

// Delete Warehouse
exports.deleteWarehouse = async (req, res) => {
  try {
    const deletedWarehouse = await Warehouse.findByIdAndDelete(req.params.id);
    if (!deletedWarehouse) return res.status(404).json({ message: 'Warehouse not found' });

    res.status(200).json({ message: 'Warehouse deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting warehouse', error });
  }
};
