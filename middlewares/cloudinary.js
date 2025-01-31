const cloudinary = require('./cloudinaryConfig');


const uploadImageToCloudinary = async (buffer) => {
  try {
    const result = await cloudinary.uploader.upload(buffer, {
      resource_type: "auto", 
    });

    console.log('Image uploaded successfully:', result); 
    return result; 
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Error uploading image to Cloudinary');
  }
};

module.exports = uploadImageToCloudinary;
