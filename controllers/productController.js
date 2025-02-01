const Product = require('../models/Product');
const uploadImageToCloudinary = require('../middlewares/cloudinary');
const { deleteFromCloudinary } = require('../middlewares/deleteFromCloudinary');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { productName, productDescription, productPrice, productQuantity, productCategory, productSubCategory, productTag, rating,barcode } = req.body;
    const productImage = req.files.productImage;
    let productImageUrl = '';
    let productImagePublicId = '';
    if (productImage) {
      const result = await uploadImageToCloudinary(productImage.tempFilePath);
      productImageUrl = result.url;
      productImagePublicId = result.public_id;
    } else {
      productImageUrl = null;
      productImagePublicId = null;
    }
    // console.log(req.user)
    // return;
    const userId = req.user.id;
    const userName = req.user.username;
    const role = req.user.role;
    const newProduct = new Product({
      userId,
      userName,
      role,
      productName,
      productDescription,
      productPrice,
      productQuantity,
      productCategory,
      productSubCategory, productTag, rating,
      productImage,
      productImageUrl,
      productImagePublicId,barcode
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error creating product', error });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { productName, productDescription, productPrice, productQuantity, productCategory, productSubCategory, productTag, rating,
    } = req.body;
    const productImage = req.files.productImage;
    let updatedproductImageUrl = null;
    let updatedproductImagePublicId = null;
    const userId = req.user.id;
    const userName = req.user.username;
    const role = req.user.role;
    const findProduct = await Product.findById(id)
    if (file) {
      await deleteFromCloudinary(findProduct.productImagePublicId);
      const result = await uploadImageToCloudinary(file.tempFilePath);
      updatedproductImageUrl = result.secure_url;
      updatedproductImagePublicId = result.public_id;

    } else {
      updatedproductImageUrl = findProduct.productImageUrl;
      updatedproductImagePublicId = findProduct.productImagePublicId;
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        productName, userId, userName, role, productDescription, productPrice, productQuantity, productCategory, productSubCategory, productTag, rating,barcode, productImageUrl: updatedproductImageUrl,
        productImagePublicId: updatedproductImagePublicId
      },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};
