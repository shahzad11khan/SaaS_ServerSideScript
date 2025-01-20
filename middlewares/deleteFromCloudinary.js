const cloudinary = require('cloudinary').v2;
const deleteFromCloudinary = async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log("Image deleted successfully:", result);
      return result;
    } catch (error) {
      console.error("Error deleting image:", error);
      throw new Error("Failed to delete image from Cloudinary.");
    }
  };

  module.exports = { deleteFromCloudinary };