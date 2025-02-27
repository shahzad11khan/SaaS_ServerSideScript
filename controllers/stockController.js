// controllers/StockManagementController.js
const StockManagement = require('../models/Stock');
const redis = require('../services/redisClient')


// Create a new Stock
exports.createStock = async (req, res) => {
    try {
        const { productName, quantity, price, totalPrice, category, subcategory, dateAdded, isActive,warehouseName } = req.body;

        // Check if the StockNumber already exists
        const existingStock = await StockManagement.findOne({ productName });
        if (existingStock) {
            return res.status(400).json({ message: 'Stock number already exists' });
        }
        const userId = req.user.id;
        const userName = req.user.username;
        const role = req.user.role;
        // Create a new Stock
        const newStock = new StockManagement({
            productName, quantity, price, totalPrice, category, subcategory, dateAdded, isActive,warehouseName,
            userId,
            username: userName,
            role,
        });

        // Save the Stock to the database
        await newStock.save();

        res.status(201).json({ message: 'Stock created successfully', Stock: newStock });
    } catch (error) {
        console.error('Error creating Stock:', error);
        res.status(500).json({ message: 'Error creating Stock' });
    }
};

// Get all Stocks
exports.getAllStock = async (req, res) => {
    try {
        const Stocks = await StockManagement.find()
        .populate({
            path: 'userId',
            select: 'companyId', // Fetch userName and companyId from User model
            populate: {
              path: 'companyId',
              select: 'companyName', // Fetch companyName from Company model
            },
          });
          await redis.set(res.locals.cacheKey, JSON.stringify(Stocks), 'EX', 300);
        res.status(200).json(Stocks);
    } catch (error) {
        console.error('Error fetching Stocks:', error);
        res.status(500).json({ message: 'Error fetching Stocks' });
    }
};

// Get a single Stock by ID
exports.getStockById = async (req, res) => {
    try {
        const Stock = await StockManagement.findById(req.params.id);
        if (!Stock) {
            return res.status(404).json({ message: 'Stock not found' });
        }
        res.status(200).json(Stock);
    } catch (error) {
        console.error('Error fetching Stock:', error);
        res.status(500).json({ message: 'Error fetching Stock' });
    }
};

// Update a Stock by ID
exports.updateStock = async (req, res) => {
    try {
        const { productName, quantity, price, totalPrice, category, subcategory, dateAdded, isActive,warehouseName } = req.body;
        const userId = req.user.id;
        const userName = req.user.username;
        const role = req.user.role;
        const updatedStock = await StockManagement.findByIdAndUpdate(
            req.params.id,
            { productName, quantity, price, totalPrice, category, subcategory, dateAdded, isActive,warehouseName,
                userId,
                username: userName,
                role, },
            { new: true } // Return the updated document
        );

        if (!updatedStock) {
            return res.status(404).json({ message: 'Stock not found' });
        }

        res.status(200).json({ message: 'Stock updated successfully', Stock: updatedStock });
    } catch (error) {
        console.error('Error updating Stock:', error);
        res.status(500).json({ message: 'Error updating Stock' });
    }
};

// Delete a Stock by ID
exports.deleteStock = async (req, res) => {
    try {
        const deletedStock = await StockManagement.findByIdAndDelete(req.params.id);
        if (!deletedStock) {
            return res.status(404).json({ message: 'Stock not found' });
        }
        res.status(200).json({ message: 'Stock deleted successfully' });
    } catch (error) {
        console.error('Error deleting Stock:', error);
        res.status(500).json({ message: 'Error deleting Stock' });
    }
};