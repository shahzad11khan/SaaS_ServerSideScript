const OnHandShopping = require('../models/OnHand');
const Product = require('../models/Product');

// Scan a product and add it to the on-hand shopping cart
const scanProduct = async (req, res) => {
    const { userName, barcode } = req.body;
  
    try {
      // Find the product by barcode
      const product = await Product.findOne({ barcode });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Find or create an on-hand shopping cart for the user
      let shoppingCart = await OnHandShopping.findOne({ userName });
  
      if (!shoppingCart) {
        shoppingCart = new OnHandShopping({
          userName,
          products: [],
          totalAmount: 0,
        });
      }
  
      // Check if the product is already in the cart
      const productIndex = shoppingCart.products.findIndex(
        (item) => item.productId.toString() === product._id.toString()
      );
  
      if (productIndex !== -1) {
        // If the product is already in the cart, increment the quantity
        shoppingCart.products[productIndex].quantity += 1;
      } else {
        // If the product is not in the cart, add it
        shoppingCart.products.push({
          productId: product._id,
          productName: product.productName,
          productPrice: product.productPrice,
          quantity: 1,
        });
      }
  
      // Update the total amount
      shoppingCart.totalAmount = shoppingCart.products.reduce(
        (total, item) => total + item.productPrice * item.quantity,
        0
      );
  
      // Save the shopping cart
      await shoppingCart.save();
  
      res.status(200).json({ message: 'Product added to cart', shoppingCart });
    } catch (error) {
      console.error('Error scanning product:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
// Get the on-hand shopping cart for a user
const getShoppingCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const shoppingCart = await OnHandShopping.findOne({ userId }).populate('products.productId');
    if (!shoppingCart) {
      return res.status(404).json({ message: 'Shopping cart not found' });
    }

    res.status(200).json(shoppingCart);
  } catch (error) {
    console.error('Error fetching shopping cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Clear the on-hand shopping cart for a user
const clearShoppingCart = async (req, res) => {
  const { userId } = req.params;

  try {
    await OnHandShopping.deleteOne({ userId });
    res.status(200).json({ message: 'Shopping cart cleared' });
  } catch (error) {
    console.error('Error clearing shopping cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  scanProduct,
  getShoppingCart,
  clearShoppingCart,
};