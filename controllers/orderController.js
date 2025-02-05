const Order = require('../models/Order');
const Product = require('../models/Product');

// Create a new order
const createOrder = async (req, res) => {
  const {  products, shippingAddress, paymentMethod } = req.body;

  try {
    // Calculate the total amount
    let totalAmount = 0;
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found` });
      }
      totalAmount += product.productPrice * item.quantity;
    }
    const userId = req.user.id;
    const userName = req.user.username;
    const role = req.user.role;    // Create the order
    const order = new Order({
      userId,
      userName,
      role,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    await order.save();
    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId').populate('products.productId');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific order by ID
const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate('userId').populate('products.productId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an order's status
const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true } // Return the updated order
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};