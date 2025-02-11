// controllers/tagManagementController.js
const TagManagement = require('../models/TagManagement');

// Create a new tag
exports.createTag = async (req, res) => {
  try {
    const { tagNumber, description } = req.body;

    // Check if the tagNumber already exists
    const existingTag = await TagManagement.findOne({ tagNumber });
    if (existingTag) {
      return res.status(400).json({ message: 'Tag number already exists' });
    }
    const userId = req.user.id;
    const userName = req.user.username;
    const role = req.user.role;
    // Create a new tag
    const newTag = new TagManagement({
      tagNumber,
      description,
      userId,
      username:userName,
      role,
    });

    // Save the tag to the database
    await newTag.save();

    res.status(201).json({ message: 'Tag created successfully', tag: newTag });
  } catch (error) {
    console.error('Error creating tag:', error);
    res.status(500).json({ message: 'Error creating tag' });
  }
};

// Get all tags
exports.getAllTags = async (req, res) => {
  try {
    const tags = await TagManagement.find()
    .populate({
      path: 'userId',
      select: 'companyId', // Fetch userName and companyId from User model
      populate: {
        path: 'companyId',
        select: 'companyName', // Fetch companyName from Company model
      },
    });
    res.status(200).json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ message: 'Error fetching tags' });
  }
};

// Get a single tag by ID
exports.getTagById = async (req, res) => {
  try {
    const tag = await TagManagement.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.status(200).json(tag);
  } catch (error) {
    console.error('Error fetching tag:', error);
    res.status(500).json({ message: 'Error fetching tag' });
  }
};

// Update a tag by ID
exports.updateTag = async (req, res) => {
  try {
    const { tagNumber, description } = req.body;
    const userId = req.user.id;
    const userName = req.user.username;
    const role = req.user.role;
    const updatedTag = await TagManagement.findByIdAndUpdate(
      req.params.id,
      { tagNumber, description, userId, username:userName, role },
      { new: true } // Return the updated document
    );

    if (!updatedTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.status(200).json({ message: 'Tag updated successfully', tag: updatedTag });
  } catch (error) {
    console.error('Error updating tag:', error);
    res.status(500).json({ message: 'Error updating tag' });
  }
};

// Delete a tag by ID
exports.deleteTag = async (req, res) => {
  try {
    const deletedTag = await TagManagement.findByIdAndDelete(req.params.id);
    if (!deletedTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error deleting tag:', error);
    res.status(500).json({ message: 'Error deleting tag' });
  }
};