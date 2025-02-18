const Category = require('../models/Category');
// Add New Category
exports.addCategory = async (req, res) => {
    try {
      const userId = req.user.id;
      const userName = req.user.username;
      const role = req.user.role;
      const { mainCategory, subCategory } = req.body;
  
      const newCategory = new Category({
        mainCategory,
        subCategory,
        userId,
        userName,
        role:role
      });
  
      const savedCategory = await newCategory.save();
      res.status(201).json({savedCategory ,message:'Created Category'});
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Get All Categories
  exports.getAllCategories = async (req, res) => {
    try {
      const categories = await Category.find()
      .populate({
        path: 'userId',
        select: 'companyId', // Fetch userName and companyId from User model
        populate: {
          path: 'companyId',
          select: 'companyName', // Fetch companyName from Company model
        },
      });
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Get Category by ID
  exports.getCategoryById = async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) return res.status(404).json({ message: 'Category not found' });
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Update Category
  exports.updateCategory = async (req, res) => {
    try {
      const userId = req.user.id;
      const userName = req.user.username;
      const role = req.user.role;
            const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          userId,
          userName,
          role
               },
        { new: true }
      );
  
      if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });
      res.status(200).json(updatedCategory);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Delete Category
  exports.deleteCategory = async (req, res) => {
    try {
      const deletedCategory = await Category.findByIdAndDelete(req.params.id);
      if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });
  
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };